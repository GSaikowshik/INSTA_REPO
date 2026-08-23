import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import DashboardOverview from './pages/DashboardOverview';
import Dashboard from './pages/Dashboard';
import CoverLetterWriter from './pages/CoverLetterWriter';
import AtsScoreEvaluator from './pages/AtsScoreEvaluator';
import PortfolioGenerator from './pages/PortfolioGenerator';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import InstaRepoDashboardLayout from './components/InstaRepoDashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Public Authentication Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        
        {/* Protected Dashboard Workspace Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InstaRepoDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<Dashboard />} />
          <Route path="portfolio" element={<PortfolioGenerator />} />
          <Route path="cover-letter" element={<CoverLetterWriter />} />
          <Route path="ats" element={<AtsScoreEvaluator />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Workspace Quick Redirects */}
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/support" element={<Navigate to="/dashboard/support" replace />} />
        <Route path="/portfolio-generator" element={<Navigate to="/dashboard/portfolio" replace />} />
        <Route path="/resume-builder" element={<Navigate to="/dashboard/resume" replace />} />

        {/* Catch-all fallback to Public Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
