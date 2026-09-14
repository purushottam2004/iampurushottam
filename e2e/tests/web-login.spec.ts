import { test, expect } from "@playwright/test";
import {
  fillEmailSignIn,
  loginViaModal,
  openLoginModal,
  ownerUserCredentials,
  testUserCredentials,
} from "./helpers/auth";

/**
 * Header login modal for `web`.
 *
 * test@example.com can sign in but is not the site owner.
 * seed_user@gmail.com is the owner and sees edit chrome.
 */
test.describe("Web login", () => {
  test("should sign in from the header modal and stay on home", async ({
    page,
  }) => {
    const { email, password } = testUserCredentials();

    await loginViaModal(page, email, password);

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
    await expect(page.getByRole("link", { name: "New" })).toHaveCount(0);
  });

  test("should keep the modal open after a wrong password", async ({ page }) => {
    const { email } = testUserCredentials();

    await openLoginModal(page);
    await fillEmailSignIn(page, email, "wrong-password-xxxxx");

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByText(/invalid login credentials/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("should show owner edit chrome after owner sign-in", async ({ page }) => {
    const { email, password } = ownerUserCredentials();

    await loginViaModal(page, email, password);

    await expect(page.getByRole("link", { name: "New" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit intro" })).toBeVisible();
    await page.getByRole("link", { name: "Writing" }).click();
    await expect(page.getByRole("link", { name: "Desk notes" })).toBeVisible();
  });

  test("should render HTML in a post title on the list and the piece", async ({
    page,
  }) => {
    const { email, password } = ownerUserCredentials();
    const original = "Why this site exists";
    const htmlTitle = `<p>${original}</p>`;

    await loginViaModal(page, email, password);
    await page.goto("/blog/why-this-site-exists");
    await page.getByRole("button", { name: "Edit" }).click();
    const titleField = page.getByLabel("Title (HTML)");
    const previous = await titleField.inputValue();

    try {
      await titleField.fill(htmlTitle);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("heading", { name: original })).toBeVisible();
      await expect(page.getByText(`<p>${original}</p>`)).toHaveCount(0);

      await page.goto("/");
      await expect(page.getByRole("link", { name: original })).toBeVisible();
      await expect(page.getByText(`<p>${original}</p>`)).toHaveCount(0);
    } finally {
      await page.goto("/blog/why-this-site-exists");
      await page.getByRole("button", { name: "Edit" }).click();
      await page.getByLabel("Title (HTML)").fill(previous);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("heading", { name: original })).toBeVisible();
    }
  });

  test("should render HTML in the home intro", async ({ page }) => {
    const { email, password } = ownerUserCredentials();
    const marker = `HTML intro ${Date.now()}`;

    await loginViaModal(page, email, password);
    await page.getByRole("button", { name: "Edit intro" }).click();
    const editor = page.getByLabel("Edit intro");
    const previous = await editor.inputValue();

    try {
      await editor.fill(`<h2>${marker}</h2>`);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("heading", { name: marker })).toBeVisible();
    } finally {
      await page.getByRole("button", { name: "Edit intro" }).click();
      await page.getByLabel("Edit intro").fill(previous);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("button", { name: "Edit intro" })).toBeVisible();
    }
  });
});
