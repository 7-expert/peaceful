'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Market = 'pk' | 'int';

interface MarketContextType {
  market: Market;
  setMarket: (market: Market) => void;
  isLoaded: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>('int');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Helper to get cookie value
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    const cookieMarket = getCookie('market') as Market;
    if (cookieMarket === 'pk' || cookieMarket === 'int') {
      setMarketState(cookieMarket);
    } else {
      // If no cookie, default to international but set it
      document.cookie = 'market=int; path=/; max-age=31536000; SameSite=Lax';
      setMarketState('int');
    }
    setIsLoaded(true);
  }, []);

  const setMarket = (newMarket: Market) => {
    document.cookie = `market=${newMarket}; path=/; max-age=31536000; SameSite=Lax`;
    setMarketState(newMarket);
    window.location.reload(); // Refresh the page to load localized server data or refresh styles
  };

  return (
    <MarketContext.Provider value={{ market, setMarket, isLoaded }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
