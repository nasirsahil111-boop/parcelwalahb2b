"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_LOCATIONS,
  DEMO_ORDERS,
  DEMO_PARTNER,
  DEMO_SETTLEMENTS,
  DEMO_TXNS,
} from "@/lib/demo-data";
import type {
  Order,
  SavedLocation,
  Settlement,
  WalletTxn,
} from "@/lib/types";
import type { PlaceOrderInput } from "./PlaceOrderForm";

interface DemoState {
  partnerName: string;
  businessType: string;
  city: string;
  walletBalance: number;
  orders: Order[];
  txns: WalletTxn[];
  locations: SavedLocation[];
  settlements: Settlement[];
  placeOrder: (input: PlaceOrderInput) => void;
  addLocation: (loc: Omit<SavedLocation, "id">) => void;
  deleteLocation: (id: string) => void;
  requestTopup: (amount: number) => void;
}

const DemoCtx = createContext<DemoState | null>(null);

export function useDemo(): DemoState {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}

/**
 * Demo session state. Everything lives in browser memory only:
 * exiting the demo or reloading resets it. No Firebase import here —
 * demo routes must never touch the live backend.
 */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [walletBalance, setWalletBalance] = useState(
    DEMO_PARTNER.walletBalance
  );
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [txns, setTxns] = useState<WalletTxn[]>(DEMO_TXNS);
  const [locations, setLocations] = useState<SavedLocation[]>(DEMO_LOCATIONS);
  const [settlements, setSettlements] =
    useState<Settlement[]>(DEMO_SETTLEMENTS);

  const value = useMemo<DemoState>(
    () => ({
      partnerName: DEMO_PARTNER.name,
      businessType: DEMO_PARTNER.businessType,
      city: DEMO_PARTNER.city,
      walletBalance,
      orders,
      txns,
      locations,
      settlements,
      placeOrder: (input) => {
        const id = `PW-${1010 + orders.length}`;
        const now = new Date().toLocaleString("en-IN");
        setOrders((prev) => [
          {
            id,
            pickup: input.pickup,
            drop: input.drop,
            city: input.city,
            category: input.category,
            distanceKm: input.distanceKm,
            fee: input.fee,
            codAmount: input.codAmount,
            status: "placed",
            source: "Portal",
            createdAt: now,
          },
          ...prev,
        ]);
        setTxns((prev) => [
          {
            id: `tx-${Date.now()}`,
            type: "debit",
            amount: input.fee,
            note: `Order ${id} fee`,
            at: now,
          },
          ...prev,
        ]);
        setWalletBalance((b) => b - input.fee);
        if (input.savePickup) {
          setLocations((prev) => [
            ...prev,
            { id: `loc-${Date.now()}`, ...input.savePickup! },
          ]);
        }
      },
      addLocation: (loc) =>
        setLocations((prev) => [...prev, { id: `loc-${Date.now()}`, ...loc }]),
      deleteLocation: (id) =>
        setLocations((prev) => prev.filter((l) => l.id !== id)),
      requestTopup: (amount) =>
        setTxns((prev) => [
          {
            id: `tx-${Date.now()}`,
            type: "topup_request",
            amount,
            note: "Top-up request — admin verify karke credit karega (demo me credit nahi hota)",
            at: new Date().toLocaleString("en-IN"),
          },
          ...prev,
        ]),
    }),
    [walletBalance, orders, txns, locations, settlements]
  );

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}
