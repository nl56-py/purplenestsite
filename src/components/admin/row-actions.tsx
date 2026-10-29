"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteResource, moveResource, togglePublished } from "@/app/admin/actions";
import { ConfirmButton } from "./ui";

export function RowActions({
  resourceKey,
  id,
  sortable,
  first,
  last,
  publishable,
  published,
}: {
  resourceKey: string;
  id: string;
  sortable: boolean;
  first: boolean;
  last: boolean;
  publishable: boolean;
  published: boolean;
}) {
  const [pending, start] = useTransition();
  const iconBtn = "grid size-8 place-items-center rounded-lg border border-line text-muted hover:bg-sand hover:text-ink disabled:opacity-30";
  return (
    <div className={`flex items-center gap-1.5 ${pending ? "opacity-60" : ""}`}>
      {publishable && (
        <button
          type="button"
          className={iconBtn}
          title={published ? "Hide from website" : "Show on website"}
          aria-label={published ? "Hide from website" : "Show on website"}
          onClick={() => start(() => togglePublished(resourceKey, id, !published))}
        >
          {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      )}
      {sortable && (
        <>
          <button type="button" className={iconBtn} disabled={first} aria-label="Move up" onClick={() => start(() => moveResource(resourceKey, id, -1))}>
            <ArrowUp className="size-4" />
          </button>
          <button type="button" className={iconBtn} disabled={last} aria-label="Move down" onClick={() => start(() => moveResource(resourceKey, id, 1))}>
            <ArrowDown className="size-4" />
          </button>
        </>
      )}
      <ConfirmButton onConfirm={() => deleteResource(resourceKey, id)} confirmLabel="Confirm">
        <Trash2 className="size-3.5" />
        <span className="sr-only">Delete</span>
      </ConfirmButton>
    </div>
  );
}
