import { describe, expect, it } from "vitest";
import { newAnnouncement, accountApproved, passwordReset } from "@/lib/email-templates";

const base = { hoaName: "Sunset Ridge", recipientName: "Maya", appUrl: "https://app.example" };

describe("email templates", () => {
  it("escapes HTML in user-controlled fields", () => {
    const out = newAnnouncement({
      ...base,
      announcementTitle: "<script>alert(1)</script>",
      announcementUrl: "https://app.example/announcements/1",
      priority: "general",
    });
    expect(out.html).not.toContain("<script>");
    expect(out.html).toContain("&lt;script&gt;");
  });

  it("marks critical announcements in subject and footer", () => {
    const out = newAnnouncement({
      ...base,
      announcementTitle: "Pool closed",
      announcementUrl: "https://app.example/x",
      priority: "critical",
    });
    expect(out.subject).toMatch(/^\[Critical\]/);
    expect(out.html).toContain("Critical notifications");
  });

  it("renders an approval email with the login URL", () => {
    const out = accountApproved({ ...base, loginUrl: "https://app.example/login" });
    expect(out.html).toContain("https://app.example/login");
    expect(out.text).toContain("https://app.example/login");
  });

  it("renders a password reset email with the token URL", () => {
    const out = passwordReset({ ...base, resetUrl: "https://app.example/reset?token=abc" });
    expect(out.subject).toContain("Reset");
    expect(out.html).toContain("https://app.example/reset?token=abc");
  });
});
