import { test, expect } from "@playwright/test";

test("visitor can open sign-up screen from landing page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /create account/i }).click();

  await expect(page).toHaveURL(/sign-up/);
});
