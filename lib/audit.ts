import { prisma } from "@/lib/prisma";

/**
 * Audit log for sensitive operations.
 * Uses the Notification model for now — in production, use a dedicated AuditLog table
 * or external service (e.g., AWS CloudTrail, Datadog).
 */

type AuditAction =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "REGISTER"
  | "READ_NOTE"
  | "CREATE_NOTE"
  | "UPDATE_CLIENT"
  | "DELETE_CLIENT"
  | "CREATE_PAYMENT"
  | "UPDATE_PAYMENT"
  | "GENERATE_INVOICE"
  | "CREATE_PORTAL_TOKEN"
  | "ACCESS_PORTAL"
  | "EXPORT_DATA"
  | "DELETE_ACCOUNT"
  | "UPDATE_APPOINTMENT";

interface AuditEntry {
  userId: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: string;
  ip?: string;
}

// In-memory buffer for batch writes (production: use external logging service)
const auditBuffer: AuditEntry[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

export async function auditLog(entry: AuditEntry) {
  // Log to console in structured format
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Use console.info for audit trail (can be captured by log aggregators)
  console.info("[AUDIT]", JSON.stringify(logEntry));

  // Buffer for batch notification creation (non-blocking)
  auditBuffer.push(entry);

  // Flush buffer every 5 seconds or when buffer is full
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushAuditBuffer, 5000);
  }
  if (auditBuffer.length >= 20) {
    await flushAuditBuffer();
  }
}

async function flushAuditBuffer() {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  if (auditBuffer.length === 0) return;

  const entries = auditBuffer.splice(0, auditBuffer.length);

  try {
    // Store critical audit events as notifications for now
    const criticalActions: AuditAction[] = [
      "DELETE_CLIENT",
      "DELETE_ACCOUNT",
      "LOGIN_FAILED",
      "EXPORT_DATA",
    ];

    const criticalEntries = entries.filter((e) =>
      criticalActions.includes(e.action)
    );

    if (criticalEntries.length > 0) {
      await prisma.notification.createMany({
        data: criticalEntries.map((e) => ({
          userId: e.userId,
          type: "VERIFICATION_UPDATE" as const, // Using existing type for audit
          title: `Security: ${e.action}`,
          body: e.details || `${e.action} on ${e.resourceType || "system"}`,
          link: "/settings",
          read: false,
        })),
      });
    }
  } catch (error) {
    // Never let audit logging break the main flow
    console.error("[AUDIT] Failed to flush audit buffer:", error);
  }
}
