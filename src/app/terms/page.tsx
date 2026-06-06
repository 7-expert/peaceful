import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Terms of Service</span>
          </div>

          <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Regulatory Agreement</span>
              <h1 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-400 mt-2">Last updated: June 4, 2026</p>
            </div>

            <div className="prose prose-slate text-sm text-slate-600 space-y-5 leading-relaxed">
              <p>
                Welcome to the website of <strong>Peaceful Dental Solutions</strong>. By accessing our catalog, registering an account, or submitting wholesale quote requests, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">1. Scope & Manufacturing Terms</h2>
              <p>
                All dental surgical instruments listed in our registry are manufactured under ISO 13485 medical device protocols. Specifications, dimensions, and alloy concentrations are subject to a nominal production tolerance of ±0.05mm.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">2. Quote Requests & Pricing</h2>
              <p>
                Any quote generated via our digital pro-forma portal is informational and does not constitute a legally binding sales contract. Custom pricing sheets are valid for 30 calendar days from the date of email dispatch, unless specified otherwise.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">3. Shipping & Import Duties</h2>
              <p>
                For international trade routes (USD), deliveries are routed Ex-Works (EXW) or Free on Board (FOB) via DHL Express or FedEx unless alternative Bill of Lading conditions are established. The buyer is responsible for importing clearance and state-specific customs declarations.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">4. 5-Year Replacement Warranty</h2>
              <p>
                Our 5-year replacement guarantee covers structural manufacturing defects, material stress cracks, and corrosion when autoclaved under manufacturer instructions (up to 134°C). The warranty does not cover aesthetic wear, misalignment due to drop impact, or modifications by third parties.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">5. Governing Law</h2>
              <p>
                These terms are governed by the laws of Pakistan. Any legal disputes arising from wholesale transactions will be settled in the competent courts of Lahore or Sialkot.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
