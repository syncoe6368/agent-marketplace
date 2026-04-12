import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AgentHub — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Effective Date: April 12, 2026 &middot; Last Updated: April 12, 2026</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          <strong>Syncoe Sdn Bhd</strong> (&quot;Syncoe&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating the
          AgentHub platform (&quot;the Platform&quot;), is committed to protecting your personal data
          in accordance with the Malaysian Personal Data Protection Act 2010 (&quot;PDPA&quot;).
          This Privacy Policy explains how we collect, use, disclose, retain, and safeguard
          your information when you use our marketplace platform at{' '}
          <a href="https://marketplace.syncoe.com" className="text-indigo-600 hover:underline">marketplace.syncoe.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>

        <h3 className="text-xl font-medium mt-4 mb-2">1.1 Personal Data</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Information:</strong> When you create an account (including via Google or GitHub OAuth), we collect your name, email address, and avatar URL.</li>
          <li><strong>Profile Information:</strong> Optional bio and profile details you choose to provide.</li>
          <li><strong>Payment Information:</strong> Billing details processed through Stripe for featured listings and verified badges. We do not store full card numbers — all payment data is handled by Stripe&apos;s PCI DSS-compliant infrastructure.</li>
          <li><strong>Communication Data:</strong> Messages sent through support channels and feedback forms.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">1.2 Usage Data (Non-Personal)</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Browsing activity: page views, search queries, agent interactions, and click patterns.</li>
          <li>Device information: browser type, operating system, IP address (anonymized), and screen resolution.</li>
          <li>Analytics data collected to improve platform experience and performance.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">1.3 Content You Submit</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Agent listings you create (name, description, tags, URLs, pricing, install commands).</li>
          <li>Reviews and ratings you submit for agents.</li>
          <li>Any files or media uploaded as part of your listing.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Purpose of Processing (PDPA Section 6)</h2>
        <p>We process your personal data for the following purposes, which are consistent with your reasonable expectations as a user of our marketplace:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service Delivery:</strong> To operate, maintain, and improve the Platform.</li>
          <li><strong>Display &amp; Discovery:</strong> To display your agent listings, reviews, and profile to other users.</li>
          <li><strong>Payment Processing:</strong> To process payments for featured listings and verified badges via Stripe.</li>
          <li><strong>Communication:</strong> To send account-related notifications, platform updates, and respond to support requests.</li>
          <li><strong>Security &amp; Compliance:</strong> To enforce our <Link href="/legal/guidelines" className="text-indigo-600 hover:underline">Agent Listing Guidelines</Link>, detect fraud, and comply with legal obligations.</li>
          <li><strong>Improvement:</strong> To analyze usage patterns and improve the Platform experience.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclosure of Personal Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Public Information:</strong> Agent listings, reviews, and profile names are publicly visible on the Platform.</li>
          <li><strong>Service Providers:</strong> We share data with the following third-party services, each bound by their own data processing agreements:
            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li><strong>Supabase Inc.</strong> — Authentication, database hosting, and backend services (USA, SOC 2 Type II certified).</li>
              <li><strong>Stripe Inc.</strong> — Payment processing (PCI DSS Level 1 compliant). Card data never touches our servers.</li>
              <li><strong>Vercel Inc.</strong> — Application hosting and CDN delivery.</li>
            </ul>
          </li>
          <li><strong>Legal Compliance:</strong> We may disclose information if required by Malaysian law, court order, or regulatory authority.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction, with notice to affected users.</li>
          <li><strong>We do NOT sell your personal data to third parties.</strong></li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Active accounts:</strong> Personal data is retained for as long as your account is active or as needed to provide services.</li>
          <li><strong>Closed accounts:</strong> Upon account deletion, personal data is removed within 30 days, except where retention is required by law (e.g., financial records retained for 7 years per Malaysian statutory requirements).</li>
          <li><strong>Usage data:</strong> Anonymized analytics data may be retained for up to 2 years for platform improvement.</li>
          <li><strong>Listing content:</strong> Agent listings and reviews are retained unless specifically requested for deletion by the data subject.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All data is encrypted in transit (HTTPS/TLS 1.3) and at rest (AES-256 encryption).</li>
          <li>Authentication is handled via Supabase Auth with industry-standard security practices.</li>
          <li>Row-Level Security (RLS) policies ensure users can only access data they are authorized to see.</li>
          <li>Environment secrets are never committed to source control.</li>
          <li>We conduct regular security reviews and promptly address any identified vulnerabilities.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights Under PDPA</h2>
        <p>As a data subject, you have the following rights:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Right of Access (Section 42):</strong> You may request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Correction (Section 43):</strong> You may update or correct inaccurate personal data via your account settings or by contacting us.</li>
          <li><strong>Right to Withdraw Consent (Section 47):</strong> You may withdraw consent for data processing at any time by contacting us. Withdrawal of consent may affect your ability to use certain Platform features.</li>
          <li><strong>Right to Deletion:</strong> You may request deletion of your account and associated personal data through account settings or by contacting us.</li>
          <li><strong>Right to Prevent Processing for Direct Marketing:</strong> You may opt out of marketing communications at any time via the unsubscribe link in emails or by contacting us.</li>
        </ul>
        <p>
          To exercise any of these rights, contact our Data Protection Officer at{' '}
          <a href="mailto:privacy@syncoe.com" className="text-indigo-600 hover:underline">privacy@syncoe.com</a>.
          We will respond to your request within 21 business days as required by the PDPA.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We may use analytics
          cookies to understand platform usage. You can manage cookie preferences through your browser
          settings. Essential cookies cannot be disabled as they are necessary for Platform functionality.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children&apos;s Privacy</h2>
        <p>
          The Platform is not intended for children under 18. We do not knowingly collect personal
          information from children under 18. If we become aware that we have collected data from
          a child under 18, we will take steps to delete it promptly.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Cross-Border Data Transfers</h2>
        <p>
          Your personal data may be transferred to and processed in countries outside Malaysia
          (e.g., United States for Supabase, Stripe, and Vercel services). These transfers are
          made with appropriate safeguards, including standard contractual clauses and compliance
          with applicable data protection regulations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The effective date at the top will
          reflect the most recent changes. Material changes will be communicated via email or
          platform notice at least 7 days before taking effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
        <p>
          This Privacy Policy is governed by and construed in accordance with the laws of Malaysia.
          Any disputes arising from this Policy shall be subject to the exclusive jurisdiction of
          the courts of Malaysia.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact</h2>
        <p>
          For privacy-related inquiries or to exercise your data subject rights, contact us at:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Email:</strong> <a href="mailto:privacy@syncoe.com" className="text-indigo-600 hover:underline">privacy@syncoe.com</a></li>
          <li><strong>Operator:</strong> Syncoe Sdn Bhd</li>
          <li><strong>Platform:</strong> <a href="https://marketplace.syncoe.com" className="text-indigo-600 hover:underline">marketplace.syncoe.com</a></li>
        </ul>
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-indigo-600 hover:underline">&larr; Back to AgentHub</Link>
      </div>
    </div>
  );
}
