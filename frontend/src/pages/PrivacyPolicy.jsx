import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen font-sans">
      
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 bg-white sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-zinc-900 text-white rounded flex items-center justify-center font-semibold text-xs">
            IR
          </div>
          <span className="font-semibold text-sm text-zinc-900 tracking-tight">InstaRepo</span>
        </Link>

        <Link
          to="/"
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto py-12 px-6 space-y-8">
        <div className="border-b border-zinc-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-medium">
            <Shield className="w-3.5 h-3.5 text-zinc-700" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: August 2026 &bull; Effective Immediately
          </p>
        </div>

        <article className="space-y-6 text-xs text-zinc-600 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">1. Overview & Commitment</h2>
            <p>
              At <strong>InstaRepo</strong>, we prioritize the confidentiality and integrity of your career data. 
              This Privacy Policy details how we collect, process, and protect your personal information when you use our AI resume builder, portfolio generator, ATS evaluator, and cover letter suite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">2. Information We Collect</h2>
            <p>We collect only essential data required to construct and render your career infrastructure:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li><strong>Account Credentials:</strong> Email address and hashed authentication details.</li>
              <li><strong>Parsed Resume Content:</strong> Personal contact info, work experiences, education history, technical skills, projects, and certifications extracted from uploaded PDFs or images.</li>
              <li><strong>Generated Portfolio Configurations:</strong> Selected visual themes, layout presets, and custom portfolio settings.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">3. How We Use Your Information</h2>
            <p>Your data is processed strictly for the following functional purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li>Generating tailored vector ATS resume exports and single-file HTML portfolio repositories.</li>
              <li>Running automated AI keyword matching and score evaluations against user-submitted job descriptions.</li>
              <li>Tailoring AI-assisted cover letters and engineering summaries.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">4. Data Security & Isolation</h2>
            <p>
              Every user profile and parsed resume record is strictly bound to your authenticated account ID in PostgreSQL. 
              We enforce multi-tenant database row-level security constraints, ensuring your data is never exposed or shared with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">5. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request data deletion, please contact our engineering support team directly at:
            </p>
            <div className="bg-white border border-zinc-200 rounded-md p-4 text-xs font-mono text-zinc-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-500" />
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saikowshikgandikota@gmail.com&su=InstaRepo%20Privacy%20Inquiry"
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline font-semibold"
              >
                saikowshikgandikota@gmail.com
              </a>
            </div>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-4 sm:px-8 py-5 text-xs text-zinc-500 font-normal">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            &copy; 2026 Developed by{" "}
            <a 
              href="https://www.linkedin.com/in/gandikotasaikowshik/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors"
            >
              Gandikota Sai Kowshik
            </a>
            . All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-zinc-500 font-medium">
            <Link to="/terms" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
            <Link to="/dashboard/support" className="hover:text-zinc-900 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PrivacyPolicy;
