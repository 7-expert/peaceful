'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const spanishC    = ['ES','MX','AR','CO','PE','CL','VE','EC','GT','CU','BO','DO','HN','PY','SV','NI','CR','UY','PA','GQ'];
const portC       = ['PT','BR','AO','MZ','GW','TL','CV','ST'];
const frenchC     = ['FR','CA','CD','MG','CM','CI','NE','BF','SN','ML','RW','BE','GN','TD','HT','BI','BJ','CH','TG','CF','GA','CG','DJ','LU','VU','SC','MC'];
const arabicC     = ['SA','EG','DZ','SD','IQ','MA','YE','SY','TN','JO','AE','LY','LB','OM','KW','MR','QA','BH','PS'];

function readLangCookie(): string {
  if (typeof document === 'undefined') return 'en';
  const val = document.cookie.split('; ').find(r => r.startsWith('googtrans='));
  if (!val) return 'en';
  const parts = val.split('/');
  const lang = parts[parts.length - 1];
  return languages.some(l => l.code === lang) ? lang : 'en';
}

function setTranslateCookie(langCode: string) {
  const hostname = window.location.hostname;
  const past = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  document.cookie = `googtrans=; ${past} path=/;`;
  document.cookie = `googtrans=; ${past} path=/; domain=.${hostname}`;
  document.cookie = `googtrans=; ${past} path=/; domain=${hostname}`;
  if (langCode === 'en') return;
  const v = `/en/${langCode}`;
  document.cookie = `googtrans=${v}; path=/;`;
  document.cookie = `googtrans=${v}; path=/; domain=.${hostname}`;
  document.cookie = `googtrans=${v}; path=/; domain=${hostname}`;
}

export default function LanguageSelector() {
  const [lang, setLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = readLangCookie();
    setLang(saved);
    if (saved === 'ar') document.documentElement.dir = 'rtl';
    else                document.documentElement.dir = 'ltr';

    // React + Google Translate crash protection
    if (!(window as any).__gt_patched) {
      (window as any).__gt_patched = true;
      const origRemove = Node.prototype.removeChild;
      (Node.prototype as any).removeChild = function <T extends Node>(c: T): T {
        if (c.parentNode !== this) return c;
        return origRemove.call(this, c) as T;
      };
      const origInsert = Node.prototype.insertBefore;
      (Node.prototype as any).insertBefore = function <T extends Node>(n: T, ref: Node | null): T {
        if (ref && ref.parentNode !== this) return this.appendChild(n) as T;
        return origInsert.call(this, n, ref) as T;
      };
    }

    // Auto detect from IP
    if (saved === 'en' && !document.cookie.includes('googtrans=')) {
      (async () => {
        let country = '';
        try {
          const r = await fetch('https://ipapi.co/json/');
          country = (await r.json()).country_code?.toUpperCase() ?? '';
        } catch {
          try {
            const r = await fetch('https://ip-api.com/json/');
            country = (await r.json()).countryCode?.toUpperCase() ?? '';
          } catch {/* silent */}
        }
        if (!country) return;
        let target = 'en';
        if (spanishC.includes(country))  target = 'es';
        else if (portC.includes(country))  target = 'pt';
        else if (frenchC.includes(country)) target = 'fr';
        else if (arabicC.includes(country)) target = 'ar';
        if (target !== 'en') {
          setTranslateCookie(target);
          window.location.reload();
        }
      })();
    }

    // Hide Google Translate Elements
    if (!document.getElementById('gt-hide')) {
      const s = document.createElement('style');
      s.id = 'gt-hide';
      s.textContent = `
        .goog-te-banner-frame, iframe.goog-te-banner-frame,
        .goog-te-banner, .goog-te-menu2-frame, #goog-gt-tt,
        .goog-tooltip, #google_translate_element {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          position: absolute !important;
        }
        /* Hide google translate tooltips / overlays */
        .skiptranslate, iframe.skiptranslate, div.skiptranslate {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
          height: 0 !important;
          width: 0 !important;
        }
        .goog-text-highlight {
          background: transparent !important;
          box-shadow: none !important;
        }
        html, body {
          top: 0 !important;
          margin-top: 0 !important;
        }
      `;
      document.head.appendChild(s);
    }

    // Load GT script
    const t = setTimeout(() => {
      if (document.getElementById('gt-script')) return;
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,es,fr,ar,pt', autoDisplay: false },
          'google_translate_element'
        );
      };
      const sc = document.createElement('script');
      sc.id = 'gt-script';
      sc.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      sc.async = true;
      document.body.appendChild(sc);
    }, 900);

    // Close on click outside
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchend', handleOutside);

    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchend', handleOutside);
    };
  }, []);


  const active = languages.find(l => l.code === lang) ?? languages[0];

  // Translation screen loading state (shows a solid white overlay blocking view until translated)
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingMsg, setTranslatingMsg] = useState('Hang tight, translating...');

  // Block screen if a translate reload has just been triggered in session/local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeLoading = localStorage.getItem('translation_loading');
      if (activeLoading) {
        setIsTranslating(true);
        const code = readLangCookie();
        let msg = 'Hang tight, translating...';
        if (code === 'es') msg = 'Un momento, traduciendo...';
        else if (code === 'fr') msg = 'Un instant, traduction en cours...';
        else if (code === 'pt') msg = 'Um momento, traduzindo...';
        else if (code === 'ar') msg = 'لحظة واحدة، جاري الترجمة...';
        setTranslatingMsg(msg);

        // Turn off loader once Google Translate has completed translation check
        const t = setTimeout(() => {
          localStorage.removeItem('translation_loading');
          setIsTranslating(false);
        }, 2500);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const handleSelect = (code: string) => {
    if (code === lang) {
      setIsOpen(false);
      return;
    }
    
    // Set message based on selected language
    let msg = 'Hang tight, translating...';
    if (code === 'es') msg = 'Un momento, traduciendo...';
    else if (code === 'fr') msg = 'Un instant, traduction en cours...';
    else if (code === 'pt') msg = 'Um momento, traduzindo...';
    else if (code === 'ar') msg = 'لحظة واحدة، جاري الترجمة...';
    
    setTranslatingMsg(msg);
    setIsTranslating(true);
    setIsOpen(false);
    
    // Persist loader state across page refresh
    localStorage.setItem('translation_loading', 'true');

    setTimeout(() => {
      setLang(code);
      setTranslateCookie(code);
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
      window.location.reload();
    }, 600);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left shrink-0">
      {/* Solid White Loading Overlay — covers everything including navbar using React Portal */}
      {isTranslating && typeof document !== 'undefined' && createPortal(
        <div
          className="notranslate select-none"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', maxWidth: '360px', padding: '0 24px', textAlign: 'center' }}>
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo4.png" alt="Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
            {/* Spinner */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                border: '4px solid #e0f2fe',
                borderTopColor: '#0ea5e9',
                animation: 'spin 0.9s linear infinite',
              }} />
              <span style={{ position: 'absolute', fontSize: '22px' }}>🦷</span>
            </div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: '0 0 8px', lineHeight: 1.3 }}>{translatingMsg}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Translating your page, please wait…</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div id="google_translate_element" aria-hidden="true" style={{ display: 'none' }} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ touchAction: 'manipulation' }}
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-white active:bg-slate-100 transition-all select-none"
      >
        <span>{active.flag}</span>
        <span className="uppercase text-[10px] tracking-wide">{active.code}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-lg bg-white border border-slate-200 shadow-xl z-[400] overflow-hidden">
          <div className="py-1">
            {languages.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                  lang === l.code ? 'bg-sky-50/50 font-semibold text-sky-600' : ''
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
