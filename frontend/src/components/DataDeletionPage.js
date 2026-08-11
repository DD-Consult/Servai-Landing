import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteFooter from './SiteFooter';

const tocSections = [
  { id: 'deletion-methods',     num: 1, label: 'Data Deletion Methods' },
  { id: 'method-a-self-service', num: 2, label: 'In-App Self-Service Deletion' },
  { id: 'method-b-facebook',    num: 3, label: 'Meta / Facebook Deletion' },
  { id: 'method-c-email',       num: 4, label: 'Email Request (Manual)' },
  { id: 'processing-timeline',  num: 5, label: 'Processing Timeline & Verification' },
  { id: 'scope-exceptions',     num: 6, label: 'Scope of Deletion & Exceptions' },
  { id: 'contact-support',      num: 7, label: 'Contact & Support' },
];

function SectionHeading({ id, num, children }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-2xl font-bold text-[#1A2126] mb-6 pb-3 border-b border-gray-200">
      {num}. {children}
    </h2>
  );
}

function SubHeading({ children }) {
  return <h3 className="text-lg font-semibold text-[#647A5A] mt-8 mb-3">{children}</h3>;
}

function DataDeletionPage() {
  const [activeSection, setActiveSection] = useState(tocSections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 24;
      let current = tocSections[0].id;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtBottom) {
        current = tocSections[tocSections.length - 1].id;
      } else {
        for (const s of tocSections) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top - offset <= 0) {
            current = s.id;
          }
        }
      }

      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTocClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-[#222A30]" data-testid="data-deletion-page">

      <header className="w-full h-16 flex items-center gap-4 px-6 sm:px-10 lg:px-16 border-b border-gray-100" data-testid="data-deletion-header">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="data-deletion-header-logo-link">
          <img src="/assets/servai-logo.webp" alt="ServAI" className="h-8 w-auto object-contain" />
        </Link>
        <span className="hidden sm:block w-px h-6 bg-gray-200" />
        <h1 className="text-base sm:text-lg font-semibold text-[#1A2126] truncate" data-testid="data-deletion-header-title">
          ServAi <span className="text-[#C85A32]">Data Deletion</span>
        </h1>
      </header>

      <div className="pt-12 sm:pt-16 pb-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">

            {/* Sticky TOC sidebar */}
            <aside className="lg:sticky lg:top-8 lg:self-start lg:h-fit" data-testid="data-deletion-toc-sidebar">
              <h4 className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mb-4">On This Page</h4>
              <nav className="flex flex-col gap-1 border-l border-gray-200">
                {tocSections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={(e) => handleTocClick(e, s.id)}
                    className={`pl-4 py-2 text-sm border-l-2 -ml-px transition-colors duration-200 ${
                      activeSection === s.id
                        ? 'border-[#C85A32] text-[#1A2126] font-medium'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                    data-testid={`toc-link-${s.id}`}>
                    {s.num}. {s.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="max-w-[750px] text-[16px] leading-[1.6] text-gray-700" data-testid="data-deletion-content">
              <p className="mb-4 text-gray-500">
                Developer App Name: <span className="text-gray-700">ServAi</span><br />
                Callback Endpoint URL:{' '}
                <a href="https://serv-ai.com/" target="_blank" rel="noopener noreferrer" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">https://serv-ai.com/</a>
              </p>
              <p className="mb-12 text-gray-500">
                ServAi respects your rights regarding personal data control. This page provides explicit, step-by-step
                technical instructions on how users can delete their accounts and permanently remove their personal
                information from our databases. These instructions specifically satisfy requirements set forth by
                major third-party platform providers, including the Meta/Facebook Developer Data Deletion Rules.
              </p>

              {/* 1. Data Deletion Methods */}
              <section className="mb-16">
                <SectionHeading id="deletion-methods" num={1}>Data Deletion Methods</SectionHeading>
                <p className="mb-2">Users can request data deletion through three (3) primary channels:</p>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">In-App Account Self-Deletion:</strong> Instant / Automated Trigger</li>
                  <li><strong className="text-[#1A2126]">Meta/Facebook App Removal Callback:</strong> Real-time Webhook Process</li>
                  <li><strong className="text-[#1A2126]">Email Request (Manual / Support):</strong> Processed within 30 days</li>
                </ul>
              </section>

              {/* 2. Method A */}
              <section className="mb-16">
                <SectionHeading id="method-a-self-service" num={2}>Method A: In-App Self-Service Deletion (Recommended)</SectionHeading>
                <p className="mb-3">To immediately initiate automated data deletion from within the platform:</p>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Log in to your ServAi account at{' '}
                    <a href="https://serv-ai.com/login" target="_blank" rel="noopener noreferrer" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">serv-ai.com/login</a>.
                  </li>
                  <li>Navigate to Account Settings by clicking your avatar in the top-right corner.</li>
                  <li>Scroll to the Security &amp; Privacy tab.</li>
                  <li>Locate the "Danger Zone" section at the bottom of the page.</li>
                  <li>Click "Delete My Account and Associated Data".</li>
                  <li>Re-enter your password or complete multi-factor authentication to confirm.</li>
                  <li>Click "Permanently Delete".</li>
                </ol>
                <p className="mt-4">
                  Your session will terminate, and automated account purging will begin immediately.
                </p>
              </section>

              {/* 3. Method B */}
              <section className="mb-16">
                <SectionHeading id="method-b-facebook" num={3}>Method B: Meta / Facebook Developer Platform Data Deletion Instructions</SectionHeading>
                <p className="mb-3">
                  If you registered for or logged into ServAi using your Facebook / Meta Account, you can remove
                  ServAi's access and trigger automated data deletion directly via Facebook:
                </p>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Log in to your Facebook account and navigate to Settings &amp; Privacy &gt; Settings.</li>
                  <li>Select Apps and Websites from the left-hand menu.</li>
                  <li>Locate ServAi in the active app list and click Remove.</li>
                  <li>To verify or trigger a specific data deletion confirmation callback:
                    <ol className="mt-2 space-y-2 list-[lower-alpha] pl-5">
                      <li>Click View Removed Apps and Websites.</li>
                      <li>Click ServAi and click Send Request to trigger Meta's Data Deletion Callback.</li>
                    </ol>
                  </li>
                </ol>

                <SubHeading>How ServAi Processes Meta Data Deletion Callbacks</SubHeading>
                <p className="mb-4">
                  When Meta sends an automated data deletion request to our server callback endpoint (
                  <span className="text-gray-700">https://serv-ai.com/api/v1/auth/facebook/deletion-callback</span>):
                </p>
                <ul className="space-y-3 list-disc pl-5 mb-6">
                  <li><strong className="text-[#1A2126]">Payload Receipt:</strong> ServAi's API receives a signed JSON payload containing your unique Meta/Facebook User ID (signed_request).</li>
                  <li><strong className="text-[#1A2126]">Account Disassociation:</strong> Our systems disassociate your Meta Profile ID, invalidate session tokens, and queue your connected profile records for permanent deletion.</li>
                  <li><strong className="text-[#1A2126]">Confirmation Code Generation:</strong> ServAi instantly returns a JSON response to Meta containing a unique Confirmation Code and a Status URL where you can track deletion status.</li>
                </ul>

                <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-700 mb-4" data-testid="deletion-callback-code">
<code>{`{
  "url": "https://serv-ai.com/deletion-status?code=[CONFIRMATION_CODE]",
  "confirmation_code": "[UNIQUE_CONFIRMATION_CODE]"
}`}</code>
                </pre>

                <p>
                  <strong className="text-[#1A2126]">Tracking:</strong> You can paste the generated confirmation code into{' '}
                  <a href="https://serv-ai.com/deletion-status" target="_blank" rel="noopener noreferrer" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">serv-ai.com/deletion-status</a>{' '}
                  to verify that your record deletion has successfully completed.
                </p>
              </section>

              {/* 4. Method C */}
              <section className="mb-16">
                <SectionHeading id="method-c-email" num={4}>Method C: Email Request (Manual Process)</SectionHeading>
                <p className="mb-3">If you cannot access your account or need manual administrative intervention:</p>
                <ol className="space-y-2 list-decimal pl-5">
                  <li>Send an email to{' '}
                    <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>.
                  </li>
                  <li>Subject line must state: <em>Data Deletion Request - [Your Account Email]</em>.</li>
                  <li>Include the following verification details in the email body:
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>Full Name associated with the account.</li>
                      <li>Registered Account Email Address.</li>
                      <li>Third-party Login Provider used (e.g., Meta/Facebook, Google, or Email).</li>
                      <li>Meta Profile ID (if applicable and available).</li>
                    </ul>
                  </li>
                </ol>
              </section>

              {/* 5. Processing Timeline */}
              <section className="mb-16">
                <SectionHeading id="processing-timeline" num={5}>Processing Timeline &amp; Verification</SectionHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Verification:</strong> Upon receiving a manual request, our privacy team will verify ownership of the account within 48 hours to prevent unauthorized deletion attacks.</li>
                  <li><strong className="text-[#1A2126]">Processing Execution:</strong> Full database and backup purge is completed within 30 calendar days of verified receipt.</li>
                  <li><strong className="text-[#1A2126]">Confirmation Email:</strong> A final confirmation email containing a formal Data Erasure Certificate / Completion notice will be dispatched once deletion is complete.</li>
                </ul>
              </section>

              {/* 6. Scope & Exceptions */}
              <section className="mb-16">
                <SectionHeading id="scope-exceptions" num={6}>Scope of Deletion &amp; Legal Exceptions</SectionHeading>
                <p className="mb-2">When your data deletion request is completed, ServAi permanently erases:</p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>Account profile data, user credentials, and OAuth tokens.</li>
                  <li>Associated Meta/Facebook user identifiers and social graphs.</li>
                  <li>Uploaded Prompts, custom AI parameters, and generated Outputs.</li>
                  <li>Active API keys, webhook configurations, and preferences.</li>
                </ul>

                <SubHeading>Legal Retention Exceptions</SubHeading>
                <p className="mb-2">
                  In accordance with privacy frameworks and legal exemptions, ServAi retains limited anonymized or
                  legally required records:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Financial Records:</strong> Payment transaction logs, tax records, and invoices are retained for 7 years to comply with legal and corporate financial reporting obligations (including ATO rules).</li>
                  <li><strong className="text-[#1A2126]">Security Logs:</strong> System error logs stripped of personal identifiers are retained in anonymized format for platform security monitoring.</li>
                </ul>
              </section>

              {/* 7. Contact & Support */}
              <section>
                <SectionHeading id="contact-support" num={7}>Data Deletion Contact &amp; Support</SectionHeading>
                <p className="mb-4">
                  If you encounter issues during account deletion or have questions regarding our data retention
                  pipeline, reach out to:
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-1">
                  <p><span className="text-gray-500">Email:</span>{' '}
                    <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>
                  </p>
                  <p><span className="text-gray-500">Live Status Verification Portal:</span>{' '}
                    <a href="https://serv-ai.com/deletion-status" target="_blank" rel="noopener noreferrer" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">serv-ai.com/deletion-status</a>
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default DataDeletionPage;
