import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Globe, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleScrollToFeatures = () => {
    const section = document.getElementById('features');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              {isAuthenticated ? (
                <Link 
                  to="/dashboard"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <button
                    type="button"
                    onClick={handleGetStarted}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-16">
        
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
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://cdn.pixabay.com/video/2020/05/25/40131-424917410_tiny.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Repositioned Primary CTA */}
          <div className="flex justify-center mt-8 mb-20">
            <button 
              type="button"
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md text-lg font-medium transition-colors cursor-pointer shadow-xs"
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
