'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils';
import { Upload, X, Plus, Trash2, Save, Loader2, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
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

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Composite Filling Tools');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Material', value: 'AISI 410 German Stainless Steel' },
    { key: 'Warranty', value: 'Signature Guarantee' },
  ]);
  const [featureBullets, setFeatureBullets] = useState<string[]>(DEFAULT_BULLETS);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      setError(err.message || 'Image upload failed. Ensure the product-images bucket is public.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !sku || !priceUsd || !description) {
      setError('Please fill in all required fields.');
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
      product_type: productType.trim(),
      size: size.trim(),
      tags: tagsArray,
      feature_bullets: featureBullets.filter(b => b.trim()),
      price_usd: parseFloat(priceUsd),
      image_url: imageUrl, is_featured: isFeatured, stock_status: stockStatus,
      specifications: specificationsObj,
      slug: slugify(name.trim()),
    };
    try {
      if (initialData?.id) {
        const { error: e } = await supabase.from('products').update(payload).eq('id', initialData.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('products').insert([payload]);
        if (e) throw e;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full h-10 rounded-xl border border-border-slate bg-slate-50 px-3.5 text-xs placeholder-slate-300 focus:border-accent-blue focus:bg-white focus:outline-none transition-all";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">

      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Name + SKU */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product Name *</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cryer Forceps (150)" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>SKU Code *</label>
          <input type="text" required value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. PD-FORCEPS-150" className={fieldClass} />
        </div>
      </div>

      {/* Row 2: Category + Type */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={fieldClass + " font-medium"}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Product Type</label>
          <input type="text" value={productType} onChange={e => setProductType(e.target.value)} placeholder="e.g. Surgical Set, Hand Instrument" className={fieldClass} />
        </div>
      </div>

      {/* Row 3: Size + Stock Status */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Size</label>
          <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. Standard, Large, Different sizes available" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Stock Status *</label>
          <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className={fieldClass + " font-medium"}>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="contact_for_availability">Contact for Availability</option>
          </select>
        </div>
      </div>

      {/* Row 4: Price + Tags */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price USD (International) *</label>
          <input type="number" required min="0" step="0.01" value={priceUsd} onChange={e => setPriceUsd(e.target.value)} placeholder="48.00" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. Forceps, Surgical, Premium" className={fieldClass} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          required rows={3} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Describe the instrument, material grade, and clinical application..."
          className="w-full rounded-xl border border-border-slate bg-slate-50 px-3.5 py-3 text-xs placeholder-slate-300 focus:border-accent-blue focus:bg-white focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className={labelClass}>Product Image</label>
        {imageUrl ? (
          <div className="flex items-center gap-4 p-3.5 rounded-xl border border-border-slate bg-slate-50">
            <img src={imageUrl} alt="preview" className="h-16 w-16 object-contain rounded-lg border border-slate-200 bg-white" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-700">Image Uploaded Successfully</p>
              <button type="button" onClick={() => setImageUrl('')} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" /> Delete Image
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors">
            {uploadingImage ? (
              <><Loader2 className="h-6 w-6 text-accent-blue animate-spin mb-1" /><span className="text-xs text-slate-400 font-semibold">Uploading to Supabase...</span></>
            ) : (
              <><Upload className="h-6 w-6 text-slate-300 mb-1.5" /><span className="text-xs text-slate-500 font-semibold">Select instrument image file</span><span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP (Max 5MB)</span></>
            )}
            <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Feature Bullets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + ' mb-0'}>Feature Bullets (shown on product page)</label>
          <button type="button" onClick={() => setFeatureBullets([...featureBullets, ''])} className="flex items-center gap-1 text-xs font-bold text-accent-blue hover:text-accent-blue-hover cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add Bullet
          </button>
        </div>
        <div className="space-y-2">
          {featureBullets.map((bullet, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={bullet} onChange={e => { const u = [...featureBullets]; u[i] = e.target.value; setFeatureBullets(u); }} placeholder="e.g. Precision Engineering" className="flex-1 h-9 rounded-xl border border-border-slate bg-slate-50 px-3.5 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all" />
              {featureBullets.length > 1 && (
                <button type="button" onClick={() => setFeatureBullets(featureBullets.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + ' mb-0'}>Specifications & Parameters</label>
          <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="flex items-center gap-1 text-xs font-bold text-accent-blue hover:text-accent-blue-hover cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Add Attribute
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={s.key} onChange={e => { const u = [...specs]; u[i].key = e.target.value; setSpecs(u); }} placeholder="e.g. Material" className="w-2/5 h-9 rounded-xl border border-border-slate bg-slate-50 px-3.5 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all font-semibold" />
              <input type="text" value={s.value} onChange={e => { const u = [...specs]; u[i].value = e.target.value; setSpecs(u); }} placeholder="e.g. AISI 410 Steel" className="flex-1 h-9 rounded-xl border border-border-slate bg-slate-50 px-3.5 text-xs focus:border-accent-blue focus:bg-white focus:outline-none transition-all" />
              {specs.length > 1 && (
                <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-accent-blue focus:ring-accent-blue cursor-pointer" />
        <span className="text-xs font-bold text-slate-700">Display on homepage feature grid</span>
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} disabled={saving} className="h-10 px-4 rounded-xl border border-border-slate text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={saving || uploadingImage} className="h-10 px-5 rounded-xl bg-primary-ocean text-white text-xs font-semibold hover:bg-primary-ocean-hover transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs">
          {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Listing…</> : <><Save className="h-3.5 w-3.5" /> Save Instrument</>}
        </button>
      </div>
    </form>
  );
}
