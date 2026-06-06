'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMarket } from '../context/MarketContext';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { market } = useMarket();

  return (
    <footer className="w-full bg-white border-t border-border-slate">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                <Image src="/logo.png" alt="Peaceful Dental Solutions" width={28} height={28} className="object-contain" />
              </div>
              <div className="notranslate">
                <div className="text-sm font-bold text-primary-ocean font-display leading-tight">
                  Peaceful Dental
                </div>
                <div className="text-[9px] font-semibold tracking-widest text-accent-blue uppercase">
                  Solutions
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-slate leading-relaxed">
              Precision-crafted, clinical-grade dental instruments and surgical apparatus serving practices globally.
            </p>
            <div className="flex flex-wrap gap-2">
              {['FDA', 'CE', 'ISO 13485'].map((cert) => (
                <span key={cert} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-50 border border-border-slate text-muted-slate uppercase tracking-wide">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Dental Catalog', href: '/products' },
                { name: 'Our Story', href: '/about' },
                { name: 'Quality Standards', href: '/certifications' },
                { name: 'Bulk Inquiries', href: '/contact' },
                { name: 'Staff Login', href: '/admin/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-slate hover:text-primary-ocean transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — switches by market */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {market === 'pk' ? 'Pakistan Operations' : 'Global Export Division'}
            </h4>

            {market === 'pk' ? (
              <div className="space-y-3 text-sm text-muted-slate">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                  <span>Plaza 45, DHA Phase 5, Lahore, Pakistan</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                  <span>Sialkot Industrial Zone, Sialkot, Punjab</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-accent-blue shrink-0" />
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-accent-blue shrink-0" />
                  <span>local@peacefuldentalsolutions.com</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-slate">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                  <span>Export Division, Sialkot Industrial Zone, Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-accent-blue shrink-0" />
                  <span>+92 52 4567890</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-accent-blue shrink-0" />
                  <span>export@peacefuldentalsolutions.com</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  DHL Express, FedEx air cargo · Bank LC / TT · Full custom instrumentation & OEM branding
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-slate flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p className="notranslate">© {new Date().getFullYear()} Peaceful Dental Solutions. All rights reserved. · Sialkot, Pakistan</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-slate-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
