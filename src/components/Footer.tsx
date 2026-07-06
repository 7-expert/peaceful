'use client';

import Image from 'next/image';
import { useMarket } from '../context/MarketContext';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { market } = useMarket();

  return (
    <footer className="ft font-sans relative">
      {/* RIGHT CORNER DNA IMAGE */}
      <div className="ft-dna">
        <img
          src="https://doccure.dreamstechnologies.com/html/template/assets/img/bg/footer-lab-img.png"
          alt="DNA decoration"
        />
      </div>

      {/* MAIN GRID */}
      <div className="ft-main max-w-6xl mx-auto px-6 py-14 relative z-10">

        {/* COL 1: Brand */}
        <div className="ft-brand space-y-5">
          <div className="ft-logo notranslate">
            <Image
              src="/logo.svg"
              alt="Peaceful Dental Solutions"
              width={233}
              height={100}
              style={{ width: 'auto', height: '100px' }}
              className="object-contain drop-shadow-sm"
            />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Precision-crafted, clinical-grade dental and surgical instruments trusted by healthcare providers in over 45+ countries.
          </p>
          <div className="ft-socials flex gap-2">
            <a className="ft-social" href="#" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a className="ft-social" href="#" aria-label="X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a className="ft-social" href="#" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a className="ft-social" href="#" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>

        {/* COL 2: Contact Info */}
        <div className="ft-col">
          <h3 className="text-base font-extrabold text-blue-900 mb-4">
            {market === 'pk' ? 'Pakistan Operations' : 'Global Export Division'}
          </h3>
          <div className="ft-services space-y-3">
            {market === 'pk' ? (
              <>
                <div className="ft-service-item flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><MapPin className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">Plaza 45, DHA Phase 5, Lahore, Pakistan</span>
                </div>
                <div className="ft-service-item flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><MapPin className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">Sialkot Industrial Zone, Sialkot, Punjab</span>
                </div>
                <div className="ft-service-item flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><Phone className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">0324-4505238</span>
                </div>
                <div className="ft-service-item flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><Mail className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">local@peacefuldentalsolutions.com</span>
                </div>
              </>
            ) : (
              <>
                <div className="ft-service-item flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><MapPin className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">Export Division, Sialkot Industrial Zone, Pakistan</span>
                </div>
                <div className="ft-service-item flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><Phone className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">0324-4505238</span>
                </div>
                <div className="ft-service-item flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><Mail className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">export@peacefuldentalsolutions.com</span>
                </div>
                <div className="ft-service-item flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="ft-service-icon shrink-0"><Globe className="h-4 w-4" /></div>
                  <span className="ft-service-text text-xs text-slate-700">DHL Express / FedEx Air Consolidated Freight</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* COL 3: Newsletter */}
        <div className="ft-col">
          <div className="ft-newsletter-title text-base font-extrabold text-blue-900 mb-4">Subscribe to updates</div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="ft-email-wrap flex items-center bg-slate-100/80 border border-slate-200 rounded-xl p-1 pl-4 mb-4">
            <input type="email" placeholder="Your Email Address" className="w-full bg-transparent border-none outline-none text-xs" required />
            <button type="submit" className="ft-email-btn shrink-0" aria-label="Subscribe">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </form>
          <div className="ft-community space-y-1">
            <h4 className="text-xs font-bold text-slate-800">Join our Community</h4>
            <p className="text-xs text-slate-400">Get the latest instrument updates, product releases, and trade offers.</p>
          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="ft-divider"><hr className="border-slate-200" /></div>

      {/* SCROLL TOP */}
      <div className="ft-top-btn">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
      </div>

      {/* NAV ROW */}
      <div className="ft-nav-row max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4 relative z-10 text-xs">
        <nav className="ft-nav flex gap-2">
          <a href="/products" className="text-slate-500 hover:text-blue-600 transition-colors">Catalog</a>
          <span className="ft-nav-sep text-slate-200">|</span>
          <a href="/about" className="text-slate-500 hover:text-blue-600 transition-colors">Our Story</a>
          <span className="ft-nav-sep text-slate-200">|</span>
          <a href="/certifications" className="text-slate-500 hover:text-blue-600 transition-colors">Quality Standards</a>
          <span className="ft-nav-sep text-slate-200">|</span>
          <a href="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</a>
        </nav>
        <div className="ft-legal flex gap-3">
          <a href="#" className="text-slate-500 hover:text-blue-600">Privacy Policy</a>
          <span className="ft-legal-sep text-slate-200">|</span>
          <a href="#" className="text-slate-500 hover:text-blue-600">Terms &amp; Conditions</a>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="ft-bottom max-w-6xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4 border-t border-slate-100 text-xs text-slate-400 relative z-10">
        <p className="ft-copy">© {new Date().getFullYear()} Peaceful Dental Solutions. All Rights Reserved.</p>
        <div className="ft-cards flex gap-2">
          <span className="ft-card visa bg-slate-50 border border-slate-200 text-blue-600 px-2 py-0.5 rounded">VISA</span>
          <span className="ft-card amex bg-slate-50 border border-slate-200 text-sky-600 px-2 py-0.5 rounded">AMEX</span>
          <span className="ft-card discover bg-slate-50 border border-slate-200 text-amber-600 px-2 py-0.5 rounded">DISC</span>
          <span className="ft-card mc bg-slate-50 border border-slate-200 text-red-500 px-2 py-0.5 rounded">MC</span>
        </div>
      </div>
    </footer>
  );
}
