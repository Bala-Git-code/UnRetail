'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ThreeDLogoLoader from './ThreeDLogoLoader';

function RouteTransitionWatcher({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip flashing loader on initial page load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Flash logo loader on route transitions
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      {loading && <ThreeDLogoLoader compact={true} message="SYNCING ROUTE..." />}
      {children}
    </>
  );
}

export default function RouteTransitionLoader({ children }) {
  return (
    <Suspense fallback={children}>
      <RouteTransitionWatcher>{children}</RouteTransitionWatcher>
    </Suspense>
  );
}
