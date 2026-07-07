'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMarket } from '../context/MarketContext';
import { Search, Globe, Menu, X, ChevronDown } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { market } = useMarket();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '#' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsMobileMenuOpen(false);
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <>
      {/* ── FIXED HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full py-3 px-3 sm:px-6 lg:px-10 bg-transparent pointer-events-none notranslate">
        <div className="mx-auto max-w-7xl bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-full px-4 sm:px-8 py-2 flex items-center justify-between pointer-events-auto gap-3">

          {/* ── MOBILE: Hamburger on LEFT ── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            style={{ touchAction: 'manipulation' }}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-white active:bg-slate-100 transition-all cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* ── LOGO: centered on mobile, left on desktop ── */}
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start flex-1 md:flex-none"
            aria-label="Peaceful Dental Solutions — Home"
          >
            <Image
              src="/logo.svg"
              alt="Peaceful Dental Solutions"
              width={100}
              height={100}
              className="h-[54px] md:h-[80px] w-auto object-contain drop-shadow-sm transition-all"
              priority
            />
          </Link>

          {/* ── DESKTOP NAV (md+) ── */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => {
              if (link.name === 'Categories') {
                return (
                  <div key={link.name} className="relative group cursor-pointer">
                    <div
                      className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1 ${pathname.startsWith('/products?category')
                          ? 'text-blue-600'
                          : 'text-slate-600 hover:text-blue-600'
                        }`}
                    >
                      {link.name}
                      <ChevronDown className="h-3 w-3 ml-0.5" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-56 bg-white border border-slate-200 shadow-xl rounded-xl py-2 flex flex-col pointer-events-auto">
                        <Link href="/products?category=Composite%20Filling%20Tools" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">Composite Filling Tools</Link>
                        <Link href="/products?category=Excavators" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">Excavators</Link>
                        <Link href="/products?category=Gingival%20Cord%20packers" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">Gingival Cord packers</Link>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${pathname === link.href
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-blue-600'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Desktop search */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-28 rounded-full border border-slate-200 bg-slate-50/70 px-3 pr-7 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:bg-white focus:w-36 transition-all duration-300"
              />
              <button type="submit" className="absolute right-2.5 text-slate-400 hover:text-blue-600 transition-colors">
                <Search className="h-3 w-3" />
              </button>
            </form>

            {/* WhatsApp Button */}
            <Link
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center h-8 px-4 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-green-600 transition-colors shadow-sm"
            >
              Our Community
            </Link>

            {/* Language Selector */}
            <LanguageSelector />

          </div>
        </div>
      </header>

      {/* ── MOBILE MENU BACKDROP ── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[108] bg-black/25 notranslate pointer-events-auto"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE MENU DRAWER ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed z-[109] bg-white border border-slate-200 shadow-2xl rounded-2xl notranslate pointer-events-auto"
          style={{ top: '82px', left: '12px', right: '12px' }}
        >
          {/* Mobile search */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm focus:border-blue-400 focus:outline-none transition-all"
              />
              <button type="submit" className="absolute right-3 text-slate-400 hover:text-blue-600">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Nav links */}
          <nav className="px-3 py-2">
            {navLinks.map((link) => {
              if (link.name === 'Categories') {
                return (
                  <div key={link.name} className="flex flex-col">
                    <div
                      className={`flex items-center justify-between py-3 px-4 text-sm font-semibold rounded-xl transition-colors ${pathname.startsWith('/products?category')
                          ? 'text-blue-600 bg-sky-50'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100'
                        }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="pl-6 pr-4 py-1 flex flex-col gap-1">
                      <Link href="/products?category=Composite%20Filling%20Tools" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg">Composite Filling Tools</Link>
                      <Link href="/products?category=Excavators" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg">Excavators</Link>
                      <Link href="/products?category=Gingival%20Cord%20packers" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg">Gingival Cord packers</Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ touchAction: 'manipulation' }}
                  className={`flex items-center py-3 px-4 text-sm font-semibold rounded-xl transition-colors ${pathname === link.href
                      ? 'text-blue-600 bg-sky-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile bottom actions */}
          <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-bold tracking-wide hover:bg-green-600 transition-colors shadow-sm"
            >
              WhatsApp
            </Link>
            <div className="flex justify-center">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}

    </>
  );
}
