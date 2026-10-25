"use client";

import { useDemo } from "@/components/DemoContext";
import { Card } from "@/components/ui";
import { RATE_CARDS } from "@/lib/rates";

export default function DemoRateCard() {
  const demo = useDemo();
  return (
    <>
      <p className="text-sm text-gray-600">
        Aapki city: <span className="font-semibold">{demo.city}</span> — neeche
        uska card highlight hai. Baaki cities ke cards bhi dekh sakte hain.
      </p>
      {RATE_CARDS.map((card) => (
        <Card
          key={card.city}
          title={`${card.city} Rate Card${card.city === demo.city ? " (aapki city)" : ""}`}
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
          <p className="mt-2 text-xs text-gray-500">
            10 km se zyada distance par is card me rate nahi hai — admin se
            confirm hoga.
          </p>
        </Card>
      ))}
    </>
  );
}
