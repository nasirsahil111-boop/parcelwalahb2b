"use client";

import { useRouter } from "next/navigation";
import { DemoProvider, useDemo } from "@/components/DemoContext";
import { PortalNav } from "@/components/PortalNav";
import type { ReactNode } from "react";

function DemoShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const demo = useDemo();
  return (
    <PortalNav
      base="/demo"
      mode="demo"
      partnerName={demo.partnerName}
      walletBalance={demo.walletBalance}
      onExit={() => router.push("/login")}
    >
      {children}
    </PortalNav>
  );
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <DemoShell>{children}</DemoShell>
    </DemoProvider>
  );
}
