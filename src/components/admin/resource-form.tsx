"use client";

import Link from "next/link";
import { useState } from "react";
import { saveResource, type FormState } from "@/app/admin/actions";
import { getResource, type Field } from "@/lib/resources";
import { FACILITY_ICONS } from "@/lib/icons";
import { toKtmInput } from "@/lib/format";
import { ImageInput, ImagesInput } from "./image-input";
import { FormAlert, SubmitButton, useFormAction } from "./ui";

export function ResourceForm({ resourceKey, id, initial }: { resourceKey: string; id: string | null; initial: Record<string, unknown> | null }) {
  const res = getResource(resourceKey)!;
  const [state, onSubmit, pending] = useFormAction<FormState>(saveResource.bind(null, resourceKey, id), null);

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {res.fields.map((f) => (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <FieldInput field={f} value={initial ? initial[f.name] : f.type === "datetime" && f.required ? new Date().toISOString() : f.default} folder={resourceKey} />
          </div>
        ))}
      </div>
      <FormAlert state={state} />
      <div className="flex gap-3 border-t border-line pt-5">
        <SubmitButton pending={pending}>{id ? "Save changes" : `Add ${res.singular}`}</SubmitButton>
        <Link href={`/admin/${resourceKey}`} className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}

function FieldInput({ field: f, value, folder }: { field: Field; value: unknown; folder: string }) {
  const help = f.help && <span className="mt-1 block text-xs text-muted">{f.help}</span>;
  switch (f.type) {
    case "checkbox":
      return (
        <label className="flex h-full items-center gap-3 rounded-lg border border-line px-4 py-3">
          <input type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="size-4 accent-[var(--brand)]" />
          <span className="text-sm font-semibold">{f.label}</span>
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <span className="label">{f.label}{f.required && " *"}</span>
          <textarea name={f.name} defaultValue={String(value ?? "")} required={f.required} maxLength={f.maxLength} rows={f.maxLength && f.maxLength > 1000 ? 7 : 3} className="input" placeholder={f.placeholder} />
          {help}
        </label>
      );
    case "tags":
      return (
        <label className="block">
          <span className="label">{f.label}</span>
          <textarea name={f.name} defaultValue={Array.isArray(value) ? value.join("\n") : ""} rows={4} className="input" />
          {help}
        </label>
      );
    case "number":
      return (
        <label className="block">
          <span className="label">{f.label}{f.required && " *"}</span>
          <input type="number" name={f.name} defaultValue={value === null || value === undefined ? "" : String(value)} required={f.required} min={f.min} max={f.max} step={1} className="input" inputMode="numeric" />
          {help}
        </label>
      );
    case "datetime":
      return (
        <label className="block">
          <span className="label">{f.label}{f.required && " *"}</span>
          <input type="datetime-local" name={f.name} defaultValue={toKtmInput(value as string | null)} required={f.required} className="input" />
          {help ?? <span className="mt-1 block text-xs text-muted">Nepal time</span>}
        </label>
      );
    case "icon":
      return <IconPicker name={f.name} label={f.label} defaultValue={String(value ?? "check")} />;
    case "image":
      return (
        <div>
          <span className="label">{f.label}</span>
          <ImageInput name={f.name} defaultValue={value as string | null} folder={folder} />
          {help}
        </div>
      );
    case "images":
      return (
        <div>
          <span className="label">{f.label}</span>
          <ImagesInput name={f.name} defaultValue={(value as string[]) ?? []} folder={folder} />
          {help}
        </div>
      );
    default:
      return (
        <label className="block">
          <span className="label">{f.label}{f.required && " *"}</span>
          <input type="text" name={f.name} defaultValue={String(value ?? "")} required={f.required} maxLength={f.maxLength} placeholder={f.placeholder} className="input" />
          {help}
        </label>
      );
  }
}

function IconPicker({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-8 gap-1.5 rounded-lg border border-line p-2">
        {Object.entries(FACILITY_ICONS).map(([key, { icon: Icon, label: l }]) => (
          <button
            key={key}
            type="button"
            title={l}
            aria-label={l}
            aria-pressed={value === key}
            onClick={() => setValue(key)}
            className={`grid aspect-square place-items-center rounded-md transition ${value === key ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-brand"}`}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
