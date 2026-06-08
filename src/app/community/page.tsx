import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-[100px] pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display">
            Our Community
          </h1>
          <p className="text-lg text-slate-600">
            Join thousands of dental professionals worldwide who trust Peaceful Dental Solutions.
          </p>

          <div className="mt-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Connect With Us</h2>
            <p className="text-slate-600 mb-8">
              Stay updated with our latest instrument releases, industry events, and exclusive offers. Follow us on our social channels or join our professional network.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="#" className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-colors">
                <span className="font-semibold text-slate-800">LinkedIn Network</span>
              </a>
              <a href="#" className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-colors">
                <span className="font-semibold text-slate-800">Instagram Gallery</span>
              </a>
              <a href="#" className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-colors">
                <span className="font-semibold text-slate-800">Facebook Page</span>
              </a>
              <a href="#" className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-colors">
                <span className="font-semibold text-slate-800">Twitter Updates</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
