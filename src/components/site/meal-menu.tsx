"use client";

import { useState, useSyncExternalStore } from "react";
import type { MealDay } from "@/lib/types";
import { DAYS } from "@/lib/format";
import { SectionHeading } from "./section-heading";

const MEALS = [
  { key: "breakfast", label: "Morning" },
  { key: "lunch", label: "Day meal" },
  { key: "snacks", label: "Snacks" },
  { key: "dinner", label: "Dinner" },
] as const;

const noop = () => () => {};

function kathmanduDay() {
  const name = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kathmandu" });
  return Math.max(0, DAYS.indexOf(name));
}

export function MealMenu({ menu }: { menu: MealDay[] }) {
  // Today is only known in the browser (the page itself is cached on the server).
  const todayIdx = useSyncExternalStore(noop, kathmanduDay, () => null);
  const [picked, setPicked] = useState<number | null>(null);
  const day = picked ?? todayIdx ?? 0;

  const activeMeals = MEALS.filter((m) => menu.some((d) => d[m.key]));
  if (!activeMeals.length) return null;
  const selected = menu.find((d) => d.day === day) ?? menu[0];

  return (
    <section id="menu" className="bg-sand py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHeading title="Food menu" label="fresh & homely, every day" />

        {/* Desktop: whole week */}
        <div className="mt-14 hidden overflow-hidden bg-white md:block">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="bg-ink text-white">
                <th className="oswald px-6 py-5 text-[12px] font-medium !tracking-[0.25em]">Day</th>
                {activeMeals.map((m) => (
                  <th key={m.key} className="oswald px-6 py-5 text-[12px] font-medium !tracking-[0.25em]">{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menu.map((d) => {
                const isToday = d.day === todayIdx;
                return (
                  <tr key={d.day} className={`border-t border-line ${isToday ? "bg-sun/35" : "odd:bg-cream"}`}>
                    <th className="oswald px-6 py-4 text-[13px] font-medium text-ink">
                      {DAYS[d.day]}
                      {isToday && <span className="ml-2 bg-brand px-2 py-0.5 text-[10px] text-white">today</span>}
                    </th>
                    {activeMeals.map((m) => (
                      <td key={m.key} className="px-6 py-4 text-ink/80">{d[m.key] || "—"}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: one day at a time */}
        <div className="mt-10 md:hidden">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="tablist">
            {menu.map((d) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                aria-selected={d.day === selected.day}
                onClick={() => setPicked(d.day)}
                className={`oswald shrink-0 px-4 py-3 text-[12px] !tracking-[0.15em] ${d.day === selected.day ? "bg-brand text-white" : "bg-white text-ink"}`}
              >
                {DAYS[d.day].slice(0, 3)}
                {d.day === todayIdx && " ★"}
              </button>
            ))}
          </div>
          <dl className="mt-4 divide-y divide-line bg-white">
            {activeMeals.map((m) => (
              <div key={m.key} className="flex justify-between gap-4 px-5 py-4">
                <dt className="oswald text-[12px] !tracking-[0.2em] text-muted">{m.label}</dt>
                <dd className="text-right text-ink">{selected[m.key] || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
