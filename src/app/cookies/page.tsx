import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ChevronRight, Cookie } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow py-12 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-semibold">Cookie Policy</span>
          </div>

          <div className="bg-white rounded-3xl border border-border-slate p-8 md:p-12 shadow-sm space-y-6">

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">Browser Tracking</span>
              <h1 className="text-3xl font-extrabold text-primary-ocean font-display mt-2">
                Cookie Policy
              </h1>
              <p className="text-xs text-slate-400 mt-2">Last updated: June 4, 2026</p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 flex gap-3 items-start text-sm text-slate-600">
              <Cookie className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" />
              <p>
                <strong>Peaceful Dental Solutions</strong> uses a minimal set of browser cookies strictly for functional and localization purposes. We do not use third-party advertising or tracking cookies.
              </p>
            </div>

            <div className="text-sm text-slate-600 space-y-5 leading-relaxed">
              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored by your web browser when you visit a website. They allow the website to remember your preferences and settings during and between sessions.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">2. Cookies We Use</h2>
              <div className="rounded-2xl border border-border-slate overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">Cookie Name</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">Purpose</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-mono text-accent-blue font-semibold">pds_market</td>
                      <td className="px-4 py-3 text-slate-600">Stores your selected market preference (Pakistan / International) and currency display (PKR / USD).</td>
                      <td className="px-4 py-3 text-slate-500">30 days</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-accent-blue font-semibold">pds_session</td>
                      <td className="px-4 py-3 text-slate-600">Maintains your authenticated admin session when logged into the staff control panel.</td>
                      <td className="px-4 py-3 text-slate-500">Session only</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-mono text-accent-blue font-semibold">sb-auth-token</td>
                      <td className="px-4 py-3 text-slate-600">Supabase authentication token used for secure admin login sessions. Not accessible via JavaScript.</td>
                      <td className="px-4 py-3 text-slate-500">1 hour / refresh</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">3. No Third-Party Tracking</h2>
              <p>
                We do not use Google Analytics, Facebook Pixel, or any third-party advertising or behavioral tracking scripts. Your browsing activity on our site is not shared with any external marketing platform.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">4. How to Control Cookies</h2>
              <p>
                You can configure your browser to block or delete cookies at any time. Note that blocking the <code className="text-accent-blue font-semibold bg-sky-50 px-1 rounded">pds_market</code> cookie will cause the site to ask for your regional preference on every visit. Blocking <code className="text-accent-blue font-semibold bg-sky-50 px-1 rounded">sb-auth-token</code> will prevent admin panel login.
              </p>
              <p>
                Instructions for managing cookies vary by browser: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-accent-blue hover:underline font-semibold">Chrome</a> · <a href="https://support.mozilla.org/en-US/kb/block-websites-storing-cookies-site-data-firefox" target="_blank" rel="noopener" className="text-accent-blue hover:underline font-semibold">Firefox</a> · <a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener" className="text-accent-blue hover:underline font-semibold">Safari</a>.
              </p>

              <h2 className="text-lg font-bold text-primary-ocean font-display pt-2">5. Contact Us</h2>
              <p>
                Questions about our cookie practices? Contact our compliance team at{' '}
                <a href="mailto:compliance@peacefuldentalsolutions.com" className="text-accent-blue hover:underline font-semibold">
                  compliance@peacefuldentalsolutions.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
