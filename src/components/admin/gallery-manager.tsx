"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { addGalleryImages, deleteGalleryImage, moveGalleryImage, updateGalleryImage } from "@/app/admin/actions";
import { ConfirmButton } from "./ui";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const categories = useMemo(() => Array.from(new Set(["Rooms", "Dining", "Study", "Building", ...images.map((i) => i.category)])), [images]);
  const [category, setCategory] = useState("Rooms");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setMessage(null);
    setProgress({ done: 0, total: imgs.length });
    const uploaded: { url: string }[] = [];
    const errors: string[] = [];
    for (const f of imgs) {
      try {
        uploaded.push({ url: await uploadImage(f, "gallery") });
      } catch (e) {
        errors.push(e instanceof Error ? e.message : f.name);
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    if (uploaded.length) {
      const res = await addGalleryImages(uploaded, category);
      setMessage({ ok: res.ok && !errors.length, text: [res.message, ...errors].join(" · ") });
    } else {
      setMessage({ ok: false, text: errors.join(" · ") || "Upload failed" });
    }
    setProgress(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(Array.from(e.dataTransfer.files));
        }}
        className={`card flex flex-col items-center gap-4 border-2 border-dashed p-8 text-center transition ${drag ? "border-brand bg-brand-soft" : ""}`}
      >
        <UploadCloud className="size-10 text-brand" />
        <div>
          <p className="font-bold">Drag photos here, or choose files</p>
          <p className="text-sm text-muted">JPG, PNG or WebP. You can select many at once.</p>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-3">
          <label className="text-left">
            <span className="label">Category</span>
            <input list="gallery-cats" value={category} onChange={(e) => setCategory(e.target.value)} className="input w-44" />
            <datalist id="gallery-cats">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </label>
          <button type="button" className="btn btn-primary h-[38px]" disabled={!!progress} onClick={() => fileRef.current?.click()}>
            {progress ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {progress ? `Uploading ${progress.done}/${progress.total}…` : "Choose photos"}
          </button>
        </div>
        {message && <p className={`text-sm font-semibold ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            upload(files);
          }}
        />
      </div>

      <p className="text-sm text-muted">{images.length} photo{images.length === 1 ? "" : "s"} · captions save automatically when you click away.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <GalleryCard key={img.id} img={img} first={i === 0} last={i === images.length - 1} categories={categories} />
        ))}
      </div>
    </div>
  );
}

function GalleryCard({ img, first, last, categories }: { img: GalleryImage; first: boolean; last: boolean; categories: string[] }) {
  const [caption, setCaption] = useState(img.caption);
  const [category, setCategory] = useState(img.category);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (caption === img.caption && category === img.category) return;
    start(async () => {
      await updateGalleryImage(img.id, caption, category);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };
  const iconBtn = "grid size-8 place-items-center rounded-lg bg-white/90 text-ink shadow hover:bg-white disabled:opacity-30";
  return (
    <div className={`card overflow-hidden ${pending ? "opacity-70" : ""}`}>
      <div className="img-fallback relative aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.image_url} alt={img.caption} className="size-full object-cover" loading="lazy" />
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button type="button" className={iconBtn} disabled={first} aria-label="Move earlier" onClick={() => start(() => moveGalleryImage(img.id, -1))}><ArrowLeft className="size-4" /></button>
          <button type="button" className={iconBtn} disabled={last} aria-label="Move later" onClick={() => start(() => moveGalleryImage(img.id, 1))}><ArrowRight className="size-4" /></button>
        </div>
      </div>
      <div className="space-y-2 p-3">
        <input value={caption} onChange={(e) => setCaption(e.target.value)} onBlur={save} placeholder="Caption (optional)" maxLength={150} className="input" aria-label="Caption" />
        <div className="flex gap-2">
          <input list={`cats-${img.id}`} value={category} onChange={(e) => setCategory(e.target.value)} onBlur={save} className="input" aria-label="Category" />
          <datalist id={`cats-${img.id}`}>
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
          <ConfirmButton onConfirm={() => deleteGalleryImage(img.id)} confirmLabel="Delete?">
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete photo</span>
          </ConfirmButton>
        </div>
        {saved && <p className="text-xs font-semibold text-emerald-700">Saved</p>}
      </div>
    </div>
  );
}
