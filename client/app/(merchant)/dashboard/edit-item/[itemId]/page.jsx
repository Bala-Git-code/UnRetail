'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import {
  TAXONOMY,
  TECH_CONDITION_GRADES,
  getCategoryById,
  isTechCategory,
} from '@/lib/taxonomy';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Tag,
  Layers,
  Sparkles,
  X,
  ShieldCheck,
  Cpu,
  Lock,
  Trash2,
  Save,
  Clock,
  Loader2,
} from 'lucide-react';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId;

  // Basic Form States
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('L');
  const [era, setEra] = useState('90s');
  const [condition, setCondition] = useState('GENTLY_USED');
  const [status, setStatus] = useState('AVAILABLE');
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Tech Anti-Fraud States
  const [techConditionGrade, setTechConditionGrade] = useState('Grade A - Mint');
  const [powerOnStatus, setPowerOnStatus] = useState(true);
  const [screenSensorClarity, setScreenSensorClarity] = useState(true);
  const [portChargingTested, setPortChargingTested] = useState(true);
  const [knownDefectsReported, setKnownDefectsReported] = useState(false);
  const [knownDefectsDesc, setKnownDefectsDesc] = useState('');
  const [serialNumberImei, setSerialNumberImei] = useState('');

  const eras = ['70s', '80s', '90s', 'Y2K', 'Archival'];
  const apparelConditions = [
    { value: 'LIKE_NEW', label: 'Pristine / Like New' },
    { value: 'GENTLY_USED', label: 'Gently Loved' },
    { value: 'FLAWED', label: 'Vintage Character' },
  ];

  // Fetch Item Data & Verify Ownership
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        let currentUser = null;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('unretail_user');
          if (stored) currentUser = JSON.parse(stored);
        }

        const res = await apiClient.get(`/items/${itemId}`);
        if (res.data?.data) {
          const item = res.data.data;

          // Check if current user is owner or admin
          if (currentUser && item.shop?.ownerId) {
            if (currentUser.role !== 'ADMIN' && item.shop.ownerId !== currentUser.id) {
              setUnauthorized(true);
              setLoading(false);
              return;
            }
          }

          setTitle(item.title || '');
          setDescription(item.description || '');
          setPrice(item.price?.toString() || '');
          setCategory(item.category || 'Apparel');
          setSubcategory(item.subcategory || '');
          setBrand(item.brand || '');
          setSize(item.size || 'OS');
          setEra(item.era || '90s');
          setCondition(item.condition || 'GENTLY_USED');
          setStatus(item.status || 'AVAILABLE');
          setImages(item.images || []);

          if (item.techConditionGrade) setTechConditionGrade(item.techConditionGrade);
          if (item.powerOnStatus !== null && item.powerOnStatus !== undefined) setPowerOnStatus(item.powerOnStatus);
          if (item.screenSensorClarity !== null && item.screenSensorClarity !== undefined) setScreenSensorClarity(item.screenSensorClarity);
          if (item.portChargingTested !== null && item.portChargingTested !== undefined) setPortChargingTested(item.portChargingTested);
          if (item.knownDefectsReported !== null && item.knownDefectsReported !== undefined) setKnownDefectsReported(item.knownDefectsReported);
          if (item.knownDefectsDesc) setKnownDefectsDesc(item.knownDefectsDesc);
          if (item.serialNumberImei) setSerialNumberImei(item.serialNumberImei);
        }
      } catch (err) {
        console.error('Fetch item error:', err);
        setErrorMsg('Failed to load item details. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  const isTech = isTechCategory(category);
  const currentCategoryObj = getCategoryById(category) || TAXONOMY[0];

  // Dynamic subcategories sync
  useEffect(() => {
    if (currentCategoryObj && currentCategoryObj.subcategories?.length > 0) {
      const exists = currentCategoryObj.subcategories.some((s) => s.id === subcategory);
      if (!exists && !subcategory) {
        setSubcategory(currentCategoryObj.subcategories[0].id);
      }
    }
  }, [category, currentCategoryObj, subcategory]);

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setErrorMsg(null);

    try {
      const sigRes = await apiClient.get('/cloudinary/signature?folder=unretail-listings');
      const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data.data;

      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        setImages((prev) => [...prev, uploadData.secure_url]);
      } else {
        const fakeUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, fakeUrl]);
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback:', err);
      const localUrl = URL.createObjectURL(files[0]);
      setImages((prev) => [...prev, localUrl]);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Form Submit / Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!title.trim()) errors.title = 'Item title is required';
    if (!price || parseFloat(price) <= 0) errors.price = 'Please enter a valid price in INR';
    if (!category) errors.category = 'Category selection is required';

    if (isTech) {
      if (!serialNumberImei || serialNumberImei.trim() === '') {
        errors.serialNumberImei = 'Serial Number / IMEI is required for escrow protection';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMsg('Please resolve highlighted fields before saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({});
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        subcategory: subcategory || null,
        brand: brand.trim() || null,
        size,
        era,
        condition: isTech ? 'LIKE_NEW' : condition,
        status,
        images: images.length > 0 ? images : ['/images/denim_vintage.png'],
        ...(isTech && {
          techConditionGrade,
          powerOnStatus,
          screenSensorClarity,
          portChargingTested,
          knownDefectsReported,
          knownDefectsDesc: knownDefectsDesc.trim() || null,
          serialNumberImei: serialNumberImei.trim(),
        }),
      };

      const res = await apiClient.patch(`/items/${itemId}`, payload);
      if (res.data?.success) {
        setSuccessMsg('Listing details successfully updated!');
        setTimeout(() => {
          router.push('/dashboard/listings');
        }, 1000);
      }
    } catch (err) {
      console.error('Update item error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Item Handler
  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.delete(`/items/${itemId}`);
      if (res.data?.success) {
        setSuccessMsg('Product permanently deleted from your rack.');
        setShowDeleteConfirm(false);
        setTimeout(() => {
          router.push('/dashboard/listings');
        }, 900);
      }
    } catch (err) {
      console.error('Delete item error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to delete item. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (unauthorized) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Unauthorized Access</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          You cannot edit or delete this product because it belongs to another merchant boutique. You can only manage inventory listed under your own store.
        </p>
        <button
          onClick={() => router.push('/dashboard/listings')}
          className="mt-4 px-5 py-2.5 bg-neon-lime text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md"
        >
          Return to My Listings
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
        <p className="text-sm text-zinc-400">Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Rack Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Edit Boutique Listing
          </h1>
          <p className="text-xs text-zinc-400">
            Update pricing, descriptions, condition attributes, or remove this product from your inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3.5 py-2 transition-all font-semibold hover:bg-rose-500 hover:text-white"
          >
            <Trash2 className="w-4 h-4" /> Delete Item
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2 transition-colors font-medium hover:border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 text-neon-lime" /> Cancel
          </button>
        </div>
      </div>

      {/* Error & Success Alerts */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-neon-lime/10 border border-neon-lime/30 text-neon-lime p-4 rounded-xl text-xs flex items-center gap-3 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleUpdate} className="space-y-6 text-xs">
        {/* Section 1: Photos */}
        <div className="space-y-3 bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              1. Rack Photos *
            </label>
            <span className="text-[11px] text-zinc-500 font-medium">Add or remove product photos</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-square bg-zinc-950 border border-zinc-700/80 rounded-xl overflow-hidden group shadow-md"
              >
                <img src={imgUrl} alt="Listing" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/80 text-rose-400 p-1.5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className="aspect-square bg-zinc-900/60 border-2 border-dashed border-zinc-700 hover:border-neon-lime rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-all">
              <Camera className="w-6 h-6 text-zinc-400 group-hover:text-neon-lime mb-2 transition-colors" />
              <span className="text-[11px] text-zinc-300 font-medium group-hover:text-white">
                {uploadingImage ? 'Uploading...' : 'Upload Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Category & Subcategory */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              2. Parent Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TAXONOMY.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neon-lime/10 border-neon-lime text-white shadow-[0_0_16px_rgba(204,255,0,0.15)]'
                        : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${isSelected ? 'text-neon-lime' : 'text-white'}`}>
                          {cat.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-neon-lime shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              3. Subcategory *
            </label>
            <div className="flex flex-wrap gap-2">
              {currentCategoryObj.subcategories.map((sub) => {
                const isSubSelected = subcategory === sub.id;
                return (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => setSubcategory(sub.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSubSelected
                        ? 'bg-neon-lime text-black font-bold shadow-md shadow-neon-lime/20 scale-[1.02]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Tech Anti-Fraud (if tech) */}
        <AnimatePresence>
          {isTech && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-b from-cyan-950/30 via-zinc-950/80 to-zinc-950 border-2 border-cyan-500/40 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2.5 text-cyan-300">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Hardware Verification & Escrow Protection
                      </h3>
                      <p className="text-[11px] text-cyan-400/90">
                        Condition grade and diagnostic telemetry
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                    Functional Condition Grade *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TECH_CONDITION_GRADES.map((grade) => {
                      const isGradeSelected = techConditionGrade === grade.value;
                      return (
                        <button
                          type="button"
                          key={grade.value}
                          onClick={() => setTechConditionGrade(grade.value)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            isGradeSelected
                              ? 'bg-zinc-900 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold text-xs ${grade.badgeClass} px-2.5 py-0.5 rounded-full border`}>
                              {grade.label}
                            </span>
                            {isGradeSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed mt-1.5">
                            {grade.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Diagnostics */}
                <div className="space-y-2 bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={powerOnStatus}
                      onChange={(e) => setPowerOnStatus(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                    />
                    <span className="font-semibold text-white text-xs">Power-On & Boot Cycle Verification</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={screenSensorClarity}
                      onChange={(e) => setScreenSensorClarity(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                    />
                    <span className="font-semibold text-white text-xs">Screen, Sensor & Optical Clarity Inspection</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={portChargingTested}
                      onChange={(e) => setPortChargingTested(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                    />
                    <span className="font-semibold text-white text-xs">Port, Battery & Charging Circuit Test</span>
                  </label>
                </div>

                {/* Serial Number */}
                <div className="space-y-2">
                  <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Serial Number / IMEI (Private) *</span>
                  </label>
                  <input
                    type="text"
                    required={isTech}
                    value={serialNumberImei}
                    onChange={(e) => setSerialNumberImei(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 4: Title, Price & Status */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                Price (INR) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm tabular-nums focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>
          </div>

          {/* Brand & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Brand (Optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              >
                <option value="AVAILABLE">AVAILABLE (Active on Feed)</option>
                <option value="SOLD_OFFLINE">SOLD_OFFLINE (Marked Sold In-Store)</option>
                <option value="SOLD">SOLD (Sold Online)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
            />
          </div>
        </div>

        {/* Section 5: Era, Size & General Condition */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          {/* Era */}
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              Vintage Era / Decade
            </label>
            <div className="flex flex-wrap gap-2">
              {eras.map((itemEra) => (
                <button
                  type="button"
                  key={itemEra}
                  onClick={() => setEra(itemEra)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    era === itemEra
                      ? 'bg-neon-lime text-black shadow-sm font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {itemEra}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing */}
          {currentCategoryObj?.sizeOptions && currentCategoryObj.sizeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                Size Tag / Specification
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCategoryObj.sizeOptions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                      size === s
                        ? 'bg-neon-lime text-black shadow-sm font-bold'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* General Apparel Condition */}
          {!isTech && (
            <div className="space-y-2">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                Garment Condition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {apparelConditions.map((cond) => {
                  const isSelected = condition === cond.value;
                  return (
                    <button
                      type="button"
                      key={cond.value}
                      onClick={() => setCondition(cond.value)}
                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all ${
                        isSelected
                          ? 'bg-neon-lime/10 border-neon-lime text-neon-lime shadow-sm'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cond.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Submit Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Product
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl font-semibold text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-neon-lime text-black hover:bg-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Listing Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-rose-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Product Listing?</h3>
                  <p className="text-xs text-zinc-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                Are you sure you want to delete <strong className="text-white">&quot;{title}&quot;</strong>? It will be permanently removed from live customer feeds, search indices, and your store rack inventory.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700"
                >
                  Keep Item
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
