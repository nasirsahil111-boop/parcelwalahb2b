"use client";

import Link from "next/link";
import { useDemo } from "@/components/DemoContext";
import { OrderList } from "@/components/OrderList";
import { Card, Stat } from "@/components/ui";

export default function DemoDashboard() {
  const demo = useDemo();
  const active = demo.orders.filter(
    (o) => o.status === "placed" || o.status === "accepted" || o.status === "picked"
  ).length;
  const delivered = demo.orders.filter(
    (o) => o.status === "delivered"
  ).length;

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900">
        Namaste, {demo.partnerName}
      </h1>
      <p className="text-sm text-gray-500">
        {demo.businessType} • {demo.city}
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Wallet Balance"
          value={`₹${demo.walletBalance.toLocaleString("en-IN")}`}
          sub="Prepaid — bina balance order nahi"
        />
        <Stat label="Active Orders" value={String(active)} />
        <Stat label="Delivered" value={String(delivered)} />
        <Stat label="Saved Locations" value={String(demo.locations.length)} />
      </div>

      <Card title="Quick Actions">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/demo/place-order"
            className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            + Place Order
          </Link>
          <Link
            href="/demo/wallet"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Wallet Recharge
          </Link>
          <Link
            href="/demo/orders"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Order History
          </Link>
        </div>
      </Card>

      <Card title="Recent Orders">
        <OrderList orders={demo.orders.slice(0, 4)} />
      </Card>
    </>
  );
}
