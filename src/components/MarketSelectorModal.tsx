'use client';

import { useEffect, useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Globe, Check } from 'lucide-react';

interface MarketSelectorModalProps {
  forceShow?: boolean;
  onClose?: () => void;
}

export default function MarketSelectorModal({ forceShow = false, onClose }: MarketSelectorModalProps) {
  const { market, setMarket, isLoaded } = useMarket();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const hasMarketCookie = document.cookie.split(';').some((item) => item.trim().startsWith('market='));
    if (forceShow || !hasMarketCookie) {
      setIsOpen(true);
    }
  }, [isLoaded, forceShow]);

  if (!isOpen) return null;

  const handleSelect = (selectedMarket: 'pk' | 'int') => {
    setMarket(selectedMarket);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-border-slate overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border-slate">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-accent-blue" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Select Region</span>
              </div>
              <h2 className="text-xl font-bold text-primary-ocean font-display">
                Choose Your Market
              </h2>
              <p className="text-sm text-muted-slate mt-1">
                Select your location to display local pricing and shipping policies.
              </p>
            </div>
            {!forceShow && (
              <button onClick={handleClose} className="text-slate-300 hover:text-slate-600 transition-colors p-1 cursor-pointer">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {/* Pakistan */}
          <button
            onClick={() => handleSelect('pk')}
            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              market === 'pk'
                ? 'border-accent-blue bg-sky-50/50'
                : 'border-border-slate hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🇵🇰</span>
              <div>
                <div className="text-sm font-semibold text-primary-ocean font-display">Pakistan Domestic</div>
                <div className="text-xs text-muted-slate mt-0.5">Prices in PKR · COD & Direct Bank Transfer · Local Support</div>
              </div>
            </div>
            {market === 'pk' && (
              <div className="h-5 w-5 rounded-full bg-accent-blue flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>

          {/* International */}
          <button
            onClick={() => handleSelect('int')}
            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              market === 'int'
                ? 'border-accent-blue bg-sky-50/50'
                : 'border-border-slate hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="text-sm font-semibold text-primary-ocean font-display">International Trade</div>
                <div className="text-xs text-muted-slate mt-0.5">Prices in USD · DHL Express Delivery · CE, FDA, ISO certifications</div>
              </div>
            </div>
            {market === 'int' && (
              <div className="h-5 w-5 rounded-full bg-accent-blue flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        </div>

        <div className="px-6 pb-6 text-center text-xs text-slate-400">
          You can toggle regional settings anytime via the globe icon in the navigation bar.
        </div>
      </div>
    </div>
  );
}
