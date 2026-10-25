"use client";

import { useState } from "react";
import { usePortal } from "@/components/PortalContext";
import { Btn, Card, Field, inputCls } from "@/components/ui";
import type { City } from "@/lib/types";

export default function PortalLocations() {
  const portal = usePortal();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState<City>("Ratlam");
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Card title="Pickup Location Add Karein">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim() || !address.trim() || !portal.merchant) return;
            setBusy(true);
            try {
              const { getFirebaseDb } = await import("@/lib/firebase");
              const { addLiveLocation } = await import("@/lib/live");
              const db = getFirebaseDb();
              if (db) {
                await addLiveLocation(db, portal.merchant.merchantId, {
                  name: name.trim(),
                  address: address.trim(),
                  city,
                });
                await portal.refresh();
              }
              setName("");
              setAddress("");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Naam (dukaan / warehouse)">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Address">
            <input
              className={inputCls}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
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
          <Btn type="submit" disabled={busy}>
            {busy ? "Save ho raha hai…" : "Save Karein"}
          </Btn>
        </form>
      </Card>

      <Card title="Saved Pickup Locations">
        {portal.locations.length === 0 ? (
          <p className="text-sm text-gray-500">Koi saved location nahi hai.</p>
        ) : (
          <ul className="space-y-2">
            {portal.locations.map((l) => (
              <li
                key={l.id}
                className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
              >
                <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                <p className="text-sm text-gray-600">
                  {l.address} • {l.city}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-gray-500">
          Location delete karna ho to admin se sampark karein (v1 me delete
          sirf demo me hai).
        </p>
      </Card>
    </>
  );
}
