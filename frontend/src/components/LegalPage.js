import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function LegalPage({ title }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#222A30] text-[#F8F5EE]" data-testid="legal-page">
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#809B73] transition-colors duration-200 mb-10"
          data-testid="legal-page-back-link"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-semibold text-white mb-6" data-testid="legal-page-title">{title}</h1>
        <p className="text-gray-400 leading-relaxed">
          This page is coming soon. Our {title} content is currently being finalized and will be published here shortly.
        </p>
      </div>
    </div>
  );
}

export default LegalPage;
