"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Sparkles } from "lucide-react";
import {
  NEPALI_MONTHS,
  adToBs,
  bsToAd,
  getPopularNepaliIntakes,
  getTodayDates,
  toDevanagariNumerals,
} from "@/lib/nepali-date";

interface NepaliDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
}

export function NepaliDatePicker({
  value,
  onChange,
  id = "move-in-date",
  className = "tfield",
  placeholder = "Move-in date",
}: NepaliDatePickerProps) {
  const [calendarMode, setCalendarMode] = useState<"BS" | "AD">("BS");
  const [isOpen, setIsOpen] = useState(false);

  // Initialize BS state from value or current date
  const initialBs = adToBs(value) || getTodayDates().bs;
  const [bsYear, setBsYear] = useState<number>(initialBs?.year || 2083);
  const [bsMonth, setBsMonth] = useState<number>(initialBs?.month || 5);
  const [bsDay, setBsDay] = useState<number>(initialBs?.day || 1);

  // Update BS state if value changes externally
  useEffect(() => {
    if (value) {
      const parsed = adToBs(value);
      if (parsed) {
        setBsYear(parsed.year);
        setBsMonth(parsed.month);
        setBsDay(parsed.day);
      }
    }
  }, [value]);

  const intakes = getPopularNepaliIntakes();

  const handleBsChange = (y: number, m: number, d: number) => {
    setBsYear(y);
    setBsMonth(m);
    setBsDay(d);
    const ad = bsToAd(y, m, d);
    if (ad) {
      onChange(ad);
    }
  };

  const currentBsInfo = adToBs(value);

  // Display label
  const displayText = value
    ? currentBsInfo
      ? `${currentBsInfo.shortBs} BS (${new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
      : value
    : "";

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          readOnly
          value={displayText}
          placeholder={placeholder}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${className} cursor-pointer pr-10`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Nepali date picker"
          className="absolute right-3 grid size-8 place-items-center rounded text-muted hover:text-ink transition"
        >
          <Calendar className="size-4 text-brand" />
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[310px] max-w-sm rounded-2xl border border-line bg-white p-4 shadow-2xl animate-fade-in">
            {/* Calendar mode switcher */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-bold text-stone-700">Move-In Calendar</span>
              <div className="inline-flex rounded-lg bg-sand/80 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCalendarMode("BS")}
                  className={`rounded-md px-3 py-1 transition ${
                    calendarMode === "BS"
                      ? "bg-brand text-white shadow-xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  नेपाली (B.S.)
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMode("AD")}
                  className={`rounded-md px-3 py-1 transition ${
                    calendarMode === "AD"
                      ? "bg-brand text-white shadow-xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  English (A.D.)
                </button>
              </div>
            </div>

            {/* Quick popular intakes */}
            <div className="mt-3">
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="size-3 text-brand" />
                Popular Move-In Intakes
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {intakes.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange(opt.adDate);
                      setIsOpen(false);
                    }}
                    className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                      value === opt.adDate
                        ? "border-brand bg-brand-soft font-bold text-brand"
                        : "border-line bg-white hover:border-brand/60 text-ink"
                    }`}
                  >
                    <span className="block truncate">{opt.label}</span>
                    <span className="block text-[10px] text-muted truncate">{opt.subLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BS Picker */}
            {calendarMode === "BS" ? (
              <div className="mt-3.5 border-t border-line pt-3">
                <p className="text-[11px] font-bold text-stone-700 mb-2">Custom Bikram Sambat Date</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* Year */}
                  <div>
                    <label className="text-[10px] text-muted block mb-1">Year (वर्ष)</label>
                    <select
                      value={bsYear}
                      onChange={(e) => handleBsChange(Number(e.target.value), bsMonth, bsDay)}
                      className="w-full rounded-lg border border-line bg-sand/40 p-2 font-semibold text-ink"
                    >
                      {[2081, 2082, 2083, 2084, 2085].map((y) => (
                        <option key={y} value={y}>
                          {y} ({toDevanagariNumerals(y)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="text-[10px] text-muted block mb-1">Month (महिना)</label>
                    <select
                      value={bsMonth}
                      onChange={(e) => handleBsChange(bsYear, Number(e.target.value), bsDay)}
                      className="w-full rounded-lg border border-line bg-sand/40 p-2 font-semibold text-ink"
                    >
                      {NEPALI_MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.nameNp} ({m.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Day */}
                  <div>
                    <label className="text-[10px] text-muted block mb-1">Gatey (गते)</label>
                    <select
                      value={bsDay}
                      onChange={(e) => handleBsChange(bsYear, bsMonth, Number(e.target.value))}
                      className="w-full rounded-lg border border-line bg-sand/40 p-2 font-semibold text-ink"
                    >
                      {Array.from({ length: 32 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d} ({toDevanagariNumerals(d)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {value && currentBsInfo && (
                  <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200/80 p-2 text-center text-xs text-emerald-900">
                    Selected: <strong>{currentBsInfo.formattedBsNp}</strong>
                    <span className="block text-[11px] text-emerald-700">
                      ({currentBsInfo.formattedBsEn} BS · {new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* AD Native picker */
              <div className="mt-3.5 border-t border-line pt-3 space-y-2">
                <label className="text-[11px] font-bold text-stone-700 block">Select English (AD) Date</label>
                <input
                  type="date"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full rounded-lg border border-line p-2 text-xs text-ink"
                />
                {value && currentBsInfo && (
                  <p className="text-xs text-brand font-semibold text-center pt-1">
                    Equivalent BS: {currentBsInfo.formattedBsNp} ({currentBsInfo.formattedBsEn} BS)
                  </p>
                )}
              </div>
            )}

            {/* Done button */}
            <div className="mt-3.5 border-t border-line pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="text-xs text-muted hover:text-red-600 transition"
              >
                Clear date
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-90 transition"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
