import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteFooter from './SiteFooter';

const tocSections = [
  { id: 'information-we-collect',    num: 1, label: 'Information We Collect' },
  { id: 'legal-basis',               num: 2, label: 'Legal Basis & Business Purposes' },
  { id: 'data-sharing',              num: 3, label: 'Data Sharing & Integrations' },
  { id: 'data-storage',              num: 4, label: 'Data Storage, Security & Retention' },
  { id: 'privacy-rights',            num: 5, label: 'Your Privacy Rights' },
  { id: 'international-transfers',   num: 6, label: 'International Data Transfers' },
  { id: 'childrens-privacy',         num: 7, label: "Children's Privacy" },
  { id: 'contact-information',       num: 8, label: 'Contact Information' },
];

const legalBasisRows = [
  { purpose: 'Providing and operating the ServAi platform', legal: 'Performance of Contract', business: 'Fulfilling service requests and platform delivery' },
  { purpose: 'Processing payment transactions via Stripe', legal: 'Performance of Contract', business: 'Commercial execution and invoicing' },
  { purpose: 'Generating AI outputs via APIs (e.g., OpenAI)', legal: 'Performance of Contract', business: 'Core feature execution' },
  { purpose: 'Authenticating users via Meta/Google Login', legal: 'Performance of Contract', business: 'Account security and user authentication' },
  { purpose: 'Improving AI response accuracy and debugging', legal: 'Legitimate Interests', business: 'Product development and service optimization' },
  { purpose: 'Detecting fraud, abuse, and security threats', legal: 'Legitimate Interests / Legal Obligation', business: 'System security and regulatory compliance' },
  { purpose: 'Sending marketing updates and product notifications', legal: 'Consent / Legitimate Interests', business: 'Marketing and customer communication' },
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

function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(tocSections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 24;
      let current = tocSections[0].id;

      // Check if we're at the bottom of the page
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

      // If at bottom, activate the last section
      if (isAtBottom) {
        current = tocSections[tocSections.length - 1].id;
      } else {
        // Otherwise, use the normal logic
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
    <div className="min-h-screen bg-white text-[#222A30]" data-testid="privacy-policy-page">

      <header className="w-full h-16 flex items-center px-6 sm:px-10 lg:px-16 border-b border-gray-100" data-testid="privacy-header">
        <Link to="/" className="flex items-center gap-2" data-testid="privacy-header-logo-link">
          <img src="/assets/servai-logo.webp" alt="ServAI" className="h-8 w-auto object-contain" />
        </Link>
      </header>

      <div className="pt-12 sm:pt-16 pb-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Header & overview */}
          <div className="mb-16 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A2126] mb-5 leading-tight" data-testid="privacy-policy-title">
              ServAi <span className="text-[#C85A32]">Privacy Policy</span>
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500" data-testid="privacy-policy-meta">
              <span>Effective Date: <span className="text-gray-700">August 10, 2026</span></span>
              <span className="text-gray-300">|</span>
              <span>Last Updated: <span className="text-gray-700">August 10, 2026</span></span>
            </div>
          </div>
 [100 lines shown. Remaining: lines 101-301 (201 lines). Use view_range parameter to continue.]

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">

            {/* Sticky TOC sidebar */}
            <aside className="lg:sticky lg:top-8 lg:self-start lg:h-fit" data-testid="privacy-toc-sidebar">
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
            <div className="max-w-[750px] text-[16px] leading-[1.6] text-gray-700" data-testid="privacy-policy-content">
              <p className="mb-12 text-gray-500">
                This Privacy Policy describes how ServAi by DD Consulting Pty. Ltd. ("ServAi," "Company," "we," "us," or "our")
                collects, uses, discloses, and protects your personal information when you access or use our software application,
                website, and related AI-powered software services (collectively, the "Services"). By accessing or using ServAi,
                you acknowledge that you have read and understood this Privacy Policy.
              </p>

              {/* 1. Information We Collect */}
              <section className="mb-16">
                <SectionHeading id="information-we-collect" num={1}>Information We Collect</SectionHeading>
                <p className="mb-2">
                  We collect information directly from you, automatically through your interaction with the Services,
                  and from third-party services.
                </p>

                <SubHeading>A. Information You Provide to Us</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Account and Profile Information:</strong> Name, email address, password, phone number, company name, and profile details provided during registration.</li>
                  <li><strong className="text-[#1A2126]">AI Prompts &amp; User Content:</strong> Text, images, audio, queries, parameters, and other inputs you upload or submit to ServAi to generate AI responses ("Prompts"), as well as feedback provided on outputs.</li>
                  <li><strong className="text-[#1A2126]">Payment Information:</strong> Payment card details, billing address, and transaction history. (Note: Payment card processing is handled securely by our third-party payment processor, Stripe. ServAi does not directly store full payment card details.)</li>
                  <li><strong className="text-[#1A2126]">Communications:</strong> Correspondence, support tickets, and feedback sent to our support team.</li>
                </ul>

                <SubHeading>B. Information Collected Automatically</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Usage Data:</strong> Interactions with our interface, feature usage, API requests, execution response times, and system usage metrics.</li>
                  <li><strong className="text-[#1A2126]">Technical &amp; Device Information:</strong> IP address, browser type, operating system, device identifiers, language settings, referring URLs, and access timestamps.</li>
                  <li><strong className="text-[#1A2126]">Cookies &amp; Tracking Technologies:</strong> Cookies, local storage, and similar web technologies to maintain session state, user preferences, and platform analytics.</li>
                </ul>

                <SubHeading>C. Information from Third-Party Services</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Social Authentication &amp; Social Login:</strong> If you connect or log in via third parties (e.g., Meta/Facebook Login, Google Sign-In), we receive account identifiers (such as Meta/Facebook Profile ID), name, and verified email address in accordance with that platform's permission settings.</li>
                  <li><strong className="text-[#1A2126]">Integrations:</strong> Data shared through connected third-party platforms integrated with ServAi at your direction.</li>
                </ul>
              </section>

              {/* 2. Legal Basis */}
              <section className="mb-16">
                <SectionHeading id="legal-basis" num={2}>Legal Basis and Business Purposes for Processing</SectionHeading>
                <p className="mb-6">
                  We process your personal information under the following legal bases and for the following business
                  purposes to comply with the Australian Privacy Principles (APPs), EU GDPR, and other global privacy laws:
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200" data-testid="legal-basis-table">
                  <table className="w-full text-sm border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold text-[#1A2126] border-b border-gray-200 w-1/3">Purpose of Processing</th>
                        <th className="text-left p-3 font-semibold text-[#1A2126] border-b border-gray-200 border-l border-gray-200 w-1/3">Legal Basis (GDPR / Global)</th>
                        <th className="text-left p-3 font-semibold text-[#1A2126] border-b border-gray-200 border-l border-gray-200 w-1/3">Business Purpose (APPs / CCPA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {legalBasisRows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="p-3 align-top text-gray-700">{row.purpose}</td>
                          <td className="p-3 align-top text-gray-500 border-l border-gray-200">{row.legal}</td>
                          <td className="p-3 align-top text-gray-500 border-l border-gray-200">{row.business}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 3. Data Sharing */}
              <section className="mb-16">
                <SectionHeading id="data-sharing" num={3}>Data Sharing and Third-Party Integrations</SectionHeading>
                <p className="mb-2">
                  We do not sell your personal information. We disclose personal data only to trustworthy vendors and
                  service providers bound by strict data processing agreements:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">AI Service Providers:</strong> Inputs and prompts may be transmitted to third-party AI backend infrastructure providers solely to execute AI output generation. Inputs sent via API integrations are governed by enterprise confidentiality commitments and are not used to train public third-party models.</li>
                  <li><strong className="text-[#1A2126]">Third-Party Identity Providers:</strong> Meta (Facebook) and Google for account authentication and user identity verification.</li>
                  <li><strong className="text-[#1A2126]">Payment Processors:</strong> Stripe for processing recurring subscriptions, billing, and fraud prevention.</li>
                  <li><strong className="text-[#1A2126]">Infrastructure &amp; Analytics Hosting:</strong> Cloud hosting platforms (e.g., AWS) and analytics providers to host application infrastructure and monitor platform performance.</li>
                  <li><strong className="text-[#1A2126]">Legal Disclosures:</strong> We may disclose information if required by law, subpoena, or court order, or to protect the rights, property, and safety of ServAi, our users, or the public.</li>
                </ul>
              </section>

              {/* 4. Data Storage */}
              <section className="mb-16">
                <SectionHeading id="data-storage" num={4}>Data Storage, Security, and Retention</SectionHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Storage &amp; Encryption:</strong> Personal data is encrypted in transit using Transport Layer Security (TLS 1.2+) and at rest using AES-256 standard encryption.</li>
                  <li><strong className="text-[#1A2126]">Data Retention:</strong> We retain personal information for as long as your account remains active or as necessary to fulfill the purposes described in this policy. Account data is retained until an account deletion request is processed. System logs and security logs are retained for 30 days before automated purge. Financial and transactional records are retained for 7 years to meet Australian Taxation Office (ATO) and corporate regulatory obligations.</li>
                </ul>
              </section>

              {/* 5. Your Privacy Rights */}
              <section className="mb-16">
                <SectionHeading id="privacy-rights" num={5}>Your Privacy Rights</SectionHeading>
                <p className="mb-2">
                  Depending on your geographic location, you possess specific legal rights regarding your personal data:
                </p>

                <SubHeading>A. Australian Privacy Principles (APPs)</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Right to Access:</strong> You have the right to request access to the personal information we hold about you.</li>
                  <li><strong className="text-[#1A2126]">Right to Correction:</strong> You have the right to request that we correct any inaccurate, out-of-date, or incomplete personal information.</li>
                  <li><strong className="text-[#1A2126]">Complaint Handling:</strong> You have the right to make a complaint about a breach of the APPs, which we will investigate and respond to within a reasonable timeframe.</li>
                </ul>

                <SubHeading>B. European Union (GDPR) &amp; United Kingdom Rights</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Right of Access &amp; Rectification:</strong> Request a copy or correction of the personal data we hold about you.</li>
                  <li><strong className="text-[#1A2126]">Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data.</li>
                  <li><strong className="text-[#1A2126]">Right to Restrict or Object:</strong> Limit or object to our processing of your personal data.</li>
                  <li><strong className="text-[#1A2126]">Right to Data Portability:</strong> Request transfer of your data in a structured, machine-readable format.</li>
                </ul>

                <SubHeading>C. California Consumer Rights (CCPA / CPRA)</SubHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Right to Know / Access:</strong> Request disclosure of personal information collected, categories of sources, and third parties receiving data.</li>
                  <li><strong className="text-[#1A2126]">Right to Delete:</strong> Request deletion of personal information collected from you.</li>
                  <li><strong className="text-[#1A2126]">Right to Opt-Out:</strong> ServAi does not sell or share personal information for cross-context behavioral advertising.</li>
                  <li><strong className="text-[#1A2126]">Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
                </ul>

                <p className="mt-6">
                  To exercise these rights, submit a request to{' '}
                  <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>.
                </p>
              </section>

              {/* 6. International Data Transfers */}
              <section className="mb-16">
                <SectionHeading id="international-transfers" num={6}>International Data Transfers</SectionHeading>
                <p>
                  While our primary database and AI processing infrastructure are hosted securely in Australia (AWS Sydney),
                  you acknowledge that utilizing certain network integrations (such as Meta Platforms) requires data to
                  transit through servers located in the United States and Ireland. By using the Services, you expressly
                  consent to this cross-border transmission of data necessary for the delivery of the Services, in
                  compliance with applicable Australian and international privacy frameworks.
                </p>
              </section>

              {/* 7. Children's Privacy */}
              <section className="mb-16">
                <SectionHeading id="childrens-privacy" num={7}>Children's Privacy</SectionHeading>
                <p>
                  ServAi is strictly intended for individuals aged 18 and older (or the legal age of majority in your
                  jurisdiction). We do not knowingly collect personal information from children under 13 (or under 16 in
                  the EU). If we discover data collected from a minor, we will delete it immediately.
                </p>
              </section>

              {/* 8. Contact Information */}
              <section>
                <SectionHeading id="contact-information" num={8}>Contact Information</SectionHeading>
                <p className="mb-4">
                  For inquiries regarding this Privacy Policy, data protection practices, or to exercise your rights,
                  contact us at:
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-1">
                  <p><span className="text-gray-500">Email:</span>{' '}
                    <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>
                  </p>
                  <p><span className="text-gray-500">Company Name:</span> ServAi by DD Consulting Pty. Ltd.</p>
                  <p><span className="text-gray-500">Mailing Address:</span> Sydney, Australia</p>
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

export default PrivacyPolicyPage;
