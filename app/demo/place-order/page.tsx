"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoContext";
import { PlaceOrderForm } from "@/components/PlaceOrderForm";

export default function DemoPlaceOrder() {
  const demo = useDemo();
  const [submitting, setSubmitting] = useState(false);

  return (
    <PlaceOrderForm
      locations={demo.locations}
      walletBalance={demo.walletBalance}
      submitting={submitting}
      onSubmit={async (input) => {
        setSubmitting(true);
        demo.placeOrder(input);
        setSubmitting(false);
      }}
    />
  );
}
