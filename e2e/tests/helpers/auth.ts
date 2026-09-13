import { expect, type Page } from "@playwright/test";

export function testUserCredentials() {
  const email = process.env.TEST_USER_EMAIL ?? "test@example.com";
  const password = process.env.TEST_USER_PASSWORD ?? "password123";
  return { email, password };
}

export function ownerUserCredentials() {
  const email = process.env.OWNER_USER_EMAIL ?? "seed_user@gmail.com";
  const password = process.env.OWNER_USER_PASSWORD ?? "password123";
  return { email, password };
}

/** Open the journal login modal from the public header. */
export async function openLoginModal(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
}

export async function loginViaModal(page: Page, email: string, password: string) {
  await openLoginModal(page);
  await fillEmailSignIn(page, email, password);
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
    timeout: 15_000,
  });
}

export async function fillEmailSignIn(
  page: Page,
  email: string,
  password: string
) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}
