import { loadStripe, Stripe } from "@stripe/js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode, useMemo } from "react";

// Test publishable key - replace with your live key later
const STRIPE_PUBLISHABLE_KEY =
  process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51QZ7F7LZ0P5dM7MWQHFHyVHp5LFvqNlxzlYy3Vq6k4G6pqVnKW7MJXfSNQzZ9U9N1Z9K9L9M9N9O9P9Q9R9";

let stripePromise: Promise<Stripe | null>;

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const stripe = useMemo(() => getStripe(), []);

  return <Elements stripe={stripe}>{children}</Elements>;
}
