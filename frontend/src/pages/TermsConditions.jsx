import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail } from 'lucide-react';

const TermsConditions = () => {
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
            <FileText className="w-3.5 h-3.5 text-zinc-700" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: August 2026 &bull; Effective Immediately
          </p>
        </div>

        <article className="space-y-6 text-xs text-zinc-600 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the <strong>InstaRepo</strong> platform, website, or API services, you agree to be bound by these Terms of Service. 
              If you do not agree to all terms, you may not access or use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">2. User Responsibilities & Ownership</h2>
            <p>
              You retain 100% full ownership rights to all original resume content, project data, and media assets uploaded to InstaRepo. 
              You represent and warrant that you possess all necessary rights and permissions to submit such data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">3. Service Availability</h2>
            <p>
              InstaRepo services are provided on an "as-is" and "as-available" basis. 
              While we strive for 99.9% uptime and reliability, we do not guarantee uninterrupted access or error-free execution during system maintenance or upstream API provider updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">4. Limitation of Liability</h2>
            <p>
              In no event shall InstaRepo, its developers, or affiliates be liable for any indirect, incidental, or consequential damages resulting from your reliance on generated resumes, portfolio repos, or automated ATS score outputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-900">5. Contact Information</h2>
            <p>
              If you have any questions regarding these Terms of Service, please reach out to our team at:
            </p>
            <div className="bg-white border border-zinc-200 rounded-md p-4 text-xs font-mono text-zinc-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-500" />
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saikowshikgandikota@gmail.com&su=InstaRepo%20Terms%20Inquiry"
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
          <span>&copy; {new Date().getFullYear()} InstaRepo Inc. All rights reserved.</span>
          <div className="flex items-center gap-5 text-zinc-500 font-medium">
            <Link to="/privacy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <Link to="/dashboard/support" className="hover:text-zinc-900 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default TermsConditions;
