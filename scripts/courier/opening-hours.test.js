/**
 * Opening hours consistency tests.
 * Verifies Monday to Friday, 9am to 6pm (Saturday and Sunday closed) across
 * LocalBusiness JSON-LD, contact sections, legacy walk-in slot picker,
 * AI discovery templates, collection JSON templates, and static HTML copy.
 *
 * Files owned by PR #137 (sections/quote-wizard.liquid, assets/quote-wizard.js,
 * assets/quote-wizard-walkin.js) are intentionally tested in PR #137 to avoid
 * cross-PR merge conflicts.
 *
 * Run: node --test scripts/courier/opening-hours.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

describe('LocalBusiness JSON-LD opening hours', () => {
  const src = read('snippets/icorrect-localbusiness-schema.liquid');
  const jsonMatch = src.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  it('contains valid JSON-LD with Monday through Friday 09:00 to 18:00', () => {
    assert.ok(jsonMatch, 'missing JSON-LD script block');
    const ld = JSON.parse(jsonMatch[1]);
    assert.equal(ld['@type'], 'LocalBusiness');
    assert.equal(Array.isArray(ld.openingHoursSpecification), true);
    assert.equal(ld.openingHoursSpecification.length, 1);

    const spec = ld.openingHoursSpecification[0];
    assert.equal(spec['@type'], 'OpeningHoursSpecification');
    assert.deepEqual(spec.dayOfWeek, [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ]);
    assert.equal(spec.opens, '09:00');
    assert.equal(spec.closes, '18:00');
  });

  it('contains no stale Friday 10:00 reference and no em or en dashes', () => {
    assert.doesNotMatch(src, /10:00|10am|Mon\s*(?:to|[\u2013-])\s*Thu/i);
    assert.doesNotMatch(src, /[\u2013\u2014]/);
  });
});

describe('Contact sections opening hours', () => {
  for (const relPath of ['sections/contact-form.liquid', 'sections/contact-with-map.liquid']) {
    it(`${relPath} shows Friday 9am - 6pm and no 10am`, () => {
      const src = read(relPath);
      assert.match(src, /<span class="hours-day">Friday:<\/span>\s*<span class="hours-time">9am - 6pm<\/span>/);
      assert.doesNotMatch(src, /Friday:[\s\S]{0,60}10am/i);
      assert.match(src, /<span class="hours-day">Saturday:<\/span>\s*<span class="hours-time">Closed<\/span>/);
      assert.match(src, /<span class="hours-day">Sunday:<\/span>\s*<span class="hours-time">Closed<\/span>/);
    });
  }
});

describe('Legacy walk-in appointment slot picker', () => {
  const src = read('snippets/additional-repair.liquid');

  it('does not override Friday start time to 10:00', () => {
    assert.doesNotMatch(src, /dayStartHHMM\s*=\s*['"]10:00['"]/);
    assert.match(src, /let dayStartHHMM = '09:30';/);
    assert.match(src, /let dayEndHHMM = '17:30';/);
  });
});

describe('AI discovery templates (llms-txt and agents.md)', () => {
  for (const relPath of ['templates/page.llms-txt.liquid', 'templates/agents.md.liquid']) {
    it(`${relPath} lists Monday to Friday, 9am to 6pm (Saturday and Sunday closed)`, () => {
      const src = read(relPath);
      assert.match(
        src,
        /Opening Hours:\*\*\s*Monday to Friday, 9am to 6pm \(Saturday and Sunday closed\)/
      );
      assert.doesNotMatch(src, /Friday\s+10/i);
      assert.doesNotMatch(src, /Monday to Thursday/i);
    });
  }
});

describe('Collection JSON templates and standalone wizard HTML', () => {
  const templatesDir = path.join(root, 'templates');
  const jsonFiles = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json')).sort();

  it('all JSON templates parse cleanly and contain zero stale Friday 10am hours', () => {
    assert.ok(jsonFiles.length > 0);
    for (const file of jsonFiles) {
      const src = read(path.join('templates', file));
      const stripped = src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
      assert.doesNotThrow(() => JSON.parse(stripped), `invalid JSON in templates/${file}`);
      assert.doesNotMatch(
        src,
        /Fri:\s*10am|"hours_fri":\s*"10am|Mon[\u2013-]Thur:\s*9am/i,
        `stale Friday 10am hours found in templates/${file}`
      );
    }
  });

  it('templates/collection.iphone-12-series.json sets hours_fri to 9am - 6pm', () => {
    const src = read('templates/collection.iphone-12-series.json');
    assert.match(src, /"hours_fri":\s*"9am - 6pm"/);
  });

  it('icorrect-quote-wizard-final.html shows Fri 9am - 6pm', () => {
    const src = read('icorrect-quote-wizard-final.html');
    assert.match(src, /<span class="hrs-d">Fri<\/span><span class="hrs-t">9am - 6pm<\/span>/);
    assert.doesNotMatch(src, /<span class="hrs-d">Fri<\/span><span class="hrs-t">10am - 6pm<\/span>/);
  });
});
