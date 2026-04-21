-- Security fixes: add missing cascade deletes and database indexes
-- Run: npx prisma migrate dev

-- ============================================================
-- CASCADE DELETES: Fix FK relations so orphaned rows are
-- automatically cleaned up when parent records are deleted.
-- ============================================================

-- SupervisionSession: cascade when supervisor/supervisee account deleted
ALTER TABLE "SupervisionSession" DROP CONSTRAINT IF EXISTS "SupervisionSession_superviseeId_fkey";
ALTER TABLE "SupervisionSession" ADD CONSTRAINT "SupervisionSession_superviseeId_fkey"
  FOREIGN KEY ("superviseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SupervisionSession" DROP CONSTRAINT IF EXISTS "SupervisionSession_supervisorId_fkey";
ALTER TABLE "SupervisionSession" ADD CONSTRAINT "SupervisionSession_supervisorId_fkey"
  FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Client: cascade when practitioner account deleted
ALTER TABLE "Client" DROP CONSTRAINT IF EXISTS "Client_practitionerId_fkey";
ALTER TABLE "Client" ADD CONSTRAINT "Client_practitionerId_fkey"
  FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Appointment: set null when client deleted (clientId is nullable)
ALTER TABLE "Appointment" DROP CONSTRAINT IF EXISTS "Appointment_clientId_fkey";
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Note: set null when client or appointment deleted
ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_clientId_fkey";
ALTER TABLE "Note" ADD CONSTRAINT "Note_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Note" DROP CONSTRAINT IF EXISTS "Note_appointmentId_fkey";
ALTER TABLE "Note" ADD CONSTRAINT "Note_appointmentId_fkey"
  FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Payment: set null on all optional FKs to preserve financial records
ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_clientId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_appointmentId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey"
  FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payment" DROP CONSTRAINT IF EXISTS "Payment_invoiceId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Invoice: cascade when client deleted
ALTER TABLE "Invoice" DROP CONSTRAINT IF EXISTS "Invoice_clientId_fkey";
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Prescription: cascade when practitioner or client deleted
ALTER TABLE "Prescription" DROP CONSTRAINT IF EXISTS "Prescription_practitionerId_fkey";
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_practitionerId_fkey"
  FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Prescription" DROP CONSTRAINT IF EXISTS "Prescription_clientId_fkey";
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Availability: cascade when user deleted
ALTER TABLE "Availability" DROP CONSTRAINT IF EXISTS "Availability_userId_fkey";
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Review: cascade when reviewer/reviewed deleted; set null when session deleted
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_reviewerId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_reviewedId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewedId_fkey"
  FOREIGN KEY ("reviewedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_supervisionSessionId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_supervisionSessionId_fkey"
  FOREIGN KEY ("supervisionSessionId") REFERENCES "SupervisionSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Subscription: cascade when user deleted
ALTER TABLE "Subscription" DROP CONSTRAINT IF EXISTS "Subscription_userId_fkey";
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Notification: cascade when user deleted
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Community models: cascade when author deleted
ALTER TABLE "ReferralPost" DROP CONSTRAINT IF EXISTS "ReferralPost_authorId_fkey";
ALTER TABLE "ReferralPost" ADD CONSTRAINT "ReferralPost_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReferralResponse" DROP CONSTRAINT IF EXISTS "ReferralResponse_responderId_fkey";
ALTER TABLE "ReferralResponse" ADD CONSTRAINT "ReferralResponse_responderId_fkey"
  FOREIGN KEY ("responderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpacePost" DROP CONSTRAINT IF EXISTS "SpacePost_authorId_fkey";
ALTER TABLE "SpacePost" ADD CONSTRAINT "SpacePost_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_authorId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_parentId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SpaceMembership" DROP CONSTRAINT IF EXISTS "SpaceMembership_userId_fkey";
ALTER TABLE "SpaceMembership" ADD CONSTRAINT "SpaceMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- INDEXES: Prevent full-table scans on all frequently filtered
-- foreign key columns and status fields.
-- ============================================================

CREATE INDEX IF NOT EXISTS "SupervisionSession_superviseeId_idx" ON "SupervisionSession"("superviseeId");
CREATE INDEX IF NOT EXISTS "SupervisionSession_supervisorId_idx" ON "SupervisionSession"("supervisorId");
CREATE INDEX IF NOT EXISTS "SupervisionSession_scheduledAt_idx" ON "SupervisionSession"("scheduledAt");

CREATE INDEX IF NOT EXISTS "Client_practitionerId_idx" ON "Client"("practitionerId");
CREATE INDEX IF NOT EXISTS "Client_email_idx" ON "Client"("email");

CREATE INDEX IF NOT EXISTS "Appointment_practitionerId_idx" ON "Appointment"("practitionerId");
CREATE INDEX IF NOT EXISTS "Appointment_clientId_idx" ON "Appointment"("clientId");
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX IF NOT EXISTS "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

CREATE INDEX IF NOT EXISTS "Note_practitionerId_idx" ON "Note"("practitionerId");
CREATE INDEX IF NOT EXISTS "Note_clientId_idx" ON "Note"("clientId");

CREATE INDEX IF NOT EXISTS "Payment_practitionerId_idx" ON "Payment"("practitionerId");
CREATE INDEX IF NOT EXISTS "Payment_clientId_idx" ON "Payment"("clientId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");

CREATE INDEX IF NOT EXISTS "Invoice_practitionerId_idx" ON "Invoice"("practitionerId");
CREATE INDEX IF NOT EXISTS "Invoice_clientId_idx" ON "Invoice"("clientId");

CREATE INDEX IF NOT EXISTS "Availability_userId_idx" ON "Availability"("userId");

CREATE INDEX IF NOT EXISTS "Review_reviewedId_idx" ON "Review"("reviewedId");
CREATE INDEX IF NOT EXISTS "Review_reviewerId_idx" ON "Review"("reviewerId");

CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");

CREATE INDEX IF NOT EXISTS "ReferralPost_authorId_idx" ON "ReferralPost"("authorId");
CREATE INDEX IF NOT EXISTS "ReferralPost_status_idx" ON "ReferralPost"("status");

CREATE INDEX IF NOT EXISTS "ReferralResponse_postId_idx" ON "ReferralResponse"("postId");
CREATE INDEX IF NOT EXISTS "ReferralResponse_responderId_idx" ON "ReferralResponse"("responderId");

CREATE INDEX IF NOT EXISTS "SpacePost_spaceId_idx" ON "SpacePost"("spaceId");
CREATE INDEX IF NOT EXISTS "SpacePost_authorId_idx" ON "SpacePost"("authorId");

CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_authorId_idx" ON "Comment"("authorId");

CREATE INDEX IF NOT EXISTS "SpaceMembership_userId_idx" ON "SpaceMembership"("userId");

CREATE INDEX IF NOT EXISTS "Prescription_practitionerId_idx" ON "Prescription"("practitionerId");
CREATE INDEX IF NOT EXISTS "Prescription_clientId_idx" ON "Prescription"("clientId");

CREATE INDEX IF NOT EXISTS "ClientPortalToken_clientId_idx" ON "ClientPortalToken"("clientId");
CREATE INDEX IF NOT EXISTS "ClientPortalToken_practitionerId_idx" ON "ClientPortalToken"("practitionerId");
