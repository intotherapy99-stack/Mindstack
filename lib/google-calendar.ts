import { google, calendar_v3 } from "googleapis";
import { prisma } from "@/lib/prisma";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// ---------------------------------------------------------------------------
// 1. Get authenticated Google Calendar client
// ---------------------------------------------------------------------------

export async function getGoogleCalendarClient(
  userId: string
): Promise<calendar_v3.Calendar | null> {
  try {
    const account = await prisma.account.findFirst({
      where: { userId, provider: "google" },
    });

    if (!account?.access_token) {
      return null;
    }

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token ?? undefined,
    });

    // Refresh token if expired (expires_at is stored as seconds since epoch)
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (account.expires_at && account.expires_at < nowSeconds) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token ?? account.refresh_token,
          expires_at: credentials.expiry_date
            ? Math.floor(credentials.expiry_date / 1000)
            : account.expires_at,
        },
      });
    }

    return google.calendar({ version: "v3", auth: oauth2Client });
  } catch (error) {
    console.error("[google-calendar] Failed to get client:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helper: resolve which calendarId to use for a practitioner
// ---------------------------------------------------------------------------

async function resolveCalendarId(userId: string): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { googleCalendarId: true },
  });
  return profile?.googleCalendarId || "primary";
}

// ---------------------------------------------------------------------------
// 2. Sync an Appointment to Google Calendar
// ---------------------------------------------------------------------------

interface AppointmentInput {
  id: string;
  practitionerId: string;
  scheduledAt: Date;
  duration: number;
  modality: string;
  meetingLink?: string | null;
  client?: { firstName: string; lastName?: string | null } | null;
  googleEventId?: string | null;
  googleCalendarId?: string | null;
}

interface SyncResult {
  googleEventId: string;
  googleCalendarId: string;
  meetingLink?: string | null;
}

export async function syncAppointmentToGoogle(
  appointment: AppointmentInput
): Promise<SyncResult | null> {
  try {
    const calendar = await getGoogleCalendarClient(
      appointment.practitionerId
    );
    if (!calendar) return null;

    const calendarId =
      appointment.googleCalendarId ||
      (await resolveCalendarId(appointment.practitionerId));

    const startTime = new Date(appointment.scheduledAt);
    const endTime = new Date(
      startTime.getTime() + appointment.duration * 60 * 1000
    );

    const clientName = appointment.client
      ? [appointment.client.firstName, appointment.client.lastName]
          .filter(Boolean)
          .join(" ")
      : "Client";

    const eventBody: calendar_v3.Schema$Event = {
      summary: `Session with ${clientName}`,
      description: `Modality: ${appointment.modality}\nManaged by Mindstack`,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
    };

    // Auto-generate Google Meet link for ONLINE sessions without an existing link
    const needsMeet =
      appointment.modality === "ONLINE" && !appointment.meetingLink;

    const conferenceParams = needsMeet
      ? {
          conferenceDataVersion: 1 as const,
        }
      : {};

    if (needsMeet) {
      eventBody.conferenceData = {
        createRequest: {
          requestId: `mindstack-${appointment.id}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    let resultEvent: calendar_v3.Schema$Event;

    if (appointment.googleEventId) {
      // Update existing event
      const res = await calendar.events.update({
        calendarId,
        eventId: appointment.googleEventId,
        requestBody: eventBody,
        ...conferenceParams,
      });
      resultEvent = res.data;
    } else {
      // Create new event
      const res = await calendar.events.insert({
        calendarId,
        requestBody: eventBody,
        ...conferenceParams,
      });
      resultEvent = res.data;
    }

    const meetLink =
      resultEvent.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri ?? appointment.meetingLink;

    return {
      googleEventId: resultEvent.id!,
      googleCalendarId: calendarId,
      meetingLink: meetLink || null,
    };
  } catch (error) {
    console.error("[google-calendar] Failed to sync appointment:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. Delete a Google Calendar event
// ---------------------------------------------------------------------------

export async function deleteGoogleCalendarEvent(
  userId: string,
  googleEventId: string,
  googleCalendarId?: string
): Promise<boolean> {
  try {
    const calendar = await getGoogleCalendarClient(userId);
    if (!calendar) return false;

    const calendarId = googleCalendarId || (await resolveCalendarId(userId));

    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
    });

    return true;
  } catch (error) {
    console.error("[google-calendar] Failed to delete event:", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 4. Sync a SupervisionSession to Google Calendar
// ---------------------------------------------------------------------------

interface SupervisionSessionInput {
  id: string;
  supervisorId: string;
  superviseeId: string;
  scheduledAt: Date;
  duration: number;
  modality: string;
  meetingLink?: string | null;
  supervisee?: { name?: string | null; email?: string | null } | null;
  googleEventId?: string | null;
  googleCalendarId?: string | null;
}

export async function syncSupervisionToGoogle(
  session: SupervisionSessionInput
): Promise<SyncResult | null> {
  try {
    const calendar = await getGoogleCalendarClient(session.supervisorId);
    if (!calendar) return null;

    const calendarId =
      session.googleCalendarId ||
      (await resolveCalendarId(session.supervisorId));

    const startTime = new Date(session.scheduledAt);
    const endTime = new Date(
      startTime.getTime() + session.duration * 60 * 1000
    );

    const superviseeName = session.supervisee?.name || "Supervisee";

    const eventBody: calendar_v3.Schema$Event = {
      summary: `Supervision with ${superviseeName}`,
      description: `Supervision session\nModality: ${session.modality}\nManaged by Mindstack`,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
    };

    const needsMeet =
      session.modality === "ONLINE" && !session.meetingLink;

    const conferenceParams = needsMeet
      ? {
          conferenceDataVersion: 1 as const,
        }
      : {};

    if (needsMeet) {
      eventBody.conferenceData = {
        createRequest: {
          requestId: `mindstack-sv-${session.id}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    let resultEvent: calendar_v3.Schema$Event;

    if (session.googleEventId) {
      const res = await calendar.events.update({
        calendarId,
        eventId: session.googleEventId,
        requestBody: eventBody,
        ...conferenceParams,
      });
      resultEvent = res.data;
    } else {
      const res = await calendar.events.insert({
        calendarId,
        requestBody: eventBody,
        ...conferenceParams,
      });
      resultEvent = res.data;
    }

    const meetLink =
      resultEvent.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri ?? session.meetingLink;

    return {
      googleEventId: resultEvent.id!,
      googleCalendarId: calendarId,
      meetingLink: meetLink || null,
    };
  } catch (error) {
    console.error("[google-calendar] Failed to sync supervision:", error);
    return null;
  }
}
