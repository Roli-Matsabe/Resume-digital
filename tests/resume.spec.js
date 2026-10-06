import { test, expect } from "@playwright/test";

test("renders the real CV, loads assets, and fits the viewport", async ({
  page,
}) => {
  const errors = [];
  const failures = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Turning digital",
  );
  await expect(page.locator("#experience-panel .timeline-entry")).toHaveCount(
    4,
  );
  for (const company of [
    "Tsogo Sun",
    "First Dream Agency",
    "Engen",
    "Aldo Group",
  ]) {
    await expect(
      page
        .locator("#experience-panel .organization")
        .filter({ hasText: company }),
    ).toBeVisible();
  }
  await expect(page.locator(".sample-label")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/roli-matsabe",
  );
  await expect(
    page.getByRole("link", { name: "068 097 6926" }),
  ).toHaveAttribute("href", "tel:+27680976926");
  await expect(
    page.getByRole("link", { name: "Rolihlahla.info@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:Rolihlahla.info@gmail.com");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});

test("education tabs support clicking and keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  const education = page.getByRole("tab", { name: "Education" });
  await education.click();
  await expect(page.locator("#education-panel")).toBeVisible();
  await expect(page.locator("#experience-panel")).toBeHidden();
  await expect(page.locator("#education-panel .timeline-entry")).toHaveCount(3);
  await expect(
    page.getByRole("heading", {
      name: "BA Strategic Corporate Communications",
    }),
  ).toBeVisible();
  await education.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Experience" })).toBeFocused();
  await expect(page.locator("#experience-panel")).toBeVisible();
  await page.getByRole("tab", { name: "Experience" }).press("End");
  await expect(education).toHaveAttribute("aria-selected", "true");
});

test("case study dialogs display sourced results and restore focus", async ({
  page,
}) => {
  await page.goto("/");
  const firstProject = page.getByRole("button", {
    name: "View Better journeys. At scale.",
  });
  await firstProject.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("4.8 million monthly active users");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstProject).toBeFocused();
  await page
    .getByRole("button", { name: "View Turning insight into growth." })
    .click();
  await expect(dialog).toContainText("65% improvement in email open rates");
  await page.getByRole("button", { name: "Close project details" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/modal-open/);
});

test("original CV downloads as a PDF", async ({ page, request }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Download CV" });
  const response = await request.get(await link.getAttribute("href"));
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const downloadPromise = page.waitForEvent("download");
  await link.click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "Roli-Matsabe-CV.pdf",
  );
});

test("print layout includes both experience and education", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#experience-panel")).toBeVisible();
  await expect(page.locator("#education-panel")).toBeVisible();
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.locator(".hero-art")).toBeHidden();
});

test("mobile navigation opens, follows a section, and closes", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only navigation control");
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Selected impact" })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
