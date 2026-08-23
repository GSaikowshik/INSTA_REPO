import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { FileText, Globe, CheckCircle2, Code2, Terminal } from 'lucide-react';

const supportedStacks = [
  "React 18",
  "Next.js",
  "Tailwind CSS",
  "HTML5 / CSS3",
  "TypeScript",
  "FastAPI",
  "Vercel Deployment",
  "Vector ATS PDFs",
  "JSON Resume Schema"
];

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-slate-900">InstaRepo</span>
            </div>
            <div>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <Link 
                    to="/dashboard"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                  >
                    Go to Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <div className="flex items-center gap-3">
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Engineer Your Career Infrastructure.
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Parse your resume once. Instantly generate ATS-optimized PDFs, custom cover letters, and 200+ distinct web portfolios.
          </p>

          {/* Product Video Showcase Container */}
          <div className="max-w-4xl mx-auto mt-12 mb-10 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 aspect-video relative flex items-center justify-center shadow-sm">
            <video 
              src="/demo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Primary CTA */}
          <div className="flex justify-center mt-8 mb-20">
            <SignedIn>
              <Link 
                to="/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-md text-lg font-medium transition-colors cursor-pointer shadow-xs inline-block"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md text-lg font-medium transition-colors cursor-pointer shadow-xs">
                  Get Started Free
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Resume Builder</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Upload any PDF or image resume to automatically build a structured profile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Combinatorial Portfolios</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Generate and export fully responsive developer portfolios with over 200 theme variations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">ATS Match Scoring</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Quantify your resume against real job descriptions and generate tailored cover letters.
              </p>
            </div>

          </div>
        </div>

        {/* Section 1: How It Works */}
        <section className="bg-white border-y border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1: Ingest */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 1</span>
                  <h3 className="text-xl font-bold text-slate-900">Ingest</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop in your outdated PDF or Word resume. Our AI extracts and structures your entire career history into a centralized JSON profile.
                </p>
              </div>

              {/* Step 2: Compose */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 2</span>
                  <h3 className="text-xl font-bold text-slate-900">Compose</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Select from over 200 combinatorial portfolio themes or ATS-optimized resume templates. Tweak configurations instantly.
                </p>
              </div>

              {/* Step 3: Deploy */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center font-bold">
                  <Terminal className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Step 3</span>
                  <h3 className="text-xl font-bold text-slate-900">Deploy</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Export standard PDFs to bypass ATS scanners, or download fully responsive, self-contained HTML portfolios ready for Vercel.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: The Developer Workspace */}
        <section className="bg-slate-50 pt-24 pb-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Developer Workspace
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-base leading-relaxed">
              InstaRepo isn't just a static template site—it's a dynamic data hub. Manage your underlying engineering profile once, and compile targeted resume exports, tailored cover letters, and live web apps effortlessly.
            </p>

            {/* Supported Stacks/Outputs Pills Grid */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {supportedStacks.map((stack, idx) => (
                <span
                  key={idx}
                  className="border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600 bg-white font-medium shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Final Bottom CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-12 text-center mt-12 mb-24 shadow-lg">
            <h2 className="text-white text-3xl font-bold mb-6 tracking-tight">
              Stop updating five different career docs. Build your single source of truth today.
            </h2>
            <div className="flex justify-center">
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 px-8 rounded-md transition-colors cursor-pointer inline-block text-base"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-md transition-colors cursor-pointer inline-block text-base">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-bold text-slate-900">InstaRepo</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>&copy; {new Date().getFullYear()} InstaRepo Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <Link className="hover:text-slate-900 transition-colors" to="/privacy">Privacy Policy</Link>
            <Link className="hover:text-slate-900 transition-colors" to="/terms">Terms of Service</Link>
            <Link className="hover:text-slate-900 transition-colors" to="/dashboard/support">Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
