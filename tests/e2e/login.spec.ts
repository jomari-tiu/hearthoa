import { test, expect } from "@playwright/test";

test.describe("login flow", () => {
  test("public landing renders sign-in form", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("rejects bad credentials", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill("nope@nope.test");
    await page.getByLabel("Password").fill("badpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    // Failure stays on the landing page — successful login pushes to /dashboard.
    await page.waitForTimeout(1500);
    expect(page.url()).not.toMatch(/\/dashboard/);
  });
});

test.describe("middleware gating", () => {
  test("dashboard redirects to landing when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/\?next=/);
  });
});
