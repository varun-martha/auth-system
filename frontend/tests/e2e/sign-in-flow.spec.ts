import { test, expect } from "@playwright/test";

test("visitor can open sign-in screen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sign in/i }).first().click();

  await expect(page).toHaveURL(/sign-in/);
});
