"use client";

import { usePortal } from "@/components/PortalContext";
import { Card } from "@/components/ui";
import { RATE_CARDS } from "@/lib/rates";

export default function PortalRateCard() {
  const portal = usePortal();
  const myCity = portal.merchant?.city;
  return (
    <>
      {myCity ? (
        <p className="text-sm text-gray-600">
          Aapki city: <span className="font-semibold">{myCity}</span>
        </p>
      ) : null}
      {RATE_CARDS.map((card) => (
        <Card
          key={card.city}
          title={`${card.city} Rate Card${card.city === myCity ? " (aapki city)" : ""}`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1">Distance</th>
                <th className="py-1">Fee</th>
              </tr>
            </thead>
            <tbody>
              {card.standard.map((s) => (
                <tr key={s.upToKm} className="border-t border-gray-100">
                  <td className="py-1.5">{s.upToKm} km tak</td>
                  <td className="py-1.5 font-semibold">₹{s.fee}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-100">
                <td className="py-1.5">
                  Food / shopping (flat, {card.foodFlatUpToKm} km tak)
                </td>
                <td className="py-1.5 font-semibold">₹{card.foodFlatFee}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      ))}
    </>
  );
}
