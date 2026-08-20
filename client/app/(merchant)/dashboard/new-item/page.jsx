'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import MerchantOnboardingModal from '@/components/MerchantOnboardingModal';
import {
  TAXONOMY,
  TECH_CONDITION_GRADES,
  FOUR_POINT_OPERATIONAL_CHECKLIST,
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
  Info,
  ShieldCheck,
  Cpu,
  Lock,
  CheckSquare,
  Square,
  HelpCircle,
  Zap,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function NewItemListingPage() {
  const router = useRouter();

  // Basic Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [subcategory, setSubcategory] = useState('Tops & Graphic Tees');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('L');
  const [era, setEra] = useState('90s');
  const [condition, setCondition] = useState('GENTLY_USED');
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Merchant Approval & Verification States
  const [merchantStatus, setMerchantStatus] = useState('APPROVED'); // 'UNSUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [canPostItems, setCanPostItems] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Tech & Retro Electronics Anti-Fraud Fields
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

  // Check merchant KYC and approval status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const storedUser = localStorage.getItem('unretail_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.role === 'ADMIN') {
            setMerchantStatus('APPROVED');
            setCanPostItems(true);
            setCheckingAuth(false);
            return;
          }
          if (u.merchantStatus) {
            setMerchantStatus(u.merchantStatus);
            setCanPostItems(u.merchantStatus === 'APPROVED');
          }
        }

        const res = await apiClient.get('/merchant/status');
        if (res.data?.data) {
          const data = res.data.data;
          setMerchantStatus(data.merchantStatus || 'UNSUBMITTED');
          setCanPostItems(data.canPostItems ?? (data.merchantStatus === 'APPROVED'));
        }
      } catch (err) {
        console.warn('Status check fallback:', err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkStatus();
  }, []);

  // Dynamic update of subcategories when parent category changes
  useEffect(() => {
    const catObj = getCategoryById(category);
    if (catObj && catObj.subcategories.length > 0) {
      const exists = catObj.subcategories.some((s) => s.id === subcategory);
      if (!exists) {
        setSubcategory(catObj.subcategories[0].id);
      }
      if (catObj.sizeOptions && catObj.sizeOptions.length > 0) {
        if (!catObj.sizeOptions.includes(size)) {
          setSize(catObj.sizeOptions[0]);
        }
      } else {
        setSize('OS');
      }
    }
  }, [category]);

  const isTech = isTechCategory(category);
  const currentCategoryObj = getCategoryById(category) || TAXONOMY[0];

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

  // Form Validation & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canPostItems) {
      setErrorMsg('Merchant approval required. Your account must be verified and approved by the platform admin before posting items.');
      setShowOnboardingModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const errors = {};

    if (!title.trim()) errors.title = 'Item title is required';
    if (!price || parseFloat(price) <= 0) errors.price = 'Please enter a valid price in INR';
    if (!category) errors.category = 'Category selection is required';
    if (!subcategory) errors.subcategory = 'Subcategory selection is required';

    // Anti-Fraud Checks for Tech & Retro Electronics
    if (isTech) {
      if (!techConditionGrade) {
        errors.techConditionGrade = 'Standardized functional condition grade is required for tech';
      }
      if (!serialNumberImei || serialNumberImei.trim() === '') {
        errors.serialNumberImei = 'Serial Number / IMEI is required for escrow dispute protection';
      }
      if (!powerOnStatus) {
        errors.powerOnStatus = 'Please confirm power-on diagnostic status';
      }
      if (!screenSensorClarity) {
        errors.screenSensorClarity = 'Please confirm screen/sensor/lens clarity';
      }
      if (!portChargingTested) {
        errors.portChargingTested = 'Please confirm port/charging circuit verification';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMsg('Please review and resolve the highlighted fields before listing.');
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
        subcategory,
        brand: brand || undefined,
        size,
        era,
        condition: isTech ? 'LIKE_NEW' : condition,
        images: images.length > 0 ? images : ['/images/denim_vintage.png'],
        ...(isTech && serialNumberImei.trim() && { serialNumberImei: serialNumberImei.trim() }),
        // Tech Anti-Fraud verification payload
        ...(isTech && {
          techConditionGrade,
          powerOnStatus,
          screenSensorClarity,
          portChargingTested,
          knownDefectsReported,
          knownDefectsDesc: knownDefectsDesc.trim(),
        }),
      };

      const res = await apiClient.post('/items', payload);
      if (res.data?.success) {
        setSuccessMsg(
          isTech
            ? 'Tech Grail verified with Escrow Anti-Fraud lock & published to live feed!'
            : 'Rack item successfully listed on live feed and search index!'
        );
        setTimeout(() => {
          router.push('/dashboard/listings');
        }, 1200);
      }
    } catch (err) {
      console.error('Create item error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to list item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Snap & Sell Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            New Boutique Rack Listing
          </h1>
          <p className="text-xs text-zinc-400">
            Publish vintage fashion or vintage electronics with escrow protection and real-time storefront sync.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2 transition-colors font-medium hover:border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4 text-neon-lime" /> Cancel
        </button>
      </div>

      {/* Admin Approval Gating Banner */}
      {!canPostItems && (
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>Admin Approval Required To Sell</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {merchantStatus === 'PENDING' ? 'Under Review' : 'KYC Required'}
                </span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {merchantStatus === 'PENDING'
                  ? 'Your ID proof document and selfie photo identification are currently under review by platform admins. Item publishing will unlock automatically once approved.'
                  : 'You must submit your contact details, valid ID proof, and selfie photo identification for admin approval before listing items.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOnboardingModal(true)}
            className="shrink-0 px-4 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{merchantStatus === 'PENDING' ? 'View Review Status' : 'Complete Verification'}</span>
          </button>
        </div>
      )}

      {/* Error and Success Banners */}
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

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Photo Upload Box */}
        <div className="space-y-3 bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              1. Rack Photos (Mobile Camera / Upload) *
            </label>
            <span className="text-[11px] text-zinc-500 font-medium">Multiple angles recommended</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Uploaded Photos */}
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

            {/* Camera Input Trigger */}
            <label className="aspect-square bg-zinc-900/60 border-2 border-dashed border-zinc-700 hover:border-neon-lime rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer group transition-all">
              <Camera className="w-6 h-6 text-zinc-400 group-hover:text-neon-lime mb-2 transition-colors" />
              <span className="text-[11px] text-zinc-300 font-medium group-hover:text-white">
                {uploadingImage ? 'Uploading...' : 'Snap Camera Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Multi-Tier Category & Subcategory Selector */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          {/* Main Parent Category */}
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
              <span>2. Parent Category *</span>
              <span className="text-[11px] text-neon-lime font-mono">Taxonomy Tier 1</span>
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
                    {cat.id === 'Tech & Retro Electronics' && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                        <ShieldCheck className="w-3 h-3" /> Anti-Fraud Verification
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Nested Subcategory Selector */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
              <span>3. Nested Subcategory *</span>
              <span className="text-[11px] text-zinc-500 font-mono">Dynamic Sub-Pills</span>
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

        {/* Section 3: Conditional Tech & Retro Electronics Anti-Fraud Verification Desk */}
        <AnimatePresence>
          {isTech && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-b from-cyan-950/30 via-zinc-950/80 to-zinc-950 border-2 border-cyan-500/40 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md relative">
                {/* Anti-Fraud Banner Header */}
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2.5 text-cyan-300">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        Hardware Verification & Escrow Anti-Fraud Desk
                      </h3>
                      <p className="text-[11px] text-cyan-400/90">
                        Mandatory condition grading and hardware telemetry to protect against returns fraud.
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[11px] font-mono text-cyan-300">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>Dispute Protection Active</span>
                  </div>
                </div>

                {/* 1. Functional Condition Grade Selector */}
                <div className="space-y-2">
                  <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                    A. Functional Condition Grade *
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

                {/* 2. 4-Point Operational Checklist */}
                <div className="space-y-3">
                  <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
                    <span>B. 4-Point Operational Checklist *</span>
                    <span className="text-[11px] text-cyan-400 font-mono">Verify All Checkpoints</span>
                  </label>

                  <div className="space-y-2 bg-zinc-950/70 border border-zinc-800 rounded-xl p-4">
                    {/* Item 1 */}
                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={powerOnStatus}
                        onChange={(e) => setPowerOnStatus(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                      />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white text-xs">
                          1. Power-On & Boot Cycle Verification
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Unit powers on, initializes firmware/shutter mechanism, and stays running without shutdowns.
                        </p>
                      </div>
                    </label>

                    {/* Item 2 */}
                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={screenSensorClarity}
                        onChange={(e) => setScreenSensorClarity(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                      />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white text-xs">
                          2. Screen, Sensor & Optical Clarity Inspection
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          LCD display, CCD/CMOS sensor, and optical elements free from severe fungus, haze, or dead pixel lines.
                        </p>
                      </div>
                    </label>

                    {/* Item 3 */}
                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={portChargingTested}
                        onChange={(e) => setPortChargingTested(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-cyan-400 rounded"
                      />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white text-xs">
                          3. Port, Battery & Charging Circuit Test
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Data transfer ports, audio output jacks, and battery charging pins hold connection and charge.
                        </p>
                      </div>
                    </label>

                    {/* Item 4: Defects / Flaws */}
                    <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={knownDefectsReported}
                        onChange={(e) => setKnownDefectsReported(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-amber-400 rounded"
                      />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-amber-300 text-xs">
                          4. Flaws / Patina Disclosed (Check if device has any known cosmetic scuffs or defects)
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Enables transparent listing and shields merchant during escrow inspection.
                        </p>
                      </div>
                    </label>

                    {knownDefectsReported && (
                      <div className="pt-2 pl-7">
                        <textarea
                          rows={2}
                          value={knownDefectsDesc}
                          onChange={(e) => setKnownDefectsDesc(e.target.value)}
                          placeholder="Detail any battery cover looseness, light cosmetic scratches, or missing peripheral caps..."
                          className="w-full bg-zinc-900 border border-amber-500/30 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Serial Number / IMEI (Private) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>C. Serial Number / IMEI (Stored Encrypted) *</span>
                    </label>
                    <span className="text-[11px] text-cyan-400 font-mono">Escrow dispute protection</span>
                  </div>

                  <input
                    type="text"
                    required={isTech}
                    value={serialNumberImei}
                    onChange={(e) => setSerialNumberImei(e.target.value)}
                    placeholder="e.g. DSCP100-SN-894210 or GBC-AP-540921"
                    className={`w-full bg-zinc-950 border rounded-xl text-white p-3.5 text-sm font-mono focus:outline-none transition-colors ${
                      validationErrors.serialNumberImei
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-zinc-800 focus:border-cyan-400'
                    }`}
                  />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    This serial number will <strong>never be shown publicly</strong> to casual browsers. It is securely logged in the escrow ledger to prevent swap-and-return fraud during customer claims.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 4: Title, Price & Details (Apparel & Accessories have NO serial number field) */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                4. Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1990s Vintage Levi 501 Heavyweight Denim"
                className={`w-full bg-zinc-950 border rounded-xl text-white p-3.5 text-sm focus:outline-none transition-colors ${
                  validationErrors.title
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-zinc-800 focus:border-neon-lime'
                }`}
              />
              {validationErrors.title && (
                <span className="text-rose-400 text-[11px] block">{validationErrors.title}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                5. Price (INR) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 5499"
                className={`w-full bg-zinc-950 border rounded-xl text-white p-3.5 text-sm tabular-nums focus:outline-none transition-colors ${
                  validationErrors.price
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-zinc-800 focus:border-neon-lime'
                }`}
              />
              {validationErrors.price && (
                <span className="text-rose-400 text-[11px] block">{validationErrors.price}</span>
              )}
            </div>
          </div>

          {/* Brand & Subcategory (Serial number removed for Apparel & Accessories) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Brand (Optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Levi's, Harley, Nike"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">Subcategory (Optional)</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. 501, Leather Bomber"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              6. Detailed Description & Curator Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe wash patina, distressing details, accessories included, or fit specifications..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3.5 text-sm focus:outline-none focus:border-neon-lime transition-colors"
            />
          </div>
        </div>

        {/* Section 5: Era, Size & General Condition (For Apparel/Accessories) */}
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
          {/* Era */}
          <div className="space-y-2">
            <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
              7. Vintage Era / Decade
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

          {/* Sizing Tag (Hidden if category has no size options e.g. Accessories) */}
          {currentCategoryObj?.sizeOptions && currentCategoryObj.sizeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                8. Size Tag / Specification
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

          {/* General Apparel Condition (Hidden if Tech is active since Tech has dedicated grading) */}
          {!isTech && (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <label className="text-zinc-200 font-bold uppercase tracking-wider text-xs block">
                {currentCategoryObj?.sizeOptions && currentCategoryObj.sizeOptions.length > 0 ? '9. ' : '8. '}Apparel Condition Grade
              </label>
              <div className="flex flex-wrap gap-2">
                {apparelConditions.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setCondition(c.value)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                      condition === c.value
                        ? 'bg-neon-lime text-black shadow-sm font-bold'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Instant Publish Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || !canPostItems}
            className={`w-full font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all ${
              !canPostItems
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                : 'bg-neon-lime hover:bg-white text-black shadow-[0_0_24px_rgba(204,255,0,0.3)] active:scale-[0.98]'
            } disabled:opacity-60`}
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>
              {submitting
                ? 'Validating & Publishing...'
                : !canPostItems
                ? 'Merchant Approval Required (Posting Locked)'
                : isTech
                ? 'Verify & Publish Tech Grail to Live Feed'
                : 'Publish Item to Live Rack Catalog'}
            </span>
          </button>
        </div>
      </form>

      {/* Onboarding & Verification Modal */}
      <MerchantOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        currentStatus={merchantStatus}
        onVerificationSubmitted={(data) => {
          setMerchantStatus('PENDING');
          setCanPostItems(false);
        }}
      />
    </div>
  );
}
