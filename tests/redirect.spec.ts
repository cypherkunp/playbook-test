import { qrCodeVideoRedirects } from "../test-data/dsa.redirects";

const { test, expect, describe } = require("@playwright/test");

// Define the test function
async function performRedirectTest(page, videoRedirect) {
  const response = await page.goto(videoRedirect.originalUrl);
  const statusCode = response?.status();
  console.log(`[Redirection Status Code]:`, statusCode);

  await expect(statusCode).toBeGreaterThanOrEqual(200);
  await expect(statusCode).toBeLessThan(300);

  const request = response?.request()?.redirectedFrom();
  const redirectedFromUrl = request?.url();
  const redirectedToUrl = request?.redirectedTo()?.url();
  console.log(`[Redirected From Url]:`, redirectedFromUrl);
  console.log(`[Redirected To Url]:`, redirectedToUrl);

  await expect(page).toHaveURL(videoRedirect.redirectedUrl);
  await expect(redirectedFromUrl).toBe(videoRedirect.originalUrl);
  await expect(redirectedToUrl).toBe(videoRedirect.redirectedUrl);
}

// Use describe to wrap the tests
describe("QR Code Video Redirection Tests", () => {
  for (const videoRedirect of qrCodeVideoRedirects) {
    test(`is redirected to player url - ${videoRedirect.originalUrl}`, async ({
      page,
    }) => {
      await performRedirectTest(page, videoRedirect);
    });
  }
});
