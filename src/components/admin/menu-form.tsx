"use client";

import { saveMenu, type FormState } from "@/app/admin/actions";
import { DAYS } from "@/lib/format";
import type { MealDay } from "@/lib/types";
import { FormAlert, SubmitButton, useFormAction } from "./ui";

const COLS = [
  ["breakfast", "Morning"],
  ["lunch", "Day meal"],
  ["snacks", "Snacks"],
  ["dinner", "Dinner"],
] as const;

export function MenuForm({ menu }: { menu: MealDay[] }) {
  const [state, onSubmit, pending] = useFormAction<FormState>(saveMenu, null);
  return (
    <form onSubmit={onSubmit} className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-sand text-left">
            <tr>
              <th className="px-4 py-3 font-bold">Day</th>
              {COLS.map(([, l]) => <th key={l} className="px-2 py-3 font-bold">{l}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {menu.map((d) => (
              <tr key={d.day}>
                <td className="px-4 py-2 font-semibold">{DAYS[d.day]}</td>
                {COLS.map(([k, l]) => (
                  <td key={k} className="px-2 py-2">
                    <input name={`${d.day}.${k}`} defaultValue={d[k]} maxLength={120} className="input" aria-label={`${DAYS[d.day]} ${l}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-line p-4">
        <SubmitButton pending={pending}>Save menu</SubmitButton>
        <div className="flex-1"><FormAlert state={state} /></div>
      </div>
    </form>
  );
}
