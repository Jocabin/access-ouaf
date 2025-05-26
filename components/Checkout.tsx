"use client";

import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { PaymentForm } from "@/types";
import { convertToSubcurrency } from "@/lib/utils";
import { Button } from "primereact/button";

export default function Checkout({ total }: PaymentForm) {
  const stripe = useStripe();
  const elements = useElements();
  const [error_message, set_error_message] = useState("");
  const [client_secret, set_client_secret] = useState("");
  const [loading, set_loading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertToSubcurrency(total),
      }),
    })
      .then((res) => res.json())
      .then((data) => set_client_secret(data.clientSecret));
  }, [total]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    set_loading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      set_error_message(submitError.message ?? "Erreur lors du paiement");
      set_loading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
    });

    if (confirmError) {
      set_error_message(
        confirmError.message ?? "Erreur lors de la valdiation du paiement"
      );
    }

    set_loading(false);
  }

  if (!client_secret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Chargement...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error_message && (
        <div className="p-3 bg-red-200 rounded">{error_message}</div>
      )}
      {client_secret && <PaymentElement />}

      <Button
        className="w-full text-center justify-center"
        disabled={!stripe || loading}
      >
        {loading ? "Traitement..." : `Payer ${total} €`}
      </Button>
    </form>
  );
}
