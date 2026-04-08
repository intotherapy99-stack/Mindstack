import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Last updated: March 25, 2026
      </p>

      <div className="prose prose-neutral prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            1. Introduction
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            MindStack (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting the privacy of mental health professionals and their clients who use our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at mindstack.in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            2. Information We Collect
          </h2>
          <h3 className="text-base font-medium text-neutral-800 mb-2">
            Account Information
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            When you register, we collect your name, email address, phone number, professional credentials (registration numbers, qualifications), and practice details.
          </p>
          <h3 className="text-base font-medium text-neutral-800 mb-2 mt-4">
            Practice Data
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            Client records, session notes, appointment schedules, payment records, and supervision logs that you create within the platform. This data is owned by you and encrypted at rest.
          </p>
          <h3 className="text-base font-medium text-neutral-800 mb-2 mt-4">
            Usage Data
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            We collect anonymized usage analytics including pages visited, feature usage patterns, and device information to improve our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li>To provide and maintain our platform services</li>
            <li>To verify your professional credentials</li>
            <li>To process payments and generate invoices</li>
            <li>To send appointment reminders and notifications</li>
            <li>To match supervisees with supervisors</li>
            <li>To provide customer support</li>
            <li>To improve our platform based on usage patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            4. Data Protection & DPDP Act Compliance
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India. As a Data Fiduciary, we ensure:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Lawful processing of personal data with explicit consent</li>
            <li>Purpose limitation — data is used only for specified purposes</li>
            <li>Data minimization — we collect only what is necessary</li>
            <li>Storage limitation — data is retained only as long as needed</li>
            <li>Right to access, correction, and erasure of your data</li>
            <li>Grievance redressal mechanism</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            5. Client Data & Confidentiality
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            We understand the critical importance of therapeutic confidentiality. Client data entered by practitioners is:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Encrypted at rest and in transit (AES-256 / TLS 1.3)</li>
            <li>Accessible only to the practitioner who created it</li>
            <li>Never used for advertising, analytics, or AI training</li>
            <li>Never shared with third parties without explicit consent</li>
            <li>Deletable at any time upon practitioner request</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            6. Data Sharing
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            We do not sell your data. We share data only with:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Payment processors (Razorpay) for transaction processing</li>
            <li>Cloud infrastructure providers (for hosting and storage)</li>
            <li>Law enforcement when required by Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            7. Your Rights
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Under the DPDP Act, you have the right to:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Erase your data (right to be forgotten)</li>
            <li>Withdraw consent at any time</li>
            <li>Nominate a person to exercise rights on your behalf</li>
            <li>File a grievance with our Data Protection Officer</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            8. Contact Us
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            For privacy-related queries, contact our Data Protection Officer at{" "}
            <a
              href="mailto:privacy@mindstack.in"
              className="text-primary-600 hover:underline"
            >
              privacy@mindstack.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
