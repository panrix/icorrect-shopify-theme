const test = require("node:test");
const assert = require("node:assert/strict");
const { renderQuoteEmail } = require("./render-quote-email");
const fixtures = require("./fixtures.json");

test("mail-in email is the quote card plus the client's name", function () {
  const html = renderQuoteEmail(fixtures.mailin);
  assert.match(html, /Hi Alex Morgan,/);
  assert.match(html, /Your repair quote/);
  assert.match(html, /We can fix this/);
  assert.match(html, /MacBook Pro 14-inch 'M1 Pro\/Max' A2442 \(2021\) Screen Repair \(Genuine Display\)/);
  assert.match(html, /Your MacBook screen is damaged and needs replacing/);
  assert.match(html, /preserve True Tone calibration/);
  assert.match(html, /ME23 8/);
  assert.match(html, /Same Day Courier isn't available for your postcode/);
  assert.match(html, /We've switched you to tracked mail-in/);
  assert.match(html, /Post it — mail-in pack/);
  assert.match(html, /Tracked, insured pack within 24h/);
  assert.match(html, /Free pack/);
  assert.match(html, /We send packaging/);
  assert.match(html, /You post the device/);
  assert.match(html, /Mon 28 Sep/);
  assert.match(html, /Estimated return by/);
  assert.match(html, /Often sooner/);
  assert.match(html, /719 Google reviews/);
  assert.match(html, /Calibrated in-house/);
  assert.match(html, /Typical repair time/);
  assert.match(html, /2-yr warranty/);
  assert.match(html, /Double the standard/);
  assert.match(html, /All-in total/);
  assert.match(html, /£549/);
  assert.match(html, /Proceed to checkout/);
  assert.doesNotMatch(html, /MacBook ·/);
  assert.doesNotMatch(html, /Pick a collection window/);
  assert.doesNotMatch(html, /Enter your postcode/);
  assert.doesNotMatch(html, />Device</);
});

test("courier email shows the collection window the client picked", function () {
  const html = renderQuoteEmail(fixtures.courier);
  assert.match(html, /Hi Priya Shah,/);
  assert.match(html, /Courier collection/);
  assert.match(html, /We collect from your door across London/);
  assert.match(html, /Included/);
  assert.match(html, /W1W 8JQ/);
  assert.match(html, /Pick a collection window/);
  assert.match(html, /Today/);
  assert.match(html, />22</);
  assert.match(html, /Sept/);
  assert.match(html, /Morning/);
  assert.match(html, /9am – 12pm/);
  assert.match(html, /We collect/);
  assert.match(html, /Thu 24 Sep/);
  assert.match(html, /£549/);
  assert.doesNotMatch(html, /Same Day Courier/);
  assert.doesNotMatch(html, /Free pack/);
  assert.doesNotMatch(html, /MacBook ·/);
});

test("diagnostic email uses the diagnostic card, and names the model once", function () {
  const html = renderQuoteEmail(fixtures.diagnostic);
  assert.match(html, /Hi Sam Adeyemi,/);
  assert.match(html, /We need to take a look/);
  assert.match(html, /Book a Diagnostic/);
  assert.match(html, /MacBook Pro 14-inch 'M1 Pro\/Max' A2442 \(2021\)/);
  assert.match(html, /Liquid causes corrosion that spreads/);
  assert.match(html, /We can't quote the full repair until we've looked/);
  assert.match(html, /Should the logic board need repair/);
  assert.match(html, /from £249/);
  assert.match(html, /We diagnose &amp; email your quote/);
  assert.match(html, /We'll tell you what's wrong by/);
  assert.match(html, /Device stays with us until you approve a repair/);
  assert.match(html, /Quote in 1 working day/);
  assert.match(html, /Diagnosis emailed to you/);
  assert.match(html, /£49/);
  const modelHits = html.split("MacBook Pro 14-inch").length - 1;
  assert.equal(modelHits, 1);
  assert.doesNotMatch(html, /MacBook ·/);
  assert.doesNotMatch(html, /Due now/);
  assert.doesNotMatch(html, /Price guide/);
});

test("JSON strings from the wizard still render", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.diagnostic, {
    paragraphs: JSON.stringify(fixtures.diagnostic.paragraphs),
    estimates: JSON.stringify(fixtures.diagnostic.estimates),
    journey: JSON.stringify(fixtures.diagnostic.journey),
    trust: JSON.stringify(fixtures.diagnostic.trust)
  }));
  assert.match(html, /from £249/);
  assert.match(html, /We send packaging/);
  assert.match(html, /719 Google reviews/);
});

test("a quote without card extras does not invent them", function () {
  const html = renderQuoteEmail({
    name: "Alex Morgan",
    repairTitle: "Apple Watch S9 41mm Glass Screen",
    deviceModel: "Apple Watch S9 41mm",
    serviceName: "Post it — mail-in pack",
    servicePrice: 0,
    totalPrice: "£149"
  });
  assert.match(html, /Hi Alex Morgan,/);
  assert.match(html, /Apple Watch S9 41mm Glass Screen/);
  assert.match(html, /£149/);
  assert.match(html, /£0/);
  assert.doesNotMatch(html, /Apple Watch ·/);
  assert.doesNotMatch(html, /We can fix this/);
  assert.doesNotMatch(html, /Your repair quote/);
  assert.doesNotMatch(html, /719 Google reviews/);
  assert.doesNotMatch(html, /Free pack/);
  assert.doesNotMatch(html, /Often sooner/);
});
