import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

interface LoginPageProps {
  onOpenPortal?: () => void;
  onBackToWebsite?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onOpenPortal,
  onBackToWebsite,
  onLoginSuccess,
}) => {
  const { login, demoAccounts, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess?.();
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemoSelect = async (account: any) => {
    setEmail(account.email);
    setPassword(account.default_password);
    setError('');
    setLoading(true);
    const res = await login(account.email, account.default_password);
    setLoading(false);
    if (res.success) {
      onLoginSuccess?.();
    } else {
      setError(res.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100/50 via-ivory-100 to-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {onBackToWebsite && (
        <button
          onClick={onBackToWebsite}
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-primary-900 text-xs font-bold border border-ivory-300 shadow-xs transition"
        >
          <span>← Back to School Website</span>
        </button>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/logo.png"
          alt="Bubbles Early Years School"
          className="h-16 w-auto mx-auto mb-2 object-contain"
        />
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#4B4039] tracking-tight font-['Baloo_2']">
          Bubbles Early Years School
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-primary-800 font-bold">
          Educator &amp; Staff Management Platform (Ages 1–6)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 border border-ivory-300 shadow-warm rounded-3xl relative overflow-hidden">
          {/* Top Turquoise Brand Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-800 via-primary-600 to-primary-400" />
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-terracotta-500" />
              <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                Phase 1 Demo Accounts (1-Click Login)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role_id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(acc)}
                  className="p-2.5 rounded-xl border border-ivory-300 bg-white hover:border-primary-500 hover:bg-primary-50/60 text-left transition-all text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink-900 capitalize text-[11px] group-hover:text-primary-900">
                      {acc.role_name}
                    </span>
                    <ArrowRight size={12} className="text-ink-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[10px] text-ink-500 truncate mt-0.5">{acc.first_name} {acc.last_name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-dustyrose-50 border border-dustyrose-200 text-dustyrose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@bubbles.edu.et"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-ink-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-ivory-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Remember me</span>
              </label>

              <a href="#" className="font-semibold text-primary-800 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Sign In to Staff Platform
            </Button>
          </form>

          {/* Parent Portal Fast Link */}
          {onOpenPortal && (
            <div className="mt-6 pt-5 border-t border-ivory-200">
              <button
                type="button"
                onClick={onOpenPortal}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm">
                    📱
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-950">Are you a Parent?</h4>
                    <p className="text-[10px] text-amber-700">Open the Mobile Parent Portal with Code &amp; 4-digit PIN</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform">
                  Enter Portal →
                </span>
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-ink-400">
            <ShieldCheck size={14} className="text-primary-600" />
            <span>Role-Based Access Control &amp; Tenant Isolated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
