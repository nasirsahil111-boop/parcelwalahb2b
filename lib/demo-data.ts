import type {
  Order,
  Partner,
  SavedLocation,
  Settlement,
  WalletTxn,
} from "./types";

/**
 * DEMO ONLY — local mock data. This file is imported only by /demo routes.
 * It must never be used for live orders, and demo routes must never import
 * lib/firebase.ts (verified by grep before release).
 */
export const DEMO_PARTNER: Partner = {
  name: "Zipeey (Demo)",
  businessType: "Grocery / essentials",
  city: "Ratlam",
  walletBalance: 1250,
};

export const DEMO_LOCATIONS: SavedLocation[] = [
  {
    id: "loc-1",
    name: "Zipeey Store",
    address: "Station Road, Ratlam",
    city: "Ratlam",
  },
  {
    id: "loc-2",
    name: "Zipeey Warehouse",
    address: "Industrial Area, Ratlam",
    city: "Ratlam",
  },
  {
    id: "loc-3",
    name: "Zipeey Jaora Hub",
    address: "Nehru Market, Jaora",
    city: "Jaora",
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: "PW-1006",
    pickup: "Zipeey Store, Station Road, Ratlam",
    drop: "Shastri Nagar, Ratlam",
    city: "Ratlam",
    category: "standard",
    distanceKm: 2.4,
    fee: 35,
    codAmount: 0,
    status: "placed",
    source: "Portal",
    createdAt: "2026-10-26 09:41",
  },
  {
    id: "PW-1005",
    pickup: "Zipeey Store, Station Road, Ratlam",
    drop: "Kasturba Nagar, Ratlam",
    city: "Ratlam",
    category: "food",
    distanceKm: 4.1,
    fee: 35,
    codAmount: 200,
    status: "delivered",
    source: "Portal",
    createdAt: "2026-10-25 18:12",
    riderName: "Rahul (Captain)",
    codStage: "collected",
  },
  {
    id: "PW-1004",
    pickup: "Zipeey Warehouse, Industrial Area, Ratlam",
    drop: "Alkapuri, Ratlam",
    city: "Ratlam",
    category: "standard",
    distanceKm: 5.6,
    fee: 45,
    codAmount: 0,
    status: "picked",
    source: "Portal",
    createdAt: "2026-10-25 16:03",
    riderName: "Amit (Captain)",
  },
  {
    id: "PW-1003",
    pickup: "Zipeey Store, Station Road, Ratlam",
    drop: "Do Batti, Ratlam",
    city: "Ratlam",
    category: "standard",
    distanceKm: 1.8,
    fee: 35,
    codAmount: 0,
    status: "accepted",
    source: "App",
    createdAt: "2026-10-25 11:27",
    riderName: "Rahul (Captain)",
  },
  {
    id: "PW-1002",
    pickup: "Zipeey Jaora Hub, Nehru Market, Jaora",
    drop: "Bus Stand, Jaora",
    city: "Jaora",
    category: "food",
    distanceKm: 3.2,
    fee: 35,
    codAmount: 450,
    status: "delivered",
    source: "Portal",
    createdAt: "2026-10-24 19:44",
    riderName: "Vikas (Captain)",
    codStage: "settled",
  },
  {
    id: "PW-1001",
    pickup: "Zipeey Store, Station Road, Ratlam",
    drop: "Sailana Road, Ratlam",
    city: "Ratlam",
    category: "standard",
    distanceKm: 8.9,
    fee: 55,
    codAmount: 0,
    status: "cancelled",
    source: "Portal",
    createdAt: "2026-10-24 10:15",
  },
];

export const DEMO_TXNS: WalletTxn[] = [
  {
    id: "tx-1",
    type: "credit",
    amount: 1000,
    note: "Top-up (UPI) — admin verified",
    at: "2026-10-24 09:00",
  },
  {
    id: "tx-2",
    type: "debit",
    amount: 55,
    note: "Order PW-1001 fee (cancelled — refund pending)",
    at: "2026-10-24 10:15",
  },
  {
    id: "tx-3",
    type: "credit",
    amount: 500,
    note: "Top-up (UPI) — admin verified",
    at: "2026-10-25 08:30",
  },
  {
    id: "tx-4",
    type: "debit",
    amount: 35,
    note: "Order PW-1005 fee",
    at: "2026-10-25 18:12",
  },
  {
    id: "tx-5",
    type: "debit",
    amount: 35,
    note: "Order PW-1006 fee",
    at: "2026-10-26 09:41",
  },
];

export const DEMO_SETTLEMENTS: Settlement[] = [
  {
    // Plan section 4 example: COD 200, captain earning 20, wallet -180 owed.
    id: "stl-1",
    orderId: "PW-1005",
    codCollected: 200,
    captainEarning: 20,
    owed: 180,
    stage: "collected",
    at: "2026-10-25 18:12",
  },
  {
    id: "stl-2",
    orderId: "PW-1002",
    codCollected: 450,
    captainEarning: 20,
    owed: 430,
    stage: "settled",
    utr: "UTR20261024XXXX",
    at: "2026-10-24 19:44",
  },
];
