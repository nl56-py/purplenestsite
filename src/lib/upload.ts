"use client";

import { getBrowserClient } from "./supabase/browser";
import { MEDIA_BUCKET } from "./supabase/env";

const MAX_SIDE = 1920;
const QUALITY = 0.82;

/**
 * Shrinks a photo in the browser before upload (phone photos are often 4–8 MB).
 * Keeps the free 1 GB Supabase storage going a long way and makes the site faster.
 */
async function compress(file: File): Promise<Blob> {
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
  const blob = await compress(file);
  if (blob.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB even after compressing.`);
  const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const sb = getBrowserClient();
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message.includes("row-level security") ? "You are not allowed to upload." : error.message);
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
