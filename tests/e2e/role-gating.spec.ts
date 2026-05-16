import { test, expect, type Page } from "@playwright/test";

const ADMIN = { email: "admin@sunset-ridge.test", password: "changeme1234" };
const RESIDENT = { email: "resident@sunset-ridge.test", password: "changeme1234" };

async function signIn(page: Page, creds: { email: string; password: string }) {
  await page.goto("/");
  await page.getByLabel("Email").fill(creds.email);
  await page.getByLabel("Password").fill(creds.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
}

test.describe("resident gating", () => {
  test("sidebar hides admin-only items", async ({ page }) => {
    await signIn(page, RESIDENT);
    const sidebar = page.locator("aside").first();
    await expect(sidebar.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Announcements", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Dues", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Documents", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Maintenance", exact: true })).toBeVisible();

    // Admin-only — must NOT appear
    await expect(sidebar.getByRole("link", { name: "Users", exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "Roles & permissions", exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "Translations", exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "PII review", exact: true })).toHaveCount(0);
  });

  test("typing /announcements/create redirects to dashboard", async ({ page }) => {
    await signIn(page, RESIDENT);
    await page.goto("/announcements/create");
    await expect(page).toHaveURL(/\/dashboard\?notice=admin-only/);
  });

  test("typing /users or /roles-and-permissions redirects to dashboard", async ({ page }) => {
    await signIn(page, RESIDENT);
    await page.goto("/users");
    await expect(page).toHaveURL(/\/dashboard\?notice=admin-only/);
    await page.goto("/roles-and-permissions");
    await expect(page).toHaveURL(/\/dashboard\?notice=admin-only/);
  });

  test("resident dashboard shows resident-specific copy", async ({ page }) => {
    await signIn(page, RESIDENT);
    await expect(page.getByRole("heading", { name: /Hi /i })).toBeVisible();
    await expect(page.getByText("Latest from the board")).toBeVisible();
    await expect(page.getByText("Your open maintenance requests")).toBeVisible();
  });
});

test.describe("admin access", () => {
  test("admin sees the full sidebar and the admin dashboard", async ({ page }) => {
    await signIn(page, ADMIN);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    const sidebar = page.locator("aside").first();
    await expect(sidebar.getByRole("link", { name: "Users", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Roles & permissions", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Translations", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "PII review", exact: true })).toBeVisible();
  });

  test("admin can open /users?status=pending directly", async ({ page }) => {
    await signIn(page, ADMIN);
    await page.goto("/users?status=pending");
    await expect(page).toHaveURL(/\/users\?status=pending$/);
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  });
});
