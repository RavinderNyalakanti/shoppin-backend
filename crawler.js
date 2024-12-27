import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import pLimit from 'p-limit';

// Define concurrency limit
const CONCURRENCY_LIMIT = 5;
const limit = pLimit(CONCURRENCY_LIMIT);

// URL patterns for product pages
const PRODUCT_PATTERNS = [/\/product/, /\/item/, /\/p/, /\/products/];

// Crawl multiple websites
async function crawlWebsites(websites) {
  const results = {};

  const tasks = websites.map((site) =>
    limit(async () => {
      console.log(`Crawling: ${site}`);
      try {
        const productUrls = await crawlWebsite(site);
        results[site] = productUrls;
      } catch (error) {
        console.error(`Error crawling ${site}:`, error.message);
        results[site] = [];
      }
    })
  );

  await Promise.all(tasks);
  console.log("\nCrawling completed.");
  return results;
}

// Crawl a single website
async function crawlWebsite(url) {
  const productUrls = new Set();

  try {
    // Static content scraping
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href && isProductUrl(href)) {
        const fullUrl = new URL(href, url).toString();
        productUrls.add(fullUrl);
      }
    });

    // Dynamic content scraping
    const dynamicUrls = await handleDynamicContent(url);
    dynamicUrls.forEach((link) => productUrls.add(link));
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
  }

  return Array.from(productUrls);
}

// Fetch HTML content of a page
async function fetchHTML(url) {
  const response = await axios.get(url);
  return response.data;
}

// Check if URL matches product patterns
function isProductUrl(url) {
  return PRODUCT_PATTERNS.some((pattern) => pattern.test(url));
}

// Handle dynamically loaded content
async function handleDynamicContent(url) {
  const productUrls = new Set();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll through the page to load dynamic content
    let previousHeight;
    do {
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(1000);
    } while (previousHeight !== (await page.evaluate('document.body.scrollHeight')));

    // Extract product URLs from dynamically loaded content
    const links = await page.$$eval('a[href]', (anchors) =>
      anchors
        .map((a) => a.href)
        .filter((href) =>
          PRODUCT_PATTERNS.some((pattern) => pattern.test(href))
        )
    );

    links.forEach((link) => productUrls.add(link));
  } catch (error) {
    console.error(`Error handling dynamic content for ${url}:`, error.message);
  } finally {
    await browser.close();
  }

  return Array.from(productUrls);
}

// Entry point
(async () => {
  const websites = [
    'https://example-ecommerce1.com',
    'https://example-ecommerce2.com',
    'https://example-ecommerce3.com',
    // Add more websites here
  ];

  const results = await crawlWebsites(websites);
  console.log("\nDiscovered Product URLs:");
  console.log(JSON.stringify(results, null, 2));
})();
