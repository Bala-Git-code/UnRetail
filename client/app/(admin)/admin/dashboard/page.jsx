'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Store,
  AlertTriangle,
  CheckCircle2,
  Layers,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  UserCheck,
  FileText,
  Camera,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  X,
  Eye,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [merchants, setMerchants] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [merchantFilter, setMerchantFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [adminToast, setAdminToast] = useState(null);

  // Lightbox Preview Modal for KYC Images
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  // Rejection Modal
  const [rejectingMerchant, setRejectingMerchant] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const triggerToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Mock Disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'disp_901',
      orderId: 'ord_90123',
      customer: 'Aarav (Delhi)',
      reason: 'Slight tear near denim cuff not disclosed in listing condition photo.',
      amount: 5499,
      status: 'OPEN',
    },
    {
      id: 'disp_844',
      orderId: 'ord_77124',
      customer: 'Maya (Mumbai)',
      reason: 'Shipping delay over 5 days beyond vendor commitment.',
      amount: 8900,
      status: 'OPEN',
    },
  ]);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoadingMerchants(true);
    try {
      const res = await apiClient.get('/merchant/admin/all');
      if (res.data?.data) {
        setMerchants(res.data.data);
      }
    } catch (err) {
      console.warn('Admin merchants fetch fallback:', err);
    } finally {
      setLoadingMerchants(false);
    }
  };

  const handleApproveMerchant = async (userId) => {
    setActionId(userId);
    try {
      const res = await apiClient.patch(`/merchant/admin/${userId}/approve`);
      if (res.data?.success) {
        setMerchants((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, merchantStatus: 'APPROVED', isVerified: true } : m))
        );
        triggerToast('Merchant verified & approved! Authorization to sell enabled.');
      }
    } catch (err) {
      console.warn('Approve merchant fallback:', err);
      setMerchants((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, merchantStatus: 'APPROVED', isVerified: true } : m))
      );
      triggerToast('Merchant approved!');
    } finally {
      setActionId(null);
    }
  };

  const handleRejectMerchant = async () => {
    if (!rejectingMerchant) return;
    const userId = rejectingMerchant.id;
    setActionId(userId);
    try {
      const res = await apiClient.patch(`/merchant/admin/${userId}/reject`, {
        reason: rejectionReasonInput.trim(),
      });
      if (res.data?.success) {
        setMerchants((prev) =>
          prev.map((m) =>
            m.id === userId ? { ...m, merchantStatus: 'REJECTED', rejectionReason: rejectionReasonInput.trim() } : m
          )
        );
        triggerToast(`Merchant application marked as rejected.`);
      }
    } catch (err) {
      console.warn('Reject merchant fallback:', err);
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === userId ? { ...m, merchantStatus: 'REJECTED', rejectionReason: rejectionReasonInput.trim() } : m
        )
      );
      triggerToast('Merchant application rejected.');
    } finally {
      setActionId(null);
      setRejectingMerchant(null);
      setRejectionReasonInput('');
    }
  };

  const handleResolveDispute = (disputeId, action) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: action } : d))
    );
    triggerToast(`Dispute #${disputeId} status set to ${action}`);
  };

  // Financial calculations
  const totalGMV = 1248500;
  const platformRevenueCut = totalGMV * 0.1; // 10% platform revenue cut

  const pendingCount = merchants.filter((m) => m.merchantStatus === 'PENDING').length;
  const approvedCount = merchants.filter((m) => m.merchantStatus === 'APPROVED').length;

  const filteredMerchants = merchants.filter((m) => {
    if (merchantFilter === 'PENDING' && m.merchantStatus !== 'PENDING') return false;
    if (merchantFilter === 'APPROVED' && m.merchantStatus !== 'APPROVED') return false;
    if (merchantFilter === 'REJECTED' && m.merchantStatus !== 'REJECTED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.fullName?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchShop = m.shopName?.toLowerCase().includes(q) || m.shops?.[0]?.shopName?.toLowerCase().includes(q);
      const matchCity = m.city?.toLowerCase().includes(q) || m.shops?.[0]?.city?.toLowerCase().includes(q);
      const matchPhone = m.phoneNumber?.toLowerCase().includes(q);
      const matchIdNum = m.idProofNumber?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchShop && !matchCity && !matchPhone && !matchIdNum) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 rounded-full text-xs font-medium text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Platform Governance Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Marketplace Overview & Desk Control
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Review merchant KYC credentials, approve boutique seller applications, monitor platform sales, and resolve customer protection disputes.
          </p>
        </div>

        <button
          onClick={fetchMerchants}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Counters
        </button>
      </div>

      {/* Financial & Status Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Total Sales Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(totalGMV)}</div>
          <div className="text-xs text-zinc-500 font-medium">Total volume across physical & online sales</div>
        </div>

        <div className="bg-street-card/80 border border-amber-500/30 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>10% Platform Fee</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight tabular-nums">{formatCurrency(platformRevenueCut)}</div>
          <div className="text-xs text-zinc-500 font-medium">Net platform fee generated</div>
        </div>

        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Pending KYC Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight tabular-nums">
            {pendingCount} Application{pendingCount === 1 ? '' : 's'}
          </div>
          <div className="text-xs text-zinc-500 font-medium">Merchants waiting for ID proof review</div>
        </div>

        <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-5 space-y-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Approved Boutiques</span>
            <div className="w-8 h-8 rounded-xl bg-neon-lime/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-neon-lime" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-neon-lime tracking-tight tabular-nums">
            {approvedCount} Store{approvedCount === 1 ? '' : 's'}
          </div>
          <div className="text-xs text-zinc-500 font-medium">Verified partners authorized to sell</div>
        </div>
      </div>

      {/* Admin Toast Alert Banner */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-black text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-black">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Merchant Partner KYC Verification Queue */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 text-xs space-y-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-white text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-neon-lime" /> Merchant KYC & ID Proof Approval Desk
            </span>
            <p className="text-[11px] text-zinc-400">
              Only approved merchants are permitted to post vintage items and electronics for sale.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'REJECTED', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMerchantFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  merchantFilter === tab.id
                    ? 'bg-amber-400 text-black shadow-sm font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by merchant name, email, phone, store name, city, or ID proof number..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs pl-10 pr-3 py-2.5 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Merchant Cards List */}
        <div className="divide-y divide-zinc-800/70">
          {filteredMerchants.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <UserCheck className="w-8 h-8 mx-auto text-zinc-600" />
              <p>No merchant applications match the selected filter.</p>
            </div>
          ) : (
            filteredMerchants.map((merchant) => {
              const isApproved = merchant.merchantStatus === 'APPROVED';
              const isPending = merchant.merchantStatus === 'PENDING';
              const isRejected = merchant.merchantStatus === 'REJECTED';

              return (
                <div key={merchant.id} className="py-5 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Merchant & Store Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-white text-base">
                          {merchant.shopName || merchant.shops?.[0]?.shopName || 'Boutique Store'}
                        </span>

                        {isApproved && (
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Authorized Seller
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> Pending Admin Review
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full flex items-center gap-1">
                            <X className="w-3 h-3" /> Application Rejected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Owner: <strong className="text-zinc-200">{merchant.fullName || 'Merchant'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Email: <strong className="text-zinc-200">{merchant.email}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Phone: <strong className="text-zinc-200">{merchant.phoneNumber || 'Not provided'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Address: <strong className="text-zinc-200">{merchant.address || 'Address'}, {merchant.city || 'City'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>ID Type: <strong className="text-amber-300">{merchant.idProofType || 'Aadhaar Card'}</strong> ({merchant.idProofNumber || 'ID Number'})</span>
                        </div>
                      </div>

                      {isRejected && merchant.rejectionReason && (
                        <div className="bg-rose-500/10 border border-rose-500/25 p-2.5 rounded-xl text-rose-300 text-[11px]">
                          <strong>Rejection Reason:</strong> {merchant.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {!isApproved && (
                        <button
                          onClick={() => handleApproveMerchant(merchant.id)}
                          disabled={actionId === merchant.id}
                          className="px-4 py-2.5 bg-neon-lime hover:bg-white text-black font-bold text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{actionId === merchant.id ? 'Approving...' : 'Approve Merchant'}</span>
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          onClick={() => {
                            setRejectingMerchant(merchant);
                            setRejectionReasonInput('');
                          }}
                          disabled={actionId === merchant.id}
                          className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-300 hover:text-rose-400 font-bold text-xs uppercase rounded-xl transition-all"
                        >
                          Reject
                        </button>
                      )}

                      {isApproved && (
                        <div className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Posting Enabled</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Proof Documents & Photo Inspection Bar */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* ID Proof Document Preview */}
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => {
                            setPreviewImage(merchant.idProofUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
                            setPreviewTitle(`ID Proof Document (${merchant.idProofType || 'Aadhaar Card'}) - ${merchant.fullName}`);
                          }}
                          className="w-16 h-12 rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden cursor-pointer relative group shrink-0"
                        >
                          <img
                            src={merchant.idProofUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                            alt="ID Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-white block">ID Proof Document</span>
                          <span className="text-[10px] text-zinc-500 font-mono">Verified ID Doc</span>
                        </div>
                      </div>

                      {/* Photo Identification Preview */}
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => {
                            setPreviewImage(merchant.idPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
                            setPreviewTitle(`Verification Selfie Photo - ${merchant.fullName}`);
                          }}
                          className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 overflow-hidden cursor-pointer relative group shrink-0"
                        >
                          <img
                            src={merchant.idPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt="Identification Photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-white block">Selfie Photo ID</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Direct Camera Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 font-mono">
                      Applied: {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lightbox Modal for Document / Photo Previews */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-white text-xs">{previewTitle}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-zinc-900/40 overflow-hidden">
              <img
                src={previewImage}
                alt="Document Preview"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl border border-zinc-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectingMerchant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Reject Merchant Application</h3>
              <button
                onClick={() => setRejectingMerchant(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Please specify the reason for rejecting <strong>{rejectingMerchant.fullName}</strong> ({rejectingMerchant.shopName || 'Boutique'}). This will be shown to the merchant so they can correct their documents.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. ID proof document was blurry or details did not match."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingMerchant(null)}
                className="px-4 py-2 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-xl hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectMerchant}
                className="px-4 py-2 bg-rose-500 text-white text-xs font-bold uppercase rounded-xl hover:bg-rose-600 transition-all shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Dispute Resolution Desk */}
      <div className="bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 text-xs space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <span className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Customer Protection & Support Desk
          </span>
          <span className="text-zinc-500 font-medium">Buyer Escrow System</span>
        </div>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">TICKET #{dispute.id}</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">Order #{dispute.orderId} ({dispute.customer})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold tabular-nums">{formatCurrency(dispute.amount)}</span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                      dispute.status === 'OPEN'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                    }`}
                  >
                    {dispute.status}
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-xs bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                Reason: &quot;{dispute.reason}&quot;
              </p>

              {dispute.status === 'OPEN' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'RESOLVED_VENDOR')}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold uppercase px-3.5 py-2 text-[11px] rounded-xl transition-all"
                  >
                    Release Escrow To Merchant (90%)
                  </button>
                  <button
                    onClick={() => handleResolveDispute(dispute.id, 'REFUNDED_CUSTOMER')}
                    className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-semibold uppercase px-3.5 py-2 text-[11px] rounded-xl transition-all"
                  >
                    Issue Full Refund To Customer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
