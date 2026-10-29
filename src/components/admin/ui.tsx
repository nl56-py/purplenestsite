"use client";

import { startTransition, useActionState, useEffect, useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";

/**
 * Like useActionState, but submits via onSubmit so React does NOT clear the form
 * afterwards — if validation fails the admin keeps what they typed.
 */
type FormState = { ok: boolean; message: string } | null;

export function useFormAction<S extends FormState = FormState>(action: (prev: S, form: FormData) => Promise<S>, initial: S) {
  const [state, run, pending] = useActionState<S, FormData>(action, initial as Awaited<S>);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => run(data));
  };
  return [state, onSubmit, pending] as const;
}

export function SubmitButton({ children, className = "", pending = false }: { children: React.ReactNode; className?: string; pending?: boolean }) {
  return (
    <button type="submit" disabled={pending} className={`btn btn-primary ${className}`}>
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function FormAlert({ state }: { state: FormState }) {
  // Success messages fade after a few seconds; errors stay until the next submit.
  const [hiddenFor, setHiddenFor] = useState<FormState>(null);
  useEffect(() => {
    if (!state?.ok) return;
    const t = setTimeout(() => setHiddenFor(state), 4000);
    return () => clearTimeout(t);
  }, [state]);
  if (!state || hiddenFor === state) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
    >
      {state.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <TriangleAlert className="size-4 shrink-0" />}
      {state.message}
    </p>
  );
}

/** Two-step button: first click arms it, second click runs the action. No browser dialogs. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Click again to delete",
  className = "btn btn-danger py-1.5 text-xs",
}: {
  onConfirm: () => Promise<unknown> | void;
  children: React.ReactNode;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      disabled={pending}
      className={`${className} ${armed ? "!bg-red-600 !text-white" : ""}`}
      onClick={() => {
        if (!armed) return setArmed(true);
        setArmed(false);
        start(async () => {
          await onConfirm();
        });
      }}
    >
      {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
      {armed ? confirmLabel : children}
    </button>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
