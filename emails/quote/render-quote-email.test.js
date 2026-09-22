const test = require("node:test");
const assert = require("node:assert/strict");
const { renderQuoteEmail, emailJourney } = require("./render-quote-email");
const fixtures = require("./fixtures.json");

const NOISE = [
  /Same Day Courier isn't available/,
  /We've switched you to tracked mail-in/,
  /Where should we collect from/,
  /How do you want to get it to us/,
  /Pick a collection window/,
  /Enter your postcode/,
  /Your MacBook screen is damaged/,
  /preserve True Tone/,
  /Tracked, insured pack within 24h/,
  /We collect from your door across London/,
  /Estimated return by/,
  /We'll tell you what's wrong by/,
  /Proceed to checkout/,
  /Total below is the all-in price/,
  /Tue 22 Sep/,
  /Wed 23 Sep/,
  /Thu 24 Sep/,
  /Mon 28 Sep/,
  /9am/,
  />Today</
];

function assertQuiet(html) {
  NOISE.forEach(function (pattern) {
    assert.doesNotMatch(html, pattern);
  });
}

test("mail-in journey is working days, not calendar dates", function () {
  const model = emailJourney(fixtures.mailin);
  assert.deepEqual(model.steps.map(function (s) { return s.title; }), [
    "We send packaging",
    "You receive the pack",
    "We repair",
    "We return it"
  ]);
  assert.equal(model.steps[1].meta, "The following working day");
  assert.equal(model.steps[2].meta, "2 working days");
  assert.equal(model.etaValue, "5 working days");
});

test("mail-in email keeps the trust block and a generic clock", function () {
  const html = renderQuoteEmail(fixtures.mailin);
  assert.match(html, /Hi Alex Morgan,/);
  assert.match(html, /Your repair quote/);
  assert.match(html, /We can fix this/);
  assert.match(html, /MacBook Pro 14-inch 'M1 Pro\/Max' A2442 \(2021\) Screen Repair \(Genuine Display\)/);
  assert.match(html, /ME23 8/);
  assert.match(html, /Post it — mail-in pack/);
  assert.match(html, /Free pack/);
  assert.match(html, /We send packaging/);
  assert.match(html, /The following working day/);
  assert.match(html, /Typically 5 working days/);
  assert.match(html, /719 Google reviews/);
  assert.match(html, /Calibrated in-house/);
  assert.match(html, /Typical repair time/);
  assert.match(html, /2-yr warranty/);
  assert.match(html, /Double the standard/);
  assert.match(html, /All-in total/);
  assert.match(html, /£549/);
  assert.match(html, /Book this repair/);
  assertQuiet(html);
});

test("courier email uses collection-relative working days", function () {
  const html = renderQuoteEmail(fixtures.courier);
  assert.match(html, /Hi Priya Shah,/);
  assert.match(html, /Courier collection/);
  assert.match(html, /Included/);
  assert.match(html, /W1W 8JQ/);
  assert.match(html, /We collect/);
  assert.match(html, /From your door/);
  assert.match(html, /2 working days from collection/);
  assert.match(html, /719 Google reviews/);
  assert.match(html, /£549/);
  assert.match(html, /Book this repair/);
  assert.doesNotMatch(html, /Free pack/);
  assertQuiet(html);
});

test("diagnostic email names the model once and prices the diagnostic", function () {
  const html = renderQuoteEmail(fixtures.diagnostic);
  assert.match(html, /Hi Sam Adeyemi,/);
  assert.match(html, /We need to take a look/);
  assert.match(html, /Book a Diagnostic/);
  assert.match(html, /MacBook Pro 14-inch 'M1 Pro\/Max' A2442 \(2021\)/);
  assert.match(html, /Should the logic board need repair/);
  assert.match(html, /from £249/);
  assert.match(html, /We diagnose &amp; email your quote/);
  assert.match(html, /1 working day after it arrives/);
  assert.match(html, /Device stays with us until you approve/);
  assert.match(html, /719 Google reviews/);
  assert.match(html, />Diagnostic</);
  assert.match(html, /£49/);
  assert.match(html, /Book the diagnostic/);
  assert.doesNotMatch(html, /Your repair quote/);
  assert.doesNotMatch(html, /Liquid causes corrosion/);
  const modelHits = html.split("MacBook Pro 14-inch").length - 1;
  assert.equal(modelHits, 1);
  assertQuiet(html);
});

test("dated wizard payload is rewritten to working days", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.mailin, {
    journey: JSON.stringify([
      { title: "We send packaging", meta: "Tue 22 Sep" },
      { title: "You post the device", meta: "Wed 23 Sep" }
    ]),
    etaDate: "Mon 28 Sep",
    collectionLine: "Tue 22 Sep · Morning · 9am–12pm"
  }));
  assert.match(html, /Same working day/);
  assert.doesNotMatch(html, /Tue 22 Sep/);
  assert.doesNotMatch(html, /Mon 28 Sep/);
  assert.doesNotMatch(html, /9am/);
});

test("colour and express render as one line when the client chose them", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.courier, {
    deviceColor: "Space Grey",
    colorLabel: "Choose a colour",
    turnaroundLabel: "How fast do you need it?",
    expressName: "Express",
    expressMeta: "Back in 4 hours",
    expressPrice: 40,
    expressPriceLabel: "+£40"
  }));
  assert.match(html, /Space Grey/);
  assert.match(html, /Express · Back in 4 hours · \+£40/);
  assert.doesNotMatch(html, /Choose a colour/);
  assert.doesNotMatch(html, /How fast do you need it/);
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
  assert.doesNotMatch(html, /We can fix this/);
  assert.doesNotMatch(html, /Your repair quote/);
  assert.doesNotMatch(html, /719 Google reviews/);
  assert.doesNotMatch(html, /Free pack/);
});

test("parts and warranty still build the screenshot trust block", function () {
  const html = renderQuoteEmail({
    name: "Alex Morgan",
    deviceType: "iPhone",
    repairTitle: "iPhone 15 Screen Repair",
    route: "repair",
    serviceKind: "courier",
    parts: "Original parts",
    warranty: "2-year warranty",
    totalPrice: "£329"
  });
  assert.match(html, /4\.9/);
  assert.match(html, /719 Google reviews/);
  assert.match(html, /Original parts/);
  assert.match(html, /Calibrated in-house/);
  assert.match(html, /1 working day/);
  assert.match(html, /Typical repair time/);
  assert.match(html, /2-yr warranty/);
  assert.match(html, /Double the standard/);
  assert.match(html, /£329/);
});

test("a safety warning is kept", function () {
  const html = renderQuoteEmail(Object.assign({}, fixtures.mailin, {
    urgent: "Safety concern: stop using the device and don't charge it."
  }));
  assert.match(html, /stop using the device and don't charge it/);
});
