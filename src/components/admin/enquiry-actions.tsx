"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteEnquiry, setEnquiryStatus } from "@/app/admin/actions";
import { ConfirmButton } from "./ui";

export function EnquiryActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className={`flex items-center gap-2 ${pending ? "opacity-60" : ""}`}>
      <select
        aria-label="Status"
        defaultValue={status}
        className="input w-auto py-1.5 text-sm"
        onChange={(e) =>
          start(async () => {
            await setEnquiryStatus(id, e.target.value);
            router.refresh();
          })
        }
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
      </select>
      <ConfirmButton
        onConfirm={async () => {
          await deleteEnquiry(id);
          router.refresh();
        }}
        confirmLabel="Delete?"
      >
        <Trash2 className="size-3.5" />
        <span className="sr-only">Delete enquiry</span>
      </ConfirmButton>
    </div>
  );
}
