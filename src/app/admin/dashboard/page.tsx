'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import ProductForm from '../../../components/admin/ProductForm';
import { Plus, Edit3, Trash2, LogOut, Search, Loader2, Package, Star, AlertCircle, ArrowLeft, ClipboardList, MailOpen } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries'>('products');

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [inquirySearch, setInquirySearch] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!s) router.push('/admin/login');
      else setSession(s);
      setLoadingSession(false);
    }
    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoadingProducts(false);
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    setInquiries(data || []);
    setLoadingInquiries(false);
  };

  useEffect(() => {
    if (session) {
      fetchProducts();
      fetchInquiries();
    }
  }, [session]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleInquiryDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    await supabase.from('inquiries').delete().eq('id', id);
    fetchInquiries();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    fetchInquiries();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(i =>
    i.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
    (i.organization && i.organization.toLowerCase().includes(inquirySearch.toLowerCase())) ||
    i.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
    (i.product_sku && i.product_sku.toLowerCase().includes(inquirySearch.toLowerCase()))
  );

  if (loadingSession) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Header bar */}
      <header className="bg-white border-b border-border-slate sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors p-1" title="Back to site">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-9 w-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center p-1">
              <Image src="/logo.svg" alt="Peaceful Dental Solutions Logo" width={24} height={24} className="object-contain" />
            </div>
            <div>
              <div className="text-sm font-bold text-primary-ocean font-display">Staff Control Panel</div>
              <div className="text-[10px] text-slate-400 font-semibold">{session?.user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Instruments', value: products.length, icon: <Package className="h-5 w-5 text-accent-blue" />, bg: 'bg-sky-50' },
            { label: 'Pending Inquiries', value: inquiries.filter(i => i.status === 'pending').length, icon: <MailOpen className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-50' },
            { label: 'Out of Stock Items', value: products.filter(p => p.stock_status === 'out_of_stock').length, icon: <AlertCircle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
          ].map(({ label, value, icon, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-border-slate p-6 flex items-center gap-4 shadow-xs">
              <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
                <div className="text-2xl font-extrabold text-primary-ocean font-display mt-0.5">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Control */}
        <div className="flex border-b border-border-slate gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold font-display border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Instruments Directory ({products.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-sm font-bold font-display border-b-2 px-1 transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Bulk Inquiries Log ({inquiries.length})
            </span>
          </button>
        </div>

        {/* Tab 1: Products Registry */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-border-slate overflow-hidden shadow-xs">
            {/* Table Header controls */}
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Filter by SKU, name, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-64 rounded-xl border border-border-slate bg-slate-50 pl-10 pr-3 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              </div>
              <button
                onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-primary-ocean text-white text-xs font-semibold hover:bg-primary-ocean-hover transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Instrument
              </button>
            </div>

            {/* Table */}
            {loadingProducts ? (
              <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
                <span>Querying product registry...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">
                {searchTerm ? 'No products matched your dashboard filter.' : 'Your instrument registry is empty. Add your first item.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="px-6 py-4">Instrument Specification</th>
                      <th className="px-6 py-4">SKU Code</th>
                      <th className="px-6 py-4">Category Group</th>
                      <th className="px-6 py-4 text-right">Price (USD)</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                              {p.image_url
                                ? <img src={p.image_url} alt={p.name} className="object-contain max-h-full max-w-full" />
                                : <span className="text-[9px] text-slate-300 font-semibold">Blank</span>
                              }
                            </div>
                            <span className="font-bold text-primary-ocean font-display line-clamp-1">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 font-semibold">{p.sku}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{p.category}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-700">${p.price_usd}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.stock_status === 'in_stock'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {p.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                              className="h-8 w-8 flex items-center justify-center rounded-xl border border-border-slate text-slate-400 hover:text-accent-blue hover:border-accent-blue/30 hover:bg-white transition-all cursor-pointer shadow-xs"
                              title="Edit details"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="h-8 w-8 flex items-center justify-center rounded-xl border border-border-slate text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-white transition-all cursor-pointer shadow-xs"
                              title="Delete instrument"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inquiries Log */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-border-slate overflow-hidden shadow-xs">
            {/* Table Header controls */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Filter inquiries by name, contact, SKU..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="h-10 w-80 rounded-xl border border-border-slate bg-slate-50 pl-10 pr-3 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Table */}
            {loadingInquiries ? (
              <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
                <span>Syncing bulk inquiries log...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">
                {inquirySearch ? 'No inquiries matched your search criteria.' : 'No bulk quote requests received yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="px-6 py-4">Sender Info</th>
                      <th className="px-6 py-4">Contact Details</th>
                      <th className="px-6 py-4">Interest Target</th>
                      <th className="px-6 py-4">Requirements message</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors align-top">
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary-ocean font-display">{inq.name}</div>
                          {inq.organization && (
                            <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">{inq.organization}</div>
                          )}
                          <div className="text-[9px] text-slate-400 font-mono mt-1">
                            {new Date(inq.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 space-y-0.5 font-medium text-slate-600">
                          <div>{inq.email}</div>
                          <div>{inq.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          {inq.product_sku ? (
                            <div className="space-y-1">
                              <span className="font-mono bg-sky-50 border border-sky-100 px-2 py-0.5 rounded text-accent-blue font-bold">
                                {inq.product_sku}
                              </span>
                              <div className="text-[10px] text-slate-400 font-semibold">Qty: {inq.quantity} units</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">General Catalog Quote</span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-slate-500 whitespace-pre-wrap leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                            {inq.message}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-full border focus:outline-none ${
                              inq.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : inq.status === 'contacted'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleInquiryDelete(inq.id)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-border-slate text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-white transition-all cursor-pointer shadow-xs"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal dialog wrapper */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-border-slate shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary-ocean font-display">
                {editingProduct ? 'Update Instrument Parameters' : 'Add New Instrument'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                initialData={editingProduct}
                onSuccess={() => { setIsFormOpen(false); setEditingProduct(null); fetchProducts(); }}
                onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
