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
        <p className="text-muted-foreground">Effective Date: April 2, 2026</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          AgentHub (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our marketplace platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <h3 className="text-xl font-medium mt-4 mb-2">1.1 Account Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>When you create an account (including via Google or GitHub OAuth), we collect your name, email address, and avatar URL.</li>
          <li>You may optionally provide a bio and profile information.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">1.2 Usage Data</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>We collect browsing activity such as page views, search queries, and Agent interactions.</li>
          <li>Analytics data helps us improve the Platform experience.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">1.3 Content You Submit</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Agent listings you create (name, description, tags, URLs, pricing).</li>
          <li>Reviews and ratings you submit for Agents.</li>
          <li>Any files or media uploaded as part of your listing.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To operate, maintain, and improve the Platform.</li>
          <li>To display your Agent listings and reviews to other Users.</li>
          <li>To process payments for featured listings and verified badges.</li>
          <li>To communicate with you about your account or platform updates.</li>
          <li>To enforce our <Link href="/legal/guidelines" className="text-primary hover:underline">Agent Listing Guidelines</Link> and these Terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Public Information:</strong> Agent listings, reviews, and profile names are publicly visible on the Platform.</li>
          <li><strong>Service Providers:</strong> We use Supabase for authentication and database hosting, and Stripe for payment processing. These providers are bound by their own privacy policies.</li>
          <li><strong>Legal Compliance:</strong> We may disclose information if required by law or to protect our rights.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user data may be transferred as part of the transaction.</li>
          <li><strong>We do NOT sell your personal data to third parties.</strong></li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All data is encrypted in transit (HTTPS/TLS) and at rest.</li>
          <li>Authentication is handled via Supabase Auth with industry-standard security.</li>
          <li>Row-Level Security (RLS) policies ensure users can only access data they are authorized to see.</li>
          <li>Environment secrets are never committed to source control.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access:</strong> You may request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> You may update or correct your account information.</li>
          <li><strong>Deletion:</strong> You may request deletion of your account and associated data.</li>
          <li><strong>Opt-Out:</strong> You may unsubscribe from marketing communications at any time.</li>
          <li>To exercise these rights, contact us at <a href="mailto:privacy@agenthub.io" className="text-primary hover:underline">privacy@agenthub.io</a>.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We may use analytics
          cookies (e.g., Plausible, Google Analytics) to understand platform usage. You can manage
          cookie preferences through our cookie consent banner.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children&apos;s Privacy</h2>
        <p>
          The Platform is not intended for children under 13. We do not knowingly collect personal
          information from children under 13.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy. The effective date at the top will reflect the most
          recent changes. Material changes will be communicated via email or platform notice.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact</h2>
        <p>
          For privacy-related inquiries, contact us at{' '}
          <a href="mailto:privacy@agenthub.io" className="text-primary hover:underline">privacy@agenthub.io</a>.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-primary hover:underline">← Back to AgentHub</Link>
      </div>
    </div>
  );
}
