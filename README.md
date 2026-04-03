# Boston Manor Live Departures

A live departure board for **Boston Manor** (Piccadilly line) showing real-time tube and bus arrivals using the [TfL Unified API](https://api.tfl.gov.uk).

## Features

- Piccadilly line arrivals split by platform (Eastbound / Westbound)
- Bus arrivals for stops directly outside the station (Stop U & Stop N)
- Auto-refresh on load, manual refresh button
- Responsive layout for mobile and desktop

## Live

Hosted via GitHub Pages: https://chrisfield-lh.github.io/boston-manor-departures/

## Development

This is a single-file static web app — no build step required. Open `index.html` directly in a browser, or serve locally:

```bash
npx serve .
```

## Testing

End-to-end tests are written with [Playwright](https://playwright.dev). They run against the live TfL API in a headless Chromium browser.

**Install dependencies (first time):**
```bash
npm install
npx playwright install chromium
```

**Run the tests:**
```bash
npm test
```

The suite covers 12 scenarios across four areas:

| Group | What's tested |
|---|---|
| Map | Section visible, Leaflet initialised, tube & bus markers present |
| Tube board | Heading visible, at least one departure row loads |
| Bus boards | Stop U & N headings visible, each board loads departure rows |
| Auto-refresh | Last-updated timestamp shown and updates on refresh |

## Data source

All departure data comes from the [TfL Unified API](https://api.tfl.gov.uk) — no API key required for read-only arrival endpoints.

## Stop IDs

| Stop | ID | Description |
|------|----|-------------|
| Tube | `940GZZLUBOS` | Boston Manor (Piccadilly line) |
| Bus Stop U | `490000027A` | Boston Manor Station (outbound) |
| Bus Stop N | `490000027B` | Boston Manor Station (inbound) |
