import React from "react";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>> | null | undefined;
  id?: string;
};

/**
 * Standard JSON-LD script tag component.
 * Safely serializes Schema.org objects for search engines & AI scrapers.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, process.env.NODE_ENV === "development" ? 2 : 0),
      }}
    />
  );
}
