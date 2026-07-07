'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { slugify } from '../lib/utils';
import { useMarket } from '../context/MarketContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, ShieldCheck, ArrowRight, MessageSquare, Phone } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', slug: 'cryer-extracting-forceps-150', sku: 'PD-FORCEPS-150', name: 'Cryer Extracting Forceps (150)', category: 'Extracting Forceps', description: 'Universal upper incisor and premolar extraction forceps with anti-slip textured handle.', price_pkr: 4500, price_usd: 48, image_url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400' },
  { id: '2', slug: '3-prong-orthodontic-plier', sku: 'PD-PLIER-3PRONG', name: '3-Prong Orthodontic Plier', category: 'Dental Pliers', description: 'German carbon-alloyed steel plier with tungsten carbide inserts for wire bending.', price_pkr: 5200, price_usd: 55, image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400' },
  { id: '3', slug: 'dental-surgery-suture-kit', sku: 'PD-KIT-SUTURE', name: 'Dental Surgery & Suture Kit', category: 'Surgery Kits', description: '12-piece complete suturing kit with needle holders, scissors, and leather case.', price_pkr: 14500, price_usd: 150, image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400' },
  { id: '4', slug: 'hygienist-scaler-h6h7', sku: 'PD-SCALER-H6', name: 'Hygienist Scaler H6/H7', category: 'Periodontal', description: 'Double-ended sickle scaler with hollow lightweight handle for plaque removal.', price_pkr: 2200, price_usd: 24, image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400' },
];

export default function Home() {
  const { market } = useMarket();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'General Consultation', organization: '', date: '', time: '13:00', message: '' });

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
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    try {
      const msg = `Booking requested for: ${formData.service} on ${formData.date} at ${formData.time}. Note: ${formData.message}`;
      const { error } = await supabase.from('inquiries').insert([{
        name: formData.name.trim(),
        organization: formData.organization.trim() || 'Direct Client',
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: msg,
        product_sku: null,
        quantity: 1,
        status: 'pending'
      }]);
      if (error) throw error;
      setInquiryStatus('success');
      setFormData({ name: '', email: '', phone: '', service: 'General Consultation', organization: '', date: '', time: '13:00', message: '' });
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
      setInquiryStatus('idle');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow">

        {/* ─── 1. DENTAL HERO SECTION ──────────────────────────────── */}
        <section className="dental-hero" style={{ marginTop: 0 }}>
          <div className="hero-content">
            <h1 className="notranslate">
              We Take Care of<br />
              Your <span>Instruments</span>
            </h1>
            <p>
              Experience top-grade, precision-manufactured stainless steel dental instruments designed for healthcare excellence.
            </p>
            <Link href="/products" className="hero-btn cursor-pointer">
              View Catalog →
            </Link>
          </div>

          <div className="teeth-gallery">
            <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/banner/banner-three-one.png" alt="Instrument details 1" />
            <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/banner/banner-three-two.png" alt="Instrument details 2" />
            <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/banner/banner-three-three.png" alt="Instrument details 3" />
            <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/banner/banner-three-four.png" alt="Instrument details 4" />
            <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/banner/banner-three-five.png" alt="Instrument details 5" />
          </div>
        </section>

        {/* ─── 2. EXPERT SECTION ───────────────────────────────────── */}
        <section className="expert-section border-t border-slate-100">
          <img
            src="https://i.pinimg.com/1200x/03/f2/fa/03f2faf1c1aec554604ceaeb08435d72.jpg"
            alt="Dental background decoration left"
            className="shape-left-img hidden lg:block"
          />
          <img
            src="https://i.pinimg.com/736x/e3/86/22/e386223c0759a15e2ffcc258fc91ef8b.jpg"
            alt="Dental background decoration right"
            className="teeth-bg"
          />

          <div className="container">
            {/* LEFT IMAGE */}
            <div className="image-box border border-slate-200 shadow-md">
              <img
                src="https://plus.unsplash.com/premium_photo-1672922646348-b8129dbd3c54?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Instrument Production Quality"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="content">
              <h2 className="font-display">
                Expert Forging for Every Tool,
                <span>Restore Surgical Confidence</span>
              </h2>

              <p>
                From diagnostics to complex surgical procedures, our expert engineering team is dedicated to producing high-grade instruments that last a lifetime.
              </p>

              <div className="service-grid">
                {/* Card 1 */}
                <div className="card">
                  <div className="icon">
                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/about-icon-one.svg" alt="Quality" />
                  </div>
                  <h4>Best Stainless Steel</h4>
                  <p>Certified steel alloys for strength.</p>
                </div>

                {/* Card 2 */}
                <div className="card">
                  <div className="icon">
                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/about-icon-two.svg" alt="Team" />
                  </div>
                  <h4>Expert Forging Team</h4>
                  <p>Specialized craftsmen in Sialkot manufacturing center.</p>
                </div>

                {/* Card 3 */}
                <div className="card">
                  <div className="icon">
                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/about-icon-three.svg" alt="Support" />
                  </div>
                  <h4>24/7 Trade Support</h4>
                  <p>Fast responses, order updates, and cargo handling.</p>
                </div>

                {/* Card 4 */}
                <div className="card">
                  <div className="icon">
                    <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/about-icon-four.svg" alt="Consultation" />
                  </div>
                  <h4>OEM Customization</h4>
                  <p>Custom laser engraving and shape modifications.</p>
                </div>
              </div>

              <Link href="/about" className="btn cursor-pointer">
                More About Us
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 3. DENTAL MARQUEE ───────────────────────────────────── */}
        <section className="marquee border-y border-slate-100">
          <div className="marquee-track">
            <div className="item">FORCEPS</div>
            <div className="star">✦</div>
            <div className="item">PLIERS</div>
            <div className="star">✦</div>
            <div className="item">SCALERS</div>
            <div className="star">✦</div>
            <div className="item">SUTURE KITS</div>
            <div className="star">✦</div>
            <div className="item">IMPLANTS</div>
            <div className="star">✦</div>
            <div className="item">DIAGNOSTICS</div>
            <div className="star">✦</div>

            {/* duplicates for loop */}
            <div className="item">FORCEPS</div>
            <div className="star">✦</div>
            <div className="item">PLIERS</div>
            <div className="star">✦</div>
            <div className="item">SCALERS</div>
            <div className="star">✦</div>
            <div className="item">SUTURE KITS</div>
            <div className="star">✦</div>
            <div className="item">IMPLANTS</div>
            <div className="star">✦</div>
            <div className="item">DIAGNOSTICS</div>
            <div className="star">✦</div>
          </div>
        </section>

        {/* ─── 4. ABOUT SECTION ────────────────────────────────────── */}
        <section className="about-section">
          <div className="about-wrapper">
            {/* LEFT */}
            <div className="left-content">
              <div className="tag">Who We Are</div>
              <div className="star-shape max-md:mr-[-10%]">✷</div>
              <div className="big-number">28</div>
              {/* Mobile-only horizontal years label (vertical-text is hidden on mobile) */}
              <span className="years-label-mobile hidden">Years Of Manufacturing Excellence</span>
              <div className="vertical-text">Years Of Manufacturing Excellence</div>

              <div className="review-box">
                <div className="review-images">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client 1" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client 2" />
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Client 3" />
                  <img src="https://randomuser.me/api/portraits/men/15.jpg" alt="Client 4" />
                </div>
                <div className="review-text">
                  Trusted by 1,250+ dental clinics globally
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="info-cards">
              <div className="info-card">
                <div className="icon-box green">
                  <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/target-icon-1.svg" alt="Mission" />
                </div>
                <div>
                  <h3 className="font-display">Our Mission</h3>
                  <p>To produce and export highest-quality surgical apparatus with certified chemical composition and strict tolerance audits.</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-box blue">
                  <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/target-icon-2.svg" alt="Vision" />
                </div>
                <div>
                  <h3 className="font-display">Our Vision</h3>
                  <p>To remain the premier manufacturer of dental instruments in Sialkot, exporting high-precision tools worldwide.</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-box pink">
                  <img src="https://doccure.dreamstechnologies.com/html/template/assets/img/icons/target-icon-3.svg" alt="Care" />
                </div>
                <div>
                  <h3 className="font-display">Why We Care</h3>
                  <p>Clinical precision starts with tools that don't rust, slip, or fail under pressure. We supply instruments doctors trust completely.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. WHY CHOOSE US SECTION ────────────────────────────── */}
        <section className="choose-section">
          <img className="corner-left" src="https://doccure.dreamstechnologies.com/html/template/assets/img/category/choose-bg-02.png" alt="Decoration left" />
          <img className="corner-right" src="https://doccure.dreamstechnologies.com/html/template/assets/img/category/choose-bg-01.png" alt="Decoration right" />

          <div className="tag">Why Choose Us</div>
          <h2>Why Choose Our Instruments?</h2>
          <p>Experience the manufacturing difference that quality alloys, modern passivation, and precise tempering make.</p>

          <div className="choose-grid">
            {/* LEFT */}
            <div>
              <div className="feature">
                <h3>Direct Factory Pricing</h3>
                <div className="line"></div>
                <p>We eliminate agent markups. Purchase directly from the Sialkot manufacturing floor.</p>
              </div>

              <div className="feature">
                <h3>Hygiene & Sterilization</h3>
                <div className="line"></div>
                <p>Boil-tested and passivation-challenged. Rates for 5,000+ autoclave cycles.</p>
              </div>

              <div className="feature">
                <h3>Guaranteed Replacement</h3>
                <div className="line"></div>
                <p>Every single instrument comes with our signature replacement guarantee.</p>
              </div>
            </div>

            {/* CENTER */}
            <div className="center-image">
              <img src="/instrument.svg" alt="Dental instrument detail" className="max-w-xs lg:max-w-[450px]" />
            </div>

            {/* RIGHT */}
            <div>
              <div className="feature">
                <h3>Painless Operations</h3>
                <div className="line"></div>
                <p>Precision-ground tips and meeting joints prevent patient discomfort or tissue tearing.</p>
              </div>

              <div className="feature">
                <h3>Certified Sourcing</h3>
                <div className="line"></div>
                <p>FDA registered facility, CE Declaration of Conformity, ISO 13485 & 9001 certified.</p>
              </div>

              <div className="feature">
                <h3>Global Delivery</h3>
                <div className="line"></div>
                <p>Consolidated air cargo, DHL Express, and FedEx options to 45+ international destinations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. DYNAMIC FEATURED PRODUCTS REGISTRY ───────────────── */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Instrument Registry</span>
                <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">Featured Products</h2>
                <p className="mt-2 text-sm text-slate-500">Hand-inspected, surgical grade instrument models in high demand.</p>
              </div>
              <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Full Catalog &rarr;
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug || slugify(product.name)}`} className="premium-card flex flex-col overflow-hidden group bg-white">
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="text-xs text-slate-400">No Image</div>
                    )}
                    <span className="absolute top-3 left-3 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[9px] font-mono text-slate-500 notranslate">{product.sku}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow bg-white border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{product.category}</span>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 font-display notranslate">{product.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-base font-extrabold text-blue-600">
                        {market === 'pk' ? `Rs. ${product.price_pkr.toLocaleString()}` : `$${product.price_usd}`}
                      </span>
                      <span className="text-xs font-bold text-blue-600 group-hover:underline">Get Quote &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. TESTIMONIALS SECTION ────────────────────────────── */}
        <section className="dr-section border-t border-slate-100">
          <div className="dr-head">
            <div className="dr-pill"><span className="dot"></span> Testimonials</div>
            <h2>Feedback from Doctors Worldwide</h2>
            <p>Discover what surgeons and clinics say about our instrument quality and durability.</p>
          </div>

          {/* ROW 1: left → right — cards repeated 3× for gapless loop */}
          <div className="dr-outer row1">
            <div className="dr-track">
              {/* SET A */}
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. James" /><div><div className="dr-name">Dr. James Harper</div><div className="dr-loc">New York, USA</div><span className="dr-badge">Orthodontist</span></div></div><p className="dr-text">The extracting forceps are on par with German-branded equivalents. Passivation holds up perfectly over countless autoclave cycles.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Sofia" /><div><div className="dr-name">Dr. Sofia Müller</div><div className="dr-loc">Berlin, Germany</div><span className="dr-badge">Periodontist</span></div></div><p className="dr-text">Outstanding durability on periodontal scalers. Ergonomic design reduces strain and tips retain sharpness perfectly.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/55.jpg" alt="Dr. Arjun" /><div><div className="dr-name">Dr. Arjun Mehta</div><div className="dr-loc">Mumbai, India</div><span className="dr-badge">Prosthodontist</span></div></div><p className="dr-text">Very responsive team. Custom laser engraving setup is neat. Shipping from Sialkot to Mumbai takes under 5 days.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Dr. Yuki" /><div><div className="dr-name">Dr. Yuki Tanaka</div><div className="dr-loc">Tokyo, Japan</div><span className="dr-badge">Endodontist</span></div></div><p className="dr-text">Root canal files hold up beautifully without fracture risks. Exceptional quality control and documentation support.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/73.jpg" alt="Dr. Khalid" /><div><div className="dr-name">Dr. Khalid Mansour</div><div className="dr-loc">Riyadh, KSA</div><span className="dr-badge">Oral Surgeon</span></div></div><p className="dr-text">Bone chisels and elevators are exceptionally well balanced. Reduced hand fatigue significantly during long procedures.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/82.jpg" alt="Dr. Laura" /><div><div className="dr-name">Dr. Laura Bianchi</div><div className="dr-loc">Milan, Italy</div><span className="dr-badge">Oral Surgeon</span></div></div><p className="dr-text">Packaging and sterilization documentation meet EU MDR standards without any extra hassle. Highly recommended supplier.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              {/* SET B — exact duplicate for seamless loop */}
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" /><div><div className="dr-name">Dr. James Harper</div><div className="dr-loc">New York, USA</div><span className="dr-badge">Orthodontist</span></div></div><p className="dr-text">The extracting forceps are on par with German-branded equivalents. Passivation holds up perfectly over countless autoclave cycles.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" /><div><div className="dr-name">Dr. Sofia Müller</div><div className="dr-loc">Berlin, Germany</div><span className="dr-badge">Periodontist</span></div></div><p className="dr-text">Outstanding durability on periodontal scalers. Ergonomic design reduces strain and tips retain sharpness perfectly.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/55.jpg" alt="" /><div><div className="dr-name">Dr. Arjun Mehta</div><div className="dr-loc">Mumbai, India</div><span className="dr-badge">Prosthodontist</span></div></div><p className="dr-text">Very responsive team. Custom laser engraving setup is neat. Shipping from Sialkot to Mumbai takes under 5 days.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/68.jpg" alt="" /><div><div className="dr-name">Dr. Yuki Tanaka</div><div className="dr-loc">Tokyo, Japan</div><span className="dr-badge">Endodontist</span></div></div><p className="dr-text">Root canal files hold up beautifully without fracture risks. Exceptional quality control and documentation support.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/73.jpg" alt="" /><div><div className="dr-name">Dr. Khalid Mansour</div><div className="dr-loc">Riyadh, KSA</div><span className="dr-badge">Oral Surgeon</span></div></div><p className="dr-text">Bone chisels and elevators are exceptionally well balanced. Reduced hand fatigue significantly during long procedures.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/82.jpg" alt="" /><div><div className="dr-name">Dr. Laura Bianchi</div><div className="dr-loc">Milan, Italy</div><span className="dr-badge">Oral Surgeon</span></div></div><p className="dr-text">Packaging and sterilization documentation meet EU MDR standards without any extra hassle. Highly recommended supplier.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
            </div>
          </div>

          {/* ROW 2: right → left */}
          <div className="dr-outer row2 mt-4">
            <div className="dr-track">
              {/* SET A */}
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/41.jpg" alt="Dr. Ahmed" /><div><div className="dr-name">Dr. Ahmed Al-Rashid</div><div className="dr-loc">Dubai, UAE</div><span className="dr-badge">Implantologist</span></div></div><p className="dr-text">Implant kits with high mechanical accuracy. Joint tolerances are precise, reducing micro-movements during surgery.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/56.jpg" alt="Dr. Priya" /><div><div className="dr-name">Dr. Priya Sharma</div><div className="dr-loc">Bangalore, India</div><span className="dr-badge">Cosmetic Dentist</span></div></div><p className="dr-text">The dental pliers have robust hinges and high grip alignment. Essential instruments for orthodontic wire bend procedures.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/62.jpg" alt="Dr. Francois" /><div><div className="dr-name">Dr. François Dupont</div><div className="dr-loc">Paris, France</div><span className="dr-badge">Periodontist</span></div></div><p className="dr-text">Autoclave compliance and material reports were provided cleanly. Excellent regulatory support for international import.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/72.jpg" alt="Dr. Mei" /><div><div className="dr-name">Dr. Mei Lin Chen</div><div className="dr-loc">Shanghai, China</div><span className="dr-badge">Orthodontist</span></div></div><p className="dr-text">Highly corrosion resistant and clean finish. Suture scissors slice smoothly without pulling skin tissue.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/88.jpg" alt="Dr. Carlos" /><div><div className="dr-name">Dr. Carlos Rivera</div><div className="dr-loc">Mexico City, Mexico</div><span className="dr-badge">Endodontist</span></div></div><p className="dr-text">Mirror polished handles look professional and resist tarnish. Our patients notice the quality of our instruments immediately.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/91.jpg" alt="Dr. Aisha" /><div><div className="dr-name">Dr. Aisha Okonkwo</div><div className="dr-loc">Lagos, Nigeria</div><span className="dr-badge">Prosthodontist</span></div></div><p className="dr-text">Fast international shipping, easy reorder, and competitive pricing make this our go-to supplier for the whole clinic chain.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              {/* SET B — exact duplicate for seamless loop */}
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/41.jpg" alt="" /><div><div className="dr-name">Dr. Ahmed Al-Rashid</div><div className="dr-loc">Dubai, UAE</div><span className="dr-badge">Implantologist</span></div></div><p className="dr-text">Implant kits with high mechanical accuracy. Joint tolerances are precise, reducing micro-movements during surgery.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/56.jpg" alt="" /><div><div className="dr-name">Dr. Priya Sharma</div><div className="dr-loc">Bangalore, India</div><span className="dr-badge">Cosmetic Dentist</span></div></div><p className="dr-text">The dental pliers have robust hinges and high grip alignment. Essential instruments for orthodontic wire bend procedures.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/62.jpg" alt="" /><div><div className="dr-name">Dr. François Dupont</div><div className="dr-loc">Paris, France</div><span className="dr-badge">Periodontist</span></div></div><p className="dr-text">Autoclave compliance and material reports were provided cleanly. Excellent regulatory support for international import.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/72.jpg" alt="" /><div><div className="dr-name">Dr. Mei Lin Chen</div><div className="dr-loc">Shanghai, China</div><span className="dr-badge">Orthodontist</span></div></div><p className="dr-text">Highly corrosion resistant and clean finish. Suture scissors slice smoothly without pulling skin tissue.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/men/88.jpg" alt="" /><div><div className="dr-name">Dr. Carlos Rivera</div><div className="dr-loc">Mexico City, Mexico</div><span className="dr-badge">Endodontist</span></div></div><p className="dr-text">Mirror polished handles look professional and resist tarnish. Our patients notice the quality of our instruments immediately.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
              <div className="dr-card" aria-hidden="true"><div className="dr-top"><img className="dr-avatar" src="https://randomuser.me/api/portraits/women/91.jpg" alt="" /><div><div className="dr-name">Dr. Aisha Okonkwo</div><div className="dr-loc">Lagos, Nigeria</div><span className="dr-badge">Prosthodontist</span></div></div><p className="dr-text">Fast international shipping, easy reorder, and competitive pricing make this our go-to supplier for the whole clinic chain.</p><div className="dr-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div></div>
            </div>
          </div>
        </section>

        {/* ─── 8. TILT FEATURE MARQUEE BANNER STRIP ─────────────────── */}
        <section className="mb-wrap mt-10">
          <div className="mb-strip">
            <div className="mb-fade-l"></div>
            <div className="mb-fade-r"></div>
            <div className="mb-track">
              <div className="mb-item"><span className="mb-icon">✚</span><span>FDA Registered Manufacturing</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>AISI 410 German Alloys</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Signature Replacement Guarantee</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>CE Declaration of Conformity</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Global DHL &amp; FedEx Cargo</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Laser Engraved Custom Branding</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Boil-Tested Passivated Surfaces</span></div>

              {/* Loop Duplicate */}
              <div className="mb-item"><span className="mb-icon">✚</span><span>FDA Registered Manufacturing</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>AISI 410 German Alloys</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Signature Replacement Guarantee</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>CE Declaration of Conformity</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Global DHL &amp; FedEx Cargo</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Laser Engraved Custom Branding</span></div>
              <div className="mb-item"><span className="mb-icon">✚</span><span>Boil-Tested Passivated Surfaces</span></div>
            </div>
          </div>
        </section>

        {/* ─── 9. HERO INQUIRY BOOKING FORM ─────────────────────────── */}
        <section className="hero-booking mt-14" id="inquiry">
          <div className="hero-booking-bg"></div>

          {/* Animated 4-Point Stars */}
          <div className="star star-tl">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0 C16 0 17 10 16 16 C15 10 16 0 16 0Z" fill="white" />
              <path d="M32 16 C32 16 22 17 16 16 C22 15 32 16 32 16Z" fill="white" />
              <path d="M16 32 C16 32 15 22 16 16 C17 22 16 32 16 32Z" fill="white" />
              <path d="M0 16 C0 16 10 15 16 16 C10 17 0 16 0 16Z" fill="white" />
              <circle cx="16" cy="16" r="2.5" fill="white" />
            </svg>
          </div>
          <div className="star star-tr">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0 C16 0 17 10 16 16 C15 10 16 0 16 0Z" fill="white" />
              <path d="M32 16 C32 16 22 17 16 16 C22 15 32 16 32 16Z" fill="white" />
              <path d="M16 32 C16 32 15 22 16 16 C17 22 16 32 16 32Z" fill="white" />
              <path d="M0 16 C0 16 10 15 16 16 C10 17 0 16 0 16Z" fill="white" />
              <circle cx="16" cy="16" r="2.5" fill="white" />
            </svg>
          </div>
          <div className="star star-bl">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0 C16 0 17 10 16 16 C15 10 16 0 16 0Z" fill="white" />
              <path d="M32 16 C32 16 22 17 16 16 C22 15 32 16 32 16Z" fill="white" />
              <path d="M16 32 C16 32 15 22 16 16 C17 22 16 32 16 32Z" fill="white" />
              <path d="M0 16 C0 16 10 15 16 16 C10 17 0 16 0 16Z" fill="white" />
              <circle cx="16" cy="16" r="2.5" fill="white" />
            </svg>
          </div>
          <div className="star star-br">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0 C16 0 17 10 16 16 C15 10 16 0 16 0Z" fill="white" />
              <path d="M32 16 C32 16 22 17 16 16 C22 15 32 16 32 16Z" fill="white" />
              <path d="M16 32 C16 32 15 22 16 16 C17 22 16 32 16 32Z" fill="white" />
              <path d="M0 16 C0 16 10 15 16 16 C10 17 0 16 0 16Z" fill="white" />
              <circle cx="16" cy="16" r="2.5" fill="white" />
            </svg>
          </div>

          <div className="hero-inner-booking">
            {/* LEFT TEXT */}
            <div className="hero-booking-left">
              <h1>
                Experience<br />
                Excellence with<br />
                <span className="highlight">Modern Alloys.</span>
              </h1>
              <p>Advance and enhance clinical procedures with cutting-edge surgical solutions and expert precision forged directly to order.</p>
              <div className="flex gap-3 mt-6">
                <a href="tel:+923001234567" className="btn-book cursor-pointer">
                  <Phone className="h-4 w-4" /> Call Factory
                </a>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="hero-booking-card">
              <h2>Have questions?<br />Get in touch!</h2>
              {inquiryStatus === 'success' ? (
                <div className="py-10 text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 font-display">Inquiry Registered</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">We have logged your query. Our trade representative will email you back within 24 hours.</p>
                  <button onClick={() => setInquiryStatus('idle')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer mt-2">Submit Another</button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="hf-group">
                    <input
                      className="hf-input"
                      type="text"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      className="hf-input"
                      type="email"
                      placeholder="Your Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      className="hf-input"
                      type="tel"
                      placeholder="WhatsApp / Phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                      className="hf-input"
                      type="text"
                      placeholder="Clinic / Organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                    <select
                      className="hf-select"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option>General Consultation</option>
                      <option>Composite Filling Tools Query</option>
                      <option>Excavators Query</option>
                      <option>Gingival Cord packers Query</option>
                      <option>Other / General Inquiry</option>
                    </select>
                    <div className="hf-icon-wrap">
                      <input
                        className="hf-input"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                      <span className="hf-ico">📅</span>
                    </div>
                  </div>
                  <button type="submit" disabled={inquiryStatus === 'submitting'} className="hf-submit cursor-pointer">
                    {inquiryStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
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
