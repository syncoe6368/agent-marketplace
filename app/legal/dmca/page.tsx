import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMCA Takedown Policy',
  description: 'DMCA Takedown Policy for AgentHub — how to report intellectual property violations.',
};

export default function DmcaPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">DMCA Takedown Policy</h1>
        <p className="text-muted-foreground">Effective Date: April 2, 2026</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          AgentHub respects the intellectual property rights of others and expects users of our
          Platform to do the same. This DMCA Takedown Policy describes our process for responding
          to notifications of alleged copyright infringement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Reporting Copyright Infringement</h2>
        <p>
          If you believe that content on AgentHub infringes your copyright, please send us a
          written &quot;Notification of Claimed Infringement&quot; (a DMCA notice) to our
          designated agent at:
        </p>
        <div className="bg-muted p-6 rounded-lg my-4">
          <p className="mb-2"><strong>Designated Copyright Agent:</strong></p>
          <p>Email: <a href="mailto:dmca@agenthub.io" className="text-primary hover:underline">dmca@agenthub.io</a></p>
          <p>Subject: DMCA Takedown Notice</p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Required Information in Your Notice</h2>
        <p>Your DMCA notice must include all of the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identification of the copyrighted work</strong> — a specific description of the copyrighted work you claim is being infringed.</li>
          <li><strong>Identification of the infringing material</strong> — the URL or location on AgentHub of the material that you claim is infringing (e.g., the Agent listing URL).</li>
          <li><strong>Contact information</strong> — your address, telephone number, and email address.</li>
          <li><strong>Good faith statement</strong> — a statement that you have a good-faith belief that the use of the copyrighted work is not authorized by the copyright owner, its agent, or the law.</li>
          <li><strong>Accuracy statement</strong> — a statement that the information in your notice is accurate and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
          <li><strong>Signature</strong> — your physical or electronic signature.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Our Process</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Receipt</strong> — We will acknowledge receipt of your DMCA notice within 48 hours.</li>
          <li><strong>Review</strong> — We will review your notice to determine if it meets the requirements above and appears legitimate.</li>
          <li><strong>Removal</strong> — If the notice is valid, we will promptly remove or disable access to the alleged infringing material.</li>
          <li><strong>Notification</strong> — We will notify the Creator whose listing was removed and provide them with a copy of your DMCA notice.</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Counter-Notice</h2>
        <p>
          If a Creator believes their listing was removed in error (e.g., due to misidentification
          or mistake), they may file a Counter-Notice to have the listing reinstated.
        </p>
        <p>The Creator&apos;s Counter-Notice must include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Their name, address, and contact information.</li>
          <li>Identification of the material that was removed or disabled.</li>
          <li>A statement under penalty of perjury that the material was removed or disabled as a result of mistake or misidentification.</li>
          <li>A statement that they consent to the jurisdiction of the court for their judicial district (or the jurisdiction where we are located).</li>
          <li>Their physical or electronic signature.</li>
        </ul>
        <p>
          If we receive a valid Counter-Notice, we will forward it to the original complainant.
          If no legal action is filed within 10 business days, we may reinstate the listing.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Repeat Infringers</h2>
        <p>
          AgentHub will terminate or suspend the accounts of users who are found to be repeat
          infringers, as determined in our discretion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. False Claims</h2>
        <p>
          Submitting fraudulent or materially misrepresenting a DMCA notice can result in legal
          liability, including damages and attorney&apos;s fees. If you are unsure whether
          material infringes your copyright, we suggest you consult with an attorney first.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Related Policies</h2>
        <p>
          Please also review our other policies:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><Link href="/legal/terms" className="text-primary hover:underline">Terms of Service</Link></li>
          <li><Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
          <li><Link href="/legal/guidelines" className="text-primary hover:underline">Agent Listing Guidelines</Link></li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
        <p>
          For DMCA-related inquiries, contact us at{' '}
          <a href="mailto:dmca@agenthub.io" className="text-primary hover:underline">dmca@agenthub.io</a>.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-primary hover:underline">← Back to AgentHub</Link>
      </div>
    </div>
  );
}
