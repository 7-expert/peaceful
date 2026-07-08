'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useMarket } from '../../../context/MarketContext';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { ChevronRight, ShieldCheck, Award, Loader2, Star, Check, Share2, MessageSquare } from 'lucide-react';
import { slugify } from '../../../lib/utils';
import ProductImageGallery from '../../../components/ProductImageGallery';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MOCK_PRODUCTS: any[] = [
  { id: '1', slug: 'cryer-extracting-forceps-150', sku: 'PD-FORCEPS-150', name: 'Cryer Extracting Forceps (150)', category: 'Extracting Forceps', short_description: 'Universal upper incisor and premolar extraction forceps with anti-slip textured handle.', description: 'Universal upper incisor and premolar extraction forceps with anti-slip textured handle. Manufactured from AISI 410 German stainless steel with satin-dull anti-glare finish. Precision-ground beaks ensure secure grip during extraction procedures. Ergonomic handle design reduces hand fatigue during extended surgical sessions.', price_pkr: 4500, price_usd: 48, image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=600', specifications: { Material: 'AISI 410 German Stainless Steel', Finish: 'Satin Dull (Anti-Glare)', Autoclavable: 'Yes — 134°C / 273°F', Warranty: 'Signature Guarantee', Sterilization: 'Ultrasonic + Chemical Passivation' }, stock_status: 'in_stock' },
];

const DEFAULT_FEATURE_BULLETS = [
  'Precision Engineering',
  'Ergonomic Design',
  'High-Quality Materials',
  'ISO-Certified',
  'Lightweight Construction',
  'Signature Guarantee',
];

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { market } = useMarket();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: '', quantity: '10', message: '' });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let found: any = null;

        if (UUID_RE.test(slug)) {
          const { data } = await supabase.from('products').select('*').eq('id', slug).single();
          if (data) found = data;
        }

        if (!found) {
          const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
          if (data) found = data;
        }

        if (!found) {
          const { data: all } = await supabase.from('products').select('*');
          found = all?.find(p => slugify(p.name) === slug) ?? null;
        }

        if (!found) {
          found = MOCK_PRODUCTS.find(p => p.slug === slug || slugify(p.name) === slug || p.id === slug) ?? null;
        }

        setProduct(found ?? null);
        if (found) {
          setFormData(f => ({ ...f, message: `Hello, I'd like a quotation for ${found.name} (SKU: ${found.sku}).` }));

          // Fetch reviews
          if (found.id) {
            const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', found.id).eq('is_approved', true).order('created_at', { ascending: false });
            if (revs) setReviews(revs);
          }

          // Fetch related products
          try {
            const { data: related } = await supabase.from('products').select('*').eq('category', found.category).neq('id', found.id).limit(4);
            if (related && related.length > 0) {
              setRelatedProducts(related);
            } else {
              setRelatedProducts(MOCK_PRODUCTS.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
            }
          } catch {
            setRelatedProducts(MOCK_PRODUCTS.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
          }
        }
      } catch {
        const mock = MOCK_PRODUCTS.find(p => p.slug === slug || slugify(p.name) === slug || p.id === slug) ?? null;
        setProduct(mock);
        if (mock) {
          setFormData(f => ({ ...f, message: `Hello, I'd like a quotation for ${mock.name} (SKU: ${mock.sku}).` }));
          setRelatedProducts(MOCK_PRODUCTS.filter(p => p.category === mock.category && p.id !== mock.id).slice(0, 4));
        }
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    setReviewStatus('submitting');
    setReviewError('');
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          product_id: product.id,
          reviewer_name: reviewForm.name.trim(),
          reviewer_email: reviewForm.email.trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          is_approved: false // requires admin approval
        }
      ]);
      if (error) throw error;
      setReviewStatus('success');
      setReviewForm({ name: '', email: '', rating: 5, comment: '' });
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
      setReviewStatus('error');
    }
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out ${product?.name} from Peaceful Dental Solutions`;
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(links[platform], '_blank', 'noopener,noreferrer');
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

  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const bullets = product.feature_bullets?.length > 0 ? product.feature_bullets : DEFAULT_FEATURE_BULLETS;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-[120px] pb-0">

        {/* ─── HERO SECTION ─── */}
        <section className="bg-white border-b border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-slate-700">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/products" className="hover:text-slate-700">Products</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-700 font-semibold truncate max-w-xs notranslate">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* Left: Product Image Gallery */}
              <ProductImageGallery
                mainImage={product.image_url}
                galleryImages={product.gallery_images}
                productName={product.name}
                sku={product.sku}
              />

              {/* Right: Product Info */}
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight notranslate">
                    {product.name}
                  </h1>
                  <div className="mt-2 text-xl font-bold text-blue-600">
                    ${product.price_usd}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`h-4 w-4 ${reviews.length > 0 && i <= Math.round(reviews.reduce((a,b)=>a+b.rating,0)/reviews.length) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">({reviews.length} reviews)</span>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.short_description || product.description}
                </p>

                {/* Feature Bullets */}
                <div className="flex flex-col gap-2.5 pt-2">
                  {bullets.map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-800">{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Dynamic Meta Info */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 mr-1">SKU:</span>
                    <span className="text-blue-600 font-mono">{product.sku}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 mr-1">CATEGORY:</span>
                    <span className="text-blue-600 uppercase tracking-wider">{product.category}</span>
                  </div>
                  {product.product_type && (
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 mr-1">TYPE:</span>
                      <span className="text-blue-600 uppercase tracking-wider">{product.product_type}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="text-xs flex items-center gap-2">
                      <span className="font-bold text-slate-800">SIZE:</span>
                      <span className="border border-slate-300 px-2 py-0.5 rounded text-slate-600 bg-white">{product.size}</span>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div className="text-xs flex flex-wrap items-center gap-2 mt-2">
                      <span className="font-bold text-slate-800">TAGS:</span>
                      {product.tags.map((t: string, i: number) => (
                        <span key={i} className="text-blue-600 uppercase tracking-wider">{t}{i < product.tags.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                  <a
                    href="#quote-form"
                    className="flex items-center justify-center gap-2 flex-1 h-12 rounded bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add to Inquiry
                  </a>
                  <a
                    href={`https://wa.me/923154505283?text=${encodeURIComponent(`Hi Peaceful Dental Solutions, I would like to get a quote about ${product.name} (SKU: ${product.sku})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 flex-1 h-12 rounded bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white text-sm font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    Whatsapp Inquiry
                  </a>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Share2 className="h-3.5 w-3.5" /> Share:</span>
                  <div className="flex gap-2">
                    {[
                      { platform: 'facebook', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>, color: 'hover:bg-blue-600 hover:text-white' },
                      { platform: 'twitter', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, color: 'hover:bg-slate-900 hover:text-white' },
                      { platform: 'whatsapp', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, color: 'hover:bg-green-500 hover:text-white' },
                      { platform: 'linkedin', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>, color: 'hover:bg-blue-700 hover:text-white' },
                    ].map(({ platform, icon, color }) => (
                      <button key={platform} onClick={() => handleShare(platform)} className={`h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 transition-all cursor-pointer ${color}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TABS BAR ─── */}
        <section className="bg-white border-b border-slate-200 sticky top-[88px] z-[50]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0">
              {[
                { key: 'description' as const, label: 'Description' },
                { key: 'specs' as const, label: 'Additional Info' },
                { key: 'reviews' as const, label: `Reviews (${reviews.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTENT SECTION: 50/50 ─── */}
        <section className="bg-slate-50/50 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* LEFT: Tab Content */}
              <div>
                {activeTab === 'description' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
                    <h2 className="text-lg font-extrabold text-slate-900 font-display">{product.name}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

                    {/* Specs Table inside description */}
                    {specs.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 font-display">Specifications</h3>
                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="bg-blue-600 text-white">
                                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider w-12">Sr.</th>
                                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Parameter</th>
                                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {specs.map(([key, val]: any, i) => (
                                <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                  <td className="px-5 py-3 text-xs text-slate-400 font-mono">{i + 1}</td>
                                  <td className="px-5 py-3 text-xs font-bold text-slate-800">{key}</td>
                                  <td className="px-5 py-3 text-xs text-slate-600">{val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Warranty Badge */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100/60 text-xs text-slate-700 leading-relaxed">
                      <Award className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold text-slate-900">Signature Guarantee:</strong> Any material stress, micro-rusting, or misalignment discovered qualifies for immediate factory replacement.
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
                    <h2 className="text-lg font-extrabold text-slate-900 font-display">Technical Profile</h2>
                    {specs.length > 0 ? (
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="bg-blue-600 text-white">
                              <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Attribute</th>
                              <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Detail</th>
                            </tr>
                          </thead>
                          <tbody>
                            {specs.map(([key, val]: any, i) => (
                              <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-5 py-3.5 text-xs font-bold text-slate-800 border-r border-slate-100">{key}</td>
                                <td className="px-5 py-3.5 text-xs text-slate-600">{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No additional specifications available for this instrument.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Review Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                      {reviewStatus === 'success' ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                          Thank you for your review! It will be published after admin approval.
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          {reviewStatus === 'error' && <p className="text-red-500 text-xs">{reviewError}</p>}
                          <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                onClick={() => setReviewForm({...reviewForm, rating: star})}
                                className={`h-6 w-6 cursor-pointer ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} 
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" required placeholder="Name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="h-10 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50" />
                            <input type="email" required placeholder="Email" value={reviewForm.email} onChange={e => setReviewForm({...reviewForm, email: e.target.value})} className="h-10 rounded-xl border border-slate-200 px-3 text-xs bg-slate-50" />
                          </div>
                          <textarea required rows={3} placeholder="Your review..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50" />
                          <button type="submit" disabled={reviewStatus === 'submitting'} className="h-10 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50">
                            {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-sm text-slate-500">No reviews yet. Be the first to review this product!</p>
                      ) : (
                        reviews.map(review => (
                          <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-sm text-slate-900">{review.reviewer_name}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Quote Form */}
              <div className="space-y-6" id="quote-form">
                <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-900 font-display mb-1">
                    Need A Quote?
                  </h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Get customized pricing for {product.name}.
                  </p>

                  {formStatus === 'success' ? (
                    <div className="py-10 text-center space-y-4">
                      <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display">Quote Request Sent!</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Our trade representative will email you back within 24 hours.
                      </p>
                      <button onClick={() => setFormStatus('idle')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer mt-2">Submit Another</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. Ahmed Khan' },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@dentalclinic.com' },
                        { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+92 300 0000000' },
                        { name: 'country', label: 'Country / Region', type: 'text', placeholder: 'e.g. United States' },
                      ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label} *</label>
                          <input
                            type={type}
                            name={name}
                            required
                            placeholder={placeholder}
                            value={(formData as any)[name]}
                            onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none transition-all"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                        <textarea
                          rows={3}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please enter your order/inquiry details here..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none transition-all resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {formStatus === 'submitting' ? 'Submitting...' : 'Get Quote'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RELATED PRODUCTS ─── */}
        {relatedProducts.length > 0 && (
          <section className="bg-white border-t border-slate-100 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">You May Also Like</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-1">Related Products</h2>
                </div>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All &rarr;
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/products/${rp.slug || slugify(rp.name)}`} className="group bg-white rounded-none border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden product-card-zoom-wrapper">
                      {rp.image_url ? (
                        <img src={rp.image_url} alt={rp.name} className="product-card-zoom-img" />
                      ) : (
                        <div className="text-xs text-slate-400">No Image</div>
                      )}
                    </div>
                    <div className="p-5 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{rp.category}</span>
                      <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 font-display notranslate">{rp.name}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-base font-extrabold text-blue-600">
                          ${rp.price_usd}
                        </span>
                        <span className="text-xs font-bold text-blue-600 group-hover:underline">Get Quote &rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
