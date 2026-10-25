export type City = "Ratlam" | "Jaora" | "Ujjain";

export type OrderStatus =
  | "placed"
  | "accepted"
  | "picked"
  | "delivered"
  | "cancelled";

export type OrderSource = "Portal" | "App";

export type CodStage = "collected" | "deposited" | "settled";

export type OrderCategory = "standard" | "food";

export interface Order {
  id: string;
  pickup: string;
  drop: string;
  city: City;
  category: OrderCategory;
  distanceKm: number;
  fee: number;
  codAmount: number;
  status: OrderStatus;
  source: OrderSource;
  createdAt: string;
  riderName?: string;
  codStage?: CodStage;
}

export interface WalletTxn {
  id: string;
  type: "debit" | "credit" | "topup_request";
  amount: number;
  note: string;
  at: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  city: City;
}

export interface Settlement {
  id: string;
  orderId: string;
  codCollected: number;
  captainEarning: number;
  /** Amount the captain owes Parcelwalah after keeping his earning. */
  owed: number;
  stage: CodStage;
  utr?: string;
  at: string;
}

export interface Partner {
  name: string;
  businessType: string;
  city: City;
  walletBalance: number;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "accepted",
  "picked",
  "delivered",
  "cancelled",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  accepted: "Accepted",
  picked: "Picked up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const COD_STAGE_LABEL: Record<CodStage, string> = {
  collected: "Collected",
  deposited: "Deposited",
  settled: "Settled",
};
