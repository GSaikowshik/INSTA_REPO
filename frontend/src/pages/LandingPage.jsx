import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { FileText, Globe, CheckCircle2, Code2, Terminal, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 fixed w-full z-30 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-slate-900 tracking-tight">InstaRepo</span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                How It Works
              </a>
              <SignedIn>
                <div className="flex items-center gap-3 ml-2">
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
                <div className="flex items-center gap-3 ml-2">
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

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-md">
            <div className="flex flex-col space-y-2 pt-2 border-b border-slate-100 pb-3">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                How It Works
              </a>
            </div>

            <div className="pt-1">
              <SignedIn>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors block"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <SignInButton mode="modal">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 py-2.5 rounded-md transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                      Get Started Free
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 sm:pt-32">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight">
            Engineer Your Career Infrastructure.
          </h1>
          <p className="mt-2 sm:mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Parse your resume once. Instantly generate ATS-optimized PDFs, custom cover letters, and 200+ distinct web portfolios.
          </p>

          {/* Product Video Showcase Container */}
          <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-12 mb-8 sm:mb-10 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 aspect-video relative flex items-center justify-center shadow-sm">
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
          <div className="flex justify-center mt-6 sm:mt-8 mb-16 sm:mb-20 px-4">
            <SignedIn>
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-md text-base sm:text-lg font-medium transition-colors cursor-pointer shadow-xs inline-block text-center"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md text-base sm:text-lg font-medium transition-colors cursor-pointer shadow-xs">
                  Get Started Free
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
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
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:col-span-2 lg:col-span-1">
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
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8 sm:mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Step 1: Ingest */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 sm:col-span-2 lg:col-span-1">
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
        <section className="bg-slate-50 pt-16 sm:pt-24 pb-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              The Developer Workspace
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed px-2">
              InstaRepo isn't just a static template site—it's a dynamic data hub. Manage your underlying engineering profile once, and compile targeted resume exports, tailored cover letters, and live web apps effortlessly.
            </p>

            {/* Supported Stacks/Outputs Pills Grid */}
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto">
              {supportedStacks.map((stack, idx) => (
                <span
                  key={idx}
                  className="border border-slate-200 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 bg-white font-medium shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Final Bottom CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8 sm:p-12 text-center mt-12 mb-16 sm:mb-24 shadow-lg">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight leading-snug">
              Stop updating five different career docs. Build your single source of truth today.
            </h2>
            <div className="flex justify-center">
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 px-8 rounded-md transition-colors cursor-pointer inline-block text-base text-center"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-md transition-colors cursor-pointer inline-block text-base">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-8 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          
          {/* Left/Top Section: Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
            <span className="font-bold text-slate-900">InstaRepo</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="max-w-[280px] md:max-w-none text-balance">
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
          </div>

          {/* Right/Bottom Section: Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-2 md:mt-0 font-medium">
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
