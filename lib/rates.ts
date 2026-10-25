import type { City, OrderCategory } from "./types";

export interface Slab {
  upToKm: number;
  fee: number;
}

export interface CityRateCard {
  city: City;
  standard: Slab[];
  foodFlatUpToKm: number;
  foodFlatFee: number;
}

/**
 * City-wise rate cards (plan section 3 + locked fleet card).
 * Same slabs in every city today; tables are per-city so admin can
 * change one city without touching the others.
 */
export const RATE_CARDS: CityRateCard[] = [
  {
    city: "Ratlam",
    standard: [
      { upToKm: 3, fee: 35 },
      { upToKm: 6, fee: 45 },
      { upToKm: 10, fee: 55 },
    ],
    foodFlatUpToKm: 5,
    foodFlatFee: 35,
  },
  {
    city: "Jaora",
    standard: [
      { upToKm: 3, fee: 35 },
      { upToKm: 6, fee: 45 },
      { upToKm: 10, fee: 55 },
    ],
    foodFlatUpToKm: 5,
    foodFlatFee: 35,
  },
  {
    city: "Ujjain",
    standard: [
      { upToKm: 3, fee: 35 },
      { upToKm: 6, fee: 45 },
      { upToKm: 10, fee: 55 },
    ],
    foodFlatUpToKm: 5,
    foodFlatFee: 35,
  },
];

export function getRateCard(city: City): CityRateCard {
  return RATE_CARDS.find((c) => c.city === city) ?? RATE_CARDS[0];
}

export interface FeeQuote {
  fee: number | null;
  note: string;
}

/**
 * Fixed rate for one order. Returns fee null when the distance is
 * outside the card (over 10 km) — the portal never invents a price.
 */
export function calcFee(
  city: City,
  distanceKm: number,
  category: OrderCategory
): FeeQuote {
  const card = getRateCard(city);
  if (category === "food" && distanceKm <= card.foodFlatUpToKm) {
    return {
      fee: card.foodFlatFee,
      note: `Food flat ₹${card.foodFlatFee} (${card.foodFlatUpToKm} km tak)`,
    };
  }
  for (const slab of card.standard) {
    if (distanceKm <= slab.upToKm) {
      return { fee: slab.fee, note: `₹${slab.fee} (${slab.upToKm} km slab)` };
    }
  }
  return {
    fee: null,
    note: "10 km se zyada — is rate card me rate nahi hai, admin se confirm karein",
  };
}
