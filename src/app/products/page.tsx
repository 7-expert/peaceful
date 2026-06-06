'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMarket } from '../../context/MarketContext';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search, SlidersHorizontal, RefreshCw, ChevronRight, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '../../lib/utils';

const MOCK_PRODUCTS = [
  { id: '1', sku: 'PD-FORCEPS-150', name: 'Cryer Extracting Forceps (150)', category: 'Extracting Forceps', description: 'Universal upper incisor and premolar forceps with anti-slip grip.', price_pkr: 4500, price_usd: 48, image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400' },
  { id: '2', sku: 'PD-PLIER-3PRONG', name: '3-Prong Orthodontic Plier', category: 'Dental Pliers', description: 'German carbon-alloyed steel with tungsten carbide inserts.', price_pkr: 5200, price_usd: 55, image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400' },
  { id: '3', sku: 'PD-KIT-SUTURE', name: 'Dental Surgery & Suture Kit (12 Pcs)', category: 'Surgery Kits', description: '12-piece complete suturing kit with leather case.', price_pkr: 14500, price_usd: 150, image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400' },
  { id: '4', sku: 'PD-SCALER-H6', name: 'Hygienist Scaler H6/H7', category: 'Periodontal', description: 'Double-ended sickle scaler with hollow lightweight handle.', price_pkr: 2200, price_usd: 24, image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400' },
];

const CATEGORIES = ['Extracting Forceps', 'Dental Pliers', 'Surgery Kits', 'Periodontal', 'Orthodontic'];

function CatalogContent() {
  const { market } = useMarket();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        if (selectedCategory) query = query.eq('category', selectedCategory);
        if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
        const { data } = await query;
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          let filtered = [...MOCK_PRODUCTS];
          if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
          if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
          setProducts(filtered);
        }
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    const k = market === 'pk' ? 'price_pkr' : 'price_usd';
    if (sortBy === 'price-asc') return a[k] - b[k];
    if (sortBy === 'price-desc') return b[k] - a[k];
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('name-asc');
    window.history.pushState({}, '', '/products');
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">

      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-border-slate p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-accent-blue" /> Filter Catalog
            </span>
            {(selectedCategory || searchTerm) && (
              <button onClick={clearFilters} className="text-xs font-bold text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 cursor-pointer">
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Search bar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Forceps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 rounded-xl border border-border-slate bg-slate-50 px-3.5 pr-9 text-xs focus:border-accent-blue focus:outline-none focus:bg-white transition-all"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left text-xs px-3.5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  !selectedCategory ? 'bg-sky-50 text-accent-blue font-bold' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                All Instruments
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs px-3.5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedCategory === cat ? 'bg-sky-50 text-accent-blue font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Grid area */}
      <div className="lg:col-span-3 space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-border-slate px-6 py-4">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-800">{sorted.length}</span> instruments
          </span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-border-slate bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:border-accent-blue focus:outline-none"
            >
              <option value="name-asc">Sort: A to Z</option>
              <option value="name-desc">Sort: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-border-slate bg-white animate-pulse h-80" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-border-slate">
            <p className="text-sm text-slate-400 mb-4">No dental instruments matched your criteria.</p>
            <button onClick={clearFilters} className="text-xs font-semibold text-accent-blue hover:underline cursor-pointer">
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((product) => (
              <div key={product.id} className="premium-card flex flex-col overflow-hidden group">
                <Link href={`/products/${product.slug || slugify(product.name)}`} className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden hover:bg-slate-100/60 transition-colors">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">No Image Available</div>
                  )}
                  <span className="absolute top-3 left-3 bg-white border border-border-slate px-2.5 py-0.5 rounded-md text-[9px] font-mono text-slate-500 uppercase notranslate">
                    {product.sku}
                  </span>
                </Link>
                <div className="p-5 flex flex-col flex-grow bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue">{product.category}</span>
                  <Link href={`/products/${product.slug || slugify(product.name)}`} className="mt-1 text-sm font-bold text-primary-ocean line-clamp-1 font-display hover:text-accent-blue transition-colors notranslate">{product.name}</Link>
                  <p className="mt-1 text-xs text-muted-slate line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-base font-extrabold text-primary-ocean">
                      {market === 'pk' ? `Rs. ${product.price_pkr.toLocaleString()}` : `$${product.price_usd}`}
                    </span>
                    <Link href={`/products/${product.slug || slugify(product.name)}`} className="text-xs font-bold text-accent-blue hover:underline">
                      Get Quote →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Instruments Catalog</span>
          </div>
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Professional Range</span>
            <h1 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">
              Surgical Instrument Registry
            </h1>
            <p className="mt-2 text-sm text-muted-slate max-w-xl">
              Filter by medical division, surgical code, or model name to generate custom pro-forma lists.
            </p>
          </div>
          <Suspense fallback={<div className="text-sm text-slate-400 py-10">Loading product line...</div>}>
            <CatalogContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
