// Email stub. Replace with Resend/Postmark/SendGrid client in Sprint 0.
// Logs to console in dev so we can see what would have been sent.

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    // Real Resend call would go here. Kept as a stub to avoid hard-coupling.
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: "no-reply@hearthhoa.app", ...payload });
    return;
  }
  console.info("[email:stub]", payload.to, "→", payload.subject);
}
