"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  contactSchema,
  type ContactInput,
} from "@/lib/validation/contact";
import { cn } from "@/lib/utils/cn";

/**
 * External form backend. The site is a static export, so submissions go to a
 * third-party endpoint rather than an API route of our own. Both values are
 * baked into the client bundle at build time, which is why the access key must
 * be a public/submit-only one.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const FORM_ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

/** §23 — validated contact form with animated errors and a polished success state. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("submitting");
    setServerError(null);

    // The site is a static export, so there is no API route of our own to post
    // to. FORM_ENDPOINT is an external form service; swapping providers means
    // changing the env var, not this component.
    if (!FORM_ENDPOINT) {
      setServerError(
        "The contact form is not configured yet. Please email us directly.",
      );
      setStatus("error");
      return;
    }

    try {
      const { website, ...submission } = values;
      // Honeypot: a filled "website" field means a bot. Report success so the
      // bot sees no signal, but never send it on.
      if (website) {
        reset();
        setStatus("success");
        return;
      }

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...submission,
          ...(FORM_ACCESS_KEY ? { access_key: FORM_ACCESS_KEY } : {}),
          subject: `New enquiry from ${submission.name}`,
        }),
      });

      if (!response.ok) {
        setServerError("Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      reset();
      setStatus("success");
    } catch {
      setServerError(
        "We couldn't reach the server. Please check your connection or email us directly.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[26rem] flex-col items-start justify-center rounded-lg border border-line bg-surface/40 p-10"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent-hi">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="mt-7 text-2xl font-medium tracking-tight">Message received.</h3>
        <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">
          Thanks for reaching out — we read every enquiry and will get back to
          you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm text-fg-muted underline underline-offset-4 transition-colors hover:text-fg"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — visually hidden, never focusable */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} htmlFor="name">
          <input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            className={inputClass(!!errors.name)}
            {...register("name")}
          />
        </Field>

        <Field label="Work email" error={errors.email?.message} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Company" error={errors.company?.message} htmlFor="company" optional>
        <input
          id="company"
          autoComplete="organization"
          placeholder="Company name"
          className={inputClass(!!errors.company)}
          {...register("company")}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Project type" error={errors.projectType?.message} htmlFor="projectType">
          <select
            id="projectType"
            defaultValue=""
            className={cn(inputClass(!!errors.projectType), "appearance-none")}
            {...register("projectType")}
          >
            <option value="" disabled>
              Select one
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-surface">
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Budget" error={errors.budget?.message} htmlFor="budget" optional>
          <select
            id="budget"
            defaultValue=""
            className={cn(inputClass(!!errors.budget), "appearance-none")}
            {...register("budget")}
          >
            <option value="" className="bg-surface">
              Prefer not to say
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range} className="bg-surface">
                {range}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" error={errors.message?.message} htmlFor="message">
        <textarea
          id="message"
          rows={6}
          placeholder="What are you building, and where are you now?"
          className={cn(inputClass(!!errors.message), "resize-none")}
          {...register("message")}
        />
      </Field>

      <AnimatePresence>
        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-md border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
          >
            {serverError}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "submitting"}
        data-cursor="cta"
        className="group inline-flex items-center gap-2.5 rounded-full bg-fg px-7 py-3.5 text-sm font-medium text-bg transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send message
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean): string {
  return cn(
    "w-full rounded-md border bg-surface/50 px-4 py-3 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-colors duration-300 focus:outline-none",
    hasError
      ? "border-red-500/50 focus:border-red-500"
      : "border-line focus:border-accent-hi",
  );
}

function Field({
  label,
  error,
  htmlFor,
  optional = false,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2.5 flex items-baseline gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle"
      >
        {label}
        {optional && <span className="text-fg-subtle/60">optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-[0.8125rem] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
