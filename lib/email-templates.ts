// Plain HTML email templates per notification type. Pure functions — keep them small
// and composition-friendly. Real branding (logo URL, colors) comes from `hoas.branding`.

type TemplateContext = {
  hoaName: string;
  recipientName: string;
  appUrl: string;
};

export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

const SHELL = (title: string, body: string, footer: string) => /* html */ `
<!doctype html>
<html lang="en">
<body style="margin:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1d20;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e4e6e8;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:20px 24px;border-bottom:1px solid #eef0f1;font-weight:600;">${title}</td></tr>
        <tr><td style="padding:24px;line-height:1.55;">${body}</td></tr>
        <tr><td style="padding:14px 24px;background:#fafbfc;border-top:1px solid #eef0f1;font-size:12px;color:#727679;">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export function newAnnouncement(
  ctx: TemplateContext & { announcementTitle: string; announcementUrl: string; priority: "general" | "critical" },
): EmailTemplate {
  const subject = ctx.priority === "critical" ? `[Critical] ${ctx.announcementTitle}` : ctx.announcementTitle;
  const body = `
    <p>Hi ${escapeHtml(ctx.recipientName)},</p>
    <p>The board posted a new announcement:</p>
    <p style="font-weight:600;font-size:16px;">${escapeHtml(ctx.announcementTitle)}</p>
    <p><a href="${ctx.announcementUrl}" style="display:inline-block;background:#1a8a5a;color:#fff;padding:9px 14px;border-radius:8px;text-decoration:none;font-weight:600;">Read it</a></p>
  `;
  const footer = ctx.priority === "critical"
    ? `Critical notifications ignore opt-out preferences. — ${escapeHtml(ctx.hoaName)}`
    : `You can adjust which emails you receive in <a href="${ctx.appUrl}/settings/notifications">your preferences</a>. — ${escapeHtml(ctx.hoaName)}`;
  return {
    subject,
    html: SHELL("New announcement", body, footer),
    text: `${ctx.announcementTitle}\n\nRead it: ${ctx.announcementUrl}`,
  };
}

export function maintenanceStatusChange(
  ctx: TemplateContext & { requestTitle: string; newStatus: string; requestUrl: string },
): EmailTemplate {
  const subject = `Update on your request: ${ctx.requestTitle}`;
  const body = `
    <p>Hi ${escapeHtml(ctx.recipientName)},</p>
    <p>Your maintenance request is now <strong>${escapeHtml(ctx.newStatus.replace("_", " "))}</strong>.</p>
    <p><a href="${ctx.requestUrl}">View the request</a></p>
  `;
  return {
    subject,
    html: SHELL("Maintenance update", body, `— ${escapeHtml(ctx.hoaName)}`),
    text: `Your request "${ctx.requestTitle}" is now ${ctx.newStatus}. ${ctx.requestUrl}`,
  };
}

export function accountApproved(ctx: TemplateContext & { loginUrl: string }): EmailTemplate {
  const subject = `Your ${ctx.hoaName} account is ready`;
  const body = `
    <p>Hi ${escapeHtml(ctx.recipientName)},</p>
    <p>The board has approved your account. You can sign in to see announcements, dues, and documents.</p>
    <p><a href="${ctx.loginUrl}" style="display:inline-block;background:#1a8a5a;color:#fff;padding:9px 14px;border-radius:8px;text-decoration:none;font-weight:600;">Sign in</a></p>
  `;
  return {
    subject,
    html: SHELL("Account approved", body, `— ${escapeHtml(ctx.hoaName)}`),
    text: `Your account is approved. Sign in: ${ctx.loginUrl}`,
  };
}

export function passwordReset(ctx: TemplateContext & { resetUrl: string }): EmailTemplate {
  const subject = `Reset your ${ctx.hoaName} password`;
  const body = `
    <p>Hi ${escapeHtml(ctx.recipientName)},</p>
    <p>Click the link below to set a new password. The link expires in 1 hour.</p>
    <p><a href="${ctx.resetUrl}">${ctx.resetUrl}</a></p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;
  return {
    subject,
    html: SHELL("Reset password", body, `— ${escapeHtml(ctx.hoaName)}`),
    text: `Reset link: ${ctx.resetUrl}`,
  };
}

export function piiReviewNeeded(ctx: TemplateContext & { documentTitle: string; reviewUrl: string }): EmailTemplate {
  const subject = `PII review needed: ${ctx.documentTitle}`;
  const body = `
    <p>Hi ${escapeHtml(ctx.recipientName)},</p>
    <p>The PII scan flagged a document before it can be indexed for the resident chatbot.</p>
    <p><a href="${ctx.reviewUrl}">Review the document</a></p>
  `;
  return {
    subject,
    html: SHELL("PII review needed", body, `— ${escapeHtml(ctx.hoaName)}`),
    text: `Review ${ctx.documentTitle}: ${ctx.reviewUrl}`,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
