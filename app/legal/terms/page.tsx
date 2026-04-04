import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for AgentHub — the AI agent marketplace.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Effective Date: April 2, 2026</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          Welcome to <strong>AgentHub</strong> (&quot;the Platform&quot;). These Terms of Service
          (&quot;Terms&quot;) govern your access to and use of the AgentHub marketplace operated by
          Syncoe (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using the
          Platform, you agree to be bound by these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Agent:</strong> An AI-powered software tool, bot, or service listed on the Platform.</li>
          <li><strong>Creator:</strong> An individual or entity that publishes an Agent on the Platform.</li>
          <li><strong>User:</strong> Any person who browses, searches, or interacts with Agents on the Platform.</li>
          <li><strong>Listing:</strong> The public-facing page for an Agent, including its description, pricing, and documentation.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Account Registration</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must create an account to list Agents or submit reviews.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must be at least 18 years old to use the Platform.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Agent Listings</h2>
        <h3 className="text-xl font-medium mt-4 mb-2">3.1 Creator Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are solely responsible for the content, accuracy, and legality of your Agent listings.</li>
          <li>Listings must accurately describe the Agent&apos;s capabilities, pricing, and limitations.</li>
          <li>You must not list Agents that contain malicious code, violate intellectual property rights, or engage in fraudulent activity.</li>
          <li>You grant us a non-exclusive license to display your listing on the Platform.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">3.2 Listing Review & Moderation</h3>
        <p>
          All Agent submissions are reviewed before publication. We may reject, suspend, or remove
          listings that violate our <Link href="/legal/guidelines" className="text-primary hover:underline">Agent Listing Guidelines</Link>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Reviews & Ratings</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Users may submit one review per Agent, based on genuine experience.</li>
          <li>Fake, misleading, or incentivized reviews are prohibited.</li>
          <li>We reserve the right to remove reviews that violate these Terms or our guidelines.</li>
          <li>Creators may not solicit, reward, or penalize users for leaving reviews.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Platform&apos;s design, code, and content (excluding Agent listings) are owned by Syncoe.</li>
          <li>Agent listings remain the intellectual property of their Creators.</li>
          <li>By listing on the Platform, you grant us permission to display, promote, and link to your Agent.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payments & Fees</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Basic Agent listings are free.</li>
          <li>Featured listings and Verified badges are available for a fee, as outlined on our <Link href="/pricing" className="text-primary hover:underline">Pricing page</Link>.</li>
          <li>All payments are processed through Stripe. Refund policies apply as per Stripe&apos;s terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimers & Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AgentHub is a discovery platform. We do not host, execute, or guarantee the performance of any Agent.</li>
          <li>Agents are provided &quot;as-is&quot; by their Creators. We make no warranties regarding Agent accuracy, security, or fitness for purpose.</li>
          <li>You use Agents at your own risk. We are not liable for any damages arising from Agent use.</li>
          <li>Our total liability is limited to the amount you paid us in the 12 months preceding the claim.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. DMCA & Takedown</h2>
        <p>
          We respect intellectual property rights and have a <Link href="/legal/dmca" className="text-primary hover:underline">DMCA Takedown Policy</Link>.
          If you believe your content has been used improperly, contact us at <a href="mailto:dmca@agenthub.io" className="text-primary hover:underline">dmca@agenthub.io</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Privacy</h2>
        <p>
          Your use of the Platform is also governed by our <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. The effective date at the top will reflect
          the most recent changes. Continued use of the Platform constitutes acceptance of updated Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact</h2>
        <p>
          For questions about these Terms, contact us at{' '}
          <a href="mailto:hello@agenthub.io" className="text-primary hover:underline">hello@agenthub.io</a>.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-primary hover:underline">← Back to AgentHub</Link>
      </div>
    </div>
  );
}
