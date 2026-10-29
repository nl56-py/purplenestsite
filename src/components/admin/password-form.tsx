"use client";

import { changePassword, type FormState } from "@/app/admin/actions";
import { FormAlert, SubmitButton, useFormAction } from "./ui";

export function PasswordForm() {
  const [state, onSubmit, pending] = useFormAction<FormState>(changePassword, null);
  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4 p-6">
      <h2 className="font-extrabold">Change password</h2>
      <label className="block">
        <span className="label">New password</span>
        <input name="password" type="password" minLength={8} required autoComplete="new-password" className="input" />
      </label>
      <label className="block">
        <span className="label">Repeat new password</span>
        <input name="confirm" type="password" minLength={8} required autoComplete="new-password" className="input" />
      </label>
      <FormAlert state={state} />
      <SubmitButton pending={pending}>Update password</SubmitButton>
    </form>
  );
}
