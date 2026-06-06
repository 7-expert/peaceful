import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight, Award, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">About Our Company</span>
          </div>

          <div className="space-y-10">

            {/* Introduction block */}
            <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Global Sourcing</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-ocean font-display mt-2">
                  Our Legacy of Precision
                </h1>
                <p className="text-sm text-muted-slate mt-2">Since 1998, shaping steel with clinical responsibility.</p>
              </div>

              <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                  <strong>Peaceful Dental Solutions</strong> was founded with a clear directive: to design and deliver premium, high-integrity dental surgical instruments directly from the manufacturing floor to the clinician's hand.
                </p>
                <p>
                  Rooted in Sialkot, Pakistan—the globally recognized epicenter of medical manufacturing—we bridge the gap between traditional metallurgical mastery and strict modern safety directives. By controlling our casting, tempering, and passivation lines internally, we ensure every claw, hinge, and insert performs exactly when needed.
                </p>
              </div>
            </div>

            {/* Core Values grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <Heart className="h-6 w-6 text-accent-blue" />,
                  title: "Clinical Focus",
                  desc: "Every tip angle is custom-calibrated to reduce tissue trauma and increase extraction leverage."
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-accent-blue" />,
                  title: "Materials Integrity",
                  desc: "We buy only certified AISI surgical steel, tested chemically for carbon and chromium balance."
                },
                {
                  icon: <Award className="h-6 w-6 text-accent-blue" />,
                  title: "Global Supply",
                  desc: "Trusted by importers, public hospitals, and private clinics in over 45 countries worldwide."
                }
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white border border-border-slate p-6 rounded-2xl space-y-3 shadow-xs">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    {icon}
                  </div>
                  <h3 className="text-sm font-bold text-primary-ocean font-display">{title}</h3>
                  <p className="text-xs text-muted-slate leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Mission Panel */}
            <div className="bg-primary-ocean text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-md">
              <div className="absolute right-0 bottom-0 h-48 w-48 bg-sky-600 rounded-full filter blur-3xl opacity-20"></div>
              <div className="max-w-xl space-y-4 relative z-10">
                <h2 className="text-2xl font-bold font-display">The Metallurgy Promise</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We understand that a dental instrument is an extension of a doctor's hand. That is why we refuse to use inferior recycled steels or skip chemical passivation. We commit to replacing any tool that fails to meet your high standard.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
