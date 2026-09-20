"use client";

import { useState } from "react";
import { Input, Textarea } from "./Field";
import { Button } from "./Button";

type Status = "idle" | "sending" | "sent";

/**
 * Front end only — wire `handleSubmit` to a route handler, a form service or
 * your CRM when the endpoint exists.
 *
 * Note on states: the locked palette has no red/green/amber, and the brand
 * file rules out introducing house hues. Success and error therefore read as
 * a mono label in ink/muted, not as a colour.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    // TODO: replace with a real submission.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="border-hairline border-muted bg-paper p-s-6 md:p-s-7">
      <div className="grid gap-s-5 md:grid-cols-2">
        <Input id="name" name="name" label="Name" placeholder="Your name" required autoComplete="name" />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
        <Input
          id="company"
          name="company"
          label="Company"
          placeholder="Optional"
          className="md:col-span-2"
          autoComplete="organization"
        />
        <Textarea
          id="brief"
          name="brief"
          label="What are you building?"
          placeholder="A paragraph is plenty."
          rows={6}
          required
          helperText="Tell us who has to believe in it, and when it needs to be live."
          className="md:col-span-2"
        />
      </div>

      <div className="mt-s-7 flex flex-col gap-s-4 border-t-hairline border-muted/40 pt-s-5 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="font-mono text-mono-label uppercase text-muted">
          {status === "sent"
            ? "Sent — we reply within two business days."
            : status === "sending"
              ? "Sending"
              : "No endpoint wired yet"}
        </p>
        <Button type="submit" variant="primary" markAccent disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send the brief"}
        </Button>
      </div>
    </form>
  );
}
