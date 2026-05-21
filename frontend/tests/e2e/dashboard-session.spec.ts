import { test, expect } from "@playwright/test";

test("unauthenticated visitors are redirected away from dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/sign-in/);
});
