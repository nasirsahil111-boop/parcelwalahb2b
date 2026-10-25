"use client";

import { useState } from "react";
import { usePortal } from "@/components/PortalContext";
import { OrderList } from "@/components/OrderList";
import { Card } from "@/components/ui";
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from "@/lib/types";

export default function PortalOrders() {
  const portal = usePortal();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const shown =
    filter === "all"
      ? portal.orders
      : portal.orders.filter((o) => o.status === filter);

  return (
    <Card title="Order History">
      <div className="mb-4 flex flex-wrap gap-1">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === "all" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Sabhi
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === s ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      <OrderList orders={shown} />
    </Card>
  );
}
