import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("3D renders and keyboard controls change the rendered scene", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("#hero-canvas");
  await expect(scene).toHaveAttribute("data-scene-state", "ready");
  const canvas = scene.locator("canvas");
  await expect(canvas).toBeVisible();
  const before = await canvas.screenshot();
  await page.getByRole("button", { name: "Rotate 3D scene right" }).focus();
  await page.keyboard.press("Enter");
  // A pixel comparison verifies a real visual response, not only DOM state.
  await expect
    .poll(async () => (await canvas.screenshot()).equals(before))
    .toBe(false);
});

test("motion preference is respected and can be changed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.locator(".motion-toggle");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAccessibleName("▶ Play motion");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
});

test("story chapters update the 3D explanation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Bring the pieces together." })
    .click();
  await expect(page.locator(".story-stage-caption")).toHaveText(
    "Make the systems work together.",
  );
  await page.getByRole("button", { name: "Make progress measurable." }).click();
  await expect(page.locator(".story-stage-caption")).toHaveText(
    "Turn insight into measurable growth.",
  );
});

test("WebGL failure preserves the resume, artwork, and navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(page.locator("#hero-canvas")).toHaveAttribute(
    "data-scene-state",
    "fallback",
  );
  await expect(page.locator("#hero-canvas .scene-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Turning digital",
  );
  await page.getByRole("tab", { name: "Education" }).click();
  await expect(
    page.getByRole("heading", {
      name: "BA Strategic Corporate Communications",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute(
    "download",
    "Roli-Matsabe-CV.pdf",
  );
});

test("main page, education, and case-study dialog pass automated accessibility checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const audit = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
  expect((await audit()).violations).toEqual([]);
  await page.getByRole("tab", { name: "Education" }).click();
  expect((await audit()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "View Better journeys. At scale." })
    .click();
  expect((await audit()).violations).toEqual([]);
});
