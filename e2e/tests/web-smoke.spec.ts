import { test, expect } from "@playwright/test";

/**
 * Public journal smoke for `web`.
 *
 * Visitors stay on the site. Drafts stay hidden. Login is a header control.
 */
test.describe("Web smoke", () => {
  test("should load the public homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Purushottam/);
    await expect(page.getByRole("link", { name: "Purushottam" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Writing" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/15555550100"
    );
    await expect(page.getByRole("link", { name: "Send email" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com"
    );
  });

  test("should show published writing and hide drafts", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Why this site exists" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "A short note on tools" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Desk notes" })).toHaveCount(0);
  });

  test("should open about and a published post", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
    await expect(page.getByText(/public shelf/i)).toBeVisible();

    await page.goto("/blog/why-this-site-exists");
    await expect(
      page.getByRole("heading", { name: "Why this site exists" })
    ).toBeVisible();
    await expect(page.getByText(/I meant it/i)).toBeVisible();
  });
});
