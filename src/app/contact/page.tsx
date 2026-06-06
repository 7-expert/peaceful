'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight, Phone, Mail, MapPin, ShieldCheck, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', organization: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formData.name.trim(),
          organization: formData.organization.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          product_sku: null,
          quantity: 1,
          status: 'pending'
        }
      ]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', organization: '', message: '' });
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
      setStatus('idle');
    }
  };

  const fieldClass = "w-full h-11 rounded-xl border border-border-slate bg-slate-50 px-4 text-xs text-slate-800 focus:border-accent-blue focus:outline-none focus:bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-2";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Contact Us</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left Side: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-border-slate p-8 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Global Operations</span>
                <h1 className="text-2xl font-extrabold text-primary-ocean font-display">
                  Get in Touch
                </h1>
                <p className="text-xs text-muted-slate leading-relaxed">
                  Have a customized bulk request or OEM specification? Reach our sales coordinators directly.
                </p>
              </div>

              {/* Contact methods */}
              <div className="bg-white rounded-3xl border border-border-slate p-6 shadow-sm divide-y divide-slate-100">
                <div className="py-4 flex gap-4 items-start first:pt-0">
                  <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-700">Call / WhatsApp</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">+92 300 1234567 (Pakistan)</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold">+92 52 4567890 (International)</p>
                  </div>
                </div>

                <div className="py-4 flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-700">Email Address</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">export@peacefuldentalsolutions.com</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold">local@peacefuldentalsolutions.com</p>
                  </div>
                </div>

                <div className="py-4 flex gap-4 items-start last:pb-0">
                  <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-700">Offices & Foundry</h3>
                    <p className="text-xs text-slate-500 mt-1">Export Division: Sialkot Industrial Zone, Sialkot, Pakistan</p>
                    <p className="text-xs text-slate-500 mt-0.5">Corporate: Plaza 45, DHA Phase 5, Lahore, Pakistan</p>
                  </div>
                </div>
                {/* WhatsApp Talk Button */}
                <a
                  href={`https://wa.me/923154505283?text=${encodeURIComponent('Hi Peaceful Dental Solutions, I would like to get a quote')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-3 w-full h-13 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-lg hover:shadow-green-200 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Talk on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Side: Quote/Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm">
              <h2 className="text-xl font-extrabold text-primary-ocean font-display mb-1.5">
                Submit Quote Request
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Receive factory-direct pricing worksheets for your dental clinic or distribution network.
              </p>

              {status === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-sky-50 text-accent-blue flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-ocean font-display">Quote Inquiry Received</h3>
                  <p className="text-xs text-muted-slate max-w-sm mx-auto">
                    We've registered your parameters. A sales coordinator will send a pro-forma quote sheet to your email address shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input type="text" required placeholder="Dr. Ahmed Khan" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Clinic / Company Name *</label>
                      <input type="text" required placeholder="City Dental Care" value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} className={fieldClass} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input type="email" required placeholder="doctor@clinic.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass}>WhatsApp / Cell *</label>
                      <input type="tel" required placeholder="+92 300 1234567" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={fieldClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Message & Order details *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please type your required instrument model numbers, dimensions, and approximate quantities..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-border-slate bg-slate-50 px-4 py-3 text-xs text-slate-800 focus:border-accent-blue focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full h-11 rounded-xl bg-primary-ocean text-white text-xs font-semibold hover:bg-primary-ocean-hover transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : 'Send Quote Request'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
