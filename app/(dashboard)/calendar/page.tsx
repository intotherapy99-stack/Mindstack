"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, View, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "client" | "supervision" | "blocked";
  // Extra fields for detail popup
  clientName?: string;
  modality?: string;
  sessionType?: string;
  status?: string;
  duration?: number;
  fee?: number;
  meetingLink?: string;
}

interface ClientOption {
  id: string;
  firstName: string;
  lastName?: string | null;
}

const SESSION_TYPES = [
  { value: "INITIAL_CONSULTATION", label: "Initial Consultation" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "CRISIS", label: "Crisis" },
  { value: "ASSESSMENT", label: "Assessment" },
  { value: "OTHER", label: "Other" },
];

const MODALITIES = [
  { value: "IN_PERSON", label: "In Person", icon: MapPin },
  { value: "ONLINE", label: "Online", icon: Video },
  { value: "PHONE", label: "Phone", icon: Phone },
];

const DURATIONS = [
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "50", label: "50 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
];

function formatSessionType(type: string): string {
  const found = SESSION_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

function formatModality(mod: string): string {
  const found = MODALITIES.find((m) => m.value === mod);
  return found ? found.label : mod;
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");
  const [error, setError] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);

  // Form state
  const [formClientId, setFormClientId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDuration, setFormDuration] = useState("50");
  const [formSessionType, setFormSessionType] = useState("FOLLOW_UP");
  const [formModality, setFormModality] = useState("IN_PERSON");
  const [formFee, setFormFee] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Event detail popup state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Default to day view on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setView("day");
    }
  }, []);

  // Fetch clients once
  useEffect(() => {
    if (clientsLoaded) return;
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClients(
            data.map((c: any) => ({
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
            }))
          );
        }
        setClientsLoaded(true);
      })
      .catch(() => setClientsLoaded(true));
  }, [clientsLoaded]);

  const fetchEvents = useCallback(async () => {
    try {
      const start = startOfMonth(subMonths(currentDate, 1)).toISOString();
      const end = endOfMonth(addMonths(currentDate, 1)).toISOString();

      const res = await fetch(`/api/appointments?start=${start}&end=${end}`);
      if (!res.ok) throw new Error("Failed to load events");
      const appointments = await res.json();

      const mapped: CalendarEvent[] = appointments.map((apt: any) => ({
        id: apt.id,
        title: apt.client
          ? `${apt.client.firstName}${apt.client.lastName ? ` ${apt.client.lastName}` : ""}`
          : "Session",
        start: new Date(apt.scheduledAt),
        end: new Date(
          new Date(apt.scheduledAt).getTime() + (apt.duration || 50) * 60000
        ),
        type: "client" as const,
        clientName: apt.client
          ? `${apt.client.firstName}${apt.client.lastName ? ` ${apt.client.lastName}` : ""}`
          : "Unknown",
        modality: apt.modality,
        sessionType: apt.sessionType,
        status: apt.status,
        duration: apt.duration,
        fee: apt.fee,
        meetingLink: apt.meetingLink,
      }));

      setEvents(mapped);
    } catch (e: any) {
      setError(e.message);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const colors = {
      client: { backgroundColor: "#00979A", borderColor: "#007A7C" },
      supervision: { backgroundColor: "#8B5CF6", borderColor: "#7C3AED" },
      blocked: { backgroundColor: "#D6D5D3", borderColor: "#BFBDBA" },
    };
    const style = colors[event.type] || colors.client;
    return {
      style: {
        ...style,
        color: "white",
        borderRadius: "8px",
        border: `2px solid ${style.borderColor}`,
        fontSize: "12px",
        fontWeight: 500,
        padding: "2px 6px",
      },
    };
  }, []);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormClientId("");
    setFormDate("");
    setFormTime("");
    setFormDuration("50");
    setFormSessionType("FOLLOW_UP");
    setFormModality("IN_PERSON");
    setFormFee("");
    setFormError("");
    setFormSubmitting(false);
  }, []);

  // Open dialog (optionally with pre-filled date/time from slot click)
  const openDialog = useCallback(
    (slotDate?: Date) => {
      resetForm();
      if (slotDate) {
        setFormDate(format(slotDate, "yyyy-MM-dd"));
        setFormTime(format(slotDate, "HH:mm"));
      }
      setDialogOpen(true);
      // Close any event detail popup
      setSelectedEvent(null);
      setPopupPos(null);
    },
    [resetForm]
  );

  // Handle slot selection on calendar
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      openDialog(slotInfo.start);
    },
    [openDialog]
  );

  // Handle event click for detail popup
  const handleSelectEvent = useCallback(
    (event: CalendarEvent, e: React.SyntheticEvent) => {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();

      // Position the popup near the clicked event
      let top = rect.bottom + 8;
      let left = rect.left;

      // Keep popup within viewport
      const popupWidth = 320;
      const popupHeight = 280;

      if (left + popupWidth > window.innerWidth - 16) {
        left = window.innerWidth - popupWidth - 16;
      }
      if (left < 16) left = 16;

      if (top + popupHeight > window.innerHeight - 16) {
        top = rect.top - popupHeight - 8;
      }
      if (top < 16) top = 16;

      setPopupPos({ top, left });
      setSelectedEvent(event);
    },
    []
  );

  // Close popup when clicking outside
  useEffect(() => {
    if (!selectedEvent) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedEvent(null);
        setPopupPos(null);
      }
    };

    // Delay attaching so the current click doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedEvent]);

  // Submit new appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formClientId) {
      setFormError("Please select a client.");
      return;
    }
    if (!formDate || !formTime) {
      setFormError("Please select a date and time.");
      return;
    }

    setFormSubmitting(true);

    try {
      const scheduledAt = new Date(`${formDate}T${formTime}:00`).toISOString();

      const body: Record<string, any> = {
        clientId: formClientId,
        scheduledAt,
        duration: parseInt(formDuration, 10),
        sessionType: formSessionType,
        modality: formModality,
      };

      if (formFee.trim()) {
        body.fee = parseFloat(formFee);
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create appointment");
      }

      setDialogOpen(false);
      resetForm();
      await fetchEvents();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const modalityIcon = (mod: string) => {
    switch (mod) {
      case "ONLINE":
        return <Video size={14} />;
      case "PHONE":
        return <Phone size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="section-header-icon bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <CalendarIcon size={18} className="text-white" />
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900">
            Calendar
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm bg-primary-500" />
              <span className="text-neutral-500 hidden sm:inline">Client</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-3 rounded-sm bg-supervision" />
              <span className="text-neutral-500 hidden sm:inline">Supervision</span>
            </div>
          </div>
          <Button size="sm" onClick={() => openDialog()}>
            <Plus size={16} className="mr-1.5" />
            New Session
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      <Card className="p-3 md:p-4 overflow-hidden">
        <style jsx global>{`
          .rbc-toolbar {
            padding: 0 0 12px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .rbc-toolbar button {
            border-radius: 8px !important;
            border-color: #E8E5E2 !important;
            color: #6B6966 !important;
            font-size: 13px !important;
            padding: 6px 14px !important;
            font-weight: 500 !important;
          }
          .rbc-toolbar button:hover {
            background-color: #F7F5F3 !important;
            border-color: #D6D5D3 !important;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #00979A !important;
            border-color: #00979A !important;
            color: white !important;
          }
          .rbc-toolbar-label {
            font-weight: 700 !important;
            font-size: 16px !important;
            color: #1A1918 !important;
          }
          .rbc-header {
            padding: 8px 4px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            color: #6B6966 !important;
            border-color: #F0EFED !important;
          }
          .rbc-time-header-gutter,
          .rbc-time-gutter {
            font-size: 11px !important;
            color: #9A9895 !important;
          }
          .rbc-day-bg + .rbc-day-bg,
          .rbc-time-content > * + * > * {
            border-color: #F0EFED !important;
          }
          .rbc-today {
            background-color: rgba(0, 151, 154, 0.04) !important;
          }
          .rbc-current-time-indicator {
            background-color: #FF5A42 !important;
            height: 2px !important;
          }
          .rbc-off-range-bg {
            background-color: #FAFAF8 !important;
          }
          .rbc-slot-selection {
            background-color: rgba(0, 151, 154, 0.15) !important;
            border: 1px solid rgba(0, 151, 154, 0.3) !important;
          }
          @media (max-width: 767px) {
            .rbc-toolbar {
              font-size: 12px;
            }
            .rbc-toolbar button {
              padding: 5px 10px !important;
              font-size: 12px !important;
            }
            .rbc-toolbar-label {
              font-size: 14px !important;
            }
          }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          step={30}
          timeslots={2}
          min={new Date(2024, 0, 1, 7, 0)}
          max={new Date(2024, 0, 1, 22, 0)}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </Card>

      {/* ── Event Detail Popup ── */}
      {selectedEvent && popupPos && (
        <div
          ref={popupRef}
          className="fixed z-[60] bg-white rounded-xl shadow-lg border border-neutral-200 p-4 w-[300px] sm:w-[320px] animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-primary-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-neutral-900 truncate">
                  {selectedEvent.clientName}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatSessionType(selectedEvent.sessionType || "FOLLOW_UP")}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setPopupPos(null);
              }}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <CalendarIcon size={14} className="text-neutral-400 flex-shrink-0" />
              <span>{format(selectedEvent.start, "EEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock size={14} className="text-neutral-400 flex-shrink-0" />
              <span>
                {format(selectedEvent.start, "h:mm a")} -{" "}
                {format(selectedEvent.end, "h:mm a")}
                {selectedEvent.duration && (
                  <span className="text-neutral-400 ml-1">
                    ({selectedEvent.duration} min)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-neutral-400 flex-shrink-0">
                {modalityIcon(selectedEvent.modality || "IN_PERSON")}
              </span>
              <span>{formatModality(selectedEvent.modality || "IN_PERSON")}</span>
              {selectedEvent.meetingLink && (
                <a
                  href={selectedEvent.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-xs underline ml-auto"
                >
                  Join
                </a>
              )}
            </div>
            {selectedEvent.fee != null && selectedEvent.fee > 0 && (
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="text-neutral-400 flex-shrink-0 text-xs font-medium w-[14px] text-center">
                  ₹
                </span>
                <span>{selectedEvent.fee.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {selectedEvent.status && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <span
                className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                  statusColors[selectedEvent.status] || "bg-neutral-100 text-neutral-600"
                }`}
              >
                {formatStatus(selectedEvent.status)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── New Session Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
            <DialogDescription>
              Create a new appointment for a client.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Client Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="client-select">Client</Label>
              <Select value={formClientId} onValueChange={setFormClientId}>
                <SelectTrigger id="client-select">
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName}
                      {client.lastName ? ` ${client.lastName}` : ""}
                    </SelectItem>
                  ))}
                  {clients.length === 0 && (
                    <div className="px-3 py-2 text-sm text-neutral-400">
                      No clients found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="appt-date">Date</Label>
                <Input
                  id="appt-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="appt-time">Time</Label>
                <Input
                  id="appt-time"
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label htmlFor="duration-select">Duration</Label>
              <Select value={formDuration} onValueChange={setFormDuration}>
                <SelectTrigger id="duration-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Type & Modality */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="session-type-select">Session Type</Label>
                <Select
                  value={formSessionType}
                  onValueChange={setFormSessionType}
                >
                  <SelectTrigger id="session-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modality-select">Modality</Label>
                <Select value={formModality} onValueChange={setFormModality}>
                  <SelectTrigger id="modality-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALITIES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fee */}
            <div className="space-y-1.5">
              <Label htmlFor="fee-input">
                Fee <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                  ₹
                </span>
                <Input
                  id="fee-input"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formFee}
                  onChange={(e) => setFormFee(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {formError}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Session"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
