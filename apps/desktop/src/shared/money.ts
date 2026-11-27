export function getCurrencyFractionDigits(currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 0;
}

// Parse a decimal string into whole minor units, such as paise for INR.
export function parseMoneyAmount(value: string, currency: string) {
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return null;
  const [whole = "", fraction = ""] = value.split(".");
  const digits = getCurrencyFractionDigits(currency);
  if (fraction.length > digits) return null;

  const amount = Number(whole + fraction.padEnd(digits, "0"));
  return Number.isSafeInteger(amount) ? amount : null;
}
