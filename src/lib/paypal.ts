// PayPal 定期支払い（Subscriptions API）。
// Stripe は日本で「サイキックサービス / 占い師」が禁止業種のため、新規の申し込みは PayPal で受ける。
// 既存の Stripe 契約者は Stripe のまま（/api/stripe/webhook が引き続き処理する）。
//
// DB 列は増やさず、Stripe と同じ列を使う：
//   stripe_subscription_id … PayPal の契約ID（"I-" で始まる。Stripe は "sub_"）
//   stripe_customer_id     … PayPal の payer_id
// どちらの決済かは isPaypalSubscription() で見分ける。

import { randomUUID } from "crypto";
import { getSupabase } from "@/lib/supabase";

const API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

export function isPaypalSubscription(id: string | null | undefined): boolean {
  return !!id && id.startsWith("I-");
}

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function paypalFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`PayPal ${path} error: ${res.status} ${text}`);
  return data;
}

// 月額の申し込みを作り、お客さまが承認するPayPalの画面のURLを返す
export async function createPaypalCheckout(email: string): Promise<string> {
  const sub = await paypalFetch("/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: process.env.PAYPAL_PLAN_ID,
      custom_id: email,
      subscriber: { email_address: email },
      application_context: {
        brand_name: "世界の占い堂",
        locale: "ja-JP",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        // PayPal が戻り先に ?subscription_id=I-xxx を付けて返す
        return_url: `${process.env.NEXT_PUBLIC_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/gate?canceled=1`,
      },
    }),
  });
  const approve = (sub.links as { rel: string; href: string }[]).find((l) => l.rel === "approve");
  if (!approve) throw new Error("PayPal approve link missing");
  return approve.href;
}

export type PaypalSubscription = {
  id: string;
  status: string; // APPROVAL_PENDING | APPROVED | ACTIVE | SUSPENDED | CANCELLED | EXPIRED
  custom_id?: string;
  create_time?: string;
  subscriber?: {
    email_address?: string;
    payer_id?: string;
    name?: { given_name?: string; surname?: string };
  };
  billing_info?: { next_billing_time?: string };
};

export async function getPaypalSubscription(id: string): Promise<PaypalSubscription> {
  return paypalFetch(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);
}

export function payerName(sub: PaypalSubscription): string | null {
  const n = sub.subscriber?.name;
  const full = [n?.surname, n?.given_name].filter(Boolean).join(" ").trim();
  return full || null;
}

// Webhook の署名をPayPalに照会して確かめる
export async function verifyPaypalWebhook(headers: Headers, rawBody: string): Promise<boolean> {
  try {
    const data = await paypalFetch("/v1/notifications/verify-webhook-signature", {
      method: "POST",
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(rawBody),
      }),
    });
    return data.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

// 契約が有効になったお客さまを有料会員にする。戻り画面と Webhook の両方から呼ぶので、
// 何度呼んでも同じ結果になるようにする（ログイン用トークンは在れば使い回す）
export async function activatePaypalUser(sub: PaypalSubscription): Promise<string | null> {
  const email = (sub.custom_id || sub.subscriber?.email_address || "").toLowerCase();
  if (!email) return null;
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("uranai_users")
    .select("access_token")
    .eq("email", email)
    .maybeSingle();
  const token = existing?.access_token || randomUUID();
  const patch: Record<string, unknown> = {
    email,
    plan: "paid",
    stripe_customer_id: sub.subscriber?.payer_id || null,
    stripe_subscription_id: sub.id,
    subscription_status: "active",
    access_token: token,
    payment_failed_at: null,
  };
  const name = payerName(sub);
  if (name) patch.name = name;
  await supabase.from("uranai_users").upsert(patch, { onConflict: "email" });
  return token;
}
