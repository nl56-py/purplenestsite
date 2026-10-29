"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Link2, LoaderCircle, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";

function useUploader(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(files: File[], onDone: (urls: string[]) => void) {
    setBusy(true);
    setError("");
    const urls: string[] = [];
    for (const f of files) {
      try {
        urls.push(await uploadImage(f, folder));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setBusy(false);
    if (urls.length) onDone(urls);
  }
  return { busy, error, setError, run };
}

/** Single image with preview. Submits the public URL in a hidden input. */
export function ImageInput({
  name,
  defaultValue,
  folder,
  aspect = "aspect-[16/9]",
  onChange,
}: {
  name?: string;
  defaultValue?: string | null;
  folder: string;
  aspect?: string;
  onChange?: (url: string) => void;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const { busy, error, setError, run } = useUploader(folder);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (u: string) => {
    setUrl(u);
    onChange?.(u);
  };

  return (
    <div>
      {name && <input type="hidden" name={name} value={url} />}
      <div className={`relative ${aspect} w-full max-w-md overflow-hidden rounded-xl border border-dashed border-line bg-sand`}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="flex size-full flex-col items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-brand">
            <ImagePlus className="size-7" /> Upload photo
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <LoaderCircle className="size-7 animate-spin text-brand" />
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost py-1.5 text-xs" onClick={() => fileRef.current?.click()} disabled={busy}>
          <ImagePlus className="size-3.5" /> {url ? "Replace" : "Choose file"}
        </button>
        <button
          type="button"
          className="btn btn-ghost py-1.5 text-xs"
          onClick={() => {
            const u = window.prompt("Paste an image link (https://…)");
            if (u && /^https:\/\//.test(u.trim())) set(u.trim());
            else if (u) setError("The link must start with https://");
          }}
        >
          <Link2 className="size-3.5" /> Use a link
        </button>
        {url && (
          <button type="button" className="btn btn-danger py-1.5 text-xs" onClick={() => set("")}>
            <Trash2 className="size-3.5" /> Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) run([f], ([u]) => set(u));
        }}
      />
    </div>
  );
}

/** Several images with reorder/remove. Submits a JSON array. */
export function ImagesInput({ name, defaultValue, folder }: { name: string; defaultValue?: string[]; folder: string }) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const { busy, error, run } = useUploader(folder);
  const fileRef = useRef<HTMLInputElement>(null);
  const move = (i: number, d: number) =>
    setUrls((u) => {
      const next = [...u];
      const j = i + d;
      if (j < 0 || j >= next.length) return u;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {urls.map((u, i) => (
          <div key={u} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="size-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1">
              <span className="flex">
                <button type="button" aria-label="Move left" className="rounded p-1 text-white hover:bg-white/20" onClick={() => move(i, -1)}><ArrowLeft className="size-4" /></button>
                <button type="button" aria-label="Move right" className="rounded p-1 text-white hover:bg-white/20" onClick={() => move(i, 1)}><ArrowRight className="size-4" /></button>
              </span>
              <button type="button" aria-label="Remove" className="rounded p-1 text-white hover:bg-red-500" onClick={() => setUrls((x) => x.filter((_, k) => k !== i))}><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-sand text-xs font-semibold text-muted hover:border-brand hover:text-brand"
        >
          {busy ? <LoaderCircle className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
          {busy ? "Uploading…" : "Add photos"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) run(files, (added) => setUrls((u) => [...u, ...added]));
        }}
      />
    </div>
  );
}
