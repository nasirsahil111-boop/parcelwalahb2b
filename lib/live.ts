import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Firestore,
} from "firebase/firestore";
import type {
  City,
  Order,
  OrderCategory,
  SavedLocation,
  Settlement,
  WalletTxn,
} from "./types";

/**
 * LIVE Firestore helpers. Used only by /portal routes.
 * Shapes follow the approved plan section 6:
 * merchants, rateCards, b2bRequests, walletTxns, settlements,
 * partnerAddresses. Admin management stays in existing admin.html.
 */

export interface LivePartner {
  merchantId: string;
  name: string;
  businessType: string;
  city: City;
  walletBalance: number;
}

export async function fetchMerchantByUid(
  db: Firestore,
  uid: string
): Promise<LivePartner | null> {
  // portalUsers/{uid} links the Auth user to a merchant.
  const link = await getDoc(doc(db, "portalUsers", uid));
  const merchantId = link.exists()
    ? (link.data().merchantId as string | undefined)
    : undefined;
  if (!merchantId) return null;
  const snap = await getDoc(doc(db, "merchants", merchantId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    merchantId,
    name: (d.name as string) ?? "Partner",
    businessType: (d.businessType as string) ?? "",
    city: (d.city as City) ?? "Ratlam",
    walletBalance: (d.walletBalance as number) ?? 0,
  };
}

export async function fetchOrders(
  db: Firestore,
  merchantId: string
): Promise<Order[]> {
  const q = query(
    collection(db, "b2bRequests"),
    where("merchantId", "==", merchantId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      pickup: (x.pickup as string) ?? "",
      drop: (x.drop as string) ?? "",
      city: (x.city as City) ?? "Ratlam",
      category: (x.category as OrderCategory) ?? "standard",
      distanceKm: (x.distanceKm as number) ?? 0,
      fee: (x.fee as number) ?? 0,
      codAmount: (x.codAmount as number) ?? 0,
      status: x.status as Order["status"],
      source: (x.source as Order["source"]) ?? "Portal",
      createdAt: x.createdAt?.toDate
        ? x.createdAt.toDate().toLocaleString("en-IN")
        : "",
      riderName: x.riderName as string | undefined,
      codStage: x.codStage as Order["codStage"],
    };
  });
}

export async function fetchTxns(
  db: Firestore,
  merchantId: string
): Promise<WalletTxn[]> {
  const q = query(
    collection(db, "walletTxns"),
    where("merchantId", "==", merchantId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      type: (x.type as WalletTxn["type"]) ?? "debit",
      amount: (x.amount as number) ?? 0,
      note: (x.note as string) ?? "",
      at: x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString("en-IN") : "",
    };
  });
}

export async function fetchLocations(
  db: Firestore,
  merchantId: string
): Promise<SavedLocation[]> {
  const q = query(
    collection(db, "partnerAddresses"),
    where("merchantId", "==", merchantId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      name: (x.name as string) ?? "",
      address: (x.address as string) ?? "",
      city: (x.city as City) ?? "Ratlam",
    };
  });
}

export async function fetchSettlements(
  db: Firestore,
  merchantId: string
): Promise<Settlement[]> {
  const q = query(
    collection(db, "settlements"),
    where("merchantId", "==", merchantId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      orderId: (x.orderId as string) ?? "",
      codCollected: (x.codCollected as number) ?? 0,
      captainEarning: (x.captainEarning as number) ?? 0,
      owed: (x.owed as number) ?? 0,
      stage: x.stage as Settlement["stage"],
      utr: x.utr as string | undefined,
      at: x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString("en-IN") : "",
    };
  });
}

export interface NewOrderInput {
  pickup: string;
  drop: string;
  city: City;
  category: OrderCategory;
  distanceKm: number;
  fee: number;
  codAmount: number;
}

/**
 * Places an order: atomic wallet debit + b2bRequests write + walletTxn.
 * The order lands in b2bRequests with status "placed" and source "Portal",
 * which is what the Captain app watches (developer leg, plan phase 3).
 * Throws when the wallet balance is insufficient — prepaid only, no credit.
 */
export async function placeLiveOrder(
  db: Firestore,
  merchant: LivePartner,
  input: NewOrderInput
): Promise<string> {
  const merchantRef = doc(db, "merchants", merchant.merchantId);
  const orderRef = doc(collection(db, "b2bRequests"));
  const txnRef = doc(collection(db, "walletTxns"));
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(merchantRef);
    const balance = (snap.data()?.walletBalance as number) ?? 0;
    if (balance < input.fee) {
      throw new Error("INSUFFICIENT_BALANCE");
    }
    tx.update(merchantRef, { walletBalance: balance - input.fee });
    tx.set(orderRef, {
      merchantId: merchant.merchantId,
      merchantName: merchant.name,
      pickup: input.pickup,
      drop: input.drop,
      city: input.city,
      category: input.category,
      distanceKm: input.distanceKm,
      fee: input.fee,
      codAmount: input.codAmount,
      status: "placed",
      source: "Portal",
      codStage: input.codAmount > 0 ? "collected" : null,
      createdAt: serverTimestamp(),
    });
    tx.set(txnRef, {
      merchantId: merchant.merchantId,
      type: "debit",
      amount: input.fee,
      note: `Order ${orderRef.id} fee`,
      createdAt: serverTimestamp(),
    });
  });
  return orderRef.id;
}

export async function addLiveLocation(
  db: Firestore,
  merchantId: string,
  loc: Omit<SavedLocation, "id">
): Promise<void> {
  await addDoc(collection(db, "partnerAddresses"), { merchantId, ...loc });
}
