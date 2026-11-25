import { expect, test } from "@playwright/test";
import { defaultChartStateClassNames, defaultGroupStateClassNames } from "../src/lib/stateClassNames";

const TIMEOUT = 120_000;

test("every component renders on the server without creating a chart", async ({ request }) => {
    const response = await request.get("/ssr");
    expect(response.status()).toBe(200);

    const html = await response.text();

    // the outer elements and the custom fallback are server-rendered...
    expect(html).toContain('id="ssr-chart"');
    expect(html).toContain('id="ssr-fallback"');
    expect(html).toContain('id="ssr-group"');
    expect(html).toContain('id="ssr-declarative"');
    // ...but no chart root, no surface and no state class: nothing ran beyond rendering markup
    expect(html).not.toContain("chart-root-");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain(defaultChartStateClassNames.initialized);
    expect(html).not.toContain(defaultGroupStateClassNames.initialized);
});

test("the server-rendered page hydrates and creates its charts", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));

    await page.goto("/ssr");

    await expect(page.locator("#ssr-chart")).toContainClass(defaultChartStateClassNames.rendered, {
        timeout: TIMEOUT
    });
    await expect(page.locator("#ssr-group")).toContainClass(defaultGroupStateClassNames.rendered, {
        timeout: TIMEOUT
    });
    // the nested overview and legend mount once the chart is initialized
    await expect(page.locator("#ssr-chart canvas").first()).toBeAttached();
    expect(pageErrors).toEqual([]);
});
