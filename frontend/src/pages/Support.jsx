import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import api, { getAuthHeaders } from '../api';
import { 
  HelpCircle, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  ExternalLink, 
  Send, 
  Check 
} from 'lucide-react';

const faqs = [
  {
    question: "How do I export my AI Portfolio?",
    answer: "Navigate to the Portfolio Generator tab in your workspace sidebar. Click on any theme preset to customize your visual style, then click the 'Export Portfolio HTML' button at the top-right toolbar to download a self-contained, publication-ready HTML file."
  },
  {
    question: "How does the ATS Resume Evaluator work?",
    answer: "Our ATS Score Evaluator uses Google Gemini AI to analyze your structured profile against industry job descriptions. It scores keywords, quantifies engineering impact, checks formatting standards, and delivers actionable recommendations to boost your match rate."
  },
  {
    question: "How do I update or edit my parsed resume data?",
    answer: "Go to the AI Resume Builder section in your sidebar. You can either upload a fresh resume PDF/image to re-parse, or directly edit your personal info, experience, skills, projects, and certifications in the interactive form fields."
  },
  {
    question: "Is my resume and portfolio data kept private?",
    answer: "Yes. Every profile and portfolio record is strictly locked to your authenticated user account ID in PostgreSQL. Cross-tenant data sharing is blocked by database constraints."
  }
];

const Support = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [subjectText, setSubjectText] = useState('InstaRepo Support & Feature Request');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [sentNotice, setSentNotice] = useState(false);

  // Extract primary email from Clerk user object
  const clerkEmail = user?.primaryEmailAddress?.emailAddress;
  const clerkName = user?.fullName || user?.firstName;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = await getAuthHeaders(getToken);
        const [meRes, profileRes] = await Promise.all([
          api.get('/auth/me', headers).catch(() => null),
          api.get('/profile', headers).catch(() => null)
        ]);

        if (meRes?.data) {
          if (meRes.data.email) setUserEmail(meRes.data.email);
          if (meRes.data.name) setUserName(meRes.data.name);
        }
        if (profileRes?.data?.parsed_data?.personal_info) {
          const personal = profileRes.data.parsed_data.personal_info;
          if (personal.email && !userEmail) setUserEmail(personal.email);
          if (personal.full_name && !userName) setUserName(personal.full_name);
        }
      } catch (err) {
        console.error('Error fetching support user data:', err);
      }
    };
    fetchUserData();
  }, [getToken]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Prioritize primary Clerk email address, then DB email
  const senderEmail = clerkEmail || userEmail || 'user@instarepo.dev';
  const senderName = clerkName || userName || 'Authenticated User';

  const fullSubject = `${subjectText} [From: ${senderEmail}]`;
  const fullBody = `Sender Email: ${senderEmail}\nSender Name: ${senderName}\n\nSupport Message:\n${messageText || 'Hello Support Team,\n\nI need assistance with my InstaRepo account.'}`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=saikowshikgandikota@gmail.com&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
  const mailtoUrl = `mailto:saikowshikgandikota@gmail.com?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;

  const handleSend = () => {
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 text-slate-900 font-sans">
      
      {/* Header Toolbar */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Help & Support</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Get assistance with InstaRepo tools, export options, and workspace management.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {sentNotice && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Opening mail client for {senderEmail}...</span>
        </div>
      )}

      {/* Contact Us Card */}
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Contact Support</h2>
          </div>
          <span className="text-[11px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
            From: {senderEmail}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* User / Sender Info Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-700">
            <div>
              <span className="font-semibold text-slate-500 block text-[11px]">From (Authenticated User Email):</span>
              <span className="font-bold text-slate-900 font-mono">{senderEmail}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block text-[11px]">To (Developer & Product Support):</span>
              <span className="font-bold text-slate-900 font-mono">saikowshikgandikota@gmail.com</span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Subject</label>
            <input
              type="text"
              value={subjectText}
              onChange={(e) => setSubjectText(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-slate-900 outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Message Area */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Your Support Message / Query</label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Describe what issue or question you have..."
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-slate-900 outline-none focus:border-indigo-600 font-medium resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500">
              Messages are sent directly from your authenticated email account (<strong>{senderEmail}</strong>).
            </p>

            <div className="flex items-center gap-2">
              <a
                href={mailtoUrl}
                onClick={handleSend}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-slate-50 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span>Default Mail App</span>
              </a>

              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSend}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Send via Gmail</span>
                <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-200 pb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-md overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {openFaqIndex === index && (
                <div className="p-4 bg-white border-t border-gray-200 text-xs text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Support;
