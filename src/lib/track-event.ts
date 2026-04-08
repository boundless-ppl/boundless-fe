import amplitude from "@/lib/amplitude";

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof amplitude.track !== "function") {
    return;
  }

  amplitude.track(eventName, properties);
}