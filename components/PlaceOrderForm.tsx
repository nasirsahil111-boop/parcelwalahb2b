"use client";

import { useMemo, useState } from "react";
import { calcFee } from "@/lib/rates";
import { getDistanceKm, hasMapsKey } from "@/lib/maps";
import type {
  City,
  OrderCategory,
  SavedLocation,
} from "@/lib/types";
import { Btn, Card, Field, inputCls } from "./ui";

export interface PlaceOrderInput {
  pickup: string;
  drop: string;
  city: City;
  category: OrderCategory;
  distanceKm: number;
  fee: number;
  codAmount: number;
  savePickup?: { name: string; address: string; city: City };
}

export function PlaceOrderForm({
  locations,
  walletBalance,
  submitting,
  onSubmit,
}: {
  locations: SavedLocation[];
  walletBalance: number;
  submitting: boolean;
  onSubmit: (input: PlaceOrderInput) => Promise<void>;
}) {
  const [pickupChoice, setPickupChoice] = useState<string>(
    locations[0]?.id ?? "new"
  );
  const [newPickupName, setNewPickupName] = useState("");
  const [newPickupAddress, setNewPickupAddress] = useState("");
  const [savePickup, setSavePickup] = useState(true);
  const [drop, setDrop] = useState("");
  const [city, setCity] = useState<City>("Ratlam");
  const [category, setCategory] = useState<OrderCategory>("standard");
  const [distanceKm, setDistanceKm] = useState("");
  const [mapsNote, setMapsNote] = useState("");
  const [mapsBusy, setMapsBusy] = useState(false);
  const [codAmount, setCodAmount] = useState("0");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const chosen = locations.find((l) => l.id === pickupChoice);
  const pickupText = chosen
    ? `${chosen.name}, ${chosen.address}`
    : newPickupAddress.trim();

  const km = parseFloat(distanceKm);
  const quote = useMemo(
    () =>
      Number.isFinite(km) && km > 0
        ? calcFee(city, km, category)
        : { fee: null as number | null, note: "Distance daalne par rate dikhega" },
    [city, km, category]
  );
  const insufficient =
    quote.fee !== null && quote.fee > walletBalance;

  async function handleMaps() {
    setMapsNote("");
    if (!pickupText || !drop.trim()) {
      setMapsNote("Pehle pickup aur drop location bharein.");
      return;
    }
    setMapsBusy(true);
    const res = await getDistanceKm(pickupText, drop.trim());
    setMapsBusy(false);
    if (res) {
      setDistanceKm(res.km.toFixed(1));
      setMapsNote(`Google Maps distance: ${res.text} (road distance)`);
    } else {
      setMapsNote(
        "Maps se distance nahi mili — distance haath se daalein (ye Maps ka result nahi hai)."
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone("");
    if (!pickupText) return setError("Pickup location chunein ya daalein.");
    if (!drop.trim()) return setError("Drop location daalein.");
    if (!Number.isFinite(km) || km <= 0)
      return setError("Sahi distance (km) daalein.");
    if (quote.fee === null) return setError(quote.note);
    if (insufficient)
      return setError(
        "Wallet balance kam hai — pehle wallet recharge karein (admin verify karke credit karega)."
      );
    try {
      await onSubmit({
        pickup: pickupText,
        drop: drop.trim(),
        city,
        category,
        distanceKm: km,
        fee: quote.fee,
        codAmount: parseFloat(codAmount) || 0,
        savePickup:
          pickupChoice === "new" && savePickup && newPickupName.trim()
            ? {
                name: newPickupName.trim(),
                address: newPickupAddress.trim(),
                city,
              }
            : undefined,
      });
      setDone("Order place ho gaya — Captain app ki queue me chala gaya.");
      setDrop("");
      setDistanceKm("");
      setCodAmount("0");
    } catch (err) {
      setError(
        err instanceof Error && err.message === "INSUFFICIENT_BALANCE"
          ? "Wallet balance kam hai — pehle wallet recharge karein."
          : "Order place nahi hua, dobara koshish karein."
      );
    }
  }

  return (
    <Card title="Place Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Pickup location">
          <select
            className={inputCls}
            value={pickupChoice}
            onChange={(e) => setPickupChoice(e.target.value)}
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.address}
              </option>
            ))}
            <option value="new">+ Nayi pickup location</option>
          </select>
        </Field>

        {pickupChoice === "new" ? (
          <>
            <Field label="Pickup naam (dukaan / warehouse)">
              <input
                className={inputCls}
                value={newPickupName}
                onChange={(e) => setNewPickupName(e.target.value)}
                placeholder="Jaise: Zipeey Store"
              />
            </Field>
            <Field label="Pickup address">
              <input
                className={inputCls}
                value={newPickupAddress}
                onChange={(e) => setNewPickupAddress(e.target.value)}
                placeholder="Poora address"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={savePickup}
                onChange={(e) => setSavePickup(e.target.checked)}
              />
              Is pickup location ko save karein (agli baar list se chun sakein)
            </label>
          </>
        ) : null}

        <Field label="Drop location (customer address)">
          <input
            className={inputCls}
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="Customer ka poora address"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <select
              className={inputCls}
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
            >
              <option>Ratlam</option>
              <option>Jaora</option>
              <option>Ujjain</option>
            </select>
          </Field>
          <Field label="Order type">
            <select
              className={inputCls}
              value={category}
              onChange={(e) => setCategory(e.target.value as OrderCategory)}
            >
              <option value="standard">Standard parcel</option>
              <option value="food">Food / shopping</option>
            </select>
          </Field>
        </div>

        <Field
          label={
            hasMapsKey()
              ? "Distance (km)"
              : "Distance (km) — Maps key nahi hai, haath se daalein (ye Maps ka result nahi hai)"
          }
        >
          <div className="flex gap-2">
            <input
              className={inputCls}
              inputMode="decimal"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              placeholder="Jaise: 4.2"
            />
            {hasMapsKey() ? (
              <Btn onClick={handleMaps} disabled={mapsBusy} variant="ghost">
                {mapsBusy ? "Nikal rahe hain…" : "Maps se nikalo"}
              </Btn>
            ) : null}
          </div>
        </Field>
        {mapsNote ? <p className="text-xs text-gray-500">{mapsNote}</p> : null}

        <Field label="COD amount (₹) — 0 matlab prepaid, customer se kuch nahi lena">
          <input
            className={inputCls}
            inputMode="decimal"
            value={codAmount}
            onChange={(e) => setCodAmount(e.target.value)}
            placeholder="0"
          />
        </Field>

        <div className="rounded-xl bg-orange-50 p-3 text-sm">
          <p>
            <span className="font-medium">Delivery fee: </span>
            {quote.fee !== null ? (
              <span className="font-bold">₹{quote.fee}</span>
            ) : (
              "—"
            )}{" "}
            <span className="text-gray-500">({quote.note})</span>
          </p>
          <p className="mt-1">
            Wallet balance: ₹{walletBalance.toLocaleString("en-IN")}
          </p>
          {insufficient ? (
            <p className="mt-1 font-semibold text-red-700">
              Balance kam hai — order place nahi hoga. Wallet me recharge
              karein (top-up request admin verify karke credit karega).
            </p>
          ) : null}
        </div>

        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        {done ? <p className="text-sm font-medium text-green-700">{done}</p> : null}

        <Btn type="submit" disabled={submitting || insufficient}>
          {submitting ? "Place ho raha hai…" : "Order Confirm karein"}
        </Btn>
        <p className="text-xs text-gray-500">
          Confirm hote hi order Captain app ki queue me jayega (source:
          Portal).
        </p>
      </form>
    </Card>
  );
}
