"use client";

import { useDemo } from "@/components/DemoContext";
import { Badge, Card } from "@/components/ui";
import { COD_STAGE_LABEL } from "@/lib/types";

export default function DemoSettlements() {
  const demo = useDemo();
  return (
    <>
      <Card title="COD Ledger — kaise kaam karta hai">
        <p className="text-sm text-gray-700">
          Captain customer se COD collect karta hai, apni earning rakh kar
          baaki Parcelwalah ko deta hai. Example: COD ₹200 collect → captain
          earning ₹20 → wallet me <span className="font-bold">−₹180</span>{" "}
          (Parcelwalah ko dena hai). Deposit <b>online-only</b> hai — koi cash
          collection nahi: (1) customer delivery par Parcelwalah QR par UPI
          kare, (2) earning ke against adjust, (3) baaki direct UPI, dedicated
          COD-collection UPI ID par (+ UTR, admin verify karega).
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Partner settlement T+1 hota hai — order-wise breakup + UTR ke saath
          partner ko manual transfer.
        </p>
      </Card>

      <Card title="COD Settlements">
        {demo.settlements.length === 0 ? (
          <p className="text-sm text-gray-500">Koi settlement nahi hai.</p>
        ) : (
          <ul className="space-y-3">
            {demo.settlements.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    Order {s.orderId}
                  </span>
                  <Badge>{COD_STAGE_LABEL[s.stage]}</Badge>
                </div>
                <p className="mt-2 text-sm text-gray-800">
                  COD collected: ₹{s.codCollected} • Captain earning: ₹
                  {s.captainEarning} •{" "}
                  <span className="font-semibold text-red-700">
                    Wallet −₹{s.owed}
                  </span>
                </p>
                {s.utr ? (
                  <p className="text-xs text-gray-500">UTR: {s.utr}</p>
                ) : null}
                <p className="text-xs text-gray-500">{s.at}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
