"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PortalProvider, usePortal } from "@/components/PortalContext";
import { PortalNav } from "@/components/PortalNav";

function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const portal = usePortal();

  useEffect(() => {
    if (!portal.loading && portal.configured && !portal.user) {
      router.push("/login");
    }
  }, [portal.loading, portal.configured, portal.user, router]);

  if (!portal.configured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          Firebase configure nahi hai
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Live portal ke liye .env.local me Firebase keys daalein (README
          dekhein). Tab tak Demo dekho se portal test karein.
        </p>
        <button
          onClick={() => router.push("/demo")}
          className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
        >
          Demo dekho (fake data)
        </button>
      </div>
    );
  }

  if (portal.loading) {
    return <p className="px-4 py-16 text-center text-sm text-gray-500">Load ho raha hai…</p>;
  }

  if (!portal.user) return null;

  if (portal.error || !portal.merchant) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm font-medium text-red-700">
          {portal.error || "Partner account load nahi hua."}
        </p>
      </div>
    );
  }

  return (
    <PortalNav
      base="/portal"
      mode="live"
      partnerName={portal.merchant.name}
      walletBalance={portal.merchant.walletBalance}
    >
      {children}
    </PortalNav>
  );
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <PortalProvider>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
