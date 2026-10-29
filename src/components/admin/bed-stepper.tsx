"use client";

import { useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { setAvailableBeds } from "@/app/admin/actions";

/** − / + control that saves bed availability immediately. */
export function BedStepper({ id, value, max }: { id: string; value: number; max: number }) {
  const [beds, setBeds] = useState(value);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const save = (next: number) => {
    const clamped = Math.max(0, Math.min(max, next));
    if (clamped === beds) return;
    const prev = beds;
    setBeds(clamped);
    setError("");
    start(async () => {
      const res = await setAvailableBeds(id, clamped);
      if (!res.ok) {
        setBeds(prev);
        setError(res.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-end">
      <div className={`flex items-center overflow-hidden rounded-lg border border-line ${pending ? "opacity-70" : ""}`}>
        <button type="button" aria-label="One less bed available" onClick={() => save(beds - 1)} disabled={beds <= 0} className="grid size-9 place-items-center hover:bg-sand disabled:opacity-30">
          <Minus className="size-4" />
        </button>
        <span className="min-w-16 px-2 text-center text-sm">
          <b className={beds === 0 ? "text-red-600" : "text-brand"}>{beds}</b>
          <span className="text-muted"> / {max}</span>
        </span>
        <button type="button" aria-label="One more bed available" onClick={() => save(beds + 1)} disabled={beds >= max} className="grid size-9 place-items-center hover:bg-sand disabled:opacity-30">
          <Plus className="size-4" />
        </button>
      </div>
      <span className="mt-0.5 text-[11px] text-muted">{error ? <span className="text-red-600">{error}</span> : beds === 0 ? "Full" : "free"}</span>
    </div>
  );
}
