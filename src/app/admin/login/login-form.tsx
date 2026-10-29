"use client";

import { login, logout, type FormState } from "../actions";
import { FormAlert, SubmitButton, useFormAction } from "@/components/admin/ui";

export function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [state, onSubmit, pending] = useFormAction<FormState>(login, null);
  return (
    <div className="card space-y-4 p-6">
      {notAdmin && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          This account is signed in but is not an admin.
          <button type="button" onClick={() => logout()} className="ml-1 font-bold underline">Sign out</button>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required autoComplete="username" className="input h-11" />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className="input h-11" />
        </label>
        <FormAlert state={state} />
        <SubmitButton pending={pending} className="h-11 w-full">Sign in</SubmitButton>
      </form>
    </div>
  );
}
