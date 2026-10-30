import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNotice, getSiteData } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema, generateNoticeSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [notice, siteData] = await Promise.all([getNotice(id), getSiteData()]);
  if (!notice) return { title: "Notice Not Found" };

  const url = `${SITE_URL}/notices/${notice.id}`;
  const title = `${notice.title} | ${siteData.settings.hostel_name} Notices`;
  const description = notice.body.slice(0, 160);
  const image = notice.image_url || "/images/hero-exterior.jpg";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: notice.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) notFound();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Notices", path: "/notices" },
    { name: notice.title, path: `/notices/${notice.id}` },
  ]);

  const noticeSchema = generateNoticeSchema(notice);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <JsonLd id="notice-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="notice-article-schema" data={noticeSchema} />

      <Link href="/notices" className="oswald inline-flex items-center gap-2 text-[12px] !tracking-[0.2em] text-brand hover:text-ink">
        <ArrowLeft className="size-4" /> All notices
      </Link>
      <p className="oswald mt-10 text-[12px] !tracking-[0.2em] text-muted">
        {formatDate(notice.published_at, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="display mt-3 text-[clamp(2.6rem,6vw,4rem)] text-brand">{notice.title}</h1>
      {notice.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={notice.image_url} alt={notice.title} className="mt-10 w-full rounded-2xl shadow-sm" />
      )}
      <div className="mt-8 whitespace-pre-line text-[17px] leading-[1.9] text-ink/90 font-serif">{notice.body}</div>
    </article>
  );
}
