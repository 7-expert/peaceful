import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Privacy Policy</span>
          </div>

          <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Data Protection</span>
              <h1 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400 mt-2">Last updated: June 4, 2026</p>
            </div>

            <div className="prose prose-slate text-sm text-slate-600 space-y-5 leading-relaxed">
              <p>
                At <strong>Peaceful Dental Solutions</strong>, we value the trust you place in our medical supply systems. This Privacy Policy details how we collect, process, and protect client information submitted via our quote registry.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">1. Information We Collect</h2>
              <p>
                When you initiate a pro-forma bulk inquiry or register a clinical profile, we collect details including your name, organization name, telephone contact, email address, shipping market preference, and transaction logs.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">2. How We Use Your Data</h2>
              <p>
                We use collected information to generate pro-forma pricing metrics, verify shipping protocols with logistics brokers (DHL/FedEx), issue compliance documentation, and process staff authorizations on the dashboard.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">3. Storage & Security</h2>
              <p>
                Your personal details, organization logs, and transactional records are securely stored on encrypted PostgreSQL databases managed by Supabase. We do not sell or rent customer data to third-party marketing networks.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">4. Cookies & Localization</h2>
              <p>
                We utilize cookies to store your preferred currency (PKR vs USD) and region (Pakistan vs International) for Geo-IP compliance. You can reset these preferences at any time from the navigation bar.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">5. Your Data Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your registered organization records at any time by emailing us at <code className="text-accent-blue font-semibold">compliance@peacefuldentalsolutions.com</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
