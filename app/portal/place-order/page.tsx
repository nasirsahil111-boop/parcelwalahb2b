"use client";

import { useState } from "react";
import { usePortal } from "@/components/PortalContext";
import { PlaceOrderForm } from "@/components/PlaceOrderForm";

export default function PortalPlaceOrder() {
  const portal = usePortal();
  const [submitting, setSubmitting] = useState(false);

  return (
    <PlaceOrderForm
      locations={portal.locations}
      walletBalance={portal.merchant?.walletBalance ?? 0}
      submitting={submitting}
      onSubmit={async (input) => {
        setSubmitting(true);
        try {
          await portal.placeOrder(input);
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
}
