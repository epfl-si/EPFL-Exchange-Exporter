'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { logRouting } from '@/services/logs';

export default function PageTracker() {
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {

    const log = async () => {
      const user = session?.user;
      delete user?.image;
      const log = {
        user: session?.user,
        pathname: pathname,
      };
      await logRouting(log);
    };
    log();
  }, [pathname]);

  return null;
}