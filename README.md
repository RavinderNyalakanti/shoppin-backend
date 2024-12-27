# Web Crawler for E-commerce Product URLs

## **Description**
This project is a web crawler designed to discover and list all product URLs from multiple e-commerce websites. It handles static and dynamic content, ensuring scalability and robustness while providing structured output.

---

## **Features**

### **Key Features**
1. **URL Discovery:**
   - Automatically identifies product pages using patterns like `/product/`, `/item/`, `/p/`, etc.

2. **Scalability:**
   - Supports crawling a minimum of 10 domains and can scale to handle hundreds of websites.

3. **Performance:**
   - Uses concurrency control to crawl multiple websites efficiently.

4. **Dynamic Content Handling:**
   - Supports websites with infinite scrolling or dynamically loaded content.

5. **Robustness:**
   - Manages variations in URL structures across different e-commerce platforms.
   - Handles errors gracefully and skips problematic sites while continuing with others.

6. **Structured Output:**
   - Produces a domain-to-product-URLs mapping in a JSON format, ensuring all URLs are unique and sorted.

---

## **Requirements**

### **Dependencies:**
- Node.js (v14+)
- NPM or Yarn

### **Installed Libraries:**
- `axios`: For fetching HTML from websites.
- `cheerio`: For parsing static HTML and extracting links.
- `puppeteer`: For handling dynamic content and infinite scrolling.
- `p-limit`: For controlling concurrency.

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-crawler.git
   cd ecommerce-crawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure Node.js is installed and up to date.

---

## **Usage**

### **Input:**
Provide a list of e-commerce domains to crawl in the `websites` array:
```javascript
const websites = [
  'https://example-ecommerce1.com',
  'https://example-ecommerce2.com',
  'https://example-ecommerce3.com',
];
```

### **Run the Script:**
Execute the crawler:
```bash
node crawler.js
```

### **Output:**
The crawler will produce a JSON-formatted result mapping each domain to its respective list of unique product URLs:
```json
{
  "https://example-ecommerce1.com": [
    "https://example-ecommerce1.com/product/12345",
    "https://example-ecommerce1.com/product/67890"
  ],
  "https://example-ecommerce2.com": [
    "https://example-ecommerce2.com/item/abc",
    "https://example-ecommerce2.com/item/xyz"
  ],
  "https://example-ecommerce3.com": [
    "https://example-ecommerce3.com/p/111",
    "https://example-ecommerce3.com/p/222"
  ]
}
```

---

## **Code Details**

### **Main Components:**

1. **`crawlWebsites`:**
   - Iterates through the list of websites and calls `crawlWebsite` for each domain.
   - Uses `p-limit` to handle concurrency.

2. **`crawlWebsite`:**
   - Fetches static HTML and extracts product URLs using `cheerio`.
   - Handles dynamic content with infinite scrolling using `puppeteer`.

3. **`fetchHTML`:**
   - Fetches the raw HTML of a website using `axios`.

4. **`isProductUrl`:**
   - Checks if a URL matches predefined product patterns.

5. **`handleDynamicContent`:**
   - Loads dynamic content by simulating scrolling and extracts product URLs using `puppeteer`.

---

## **Error Handling**
- If a website fails to load or throws an error, it is logged, and the crawler continues with the remaining domains.
- Empty lists are returned for problematic domains to ensure structured output.

---

## **Future Improvements**
1. Add support for more product URL patterns.
2. Improve error handling for specific edge cases (e.g., CAPTCHAs).
3. Enhance scalability to distribute crawling across multiple instances.
4. Implement a database integration for storing results persistently.
5. Add CLI support for specifying input domains dynamically.

---

## **Contributing**
Contributions are welcome! Feel free to open issues or submit pull requests.

---

## **License**
This project is licensed under the MIT License.

