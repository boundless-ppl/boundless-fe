const PENDING_PAYMENT_STORAGE_KEY = "boundless_pending_payment";

export type PendingPaymentRecord = {
  paymentId: string;
  transactionId: string;
  submittedAt: string;
};

export function readPendingPayment(): PendingPaymentRecord | null {
  if (globalThis.window === undefined) {
    return null;
  }

  const rawValue = globalThis.localStorage.getItem(PENDING_PAYMENT_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PendingPaymentRecord>;
    if (
      typeof parsed.paymentId !== "string" ||
      typeof parsed.transactionId !== "string" ||
      typeof parsed.submittedAt !== "string"
    ) {
      return null;
    }

    return {
      paymentId: parsed.paymentId,
      transactionId: parsed.transactionId,
      submittedAt: parsed.submittedAt,
    };
  } catch {
    return null;
  }
}

export function savePendingPayment(record: PendingPaymentRecord) {
  if (globalThis.window === undefined) {
    return;
  }

  globalThis.localStorage.setItem(
    PENDING_PAYMENT_STORAGE_KEY,
    JSON.stringify(record)
  );
}

export function clearPendingPayment() {
  if (globalThis.window === undefined) {
    return;
  }

  globalThis.localStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
}
