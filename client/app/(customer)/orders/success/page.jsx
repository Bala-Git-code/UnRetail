'use client';

import React, { Suspense } from 'react';
import { OrderSuccessContent } from '../[orderId]/success/page';
import { Sparkles } from 'lucide-react';

export default function OrderSuccessFallback(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-street-black text-zinc-100 flex items-center justify-center p-6 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles className="w-4 h-4 text-neon-lime animate-spin" />
            <span>Loading Order Confirmation...</span>
          </div>
        </div>
      }
    >
      <OrderSuccessContent {...props} />
    </Suspense>
  );
}


