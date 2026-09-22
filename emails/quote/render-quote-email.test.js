const test = require("node:test");
const assert = require("node:assert/strict");
const { renderQuoteEmail } = require("./render-quote-email");
const fixtures = require("./fixtures.json");

test("repair quote repeats wizard fields and not the device category", function () {
  const html = renderQuoteEmail(fixtures.repair);
  assert.match(html, /Hi Sarah Freeman/);
  assert.match(html, /iPhone 15 Pro Screen/);
  assert.match(html, />Device</);
  assert.match(html, /iPhone 15 Pro/);
  assert.doesNotMatch(html, /iPhone ·/);
  assert.match(html, /Cracked screen/);
  assert.match(html, /Natural Titanium/);
  assert.match(html, /Same-day/);
  assert.match(html, /Back today/);
  assert.match(html, /Courier collection/);
  assert.match(html, /£25/);
  assert.match(html, /£403/);
  assert.match(html, /2-year warranty/);
  assert.match(html, /Original parts/);
  assert.match(html, /Proceed to checkout/);
  assert.doesNotMatch(html, /We can fix this/);
  assert.doesNotMatch(html, /Your repair quote/);
  assert.doesNotMatch(html, /This is the quote/);
});

test("diagnostic quote shows wizard rows only", function () {
  const html = renderQuoteEmail(fixtures.diagnostic);
  assert.match(html, /MacBook Air 13&quot; M2 A2681 \(2022\)/);
  assert.doesNotMatch(html, /MacBook ·/);
  assert.match(html, /Liquid damage/);
  assert.match(html, /from £549/);
  assert.match(html, /Should the logic board need repair/);
  assert.match(html, /from £249/);
  assert.match(html, /Mail-in/);
  assert.match(html, /£0/);
  assert.match(html, /£49/);
  assert.match(html, /2-year warranty/);
  assert.match(html, /Proceed to checkout/);
  assert.doesNotMatch(html, /Due now/);
  assert.doesNotMatch(html, /Price guide/);
  assert.doesNotMatch(html, /Quote in 1 working day/);
  assert.doesNotMatch(html, /We need to take a look/);
  assert.doesNotMatch(html, /Free/);
});

test("simple repair omits colour, express, and the category", function () {
  const html = renderQuoteEmail(fixtures.simple);
  assert.match(html, /Apple Watch S9 41mm/);
  assert.doesNotMatch(html, /Apple Watch ·/);
  assert.match(html, /Mail-in/);
  assert.match(html, /£0/);
  assert.match(html, /£149/);
  assert.match(html, /Original specification/);
  assert.doesNotMatch(html, /Same-day/);
  assert.doesNotMatch(html, />Colour</);
  assert.doesNotMatch(html, /working days/);
});

test("estimates JSON string from the wizard still renders", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.diagnostic, {
    estimates: JSON.stringify(fixtures.diagnostic.estimates)
  }));
  assert.match(html, /from £549/);
});
