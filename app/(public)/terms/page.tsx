import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="font-heading font-bold text-lg text-neutral-900">
          MindStack
        </span>
      </div>

      <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
        Terms of Service
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Last updated: March 25, 2026
      </p>

      <div className="prose prose-neutral prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            By accessing or using MindStack (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. MindStack is operated by MindStack Technologies Private Limited, registered in India. If you do not agree to these terms, you may not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            2. Eligibility
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            MindStack is designed for mental health and wellness professionals practicing in India, including but not limited to:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Clinical Psychologists</li>
            <li>Counseling Psychologists and Counselors</li>
            <li>Psychiatrists</li>
            <li>Psychotherapists</li>
            <li>Social Workers in mental health settings</li>
            <li>Life Coaches and Wellness Coaches</li>
            <li>Trainees and interns under supervision of qualified professionals</li>
          </ul>
          <p className="text-neutral-600 leading-relaxed mt-3">
            By registering, you represent that you hold valid professional credentials or are working under supervision of a credentialed professional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            3. Account Responsibilities
          </h2>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your login credentials</li>
            <li>You must provide accurate professional credential information for verification</li>
            <li>You are solely responsible for all activity under your account</li>
            <li>You must notify us immediately of any unauthorized access</li>
            <li>You may not share your account with others or transfer it</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            4. Platform Services
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            MindStack provides practice management tools including:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Client record management</li>
            <li>Appointment scheduling and calendar</li>
            <li>Session note documentation (SOAP, DAP, free-form)</li>
            <li>Payment tracking and invoicing</li>
            <li>Supervision matching and hours logging</li>
            <li>Public professional profile and booking page</li>
            <li>Analytics and practice insights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            5. Client Data & Ethical Obligations
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            You retain full ownership and control over client data you enter into the Platform. You are responsible for:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Obtaining informed consent from clients for digital record-keeping</li>
            <li>Complying with applicable ethical codes and professional guidelines</li>
            <li>Ensuring client data accuracy</li>
            <li>Maintaining appropriate backups of critical records</li>
            <li>Complying with mandatory reporting requirements under Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            6. Subscription & Payments
          </h2>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li>Free tier: Up to 5 active clients, basic features</li>
            <li>Solo plan: Unlimited clients, full features for individual practitioners</li>
            <li>Clinic plan: Multi-practitioner support, admin dashboard</li>
            <li>Subscriptions renew automatically unless cancelled</li>
            <li>All prices are in Indian Rupees (INR) and inclusive of applicable GST</li>
            <li>Refunds are available within 7 days of payment if no client data has been created</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            7. Verification Process
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            We verify professional credentials to maintain platform integrity. Verification involves:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Submission of professional registration number or equivalent credentials</li>
            <li>Review by our verification team (typically within 48 hours)</li>
            <li>Verified professionals receive a badge on their public profile</li>
            <li>We reserve the right to revoke verification if credentials are found to be invalid</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            8. Prohibited Use
          </h2>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li>Using the Platform for any unlawful purpose</li>
            <li>Impersonating a licensed professional</li>
            <li>Uploading malicious code or attempting to breach security</li>
            <li>Scraping or harvesting data from other users&apos; profiles</li>
            <li>Using the Platform for direct client therapy (this is a management tool, not a telehealth platform)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            9. Limitation of Liability
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            MindStack is a practice management tool and does not provide clinical advice. We are not liable for clinical decisions made using information stored on the Platform. Our total liability is limited to the fees paid by you in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            10. Governing Law
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            11. Contact
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:legal@mindstack.in"
              className="text-primary-600 hover:underline"
            >
              legal@mindstack.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
