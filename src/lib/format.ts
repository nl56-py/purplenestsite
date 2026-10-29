const npr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const formatRs = (n: number) => `Rs. ${npr.format(n)}`;

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-GB", { timeZone: "Asia/Kathmandu", ...opts });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Kathmandu",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  const withCountry = digits.length === 10 && digits.startsWith("9") ? `977${digits}` : digits;
  return `https://wa.me/${withCountry}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function availabilityLabel(available: number, total: number) {
  if (total === 0 || available === 0) return { text: "Full", tone: "full" as const };
  if (available <= 2) return { text: `Only ${available} bed${available === 1 ? "" : "s"} left`, tone: "low" as const };
  return { text: `${available} beds available`, tone: "ok" as const };
}

/** ISO timestamp → value for <input type="datetime-local"> in Nepal time. */
export function toKtmInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + (5 * 60 + 45) * 60000);
  return d.toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value (Nepal time) → ISO timestamp. */
export function fromKtmInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00+05:45`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
