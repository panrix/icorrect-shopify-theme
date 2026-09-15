'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { slackSameDayPrefix, annotateSuccessSlackText } = require('./slack-same-day');

describe('Slack SAME-DAY line', () => {
  it('prefixes a successful same-day order so staff book both legs by hand', () => {
    const order = { line_items: [{ variant_id: 71304855585021, title: 'Same-day iPhone' }] };
    assert.equal(slackSameDayPrefix(order), 'SAME-DAY');
    const text = annotateSuccessSlackText(':package: *New Shopify Order*', order);
    assert.match(text, /^\*SAME-DAY\*/);
    assert.match(text, /New Shopify Order/);
  });

  it('uses SAME-DAY RESERVE FAILED when the cap rejected the booking', () => {
    const order = { line_items: [{ variant_id: 46150010962173, title: 'Fastest' }] };
    assert.equal(slackSameDayPrefix(order, { reserveFailed: true }), 'SAME-DAY RESERVE FAILED');
    assert.match(
      annotateSuccessSlackText('kept the repair', order, { reserveFailed: true }),
      /SAME-DAY RESERVE FAILED/
    );
  });

  it('leaves standard / Fast orders alone', () => {
    const order = { line_items: [{ variant_id: 46150011027709, title: '1 working day' }] };
    assert.equal(slackSameDayPrefix(order), '');
    assert.equal(annotateSuccessSlackText('plain', order), 'plain');
  });
});
