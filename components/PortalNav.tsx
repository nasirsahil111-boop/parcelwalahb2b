"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const LINKS = [
  { href: "", label: "Dashboard" },
  { href: "/place-order", label: "Place Order" },
  { href: "/orders", label: "Order History" },
  { href: "/wallet", label: "Wallet" },
  { href: "/locations", label: "Saved Locations" },
  { href: "/rate-card", label: "Rate Card" },
  { href: "/settlements", label: "COD Settlements" },
];

export function PortalNav({
  base,
  mode,
  partnerName,
  walletBalance,
  onExit,
  children,
}: {
  base: string;
  mode: "demo" | "live";
  partnerName: string;
  walletBalance: number;
  onExit?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-orange-50/60">
      {mode === "demo" ? (
        <div className="bg-amber-400 px-4 py-2 text-center text-sm font-bold text-amber-950">
          DEMO DATA — ye nakli data hai, asli Firebase me kuch save nahi ho
          raha.
        </div>
      ) : null}
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-2">
            <p className="text-lg font-extrabold text-orange-600">
              Parcelwalah
            </p>
            <p className="text-xs text-gray-500">Partner Portal</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {partnerName}
              </p>
              <p className="text-xs text-gray-500">
                Wallet: ₹{walletBalance.toLocaleString("en-IN")}
              </p>
            </div>
            {onExit ? (
              <button
                onClick={onExit}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Demo se bahar jao
              </button>
            ) : null}
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-4 pb-3">
          {LINKS.map((l) => {
            const href = `${base}${l.href}`;
            const active =
              pathname === href ||
              (l.href === "" && pathname === base) ||
              (l.href !== "" && pathname === href);
            return (
              <Link
                key={l.label}
                href={href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-5">{children}</main>
    </div>
  );
}
