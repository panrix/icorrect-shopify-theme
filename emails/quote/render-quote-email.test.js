const test = require("node:test");
const assert = require("node:assert/strict");
const { renderQuoteEmail } = require("./render-quote-email");
const fixtures = require("./fixtures.json");

test("repair quote shows colour, express, courier, and total", function () {
  const html = renderQuoteEmail(fixtures.repair);
  assert.match(html, /Your repair quote/);
  assert.match(html, /Natural Titanium/);
  assert.match(html, /Same-day/);
  assert.match(html, /£49/);
  assert.match(html, /Courier collection/);
  assert.match(html, /£25/);
  assert.match(html, /£403/);
  assert.match(html, /Book this repair/);
  assert.doesNotMatch(html, /Price guide/);
});

test("diagnostic quote shows the guide and a free service, not the repair warranty", function () {
  const html = renderQuoteEmail(fixtures.diagnostic);
  assert.match(html, /Your diagnostic quote/);
  assert.match(html, /Due now/);
  assert.match(html, /Mail-in/);
  assert.match(html, />Free</);
  assert.match(html, /Price guide/);
  assert.match(html, /from £549/);
  assert.match(html, /from £249/);
  assert.match(html, /Quote in 1 working day/);
  assert.match(html, /Repair warranty confirmed after you accept the quote/);
  assert.doesNotMatch(html, /2-year warranty/);
  assert.match(html, /Book this diagnostic/);
  assert.match(html, /£49/);
});

test("simple repair omits express and colour and shows free mail-in", function () {
  const html = renderQuoteEmail(fixtures.simple);
  assert.match(html, /Apple Watch S9 41MM Glass Screen/);
  assert.match(html, /Mail-in/);
  assert.match(html, />Free</);
  assert.match(html, /2–3 working days/);
  assert.match(html, /2-year warranty/);
  assert.doesNotMatch(html, /Same-day/);
  assert.doesNotMatch(html, /Colour/);
  assert.doesNotMatch(html, /Price guide/);
});

test("estimates JSON string from the wizard still renders", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.diagnostic, {
    estimates: JSON.stringify(fixtures.diagnostic.estimates)
  }));
  assert.match(html, /from £549/);
});
