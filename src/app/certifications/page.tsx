import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight, FileText, Check, ShieldCheck } from 'lucide-react';

export default function Certifications() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[120px] pb-12 bg-slate-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Certifications & Standards</span>
          </div>

          <div className="space-y-10">

            {/* Header info */}
            <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Compliance Portfolio</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-ocean font-display mt-2">
                  Certified Medical Grade
                </h1>
                <p className="text-sm text-muted-slate mt-2">Validated regulatory compliance for imports into US, EU, and Asian markets.</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                All dental instruments produced under the <strong>Peaceful Dental Solutions</strong> label undergo standardized quality management checks. Below are our official certifications, audit sheets, and manufacturing codes.
              </p>
            </div>

            {/* Certifications list */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  code: "FDA Registration",
                  title: "US FDA Compliant",
                  body: "Registered facility under medical equipment establishment code #301140928, satisfying Class I surgical diagnostics.",
                  icon: <ShieldCheck className="h-5 w-5 text-accent-blue" />
                },
                {
                  code: "CE Marking",
                  title: "European CE Conformity",
                  body: "Declared compliant with EU health, safety, and environmental protection standard directives for active surgical tools.",
                  icon: <ShieldCheck className="h-5 w-5 text-accent-blue" />
                },
                {
                  code: "ISO 13485:2016",
                  title: "Medical Quality Systems",
                  body: "Audited QMS standards specifically tailored for medical device production lines, materials tracking, and cleanroom sterilizations.",
                  icon: <ShieldCheck className="h-5 w-5 text-accent-blue" />
                },
                {
                  code: "ISO 9001:2015",
                  title: "General Manufacturing Quality",
                  body: "Standardized QA protocols covering casting, forging, passivating, and packaging audits across all departments.",
                  icon: <ShieldCheck className="h-5 w-5 text-accent-blue" />
                }
              ].map((cert) => (
                <div key={cert.title} className="bg-white border border-border-slate p-6 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent-blue bg-sky-50 px-2 py-0.5 rounded-md font-mono">{cert.code}</span>
                    {cert.icon}
                  </div>
                  <h3 className="text-sm font-bold text-primary-ocean font-display">{cert.title}</h3>
                  <p className="text-xs text-muted-slate leading-relaxed">{cert.body}</p>
                </div>
              ))}
            </div>

            {/* Quality control block */}
            <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-10 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-primary-ocean font-display">Passivation and Boil Testing</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                To guarantee zero rusting during clinic autoclaving, random samples from every production run are subjected to a **100-minute boiling water test** and a **copper sulfate chemical immersion challenge**. Any sample showing pitting, staining, or oxidation immediately triggers a rebuild of the entire batch.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
