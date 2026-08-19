'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import {
  ShieldCheck,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Sparkles,
  Lock,
  Clock,
  ArrowRight,
  RefreshCw,
  Video,
} from 'lucide-react';

const ID_PROOF_TYPES = [
  { id: 'Aadhaar Card', label: 'Aadhaar Card (UIDAI)', placeholder: '12-digit Aadhaar Number (e.g. 1234 5678 9012)' },
  { id: 'PAN Card', label: 'Permanent Account Number (PAN)', placeholder: '10-character PAN (e.g. ABCDE1234F)' },
  { id: 'Voter ID', label: 'Voter ID (Election Commission)', placeholder: 'Voter EPIC Number (e.g. WBD1234567)' },
  { id: 'Passport', label: 'Passport', placeholder: '8-character Passport Number (e.g. A1234567)' },
];

export default function MerchantOnboardingModal({ isOpen, onClose, onVerificationSubmitted, currentStatus = 'UNSUBMITTED' }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');

  // ID Document and Verification Selfie States
  const [idProofImage, setIdProofImage] = useState(null);
  const [idPhotoImage, setIdPhotoImage] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Device Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [merchantStatus, setMerchantStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync merchant status whenever prop updates
  useEffect(() => {
    if (currentStatus) {
      setMerchantStatus(currentStatus);
    }
  }, [currentStatus]);

  // Connect active media stream to video element whenever camera is toggled on and video ref is rendered
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Camera stream play warning:', err);
      });
    }
  }, [cameraActive, step]);

  // Stop camera when closing or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Initialize from logged-in user if available
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const stored = localStorage.getItem('unretail_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.fullName) setFullName(u.fullName);
          if (u.email) setEmail(u.email);
          if (u.phoneNumber) setPhoneNumber(u.phoneNumber);
          if (u.address) setAddress(u.address);
          if (u.city) setCity(u.city);
          if (u.shopName) setShopName(u.shopName);
          if (u.idProofType) setIdProofType(u.idProofType === 'Indian Passport' ? 'Passport' : u.idProofType);
          if (u.idProofNumber) setIdProofNumber(u.idProofNumber);
          if (u.idProofUrl) setIdProofImage(u.idProofUrl);
          if (u.idPhotoUrl) setIdPhotoImage(u.idPhotoUrl);
          if (u.merchantStatus) setMerchantStatus(u.merchantStatus);
          if (u.rejectionReason) setRejectionReason(u.rejectionReason);
        } catch (e) {}
      }
    }
  }, [isOpen]);

  // Handle uploading media to storage service
  const uploadFileToStorage = async (file, folder = 'unretail-kyc-docs') => {
    try {
      const sigRes = await apiClient.get(`/cloudinary/signature?folder=${folder}`);
      if (sigRes?.data?.data) {
        const { timestamp, signature, apiKey, cloudName, folder: sigFolder } = sigRes.data.data;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder || sigFolder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          return uploadData.secure_url;
        }
      }
    } catch (err) {
      console.warn('Storage upload fallback, converting to DataURI:', err);
    }

    // Fallback: Convert to Base64 Data URL so backend can process
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleIdDocSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFileToStorage(file, 'unretail-kyc-docs');
      setIdProofImage(uploadedUrl);
    } catch (err) {
      setErrorMsg('Failed to process document. Please try a different image.');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Direct Device Camera Controls
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch((err) => console.warn('Stream play warning:', err));
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions in your browser to take a photo.');
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraSnapshot = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 480;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    setUploadingPhoto(true);
    setErrorMsg(null);

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `merchant_kyc_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const uploadedUrl = await uploadFileToStorage(file, 'unretail-kyc-photos');
      setIdPhotoImage(uploadedUrl || dataUrl);
    } catch (err) {
      console.warn('Camera snapshot upload error:', err);
      setIdPhotoImage(dataUrl);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRetakePhoto = () => {
    setIdPhotoImage(null);
    startCamera();
  };

  const handleStepChange = (newStep) => {
    if (step === 3 && newStep !== 3) {
      stopCamera();
    }
    setStep(newStep);
    if (newStep === 3 && !idPhotoImage) {
      startCamera();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !city.trim() || !shopName.trim()) {
      setErrorMsg('Please complete all contact and store location details.');
      setStep(1);
      return;
    }

    if (!idProofNumber.trim()) {
      setErrorMsg('Please enter your valid ID proof document number.');
      setStep(2);
      return;
    }

    if (!idProofImage) {
      setErrorMsg('Please upload a clear photo/scan of your ID proof.');
      setStep(2);
      return;
    }

    if (!idPhotoImage) {
      setErrorMsg('Please take a verification selfie using your camera for identity authentication.');
      setStep(3);
      if (!cameraActive) {
        startCamera();
      }
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        shopName: shopName.trim(),
        address: address.trim(),
        city: city.trim(),
        idProofType,
        idProofNumber: idProofNumber.trim(),
        idProofImage,
        idPhotoImage,
      };

      const res = await apiClient.post('/merchant/onboarding', payload);

      if (res.data?.success) {
        setMerchantStatus('PENDING');
        setSuccessMsg('Your merchant verification details have been submitted. Your application is now under admin review.');

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('unretail_user');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              const updatedUser = {
                ...parsed,
                ...res.data.data.user,
                merchantStatus: 'PENDING',
              };
              localStorage.setItem('unretail_user', JSON.stringify(updatedUser));
            } catch (e) {}
          }
        }

        if (onVerificationSubmitted) {
          onVerificationSubmitted(res.data.data);
        }
      } else {
        throw new Error(res.data?.error || 'Submission failed');
      }
    } catch (err) {
      console.error('KYC submit error:', err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to submit verification details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const modalContent = (
    <div className="fixed inset-0 w-screen h-screen z-[99999] overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      {/* Clickable Outside Backdrop */}
      <div onClick={handleClose} className="fixed inset-0 -z-10" />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 w-full max-w-2xl bg-street-card/95 border border-zinc-800/90 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl text-zinc-100 my-auto"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center text-neon-lime shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Merchant Partner Verification</span>
                {merchantStatus === 'APPROVED' && (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Approved
                  </span>
                )}
                {merchantStatus === 'PENDING' && (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Under Review
                  </span>
                )}
                {merchantStatus === 'REJECTED' && (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Action Required
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Identity verification and government ID proof required before posting products.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pending / Under Review Banner View */}
        {merchantStatus === 'PENDING' && (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 mx-auto flex items-center justify-center text-amber-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Verification Application Under Review
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Thank you for submitting your ID proof document and selfie identification. Our platform administration team is currently reviewing your credentials.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Store Name:</span>
                <strong className="text-white">{shopName || 'Boutique'}</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>ID Proof:</span>
                <strong className="text-white">{idProofType} ({idProofNumber ? `••••${idProofNumber.slice(-4)}` : 'Verified'})</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Status:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Pending Admin Approval
                </span>
              </div>
            </div>

            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3.5 max-w-md mx-auto text-left text-[11px] text-amber-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Once approved by the admin, you will instantly gain full access to publish apparel, sneakers, accessories, and electronics to the marketplace catalog and store shelves.
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 bg-neon-lime text-black font-bold text-xs uppercase rounded-xl hover:bg-white transition-all shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Form Wizard View (If UNSUBMITTED or REJECTED) */}
        {merchantStatus !== 'PENDING' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Rejection Alert if applicable */}
            {merchantStatus === 'REJECTED' && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-rose-200 font-bold block">Previous Application Needs Correction</strong>
                  <p className="text-[11px] text-rose-300/90">
                    Reason: {rejectionReason || 'Please provide clear and valid ID proof documents.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step Navigation Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  step === 1 ? 'bg-neon-lime text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>1. Contact & Store</span>
              </button>

              <button
                type="button"
                onClick={() => handleStepChange(2)}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  step === 2 ? 'bg-neon-lime text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>2. ID Proof</span>
              </button>

              <button
                type="button"
                onClick={() => handleStepChange(3)}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  step === 3 ? 'bg-neon-lime text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>3. Face Verification</span>
              </button>
            </div>

            {/* Step 1: Contact & Store Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neon-lime" /> Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="merchant@boutique.in"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-neon-lime" /> Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neon-lime" /> Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +91 98201 54321"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-neon-lime" /> Shop / Boutique Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Relic Vintage Co."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neon-lime" /> Physical / Store Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 42 Bandra West, Hill Road"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] block">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="px-5 py-2.5 bg-neon-lime text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 hover:bg-white transition-all shadow-md active:scale-95"
                  >
                    <span>Proceed to ID Proof</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Valid Proof of ID */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] block">
                    A. Select ID Proof Document Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ID_PROOF_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setIdProofType(type.id)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          idProofType === type.id
                            ? 'bg-neon-lime/10 border-neon-lime text-white shadow-sm'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-neon-lime" />
                          <span className="font-semibold text-xs">{type.label}</span>
                        </div>
                        {idProofType === type.id && <CheckCircle2 className="w-4 h-4 text-neon-lime" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] block">
                    B. {idProofType} Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder={ID_PROOF_TYPES.find((t) => t.id === idProofType)?.placeholder || 'Enter ID document number'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white p-3 text-xs focus:outline-none focus:border-neon-lime font-mono"
                  />
                </div>

                {/* ID Proof Document Upload Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                      C. Upload Photo / Scan of {idProofType} *
                    </label>
                    <span className="text-neon-lime font-mono text-[10px]">Secure Storage</span>
                  </div>

                  {idProofImage ? (
                    <div className="relative aspect-[16/9] max-h-48 bg-zinc-950 border border-zinc-700 rounded-2xl overflow-hidden group">
                      <img src={idProofImage} alt="ID Document Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="bg-neon-lime text-black px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer hover:bg-white transition-all">
                          Replace Document
                          <input type="file" accept="image/*" onChange={handleIdDocSelect} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-zinc-700 hover:border-neon-lime bg-zinc-950/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <FileText className="w-8 h-8 text-zinc-400 group-hover:text-neon-lime mb-2 transition-colors" />
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                        {uploadingDoc ? 'Uploading ID document...' : `Upload ${idProofType} Front / Full Card`}
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1">PNG, JPG, or JPEG up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdDocSelect}
                        disabled={uploadingDoc}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleStepChange(1)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl hover:bg-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="px-5 py-2.5 bg-neon-lime text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 hover:bg-white transition-all shadow-md active:scale-95"
                  >
                    <span>Proceed to Photo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Direct Device Camera Photo Verification (Zero File Upload) */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-neon-lime" /> Real-time Photo Capture *
                    </label>
                    <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Direct Camera Only
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Capture a clear selfie photo using your device webcam or camera to verify merchant authenticity. File uploads are disabled for security compliance.
                  </p>

                  {/* Camera Error Message */}
                  {cameraError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center justify-between gap-3">
                      <span>{cameraError}</span>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3 py-1 bg-rose-500 text-white rounded-lg font-bold text-[11px] shrink-0"
                      >
                        Retry Camera
                      </button>
                    </div>
                  )}

                  {/* Camera Viewfinder or Captured Snapshot */}
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-4">
                    {idPhotoImage ? (
                      /* Captured Verification Photo Display */
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-neon-lime shadow-[0_0_24px_rgba(204,255,0,0.25)] bg-black">
                          <img src={idPhotoImage} alt="Captured Verification Snapshot" className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-neon-lime text-black p-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleRetakePhoto}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-neon-lime text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-neon-lime" /> Retake Snapshot
                          </button>
                        </div>
                      </div>
                    ) : cameraActive ? (
                      /* Active Camera Viewfinder Stream */
                      <div className="flex flex-col items-center space-y-3.5 w-full">
                        <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-cyan-400 bg-black shadow-[0_0_24px_rgba(6,182,212,0.3)] flex items-center justify-center">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                          {/* Face Guideline Overlay */}
                          <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/50 pointer-events-none" />
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={captureCameraSnapshot}
                            disabled={uploadingPhoto}
                            className="px-6 py-2.5 bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            <span>{uploadingPhoto ? 'Processing...' : 'Capture Snapshot'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Camera Inactive: Prompt to Open Camera */
                      <div className="flex flex-col items-center text-center space-y-3 py-6">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-neon-lime">
                          <Video className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 max-w-xs">
                          <div className="font-bold text-white text-xs">Device Camera Required</div>
                          <p className="text-[11px] text-zinc-500">
                            Click below to activate your camera and capture a verification snapshot.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={startCamera}
                          disabled={cameraLoading}
                          className="px-5 py-2.5 bg-neon-lime text-black font-bold text-xs uppercase rounded-xl hover:bg-white transition-all shadow-md active:scale-95 flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{cameraLoading ? 'Starting Camera...' : 'Open Camera'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary & Review */}
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-800">
                    Application Summary
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-400">
                    <div>Name: <strong className="text-zinc-200">{fullName}</strong></div>
                    <div>Phone: <strong className="text-zinc-200">{phoneNumber}</strong></div>
                    <div>Store: <strong className="text-zinc-200">{shopName}</strong></div>
                    <div>City: <strong className="text-zinc-200">{city}</strong></div>
                    <div>ID Proof: <strong className="text-zinc-200">{idProofType}</strong></div>
                    <div>Verification Photo: <strong className={idPhotoImage ? 'text-emerald-400' : 'text-amber-400'}>{idPhotoImage ? 'Captured' : 'Pending'}</strong></div>
                  </div>
                </div>

                {/* Error Notification */}
                {errorMsg && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl flex items-center gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl hover:bg-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingDoc || uploadingPhoto || !idPhotoImage}
                    className="px-6 py-3 bg-neon-lime text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Verification Details...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Verification For Admin Approval</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
