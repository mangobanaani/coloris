# Coloris Game Tests

This directory contains automated tests for the Coloris game using Playwright.

## Test Structure

- `game.spec.ts` - Basic game functionality tests
- `controls.spec.ts` - Tests for keyboard controls

## Running Tests

### Prerequisites

Make sure you have installed the project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

### Run all tests

```bash
npm test
```

### Run tests with UI mode

```bash
npm run test:ui
```

### Debug tests

```bash
npm run test:debug
```

### Run tests in a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Reports

After running the tests, you can find the HTML report in the `playwright-report` directory.
Open it with:

```bash
npx playwright show-report
```
