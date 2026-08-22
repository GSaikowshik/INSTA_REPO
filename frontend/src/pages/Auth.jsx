import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogIn, UserPlus, Mail, Lock, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // FastAPI OAuth2PasswordRequestForm expects form URL encoded parameters: username & password
        const params = new URLSearchParams();
        params.append('username', email.trim());
        params.append('password', password);

        const response = await api.post('/auth/login', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (response.data && response.data.access_token) {
          localStorage.setItem('token', response.data.access_token);
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 600);
        }
      } else {
        // Register user
        await api.post('/auth/register', {
          email: email.trim(),
          password: password,
        });

        setSuccess('Account created successfully! Logging you in...');

        // Auto login after registration
        const params = new URLSearchParams();
        params.append('username', email.trim());
        params.append('password', password);

        const loginResp = await api.post('/auth/login', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (loginResp.data && loginResp.data.access_token) {
          localStorage.setItem('token', loginResp.data.access_token);
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Try a different email.');
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center border border-slate-900">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          InstaRepo
        </h1>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-md p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {isLogin ? 'Access your AI resume profile dashboard' : 'Build interactive portfolio repos in seconds'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-md mb-5 border border-gray-200">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-1.5 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isLogin
                ? 'bg-white text-slate-900 font-semibold border border-gray-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-1.5 rounded-md font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isLogin
                ? 'bg-white text-slate-900 font-semibold border border-gray-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Notification Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded flex items-start gap-2.5 text-emerald-700 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-9 pr-3 text-slate-900 text-xs placeholder-slate-400 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-9 pr-3 text-slate-900 text-xs placeholder-slate-400 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 font-medium text-white text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isLogin ? 'Sign In to Dashboard' : 'Register Now'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
