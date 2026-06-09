"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Yapılandırma yoksa /setup sayfasına yönlendirir */
export default function SetupGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/setup' || pathname.startsWith('/api/')) {
      setReady(true);
      return;
    }

    fetch('/api/setup/status', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) {
          router.replace('/setup');
        } else {
          setReady(true);
        }
      })
      .catch(() => setReady(true));
  }, [pathname, router]);

  if (!ready && pathname !== '/setup') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#e0e6ed' }}>
        Yükleniyor...
      </div>
    );
  }

  return children;
}
