'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '../lib/utils';
import { useMarket } from '../context/MarketContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck, Award, ChevronRight, ArrowRight, Package, Check,
  Star, Globe, Truck, Wrench, FlaskConical, Microscope, Quote,
  Phone, MessageSquare
} from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', slug: 'cryer-extracting-forceps-150', sku: 'PD-FORCEPS-150', name: 'Cryer Extracting Forceps (150)', category: 'Extracting Forceps', description: 'Universal upper incisor and premolar extraction forceps with anti-slip textured handle.', price_pkr: 4500, price_usd: 48, image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400' },
  { id: '2', slug: '3-prong-orthodontic-plier', sku: 'PD-PLIER-3PRONG', name: '3-Prong Orthodontic Plier', category: 'Dental Pliers', description: 'German carbon-alloyed steel plier with tungsten carbide inserts for wire bending.', price_pkr: 5200, price_usd: 55, image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400' },
  { id: '3', slug: 'dental-surgery-suture-kit', sku: 'PD-KIT-SUTURE', name: 'Dental Surgery & Suture Kit', category: 'Surgery Kits', description: '12-piece complete suturing kit with needle holders, scissors, and leather case.', price_pkr: 14500, price_usd: 150, image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400' },
  { id: '4', slug: 'hygienist-scaler-h6h7', sku: 'PD-SCALER-H6', name: 'Hygienist Scaler H6/H7', category: 'Periodontal', description: 'Double-ended sickle scaler with hollow lightweight handle for plaque removal.', price_pkr: 2200, price_usd: 24, image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400' },
];

const CATEGORIES = [
  { name: 'Extracting Forceps', desc: '120+ upper, lower & pediatric extraction tools', icon: <Wrench className="h-5 w-5 text-accent-blue" /> },
  { name: 'Dental Pliers', desc: '90+ orthodontic and utility pliers', icon: <Package className="h-5 w-5 text-accent-blue" /> },
  { name: 'Surgery Kits', desc: '30+ complete suture & periodontal sets', icon: <FlaskConical className="h-5 w-5 text-accent-blue" /> },
  { name: 'Periodontal & Scaling', desc: '75+ scalers, curettes & explorers', icon: <Microscope className="h-5 w-5 text-accent-blue" /> },
];

const TESTIMONIALS = [
  { name: 'Dr. Sarah Mitchell', role: 'Chief Dental Officer, London Dental Group', country: '🇬🇧', body: 'The forceps we received are genuinely on par with Hu-Friedy quality — at a fraction of the import cost. Lead time from Sialkot to UK was under 6 days.' },
  { name: 'Dr. Khalid Al-Rashid', role: 'Director, Gulf Medical Supplies Co.', country: '🇦🇪', body: 'We have been ordering in bulk for our hospital chain for 3 years. Exceptional consistency across every single batch. CE documentation arrives promptly.' },
  { name: 'Dr. Priya Nair', role: 'Prosthodontist, Apollo Dental, Mumbai', country: '🇮🇳', body: 'Outstanding autoclave resistance. We run 5 sterilization cycles per day — after 2 years, our instruments still have zero rust or misalignment. Remarkable.' },
  { name: 'Dr. Ahmed Hassan', role: 'Oral Surgeon, Cairo University Hospital', country: '🇪🇬', body: 'The OEM laser engraving service was perfect for our institutional procurement needs. The quality is indistinguishable from European-branded instruments.' },
];

const FAQS = [
  { q: 'What is the minimum order quantity for wholesale pricing?', a: 'For international export, our standard MOQ is 50 units per SKU. For Pakistan domestic orders, there is no minimum — you can order even a single piece.' },
  { q: 'Do you provide custom OEM branding on instruments?', a: 'Yes. We offer laser engraving of your clinic name, logo, or institution code directly onto instrument handles. There is a one-time setup fee for the engraving template.' },
  { q: 'How long does international delivery take?', a: 'Standard DHL Express delivery to Europe, North America, and Gulf states takes 4–7 business days from our Sialkot facility. Air freight consolidation is also available for larger orders.' },
  { q: 'Are your instruments autoclavable?', a: 'All instruments are rated for autoclaving at up to 134°C / 273°F. Every batch is subjected to a copper sulfate passivation challenge test before dispatch.' },
  { q: 'Can I request a sample before placing a bulk order?', a: 'Yes. We offer a sample kit program — request up to 5 instrument SKUs at trade price with free DHL shipping for first-time international buyers.' },
];

const MARQUEE_COUNTRIES = [
  '🇬🇧 United Kingdom', '🇺🇸 United States', '🇦🇪 UAE', '🇸🇦 Saudi Arabia',
  '🇩🇪 Germany', '🇫🇷 France', '🇦🇺 Australia', '🇨🇦 Canada',
  '🇮🇳 India', '🇪🇬 Egypt', '🇯🇴 Jordan', '🇳🇱 Netherlands',
  '🇮🇹 Italy', '🇿🇦 South Africa', '🇲🇾 Malaysia', '🇸🇬 Singapore',
];

export default function Home() {
  const { market } = useMarket();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', organization: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await supabase.from('products').select('*').eq('is_featured', true).limit(4);
        setFeaturedProducts(data && data.length > 0 ? data : MOCK_PRODUCTS);
      } catch {
        setFeaturedProducts(MOCK_PRODUCTS);
      }
    }
    fetchFeatured();
    // Auto-cycle testimonials
    const timer = setInterval(() => setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: formData.name.trim(), organization: formData.organization.trim(),
        email: formData.email.trim(), phone: formData.phone.trim(),
        message: formData.message.trim(), product_sku: null, quantity: 1, status: 'pending'
      }]);
      if (error) throw error;
      setInquiryStatus('success');
      setFormData({ name: '', email: '', phone: '', organization: '', message: '' });
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
      setInquiryStatus('idle');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow">

        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section className="hero-gradient border-b border-border-slate overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
          {/* floating orbs */}
          <div className="absolute -top-24 -right-24 h-96 w-96 bg-sky-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 bg-blue-300 rounded-full opacity-10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              <div className="space-y-7 lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-100 bg-sky-50/60 text-xs font-semibold text-accent-blue">
                  <span className="h-2 w-2 rounded-full bg-accent-blue inline-block animate-pulse" />
                  Certified Global Exporter · Sialkot, Pakistan · Since 1998
                </div>

                <div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-primary-ocean tracking-tight leading-[1.1] font-display">
                    Precision<br />
                    <span className="text-accent-blue">Dental</span><br />
                    Instruments
                  </h1>
                  <p className="mt-6 text-sm sm:text-base text-muted-slate leading-relaxed max-w-lg">
                    Surgically-certified apparatus forged from AISI 410 German stainless steel. Backed by FDA, CE, ISO 13485 & a 5-year unconditional replacement guarantee.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/products" className="flex items-center gap-2 h-12 px-7 rounded-xl bg-primary-ocean text-white text-sm font-bold hover:bg-primary-ocean-hover transition-all shadow-lg hover:shadow-xl cursor-pointer">
                    Browse Catalog <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="flex items-center gap-2 h-12 px-7 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-accent-blue hover:text-accent-blue transition-all cursor-pointer shadow-sm">
                    Get Bulk Quote
                  </Link>
                </div>

                {/* Cert badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['FDA Registered', 'CE Mark', 'ISO 13485', 'ISO 9001'].map(b => (
                    <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border border-sky-200 bg-sky-50 text-accent-blue">
                      <ShieldCheck className="h-3 w-3" /> {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center lg:justify-end lg:col-span-5">
                <div className="relative">
                  <div className="w-80 h-80 rounded-3xl bg-white border border-border-slate shadow-2xl flex items-center justify-center p-12 hover:scale-[1.02] transition-transform duration-500">
                    <Image src="/logo.png" alt="Peaceful Dental Solutions" width={220} height={220} className="object-contain" priority />
                  </div>
                  {/* Floating cards */}
                  <div className="absolute -bottom-5 -left-5 bg-white border border-border-slate shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-primary-ocean">5-Year Guarantee</div>
                      <div className="text-[10px] text-slate-400">Full Replacement</div>
                    </div>
                  </div>
                  <div className="absolute -top-5 -right-5 bg-white border border-border-slate shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-accent-blue" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-primary-ocean">45+ Countries</div>
                      <div className="text-[10px] text-slate-400">Worldwide Export</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS COUNTER BAR ─────────────────────────────────── */}
        <section className="py-14 bg-primary-ocean relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.15)_0%,_transparent_70%)] pointer-events-none" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { stat: '2.4M+', label: 'Instruments Produced', sub: 'Since 1998' },
                { stat: '1,250+', label: 'Clinics Worldwide', sub: 'Active Accounts' },
                { stat: '99.98%', label: 'Sterility Pass Rate', sub: 'Per Batch Audit' },
                { stat: '45+', label: 'Countries Served', sub: 'DHL / FedEx Export' },
              ].map(({ stat, label, sub }) => (
                <div key={label} className="space-y-1">
                  <div className="text-4xl font-extrabold text-sky-200 font-display tracking-tight">{stat}</div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest">{label}</div>
                  <div className="text-[10px] text-slate-400">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SCROLLING COUNTRY MARQUEE ─────────────────────────── */}
        <div className="py-4 bg-slate-50 border-y border-border-slate overflow-hidden">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...MARQUEE_COUNTRIES, ...MARQUEE_COUNTRIES].map((c, i) => (
              <span key={i} className="text-xs font-bold text-slate-500 shrink-0">{c}</span>
            ))}
          </div>
        </div>

        {/* ─── VALUE PILLARS ─────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <ShieldCheck className="h-6 w-6 text-accent-blue" />, title: 'Austenite German Steel', desc: 'AISI 410 & 420 alloys rated for 5,000+ sterilization cycles without structural degradation.' },
                { icon: <Award className="h-6 w-6 text-accent-blue" />, title: 'Universal Certifications', desc: 'FDA Facility #301140928, CE Mark, ISO 13485:2016, and ISO 9001:2015 — all active and auditable.' },
                { icon: <Truck className="h-6 w-6 text-accent-blue" />, title: 'Global Logistics Network', desc: 'DHL Express & FedEx air freight. Customs-ready COO, blister packing, and sterilized packaging.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="group p-8 rounded-2xl border border-border-slate bg-slate-50/50 space-y-4 hover:border-accent-blue hover:bg-white hover:shadow-md transition-all duration-300 cursor-default">
                  <div className="h-12 w-12 rounded-xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center transition-colors">{icon}</div>
                  <h3 className="text-base font-bold text-primary-ocean font-display">{title}</h3>
                  <p className="text-sm text-muted-slate leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRODUCT CATEGORIES ────────────────────────────────── */}
        <section className="py-20 bg-slate-50 border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Instrument Registry</span>
              <h2 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">Browse Instrument Families</h2>
              <p className="mt-3 text-sm text-muted-slate max-w-md">Professional catalog covering diagnostics, extractions, orthodontics, and minor surgeries.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.map((cat) => (
                <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group block p-6 rounded-2xl bg-white border border-border-slate hover:border-accent-blue hover:shadow-lg transition-all duration-300">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center mb-4 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm font-bold text-primary-ocean group-hover:text-accent-blue transition-colors font-display">{cat.name}</h3>
                  <p className="mt-1.5 text-xs text-muted-slate leading-relaxed">{cat.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent-blue font-bold group-hover:translate-x-1 transition-transform">
                    View Range <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MARKET-AWARE SHIPPING BAND ────────────────────────── */}
        <section className="py-16 bg-white border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border-slate bg-gradient-to-br from-slate-50 to-sky-50/30 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-64 w-64 bg-sky-100 rounded-full blur-3xl opacity-20 pointer-events-none" />
              <div className="max-w-3xl space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-accent-blue">
                  {market === 'pk' ? '🇵🇰  Pakistan Domestic Supply' : '🌐  Global Export Operations'}
                </div>
                {market === 'pk' ? (
                  <>
                    <h3 className="text-2xl font-extrabold text-primary-ocean font-display">Direct Manufacturing → Your Clinic</h3>
                    <p className="text-sm text-muted-slate leading-relaxed">Supply directly from our Sialkot production floor. Wholesale pricing, free domestic shipping on orders over PKR 10,000, with a dedicated Lahore sales office.</p>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                      {['Cash on Delivery (COD)', '2-3 Days Nationwide', 'Lahore Walk-in Office'].map(f => (
                        <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-blue shrink-0" /> {f}</div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-extrabold text-primary-ocean font-display">Factory-to-Clinic Global Shipments</h3>
                    <p className="text-sm text-muted-slate leading-relaxed">Supplying dental clinics, universities, and distribution networks across 45+ countries. DHL Express and FedEx couriers, with COO, sterilized blister packing, and OEM laser engraving.</p>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                      {['DHL & FedEx Air Freight', 'Bank LC / TT / PayPal', 'Custom OEM Branding'].map(f => (
                        <div key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-blue shrink-0" /> {f}</div>
                      ))}
                    </div>
                  </>
                )}
                <Link href="/contact" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary-ocean text-white text-xs font-bold hover:bg-primary-ocean-hover transition-all shadow-md cursor-pointer">
                  Request Trade Terms <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─────────────────────────────────── */}
        <section className="py-20 bg-slate-50 border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Bestsellers</span>
                <h2 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">Featured Instruments</h2>
                <p className="mt-2 text-sm text-muted-slate">Hand-inspected, high-demand surgical tools from our catalog.</p>
              </div>
              <Link href="/products" className="text-sm font-bold text-accent-blue hover:text-accent-blue-hover flex items-center gap-1">
                Full Catalog <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug || slugify(product.name)}`} className="premium-card flex flex-col overflow-hidden group">
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-xs text-slate-400">No Image</div>
                    )}
                    <span className="absolute top-3 left-3 bg-white border border-border-slate px-2.5 py-0.5 rounded-md text-[9px] font-mono text-slate-500 notranslate">{product.sku}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue">{product.category}</span>
                    <h3 className="mt-1 text-sm font-bold text-primary-ocean line-clamp-1 font-display notranslate">{product.name}</h3>
                    <p className="mt-1 text-xs text-muted-slate line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-base font-extrabold text-primary-ocean">
                        {market === 'pk' ? `Rs. ${product.price_pkr.toLocaleString()}` : `$${product.price_usd}`}
                      </span>
                      <span className="text-xs font-bold text-accent-blue group-hover:underline">Get Quote →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CERTIFICATIONS & TECH SPECS ────────────────────────── */}
        <section className="py-20 bg-white border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Regulatory Compliance</span>
                  <h2 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">Certified to Every Major Standard</h2>
                  <p className="mt-3 text-sm text-muted-slate leading-relaxed">Every batch undergoes chemical passivation, boil tests, and individual microscope inspection before clearance to ship.</p>
                </div>
                <div className="grid gap-3">
                  {[
                    'FDA Facility Registration #301140928',
                    'CE Declaration of Conformity (EU Medical Devices)',
                    'ISO 13485:2016 — Medical Quality Management',
                    'ISO 9001:2015 — Global Manufacturing Standards',
                  ].map((cert) => (
                    <div key={cert} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="h-5 w-5 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-accent-blue" />
                      </div>
                      <span className="font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
                <Link href="/certifications" className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue hover:underline">
                  View Full Certification Portfolio <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: 'HRC 50–54', label: 'Rockwell Hardness', desc: 'Surgical grade, prevents chipping on impact' },
                  { stat: '0.05 mm', label: 'Tolerance', desc: 'Precision-ground tips and meeting joints' },
                  { stat: '100%', label: 'Passivation Check', desc: 'Copper sulfate immersion test per batch' },
                  { stat: '134°C', label: 'Autoclave Rating', desc: 'Full steam cycle compatibility confirmed' },
                ].map(({ stat, label, desc }) => (
                  <div key={label} className="p-6 rounded-2xl bg-slate-50 border border-border-slate space-y-1.5 hover:border-accent-blue transition-colors duration-300">
                    <div className="text-2xl font-extrabold text-primary-ocean font-display">{stat}</div>
                    <div className="text-xs font-bold text-slate-800">{label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── MANUFACTURING PROCESS TIMELINE ────────────────────── */}
        <section className="py-20 bg-slate-50 border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Manufacturing Cycle</span>
              <h2 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">How Every Instrument is Built</h2>
              <p className="mt-3 text-sm text-muted-slate">From raw German steel billets to sterilized instruments in 4 precision stages.</p>
            </div>
            <div className="relative">
              {/* Connecting line on desktop */}
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '01', icon: <FlaskConical className="h-6 w-6" />, title: 'Alloy Sourcing', desc: 'AISI 410 Austenitic steel billets certified by independent metallurgical labs.' },
                  { step: '02', icon: <Wrench className="h-6 w-6" />, title: 'Drop Forging', desc: 'Hot-die forge presses shapes the steel at 1,200°C for maximum grain density.' },
                  { step: '03', icon: <FlaskConical className="h-6 w-6" />, title: 'Passivation Bath', desc: 'Nitric acid bath removes free iron, creating an invisible anti-rust chromium oxide layer.' },
                  { step: '04', icon: <Microscope className="h-6 w-6" />, title: 'Micro-Inspection', desc: 'Each tip and hinge is verified under 10× magnification for dimensional accuracy.' },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="relative bg-white border border-border-slate p-6 rounded-2xl space-y-3 hover:border-accent-blue hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center text-accent-blue transition-colors">
                        {icon}
                      </div>
                      <span className="text-xs font-bold text-slate-300 font-mono">STEP {step}</span>
                    </div>
                    <h3 className="text-sm font-bold text-primary-ocean font-display">{title}</h3>
                    <p className="text-xs text-muted-slate leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ──────────────────────────────────────── */}
        <section className="py-20 bg-primary-ocean border-t border-primary-ocean-hover relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.1),transparent_60%)] pointer-events-none" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300">What Clinicians Say</span>
              <h2 className="text-3xl font-extrabold text-white font-display mt-2">Trusted by Dental Professionals Worldwide</h2>
            </div>

            {/* Testimonial Cards */}
            <div className="relative min-h-[220px]">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 space-y-5">
                    <Quote className="h-8 w-8 text-sky-300 opacity-60" />
                    <p className="text-sm text-white/90 leading-relaxed italic">&ldquo;{t.body}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
                        {t.name[0]}{t.name.split(' ')[1]?.[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{t.country} {t.name}</div>
                        <div className="text-[10px] text-sky-300 mt-0.5">{t.role}</div>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[...Array(5)].map((_, s) => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all cursor-pointer ${i === activeTestimonial ? 'bg-white w-6 h-2' : 'bg-white/30 w-2 h-2 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION ───────────────────────────────────────── */}
        <section className="py-20 bg-white border-t border-border-slate">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Trade & Export</span>
              <h2 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">Frequently Asked Questions</h2>
              <p className="mt-3 text-sm text-muted-slate">Everything you need to know before placing a wholesale order.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border-slate rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-primary-ocean font-display pr-4">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 bg-slate-50 border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BAND ──────────────────────────────────────────── */}
        <section className="py-16 bg-slate-50 border-t border-border-slate">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-ocean to-sky-600 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 h-40 w-40 bg-sky-400 rounded-full opacity-10 blur-2xl" />
              <div className="space-y-2 relative z-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">Ready to Place a Bulk Order?</h2>
                <p className="text-sm text-sky-100 max-w-md">Our export team responds to all quote requests within 24 hours with a pro-forma invoice and shipping terms.</p>
              </div>
              <div className="flex gap-3 relative z-10 shrink-0">
                <Link href="/contact" className="flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-primary-ocean text-sm font-bold hover:bg-sky-50 transition-all shadow-md cursor-pointer">
                  <MessageSquare className="h-4 w-4" /> Request Quote
                </Link>
                <a href="tel:+923001234567" className="flex items-center gap-2 h-11 px-6 rounded-xl border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition-all cursor-pointer">
                  <Phone className="h-4 w-4" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOMEPAGE INQUIRY FORM ─────────────────────────────── */}
        <section id="inquiry" className="py-20 bg-white border-t border-border-slate">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-lg">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Direct Factory Quote</span>
                <h2 className="text-2xl font-extrabold text-primary-ocean font-display mt-2">Request Pro-Forma Invoice</h2>
                <p className="mt-2 text-xs text-muted-slate">Enter your requirements below. Our trade desk responds within 24 hours.</p>
              </div>
              {inquiryStatus === 'success' ? (
                <div className="py-10 text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-sky-50 text-accent-blue flex items-center justify-center mx-auto border border-sky-100">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-primary-ocean font-display">Quote Request Logged</h3>
                  <p className="text-xs text-muted-slate max-w-sm mx-auto">We've received your message. A pro-forma invoice will reach your inbox within 24 hours.</p>
                  <button onClick={() => setInquiryStatus('idle')} className="text-xs font-bold text-accent-blue hover:underline cursor-pointer mt-2">Submit Another Inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Dr. Ahmed Khan' },
                      { name: 'organization', label: 'Clinic / Distributor *', type: 'text', placeholder: 'City Dental Care' },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
                        <input type={type} required value={(formData as any)[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} placeholder={placeholder}
                          className="w-full h-11 rounded-xl border border-border-slate bg-slate-50 px-4 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'email', label: 'Email *', type: 'email', placeholder: 'doctor@hospital.com' },
                      { name: 'phone', label: 'WhatsApp / Phone *', type: 'tel', placeholder: '+92 300 1234567' },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
                        <input type={type} required value={(formData as any)[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} placeholder={placeholder}
                          className="w-full h-11 rounded-xl border border-border-slate bg-slate-50 px-4 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Instruments Required *</label>
                    <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="List product SKUs, models, quantities, and any special requirements..."
                      className="w-full rounded-xl border border-border-slate bg-slate-50 px-4 py-3 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={inquiryStatus === 'submitting'}
                    className="w-full h-12 rounded-xl bg-primary-ocean text-white text-sm font-bold hover:bg-primary-ocean-hover transition-all shadow-md disabled:opacity-60 cursor-pointer">
                    {inquiryStatus === 'submitting' ? 'Submitting...' : 'Send Quote Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
