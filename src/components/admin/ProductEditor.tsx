'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils';
import { Upload, X, Plus, Trash2, Save, Loader2, AlertCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductEditorProps {
  initialData?: any;
}

const CATEGORIES = ['Composite Filling Tools', 'Excavators', 'Gingival Cord packers'];

const DEFAULT_BULLETS = [
  'Precision Engineering',
  'Ergonomic Design',
  'High-Quality Materials',
  'ISO-Certified',
  'Lightweight Construction',
  'Signature Guarantee',
];

export default function ProductEditor({ initialData }: ProductEditorProps) {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Composite Filling Tools');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [tags, setTags] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Material', value: 'Stainless Steel' },
    { key: 'Warranty', value: 'Signature Guarantee' },
  ]);
  const [featureBullets, setFeatureBullets] = useState<string[]>(DEFAULT_BULLETS);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Accordion states for sidebar panels
  const [panels, setPanels] = useState({
    publish: true,
    data: true,
    categories: true,
    image: true,
    gallery: true,
  });

  const togglePanel = (panel: keyof typeof panels) => {
    setPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name || '');
    setSku(initialData.sku || '');
    setCategory(initialData.category || 'Composite Filling Tools');
    setProductType(initialData.product_type || '');
    setSize(initialData.size || '');
    setTags(initialData.tags ? initialData.tags.join(', ') : '');
    setDescription(initialData.description || '');
    setPriceUsd(initialData.price_usd?.toString() || '');
    setImageUrl(initialData.image_url || '');
    setIsFeatured(initialData.is_featured || false);
    setStockStatus(initialData.stock_status || 'in_stock');
    if (initialData.specifications) {
      const pairs = Object.entries(initialData.specifications).map(([k, v]) => ({ key: k, value: v as string }));
      setSpecs(pairs.length > 0 ? pairs : [{ key: '', value: '' }]);
    }
    if (initialData.feature_bullets && initialData.feature_bullets.length > 0) {
      setFeatureBullets(initialData.feature_bullets);
    }
    if (initialData.gallery_images && initialData.gallery_images.length > 0) {
      setGalleryImages(initialData.gallery_images);
    }
    if (initialData.short_description) {
      setShortDescription(initialData.short_description);
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `product-images/${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
      setImageUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError('');
    setUploadingGallery(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const path = `product-images/gallery-${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
        newUrls.push(publicUrl);
      }
      setGalleryImages(prev => [...prev, ...newUrls]);
    } catch (err: any) {
      setError(err.message || 'Gallery upload failed.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !sku || !priceUsd || !description || !shortDescription) {
      setError('Please fill in all required fields.');
      window.scrollTo(0, 0);
      return;
    }
    setSaving(true);
    const specificationsObj: Record<string, string> = {};
    specs.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) specificationsObj[key.trim()] = value.trim();
    });
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      sku: sku.trim(), name: name.trim(), category, description: description.trim(),
      short_description: shortDescription.trim(),
      product_type: productType.trim(),
      size: size.trim(),
      tags: tagsArray,
      feature_bullets: featureBullets.filter(b => b.trim()),
      price_usd: parseFloat(priceUsd),
      price_pkr: Math.round(parseFloat(priceUsd) * 280), // Approx calculation
      image_url: imageUrl, gallery_images: galleryImages, is_featured: isFeatured, stock_status: stockStatus,
      specifications: specificationsObj,
      slug: initialData?.slug || (slugify(name.trim()) + '-' + Math.random().toString(36).substring(2, 8)),
    };
    try {
      if (initialData?.id) {
        const { error: e } = await supabase.from('products').update(payload).eq('id', initialData.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('products').insert([payload]);
        if (e) throw e;
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  // Reusable panel component for the sidebar
  const Panel = ({ title, id, children }: { title: string, id: keyof typeof panels, children: React.ReactNode }) => (
    <div className="bg-white border border-slate-300 rounded-sm mb-4">
      <button 
        type="button"
        onClick={() => togglePanel(id)} 
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
      >
        <span>{title}</span>
        {panels[id] ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      {panels[id] && <div className="p-3.5 space-y-4">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-300 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center gap-4">
          <button onClick={() => router.push('/admin/dashboard')} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium text-slate-800 font-display">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN: Main content area */}
          <div className="flex-1 space-y-6">
            
            {/* Title */}
            <div>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Product Name" 
                className="w-full text-2xl px-4 py-3 border border-slate-300 rounded-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors placeholder-slate-400 font-medium"
              />
            </div>

            {/* Long Description Area (Simulated WordPress Editor Box) */}
            <div className="bg-white border border-slate-300 rounded-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Product Description</span>
              </div>
              <textarea
                required 
                rows={12} 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed description, clinical application..."
                className="w-full p-4 text-sm focus:outline-none focus:bg-slate-50 transition-colors resize-y"
              />
            </div>

            {/* Feature Bullets Box */}
            <div className="bg-white border border-slate-300 rounded-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Feature Highlights</span>
                <button type="button" onClick={() => setFeatureBullets([...featureBullets, ''])} className="text-xs text-accent-blue hover:underline font-medium">
                  + Add Item
                </button>
              </div>
              <div className="p-4 space-y-3">
                {featureBullets.map((bullet, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={bullet} onChange={e => { const u = [...featureBullets]; u[i] = e.target.value; setFeatureBullets(u); }} placeholder="e.g. Premium quality..." className={fieldClass} />
                    {featureBullets.length > 1 && (
                      <button type="button" onClick={() => setFeatureBullets(featureBullets.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Box */}
            <div className="bg-white border border-slate-300 rounded-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Technical Specifications</span>
                <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs text-accent-blue hover:underline font-medium">
                  + Add Specification
                </button>
              </div>
              <div className="p-4 space-y-3">
                {specs.map((s, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input type="text" value={s.key} onChange={e => { const u = [...specs]; u[i].key = e.target.value; setSpecs(u); }} placeholder="Property (e.g. Material)" className={`${fieldClass} w-1/3`} />
                    <input type="text" value={s.value} onChange={e => { const u = [...specs]; u[i].value = e.target.value; setSpecs(u); }} placeholder="Value (e.g. Stainless Steel)" className={`${fieldClass} flex-1`} />
                    {specs.length > 1 && (
                      <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Short Description */}
            <div className="bg-white border border-slate-300 rounded-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-700">Product Short Description</span>
              </div>
              <textarea
                required 
                rows={4} 
                value={shortDescription} 
                onChange={e => setShortDescription(e.target.value)}
                placeholder="Brief overview shown near the add to cart area..."
                className="w-full p-4 text-sm focus:outline-none focus:bg-slate-50 transition-colors resize-y"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar panels */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            
            {/* Publish Panel */}
            <Panel title="Publish" id="publish">
              <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
                <span>Status:</span>
                <span className="font-semibold text-slate-800">Published</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
                <button 
                  type="submit" 
                  disabled={saving || uploadingImage || uploadingGallery} 
                  className="bg-accent-blue hover:bg-accent-blue-hover text-white px-4 py-2 text-sm font-semibold rounded shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Publish'}
                </button>
              </div>
            </Panel>

            {/* Product Data Panel */}
            <Panel title="Product Data" id="data">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>SKU *</label>
                  <input type="text" required value={sku} onChange={e => setSku(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Regular Price (USD) *</label>
                  <input type="number" required min="0" step="0.01" value={priceUsd} onChange={e => setPriceUsd(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock Status</label>
                  <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className={fieldClass}>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of stock</option>
                    <option value="contact_for_availability">On backorder / Contact</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Product Type</label>
                  <input type="text" value={productType} onChange={e => setProductType(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Size Variants</label>
                  <input type="text" value={size} onChange={e => setSize(e.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={fieldClass} />
                </div>
                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="rounded text-accent-blue focus:ring-accent-blue" />
                  <span className="text-sm text-slate-700 font-medium">Feature on Homepage</span>
                </label>
              </div>
            </Panel>

            {/* Categories Panel */}
            <Panel title="Product Categories" id="categories">
              <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="text-accent-blue focus:ring-accent-blue" 
                    />
                    <span className="text-sm text-slate-700">{cat}</span>
                  </label>
                ))}
              </div>
            </Panel>

            {/* Product Image Panel */}
            <Panel title="Product Image" id="image">
              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative group rounded bg-slate-50 border border-slate-200 overflow-hidden">
                    <img src={imageUrl} alt="Product" className="w-full h-auto object-contain max-h-48" />
                  </div>
                  <button type="button" onClick={() => setImageUrl('')} className="text-xs text-red-600 hover:underline">
                    Remove product image
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-accent-blue hover:underline cursor-pointer">
                    {uploadingImage ? 'Uploading...' : 'Set product image'}
                    <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </Panel>

            {/* Product Gallery Panel */}
            <Panel title="Product Gallery" id="gallery">
              <div className="space-y-3">
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded border border-slate-200 bg-slate-50 overflow-hidden">
                        <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                          className="absolute top-0 right-0 bg-red-500/90 text-white p-0.5 rounded-bl hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="block text-sm text-accent-blue hover:underline cursor-pointer mt-2">
                  {uploadingGallery ? 'Uploading...' : 'Add product gallery images'}
                  <input type="file" accept="image/*" multiple disabled={uploadingGallery} onChange={handleGalleryUpload} className="hidden" />
                </label>
              </div>
            </Panel>

          </div>
        </form>
      </div>
    </div>
  );
}
