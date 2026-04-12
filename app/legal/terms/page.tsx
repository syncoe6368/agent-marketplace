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
        <p className="text-muted-foreground">Effective Date: April 12, 2026 &middot; Last Updated: April 12, 2026</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          Welcome to <strong>AgentHub</strong> (&quot;the Platform&quot;). These Terms of Service
          (&quot;Terms&quot;) govern your access to and use of the AgentHub marketplace operated by
          Syncoe Sdn Bhd (&quot;Syncoe&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          By accessing or using the Platform, you agree to be bound by these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Agent:</strong> An AI-powered software tool, bot, skill package, or service listed on the Platform.</li>
          <li><strong>Skill:</strong> A packaged set of instructions, prompts, and resources for AI agents, distributable through the marketplace.</li>
          <li><strong>Creator:</strong> An individual or entity that publishes an Agent or Skill on the Platform.</li>
          <li><strong>User:</strong> Any person who browses, searches, downloads, or interacts with Agents on the Platform.</li>
          <li><strong>Listing:</strong> The public-facing page for an Agent, including its description, pricing, documentation, and reviews.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Account Registration</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must create an account to list Agents, submit reviews, or access creator features.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must be at least 18 years old to use the Platform.</li>
          <li>You must provide accurate and complete information during registration.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Agent Listings</h2>
        <h3 className="text-xl font-medium mt-4 mb-2">3.1 Creator Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are solely responsible for the content, accuracy, security, and legality of your Agent listings.</li>
          <li>Listings must accurately describe the Agent&apos;s capabilities, pricing, limitations, and system requirements.</li>
          <li>You must not list Agents that contain malicious code, violate intellectual property rights, or engage in fraudulent activity.</li>
          <li>Agents must not collect user data beyond what is disclosed in their listing description.</li>
          <li>You grant us a non-exclusive, worldwide, royalty-free license to display, promote, and distribute your listing on the Platform.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">3.2 Content Ownership</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You retain full ownership of your Agent code, skill packages, and associated intellectual property.</li>
          <li>By listing on the Platform, you grant users who download or access your Agent a license as specified in your listing (or a reasonable non-exclusive license if not specified).</li>
          <li>The Platform&apos;s design, code, branding, and aggregate content (excluding individual Agent listings) are owned by Syncoe.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">3.3 Listing Review &amp; Moderation</h3>
        <p>
          All Agent submissions are reviewed before publication. We may reject, suspend, or remove
          listings that violate our <Link href="/legal/guidelines" className="text-indigo-600 hover:underline">Agent Listing Guidelines</Link>
          {' '}or these Terms. We strive to review submissions within 48 business hours.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Reviews &amp; Ratings</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Users may submit one review per Agent, based on genuine experience.</li>
          <li>Fake, misleading, or incentivized reviews are prohibited and will be removed.</li>
          <li>We reserve the right to remove reviews that violate these Terms or our guidelines.</li>
          <li>Creators may not solicit, reward, or penalize users for leaving reviews.</li>
          <li>Review content becomes publicly visible and may be indexed by search engines.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Platform&apos;s design, code, trademarks, and content (excluding Agent listings) are owned by Syncoe.</li>
          <li>Agent and Skill listings remain the intellectual property of their respective Creators.</li>
          <li>By listing on the Platform, you grant us permission to display, promote, and link to your Agent.</li>
          <li>You represent that you have the right to grant the licenses described in these Terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payments &amp; Fees</h2>
        <h3 className="text-xl font-medium mt-4 mb-2">6.1 Pricing</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Basic Agent listings are free.</li>
          <li>Featured listings and Verified badges are available for a fee, as outlined on our <Link href="/pricing" className="text-indigo-600 hover:underline">Pricing page</Link>.</li>
          <li>All prices are displayed in USD unless otherwise stated.</li>
          <li>We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">6.2 Payment Processing</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>All payments are processed securely through Stripe.</li>
          <li>We do not store or have access to your full payment card details.</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2">6.3 Refund Policy</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Featured Listings:</strong> Refund requests must be made within 14 days of purchase if the featured listing has not received any additional views compared to non-featured status. Pro-rated refunds may be issued at our discretion.</li>
          <li><strong>Verified Badges:</strong> Refund requests must be made within 14 days of purchase if the verification review has not been completed.</li>
          <li><strong>Third-Party Agents:</strong> Payments for Agents with pricing set by Creators are subject to the Creator&apos;s own refund policy as stated on their listing. Syncoe is not responsible for refunding third-party Agent purchases.</li>
          <li>To request a refund, contact <a href="mailto:billing@syncoe.com" className="text-indigo-600 hover:underline">billing@syncoe.com</a> with your order details.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. User Obligations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You agree not to misuse the Platform, including but not limited to: attempting to gain unauthorized access, scraping data at scale, or interfering with Platform functionality.</li>
          <li>You agree not to use Agents obtained through the Platform for illegal purposes.</li>
          <li>You agree not to resell or redistribute Agent listings without the Creator&apos;s permission.</li>
          <li>You agree to comply with all applicable laws and regulations in your jurisdiction.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimers &amp; Limitation of Liability</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AgentHub is a discovery and distribution platform. We do not host, execute, or guarantee the performance of any Agent.</li>
          <li>Agents are provided &quot;as-is&quot; by their Creators. We make no warranties regarding Agent accuracy, security, or fitness for purpose.</li>
          <li>You use Agents at your own risk. We are not liable for any damages arising from Agent use.</li>
          <li>To the fullest extent permitted by Malaysian law, our total liability is limited to the amount you paid us in the 12 months preceding the claim.</li>
          <li>We do not warrant that the Platform will be available at all times or free from errors.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. DMCA &amp; Takedown</h2>
        <p>
          We respect intellectual property rights and have a{' '}
          <Link href="/legal/dmca" className="text-indigo-600 hover:underline">DMCA Takedown Policy</Link>.
          If you believe your content has been used improperly, contact us at{' '}
          <a href="mailto:dmca@syncoe.com" className="text-indigo-600 hover:underline">dmca@syncoe.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Privacy</h2>
        <p>
          Your use of the Platform is also governed by our{' '}
          <Link href="/legal/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>,
          which is incorporated by reference into these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Syncoe, its officers, directors, employees, and
          agents from any claims, damages, losses, or expenses arising from your use of the Platform
          or violation of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. The effective date at the top will reflect
          the most recent changes. Material changes will be communicated via email or platform
          notice at least 14 days before taking effect. Continued use of the Platform constitutes
          acceptance of updated Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of Malaysia.
          Any disputes arising from or in connection with these Terms shall be subject to the
          exclusive jurisdiction of the courts of Malaysia. If any provision of these Terms is
          found to be unenforceable, the remaining provisions shall continue in full force and effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact</h2>
        <p>
          For questions about these Terms, contact us at:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Email:</strong> <a href="mailto:legal@syncoe.com" className="text-indigo-600 hover:underline">legal@syncoe.com</a></li>
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
