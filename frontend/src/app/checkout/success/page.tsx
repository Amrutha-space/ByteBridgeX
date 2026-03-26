import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";

import { CheckoutSuccessClient } from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loader label="Confirming payment..." />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
