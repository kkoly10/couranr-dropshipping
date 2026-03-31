/* eslint-disable */

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("couranr-cookie-consent") === "accepted";
}

/**
 * Fire an event to both Meta Pixel and GA4.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function trackViewContent(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  currency: string;
}): void {
  trackEvent("ViewContent", params);
}

export function trackAddToCart(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  currency: string;
}): void {
  trackEvent("AddToCart", params);
}

export function trackInitiateCheckout(params: {
  value: number;
  currency: string;
  num_items: number;
}): void {
  trackEvent("InitiateCheckout", params);
}

export function trackPurchase(params: {
  value: number;
  currency: string;
  transaction_id: string;
}): void {
  trackEvent("Purchase", params);
}
