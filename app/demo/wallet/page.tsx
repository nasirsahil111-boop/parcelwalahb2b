"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { Btn, Card, Field, inputCls, Stat } from "@/components/ui";

export default function DemoWallet() {
  const demo = useDemo();
  const [amount, setAmount] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <>
      <Stat
        label="Wallet Balance"
        value={`₹${demo.walletBalance.toLocaleString("en-IN")}`}
        sub="Prepaid — order fee isi se kat-ti hai"
      />

      <Card title="Wallet Recharge (Top-up Request)">
        <p className="mb-3 text-sm text-gray-600">
          v1 me: UPI se payment karke request bhejein — admin verify karke
          wallet credit karega. Demo me request sirf list me dikhegi, balance
          nahi badhega.
        </p>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const n = parseFloat(amount);
            if (Number.isFinite(n) && n > 0) {
              demo.requestTopup(n);
              setAmount("");
              setSent(true);
            }
          }}
        >
          <Field label="Amount (₹)">
            <input
              className={inputCls}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Jaise: 1000"
            />
          </Field>
          <Btn type="submit">Top-up Request Bhejein</Btn>
        </form>
        {sent ? (
          <p className="mt-2 text-sm font-medium text-green-700">
            Request bhej di gayi — admin verify karke credit karega.
          </p>
        ) : null}
      </Card>

      <Card title="Transactions">
        {demo.txns.length === 0 ? (
          <p className="text-sm text-gray-500">Koi transaction nahi hai.</p>
        ) : (
          <ul className="space-y-2">
            {demo.txns.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm text-gray-800">{t.note}</p>
                  <p className="text-xs text-gray-500">{t.at}</p>
                </div>
                <p
                  className={`text-sm font-bold ${t.type === "debit" ? "text-red-700" : "text-green-700"}`}
                >
                  {t.type === "debit" ? "−" : "+"}₹{t.amount}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
