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
    document.cookie = 'market=int; path=/; max-age=31536000; SameSite=Lax';
    setMarketState('int');
    setIsLoaded(true);
  }, []);

  const setMarket = (newMarket: Market) => {
    // Only 'int' is allowed now
    document.cookie = `market=int; path=/; max-age=31536000; SameSite=Lax`;
    setMarketState('int');
    window.location.reload(); 
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
