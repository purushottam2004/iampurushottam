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
});
