import NepaliDate from "nepali-date-converter";

export interface NepaliMonthOption {
  value: number; // 0-indexed (0 = Baishakh)
  nameEn: string;
  nameNp: string;
}

export const NEPALI_MONTHS: NepaliMonthOption[] = [
  { value: 0, nameEn: "Baishakh", nameNp: "बैशाख" },
  { value: 1, nameEn: "Jestha", nameNp: "जेठ" },
  { value: 2, nameEn: "Ashadh", nameNp: "असार" },
  { value: 3, nameEn: "Shrawan", nameNp: "साउन" },
  { value: 4, nameEn: "Bhadra", nameNp: "भदौ" },
  { value: 5, nameEn: "Ashwin", nameNp: "असोज" },
  { value: 6, nameEn: "Kartik", nameNp: "कार्तिक" },
  { value: 7, nameEn: "Mangsir", nameNp: "मंसिर" },
  { value: 8, nameEn: "Poush", nameNp: "पुस" },
  { value: 9, nameEn: "Magh", nameNp: "माघ" },
  { value: 10, nameEn: "Falgun", nameNp: "फागुन" },
  { value: 11, nameEn: "Chaitra", nameNp: "चैत" },
];

/** Convert standard AD date string (YYYY-MM-DD) or Date to BS details */
export function adToBs(dateInput?: string | Date | null) {
  if (!dateInput) return null;
  try {
    const d = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
    if (isNaN(d.getTime())) return null;

    const nd = new NepaliDate(d);
    const year = nd.getYear();
    const month = nd.getMonth(); // 0-11
    const day = nd.getDate(); // 1-32

    const monthObj = NEPALI_MONTHS[month] || { nameEn: "Month", nameNp: "महिना" };

    return {
      year,
      month,
      day,
      monthEn: monthObj.nameEn,
      monthNp: monthObj.nameNp,
      formattedBsEn: `${day} ${monthObj.nameEn} ${year}`,
      formattedBsNp: `${toDevanagariNumerals(day)} ${monthObj.nameNp} ${toDevanagariNumerals(year)}`,
      shortBs: `${day} ${monthObj.nameEn}`,
      isoBs: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  } catch {
    return null;
  }
}

/** Convert BS (Year, Month 0-11, Day 1-32) to AD ISO string (YYYY-MM-DD) */
export function bsToAd(year: number, month: number, day: number): string | null {
  try {
    const nd = new NepaliDate(year, month, Math.max(1, Math.min(day, 32)));
    const jsDate = nd.toJsDate();
    const y = jsDate.getFullYear();
    const m = String(jsDate.getMonth() + 1).padStart(2, "0");
    const d = String(jsDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  } catch {
    return null;
  }
}

/** Returns today's date in both BS and AD */
export function getTodayDates() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const isoAd = `${y}-${m}-${d}`;
  const bs = adToBs(today);
  return {
    isoAd,
    bs,
  };
}

/** Formats a date showing both English and Nepali BS */
export function formatDualDate(dateInput?: string | null): string {
  if (!dateInput) return "Immediate / Flexible";
  const bs = adToBs(dateInput);
  const adFormatted = new Date(dateInput).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!bs) return adFormatted;
  return `${adFormatted} (${bs.formattedBsEn} BS · ${bs.formattedBsNp})`;
}

/** Formats a compact dual date for tables and chips */
export function formatShortDualDate(dateInput?: string | null): string {
  if (!dateInput) return "Immediate";
  const bs = adToBs(dateInput);
  if (!bs) return dateInput;
  return `${bs.formattedBsEn} BS (${new Date(dateInput).toLocaleDateString("en-GB", { day: "numeric", month: "short" })})`;
}

/** Convert English numerals (0-9) to Devanagari numerals (०-९) */
export function toDevanagariNumerals(n: number | string): string {
  const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(n)
    .split("")
    .map((c) => {
      const idx = parseInt(c, 10);
      return isNaN(idx) ? c : devanagariDigits[idx];
    })
    .join("");
}

/** Generate popular Nepali student move-in dates for quick selection */
export function getPopularNepaliIntakes() {
  const { bs } = getTodayDates();
  if (!bs) return [];

  const currentYear = bs.year;
  const currentMonth = bs.month;

  const options: { label: string; subLabel: string; adDate: string; isImmediate?: boolean }[] = [];

  // 1. Immediate / Today
  const todayAd = bsToAd(currentYear, currentMonth, bs.day);
  if (todayAd) {
    options.push({
      label: "आजैबाट (Immediate)",
      subLabel: `From today (${bs.shortBs})`,
      adDate: todayAd,
      isImmediate: true,
    });
  }

  // 2. 1st of upcoming month (१ गते)
  const nextMonth = (currentMonth + 1) % 12;
  const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear;
  const nextMonthAd = bsToAd(nextMonthYear, nextMonth, 1);
  if (nextMonthAd) {
    const monthObj = NEPALI_MONTHS[nextMonth];
    options.push({
      label: `१ ${monthObj.nameNp} बाट (1st ${monthObj.nameEn})`,
      subLabel: `New Month Intake`,
      adDate: nextMonthAd,
    });
  }

  // 3. 15th of upcoming month (१५ गते)
  const midMonthAd = bsToAd(nextMonthYear, nextMonth, 15);
  if (midMonthAd) {
    const monthObj = NEPALI_MONTHS[nextMonth];
    options.push({
      label: `१५ ${monthObj.nameNp} बाट (15th ${monthObj.nameEn})`,
      subLabel: `Mid-Month Intake`,
      adDate: midMonthAd,
    });
  }

  // 4. 1st of subsequent month
  const subsequentMonth = (currentMonth + 2) % 12;
  const subsequentYear = subsequentMonth < currentMonth ? currentYear + 1 : currentYear;
  const subsequentAd = bsToAd(subsequentYear, subsequentMonth, 1);
  if (subsequentAd) {
    const monthObj = NEPALI_MONTHS[subsequentMonth];
    options.push({
      label: `१ ${monthObj.nameNp} बाट (1st ${monthObj.nameEn})`,
      subLabel: `Next Session Intake`,
      adDate: subsequentAd,
    });
  }

  return options;
}
