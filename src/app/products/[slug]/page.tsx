'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useMarket } from '../../../context/MarketContext';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { ChevronRight, ShieldCheck, Award, Loader2, Info } from 'lucide-react';
import { slugify } from '../../../lib/utils';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MOCK_PRODUCTS: any[] = [
  { id: '1', slug: 'cryer-extracting-forceps-150', sku: 'PD-FORCEPS-150', name: 'Cryer Extracting Forceps (150)', category: 'Extracting Forceps', description: 'Universal upper incisor and premolar extraction forceps with anti-slip textured handle.', price_pkr: 4500, price_usd: 48, image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=600', specifications: { Material: 'AISI 410 German Stainless Steel', Finish: 'Satin Dull (Anti-Glare)', Autoclavable: 'Yes — 134°C / 273°F', Warranty: '5 Years Full Replacement', Sterilization: 'Ultrasonic + Chemical Passivation' }, stock_status: 'in_stock' },
  { id: '2', slug: '3-prong-orthodontic-plier', sku: 'PD-PLIER-3PRONG', name: '3-Prong Orthodontic Plier', category: 'Dental Pliers', description: 'German carbon-alloyed steel with tungsten carbide inserts for wire bending and clasp adjustment.', price_pkr: 5200, price_usd: 55, image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=600', specifications: { Material: 'Carbon-Alloyed Stainless Steel', Inserts: 'Tungsten Carbide Tips', Autoclavable: 'Yes — 134°C / 273°F', Warranty: '5 Years Full Replacement', Passivation: 'Chemical passivation verified' }, stock_status: 'in_stock' },
  { id: '3', slug: 'dental-surgery-suture-kit-12-pcs', sku: 'PD-KIT-SUTURE', name: 'Dental Surgery & Suture Kit (12 Pcs)', category: 'Surgery Kits', description: 'Complete suturing kit with needle holders, scissors, scalpel handle, and tissue forceps in a leather case.', price_pkr: 14500, price_usd: 150, image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600', specifications: { Contents: '12 Instruments + Leather Zipper Case', Material: 'Premium Surgical Stainless Steel', Application: 'Periodontal & Suturing Training', Autoclavable: 'Yes (Instruments only)', Warranty: '5 Years Full Replacement' }, stock_status: 'in_stock' },
  { id: '4', slug: 'hygienist-scaler-h6h7', sku: 'PD-SCALER-H6', name: 'Hygienist Scaler H6/H7', category: 'Periodontal', description: 'Double-ended sickle scaler for interproximal cleaning and plaque removal with hollow anti-slip handle.', price_pkr: 2200, price_usd: 24, image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600', specifications: { Material: 'High Carbon Stainless Steel Alloy', TipType: 'H6/H7 Sickle Double-Ended', HandleType: 'Hollow Lightweight Grip', Autoclavable: 'Yes', Warranty: '5 Years Full Replacement' }, stock_status: 'in_stock' },
];

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { market } = useMarket();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', quantity: '10', message: '' });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let found: any = null;

        if (UUID_RE.test(slug)) {
          // Legacy UUID — query by id for backward compatibility
          const { data } = await supabase.from('products').select('*').eq('id', slug).single();
          if (data) found = data;
        }

        if (!found) {
          // Query by slug column
          const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
          if (data) found = data;
        }

        if (!found) {
          // Fallback: fetch all and match by computed slug (handles products without slug column yet)
          const { data: all } = await supabase.from('products').select('*');
          found = all?.find(p => slugify(p.name) === slug) ?? null;
        }

        // Mock product fallback
        if (!found) {
          found = MOCK_PRODUCTS.find(p => p.slug === slug || slugify(p.name) === slug || p.id === slug) ?? null;
        }

        setProduct(found ?? null);
        if (found) {
          setFormData(f => ({ ...f, message: `Hello, I'd like a quotation for ${found.name} (SKU: ${found.sku}).` }));
        }
      } catch {
        const mock = MOCK_PRODUCTS.find(p => p.slug === slug || slugify(p.name) === slug || p.id === slug) ?? null;
        setProduct(mock);
        if (mock) setFormData(f => ({ ...f, message: `Hello, I'd like a quotation for ${mock.name} (SKU: ${mock.sku}).` }));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formData.name.trim(),
          organization: '',
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          product_sku: product?.sku || null,
          quantity: parseInt(formData.quantity) || 1,
          status: 'pending'
        }
      ]);
      if (error) throw error;
      setFormStatus('success');
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
      setFormStatus('idle');
    }
  };

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-[120px] flex items-center justify-center text-sm text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-accent-blue" /> Loading instrument specs…
      </main>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-[120px] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-slate-400">Instrument Registry record not found.</p>
        <Link href="/products" className="text-sm font-semibold text-accent-blue hover:underline">← Return to Catalog</Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-slate-700">Catalog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold truncate max-w-xs notranslate">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left Frame: Image */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-border-slate flex items-center justify-center aspect-square p-12 shadow-sm">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-contain max-h-full max-w-full drop-shadow-md" />
              ) : (
                <div className="text-xs text-slate-400">No Image Available</div>
              )}
            </div>

            {/* Right Frame: Product Details */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">{product.category}</span>
                <h1 className="mt-2 text-3xl font-extrabold text-primary-ocean font-display leading-tight notranslate">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-center gap-3.5 text-xs">
                  <span className="font-mono bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md text-slate-600 font-semibold notranslate">SKU: {product.sku}</span>
                  <span className={`font-semibold px-2.5 py-1 rounded-md ${
                    product.stock_status === 'in_stock' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {product.stock_status === 'in_stock' ? '✓ Available' : 'Contact for Lead Time'}
                  </span>
                </div>
              </div>

              {/* Price Panel */}
              <div className="bg-white rounded-2xl border border-border-slate p-6 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Trade Unit Price</div>
                <div className="text-3xl font-extrabold text-primary-ocean font-display">
                  {market === 'pk' ? `Rs. ${product.price_pkr.toLocaleString()}` : `$${product.price_usd}`}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Wholesale discounts applied automatically at billing for export volumes or clinics.
                </p>
              </div>

              {/* WhatsApp Quote Button */}
              <a
                href={`https://wa.me/923154505283?text=${encodeURIComponent(`Hi Peaceful Dental Solutions, I would like to get a quote about ${product.name} (SKU: ${product.sku})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full h-13 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-lg hover:shadow-green-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Talk on WhatsApp
              </a>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3.5">Technical Profile</h3>
                  <div className="rounded-2xl border border-border-slate overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-xs text-left">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val]: any, i) => (
                          <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="px-5 py-3 font-bold text-primary-ocean border-r border-slate-100 w-2/5 font-display">{key}</td>
                            <td className="px-5 py-3 text-slate-600 font-medium">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Warranty & Standards Badge */}
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-sky-50/50 border border-sky-100/60 text-xs text-slate-700 leading-relaxed">
                <Award className="h-5 w-5 text-accent-blue shrink-0" />
                <span>
                  <strong className="font-bold text-primary-ocean">5-Year Quality Guarantee:</strong> Any material stress, micro-rusting, or misalignment discovered within 5 years qualifies for immediate factory replacement.
                </span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="mt-16 max-w-3xl">
            <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-10 shadow-md">
              <h2 className="text-xl font-extrabold text-primary-ocean font-display mb-1.5">
                Acquire Wholesale Quote
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Receive customized pro-forma terms for bulk supply of {product.name}.
              </p>

              {formStatus === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-sky-50 text-accent-blue flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-ocean font-display">Quote Registry Updated</h3>
                  <p className="text-xs text-muted-slate max-w-sm mx-auto">
                    We've logged your request. One of our regional sales leads will dispatch your quote parameters to your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name', label: 'Contact Name *', type: 'text', placeholder: 'Dr. Ahmed Khan' },
                      { name: 'email', label: 'Business Email *', type: 'email', placeholder: 'you@dentalclinic.com' },
                      { name: 'phone', label: 'WhatsApp / Cell *', type: 'tel', placeholder: '+92 300 0000000' },
                      { name: 'quantity', label: 'Volume Required *', type: 'number', placeholder: '10' },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">{label}</label>
                        <input
                          type={type}
                          name={name}
                          required
                          placeholder={placeholder}
                          value={(formData as any)[name]}
                          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                          className="w-full h-10 rounded-xl border border-border-slate bg-slate-50 px-3.5 text-xs text-slate-800 focus:border-accent-blue focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Message & Notes</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-border-slate bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:border-accent-blue focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full h-11 rounded-xl bg-primary-ocean text-white text-xs font-semibold hover:bg-primary-ocean-hover transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {formStatus === 'submitting' ? 'Submitting Quote Request...' : 'Send Quote Request'}
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
