import Stripe from "stripe";

export const FREE_LIMIT = 30;
export const PRICE_JPY = 980;

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });
}
