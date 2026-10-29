"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";

/** Green strip with a two-field “call me back” form (saved as an enquiry). */
export function CallbackBand() {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, null);
  return (
    <section className="bg-leaf">
      <div className="mx-auto max-w-[1200px] px-5 py-16 text-center">
        <h2 className="display text-[clamp(2.2rem,4.5vw,3rem)] text-white">Want us to call you back?</h2>
        {state?.ok ? (
          <p className="oswald mx-auto mt-8 max-w-xl bg-white/15 px-6 py-5 text-[14px] text-white" role="status">{state.message}</p>
        ) : (
          <form action={action} className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <input type="hidden" name="message" value="Please call me back (sent from the call-back form)." />
            <label className="sr-only" htmlFor="cb-name">Your name</label>
            <input id="cb-name" name="name" required minLength={2} maxLength={100} placeholder="Your name" autoComplete="name" className="tfield tfield-cream sm:flex-1" />
            <label className="sr-only" htmlFor="cb-phone">Phone number</label>
            <input id="cb-phone" name="phone" required type="tel" inputMode="tel" maxLength={20} placeholder="Phone number" autoComplete="tel" className="tfield tfield-cream sm:flex-1" />
            <button type="submit" disabled={pending} className="tbtn tbtn-dark h-[3.75rem] px-8">
              {pending ? "Sending…" : "Call me"}
            </button>
          </form>
        )}
        {state && !state.ok && <p className="mt-3 text-[14px] font-semibold text-white" role="alert">{state.message}</p>}
      </div>
    </section>
  );
}
