"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { Btn, Card, Field, inputCls } from "@/components/ui";
import type { City } from "@/lib/types";

export default function DemoLocations() {
  const demo = useDemo();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState<City>("Ratlam");

  return (
    <>
      <Card title="Pickup Location Add Karein">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !address.trim()) return;
            demo.addLocation({ name: name.trim(), address: address.trim(), city });
            setName("");
            setAddress("");
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
          <Btn type="submit">Save Karein</Btn>
        </form>
      </Card>

      <Card title="Saved Pickup Locations">
        {demo.locations.length === 0 ? (
          <p className="text-sm text-gray-500">Koi saved location nahi hai.</p>
        ) : (
          <ul className="space-y-2">
            {demo.locations.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                  <p className="text-sm text-gray-600">
                    {l.address} • {l.city}
                  </p>
                </div>
                <Btn
                  variant="danger"
                  onClick={() => demo.deleteLocation(l.id)}
                >
                  Delete
                </Btn>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
