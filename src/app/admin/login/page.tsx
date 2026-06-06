'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/admin/dashboard');
    }
    check();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else if (data.session) router.push('/admin/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-6 font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
        </Link>

        <div className="bg-white rounded-3xl border border-border-slate shadow-lg p-8">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center p-1">
              <Image src="/logo.png" alt="Peaceful Dental Solutions Logo" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <div className="text-sm font-bold text-primary-ocean font-display leading-tight">
                Peaceful Dental
              </div>
              <div className="text-[9px] font-semibold tracking-widest text-accent-blue uppercase">
                Solutions
              </div>
            </div>
          </div>

          <h1 className="text-lg font-bold text-primary-ocean font-display mb-1">Staff Portal</h1>
          <p className="text-xs text-slate-400 mb-6">Manage instrument inventory, listings, and quote logs.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@peacefuldentalsolutions.com"
                  className="w-full h-11 rounded-xl border border-border-slate bg-slate-50 pl-10 pr-3 text-xs placeholder-slate-300 focus:border-accent-blue focus:bg-white focus:outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-border-slate bg-slate-50 pl-10 pr-3 text-xs placeholder-slate-300 focus:border-accent-blue focus:bg-white focus:outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-300" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary-ocean text-white text-xs font-semibold hover:bg-primary-ocean-hover transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials…</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-5 font-medium">
          System access restricted to authorized personnel.
        </p>
      </div>
    </div>
  );
}
