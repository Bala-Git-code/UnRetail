'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ShieldCheck, AlertTriangle, Store, DollarSign, CheckCircle2, RefreshCw, XCircle, Tag, Eye, ArrowUpRight } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function AdminDashboardPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Reported Listings Moderation Mock Table
  const [reportedListings] = useState([
    {
      id: 'rep-881',
      title: 'Bootleg Concert Tee (Counterfeit Flag)',
      shopName: 'Retro Vault',
      flaggedBy: 'Automated Content Scanner',
      reason: 'Potential fake vintage label trademark mismatch.',
      status: 'PENDING_REVIEW',
    },
  ]);

  // Dispute Resolution Tickets
  const [disputes] = useState([
    {
      id: 'disp-101',
      orderId: 'ord_9823a10f',
      customerName: 'Alex Rivera',
      shopName: 'Dust & Gold Vintage',
      reason: 'Item condition grade mismatch (stated Like New, had minor stain).',
      status: 'OPEN',
      createdAt: '2026-08-10',
    },
  ]);

  useEffect(() => {
    fetchAdminShops();
  }, []);

  const fetchAdminShops = async () => {
    try {
      const response = await apiClient.get('/shops');
      if (response.data.success) {
        setShops(response.data.data);
      }
    } catch (err) {
      console.warn('Admin shops fetch fallback:', err);
      setShops([
        {
          id: 'shop-1',
          shopName: 'Relic Vintage Co.',
          city: 'Mumbai',
          address: '42 Bandra West',
          isVerified: true,
          owner: { fullName: 'Aarav Patel' },
        },
        {
          id: 'shop-2',
          shopName: 'Retro Vault',
          city: 'Bengaluru',
          address: '108 Indiranagar',
          isVerified: true,
          owner: { fullName: 'Priya Sharma' },
        },
        {
          id: 'shop-3',
          shopName: 'Dust & Gold Vintage',
          city: 'Delhi',
          address: '15 Hauz Khas',
          isVerified: false,
          owner: { fullName: 'Rohan Verma' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyShop = async (shopId: string) => {
    try {
      await apiClient.patch(`/shops/${shopId}/verify`);
      setShops(shops.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s)));
    } catch (err) {
      setShops(shops.map((s) => (s.id === shopId ? { ...s, isVerified: true } : s)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Executive Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Gross Merchandise Value (GMV)</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">₹1,42,800</p>
          <span className="text-[11px] text-emerald-400 mt-1.5 block font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.2% GMV Volume
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Platform Commission (5%)</span>
            <Tag className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-teal-400">₹7,140</p>
          <span className="text-[11px] text-slate-400 mt-1.5 block">Automated Razorpay Split</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Vendor Moderation Queue</span>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{shops.filter((s) => !s.isVerified).length} Pending</p>
          <span className="text-[11px] text-amber-400/80 mt-1.5 block font-medium">Physical location verification</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Open Dispute Tickets</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">{disputes.length} Ticket</p>
          <span className="text-[11px] text-rose-400/80 mt-1.5 block font-medium">Requires admin refund decision</span>
        </div>
      </div>

      {/* Moderation Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Physical Store Verification Queue */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" /> Vendor Moderation & Store Queue
            </h3>
            <span className="text-xs text-slate-400 font-medium">Physical Location Audit</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" /> Loading store queue...
            </div>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div key={shop.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {shop.shopName}
                      {shop.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{shop.address}, {shop.city}</p>
                    <p className="text-[11px] text-slate-500">Owner: {shop.owner?.fullName || 'Shop Owner'}</p>
                  </div>

                  <div>
                    {shop.isVerified ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                        Verified Shop
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyShop(shop.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-all shadow-md"
                      >
                        Approve & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reported Listing Moderation Table */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Reported Catalog Moderation
            </h3>
            <span className="text-xs text-slate-400 font-medium">Counterfeit & Flaw Flag</span>
          </div>

          <div className="space-y-3">
            {reportedListings.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                    Flagged
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Shop: {rep.shopName} • Flagged by: {rep.flaggedBy}</p>
                <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  {rep.reason}
                </p>
                <div className="flex gap-2 justify-end pt-1">
                  <button className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">
                    Keep Listing
                  </button>
                  <button className="px-3 py-1 rounded-xl bg-rose-500 text-slate-950 text-xs font-bold hover:bg-rose-400">
                    Remove Piece
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispute Resolution Tickets Module */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Customer Dispute Resolution Tickets
          </h3>
          <span className="text-xs text-slate-400">Razorpay Refund Trigger</span>
        </div>

        <div className="space-y-4">
          {disputes.map((disp) => (
            <div key={disp.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-400 font-mono font-bold">Ticket #{disp.id}</span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                  {disp.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Customer: Alex Rivera • Store: {disp.shopName} (Order #{disp.orderId})
              </p>
              <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                Reason: &quot;{disp.reason}&quot;
              </p>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700">
                  Reject Claim
                </button>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-md shadow-emerald-500/10">
                  Approve Razorpay Full Refund
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
