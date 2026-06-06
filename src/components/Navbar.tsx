'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMarket } from '../context/MarketContext';
import { Search, Globe, Menu, X } from 'lucide-react';
import MarketSelectorModal from './MarketSelectorModal';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { market } = useMarket();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
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
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0 min-w-0">
              <div className="h-8 w-8 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="Peaceful Dental Solutions Logo"
                  width={26}
                  height={26}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="notranslate">
                <div className="text-[11px] font-bold tracking-wide text-blue-900 leading-tight whitespace-nowrap">
                  Peaceful Dental
                </div>
                <div className="text-[8px] font-semibold tracking-widest text-sky-600 uppercase">
                  Solutions
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href
                      ? 'text-blue-900 font-semibold'
                      : 'text-slate-500 hover:text-blue-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">

              {/* Desktop search */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center mr-1">
                <input
                  type="text"
                  placeholder="Search instruments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-44 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:bg-white transition-all"
                />
                <button type="submit" className="absolute right-2 text-slate-400 hover:text-sky-600 transition-colors">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Currency / Market */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                style={{ touchAction: 'manipulation' }}
                className="flex items-center justify-center gap-1 h-8 w-8 sm:w-auto sm:px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-white active:bg-slate-100 transition-all"
                aria-label="Select currency / market"
              >
                <Globe className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="hidden sm:inline">{market === 'pk' ? 'PKR' : 'USD'}</span>
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                style={{ touchAction: 'manipulation' }}
                className="flex md:hidden items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 active:bg-slate-100 transition-all"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU (fixed overlay, outside header) ── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[90] bg-black/20"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-[95] bg-white border-b border-slate-200 shadow-xl">
          {/* Mobile search */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm focus:border-sky-400 focus:outline-none transition-all"
              />
              <button type="submit" className="absolute right-3 text-slate-400">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Nav links */}
          <nav className="px-3 pb-4 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ touchAction: 'manipulation' }}
                className={`flex items-center py-3 px-3 text-sm font-medium rounded-xl transition-colors ${
                  pathname === link.href
                    ? 'text-blue-900 font-semibold bg-sky-50'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Market modal */}
      {isModalOpen && (
        <MarketSelectorModal forceShow={true} onClose={() => setIsModalOpen(false)} />
      )}
      <MarketSelectorModal forceShow={false} />
    </>
  );
}
