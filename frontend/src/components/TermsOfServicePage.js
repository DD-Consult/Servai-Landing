import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteFooter from './SiteFooter';

const tocSections = [
  { id: 'acceptance',              num: 1,  label: 'Acceptance & Eligibility' },
  { id: 'account-registration',    num: 2,  label: 'Account Registration' },
  { id: 'acceptable-use',          num: 3,  label: 'Acceptable Use' },
  { id: 'ip-ownership',            num: 4,  label: 'IP & AI Output Ownership' },
  { id: 'subscriptions-payments',  num: 5,  label: 'Subscriptions & Payments' },
  { id: 'termination',             num: 6,  label: 'Termination & Suspension' },
  { id: 'disclaimers-liability',   num: 7,  label: 'Disclaimers & Liability' },
  { id: 'indemnification',         num: 8,  label: 'Indemnification' },
  { id: 'governing-law',           num: 9,  label: 'Governing Law' },
  { id: 'contact-information',     num: 10, label: 'Contact Information' },
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

function TermsOfServicePage() {
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
    <div className="min-h-screen bg-white text-[#222A30]" data-testid="terms-page">

      <header className="w-full h-16 flex items-center gap-4 px-6 sm:px-10 lg:px-16 border-b border-gray-100" data-testid="terms-header">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="terms-header-logo-link">
          <img src="/assets/servai-logo.webp" alt="ServAI" className="h-8 w-auto object-contain" />
        </Link>
        <span className="hidden sm:block w-px h-6 bg-gray-200" />
        <h1 className="text-base sm:text-lg font-semibold text-[#1A2126] truncate" data-testid="terms-header-title">
          ServAi <span className="text-[#C85A32]">Terms of Service</span>
        </h1>
      </header>

      <div className="pt-12 sm:pt-16 pb-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">

            {/* Sticky TOC sidebar */}
            <aside className="lg:sticky lg:top-8 lg:self-start lg:h-fit" data-testid="terms-toc-sidebar">
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
            <div className="max-w-[750px] text-[16px] leading-[1.6] text-gray-700" data-testid="terms-content">
              <p className="mb-12 text-gray-500">
                Please read these Terms of Service ("Terms") carefully before using ServAi. By creating an account
                or using the platform, you agree to be bound by these Terms.
              </p>

              {/* 1. Acceptance */}
              <section className="mb-16">
                <SectionHeading id="acceptance" num={1}>Acceptance of Terms &amp; Eligibility</SectionHeading>
                <p>
                  These Terms form a legally binding contract between ServAi by DD Consulting Pty. Ltd. ("ServAi,"
                  "we," "us") and you ("User" or "Customer"). You must be at least 18 years old (or the legal age of
                  majority in your jurisdiction) to use ServAi. If you enter into these Terms on behalf of an entity
                  or employer, you represent and warrant that you have full authority to bind that entity to these Terms.
                </p>
              </section>

              {/* 2. Account Registration */}
              <section className="mb-16">
                <SectionHeading id="account-registration" num={2}>Account Registration and Responsibilities</SectionHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Account Accuracy:</strong> You must provide accurate, complete, and current information during registration.</li>
                  <li><strong className="text-[#1A2126]">Security:</strong> You are responsible for safeguarding your account credentials, including third-party login authorizations (e.g., Meta/Facebook Login). You are solely responsible for all activities occurring under your account.</li>
                  <li><strong className="text-[#1A2126]">Unauthorized Use:</strong> You must immediately notify ServAi at{' '}
                    <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>{' '}
                    of any unauthorized access or breach of security.
                  </li>
                </ul>
              </section>

              {/* 3. Acceptable Use */}
              <section className="mb-16">
                <SectionHeading id="acceptable-use" num={3}>Acceptable Use &amp; Prohibited Conduct</SectionHeading>
                <p className="mb-2">You agree not to misuse the ServAi platform. You explicitly agree NOT to:</p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>Use ServAi for any illegal, fraud, or unauthorized purpose under applicable local, national, or international laws.</li>
                  <li>Input prompts or generate outputs that contain unlawful, harmful, defamatory, hate speech, explicit, or infringing content.</li>
                  <li>Reverse engineer, decompile, disassemble, or attempt to extract source code or underlying AI models of ServAi or its service providers.</li>
                  <li>Use automated bots, scrapers, or spiders to access, index, or extract data from the platform.</li>
                  <li>Submit high-volume programmatic requests designed to abuse, overload, or disrupt our API or network performance.</li>
                  <li>Use outputs from ServAi to develop competing machine learning or artificial intelligence models.</li>
                </ul>
              </section>

              {/* 4. IP & AI Output Ownership */}
              <section className="mb-16">
                <SectionHeading id="ip-ownership" num={4}>Intellectual Property Rights &amp; AI Output Ownership</SectionHeading>

                <SubHeading>A. ServAi Ownership</SubHeading>
                <p>
                  ServAi retains all ownership, rights, title, and interest in and to the platform, including
                  software, infrastructure, brand assets, proprietary code, system architectures, and user interfaces.
                </p>

                <SubHeading>B. User Content &amp; Inputs</SubHeading>
                <p>
                  You retain all ownership rights in the text, data, files, and prompts you upload to ServAi
                  ("Inputs"). You grant ServAi a worldwide, royalty-free, non-exclusive license to process, store,
                  and host your Inputs solely to provide, support, and maintain the platform.
                </p>

                <SubHeading>C. Generated AI Output Ownership</SubHeading>
                <p className="mb-4">
                  Subject to your compliance with these Terms, ServAi hereby assigns to you all its right, title, and
                  interest (if any) in the output generated by the platform based on your Inputs ("Outputs").
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Nature of AI Outputs:</strong> You acknowledge that due to the probabilistic nature of artificial intelligence, Outputs may not be unique across users, and similar queries by other users may yield identical or similar outputs.</li>
                  <li><strong className="text-[#1A2126]">Accuracy Notice:</strong> AI-generated Outputs may occasionally contain factual errors, hallucinations, or incomplete information. You are responsible for reviewing and verifying the accuracy and appropriateness of Outputs prior to commercial or legal reliance.</li>
                </ul>
              </section>

              {/* 5. Subscriptions & Payments */}
              <section className="mb-16">
                <SectionHeading id="subscriptions-payments" num={5}>Subscriptions, Payments, and Billing</SectionHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Subscription Fees:</strong> Access to certain features of ServAi requires a paid subscription. Pricing details are available on our pricing page and subject to change upon notice.</li>
                  <li><strong className="text-[#1A2126]">Payment Processing:</strong> Payment execution is handled by our third-party processor, Stripe. By subscribing, you authorize Stripe to charge your payment method on a recurring basis until cancellation.</li>
                  <li><strong className="text-[#1A2126]">Refund Policy:</strong> All fees are non-refundable except as required by applicable Australian Consumer Law or as explicitly stated in our billing terms.</li>
                  <li><strong className="text-[#1A2126]">Cancellations:</strong> You may cancel your subscription at any time via your Account Settings. Cancellation takes effect at the end of the current billing cycle.</li>
                </ul>
              </section>

              {/* 6. Termination */}
              <section className="mb-16">
                <SectionHeading id="termination" num={6}>Account Termination and Suspension</SectionHeading>
                <p className="mb-2">
                  ServAi reserves the right to suspend, limit, or terminate your access to the platform immediately,
                  without prior notice, if:
                </p>
                <ul className="space-y-3 list-disc pl-5">
                  <li>You violate any provision of these Terms or the Acceptable Use Policy.</li>
                  <li>Required by law enforcement or regulatory authorities.</li>
                  <li>Continued operation presents an unexpected technical, security, or legal risk to ServAi or other users.</li>
                </ul>
                <p className="mt-4">
                  You may terminate your account at any time by executing a deletion request within Account Settings
                  or by following the procedures outlined in our User Data Deletion Page.
                </p>
              </section>

              {/* 7. Disclaimers & Liability */}
              <section className="mb-16">
                <SectionHeading id="disclaimers-liability" num={7}>Disclaimers &amp; Limitation of Liability</SectionHeading>

                <SubHeading>A. Disclaimer of Warranties</SubHeading>
                <p>
                  Except as guaranteed by the Australian Consumer Law, ServAi and all generated AI Outputs are
                  provided on an "as is" and "as available" basis. To the maximum extent permitted by applicable law,
                  ServAi expressly disclaims all warranties of any kind, whether express, implied, statutory, or
                  otherwise, including implied warranties of merchantability, fitness for a particular purpose, and
                  non-infringement.
                </p>

                <SubHeading>B. Limitation of Liability</SubHeading>
                <p>
                  To the maximum extent permitted by law, in no event shall ServAi, its affiliates, officers,
                  directors, employees, or agents be liable for any indirect, incidental, special, consequential, or
                  punitive damages (including loss of profits, data, use, goodwill, or business interruption) arising
                  out of or in connection with your use of the Service. ServAi's total aggregate liability for all
                  claims arising under these Terms shall not exceed the total amount paid by you to ServAi in the
                  6 months preceding the claim.
                </p>
              </section>

              {/* 8. Indemnification */}
              <section className="mb-16">
                <SectionHeading id="indemnification" num={8}>Indemnification</SectionHeading>
                <p>
                  You agree to defend, indemnify, and hold harmless ServAi, its officers, directors, employees, and
                  agents from and against any third-party claims, liabilities, damages, losses, or expenses (including
                  reasonable attorney fees) arising out of or related to your Inputs, your breach of these Terms, or
                  your violation of any third-party rights.
                </p>
              </section>

              {/* 9. Governing Law */}
              <section className="mb-16">
                <SectionHeading id="governing-law" num={9}>Governing Law and Dispute Resolution</SectionHeading>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong className="text-[#1A2126]">Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of Australia, without regard to conflict of law principles.</li>
                  <li><strong className="text-[#1A2126]">Dispute Resolution:</strong> Any dispute arising under these Terms shall first be attempted to be resolved via informal good-faith negotiation. If unresolved, disputes shall be submitted to binding individual arbitration under the rules of the Australian Disputes Centre (ADC), held in Australia.</li>
                </ul>
              </section>

              {/* 10. Contact Information */}
              <section>
                <SectionHeading id="contact-information" num={10}>Contact Information</SectionHeading>
                <p className="mb-4">
                  For legal inquiries or notices regarding these Terms of Service, please contact:
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-1">
                  <p><span className="text-gray-500">Email:</span>{' '}
                    <a href="mailto:info@serv-ai.com" className="text-[#647A5A] hover:text-[#809B73] hover:underline transition-colors duration-200">info@serv-ai.com</a>
                  </p>
                  <p><span className="text-gray-500">Company Legal Name:</span> ServAi by DD Consulting Pty. Ltd.</p>
                  <p><span className="text-gray-500">Address:</span> Sydney, Australia</p>
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

export default TermsOfServicePage;
