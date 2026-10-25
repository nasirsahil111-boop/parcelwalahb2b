"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  fetchLocations,
  fetchMerchantByUid,
  fetchOrders,
  fetchSettlements,
  fetchTxns,
  placeLiveOrder,
  type LivePartner,
} from "@/lib/live";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import type {
  Order,
  SavedLocation,
  Settlement,
  WalletTxn,
} from "@/lib/types";
import type { PlaceOrderInput } from "./PlaceOrderForm";

interface PortalState {
  configured: boolean;
  loading: boolean;
  user: User | null;
  merchant: LivePartner | null;
  orders: Order[];
  txns: WalletTxn[];
  locations: SavedLocation[];
  settlements: Settlement[];
  error: string;
  placeOrder: (input: PlaceOrderInput) => Promise<void>;
  refresh: () => Promise<void>;
}

const PortalCtx = createContext<PortalState | null>(null);

export function usePortal(): PortalState {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}

/** Live portal session. Used only by /portal routes — never by /demo. */
export function PortalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<LivePartner | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [txns, setTxns] = useState<WalletTxn[]>([]);
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const db = getFirebaseDb();
    const auth = getFirebaseAuth();
    if (!db || !auth?.currentUser) return;
    const m = await fetchMerchantByUid(db, auth.currentUser.uid);
    if (!m) {
      setError("Is account se koi partner link nahi hai — admin se sampark karein.");
      return;
    }
    setMerchant(m);
    const [o, t, l, s] = await Promise.all([
      fetchOrders(db, m.merchantId),
      fetchTxns(db, m.merchantId),
      fetchLocations(db, m.merchantId),
      fetchSettlements(db, m.merchantId),
    ]);
    setOrders(o);
    setTxns(t);
    setLocations(l);
    setSettlements(s);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await refresh();
        } catch {
          setError("Data load nahi hua — dobara koshish karein.");
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [refresh]);

  const value = useMemo<PortalState>(
    () => ({
      configured: isFirebaseConfigured(),
      loading,
      user,
      merchant,
      orders,
      txns,
      locations,
      settlements,
      error,
      placeOrder: async (input) => {
        const db = getFirebaseDb();
        if (!db || !merchant) throw new Error("NOT_READY");
        await placeLiveOrder(db, merchant, input);
        if (input.savePickup) {
          const { addLiveLocation } = await import("@/lib/live");
          await addLiveLocation(db, merchant.merchantId, input.savePickup);
        }
        await refresh();
      },
      refresh,
    }),
    [loading, user, merchant, orders, txns, locations, settlements, error, refresh]
  );

  return <PortalCtx.Provider value={value}>{children}</PortalCtx.Provider>;
}
