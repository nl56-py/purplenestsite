import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNotice } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const notice = await getNotice((await params).id);
  return { title: notice?.title ?? "Notice", description: notice?.body.slice(0, 160) };
}

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const notice = await getNotice((await params).id);
  if (!notice) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Link href="/notices" className="oswald inline-flex items-center gap-2 text-[12px] !tracking-[0.2em] text-brand hover:text-ink">
        <ArrowLeft className="size-4" /> All notices
      </Link>
      <p className="oswald mt-10 text-[12px] !tracking-[0.2em] text-muted">{formatDate(notice.published_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      <h1 className="display mt-3 text-[clamp(2.6rem,6vw,4rem)] text-brand">{notice.title}</h1>
      {notice.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={notice.image_url} alt="" className="mt-10 w-full" />
      )}
      <div className="mt-8 whitespace-pre-line text-[17px] leading-[1.9]">{notice.body}</div>
    </article>
  );
}
