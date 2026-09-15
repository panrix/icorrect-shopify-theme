'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { SETTINGS, splitThemeJson } = require('./apply-quote-wizard-settings');

const templatesDir = path.join(__dirname, '../../templates');

function walkJson(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...walkJson(full));
    else if (name.endsWith('.json')) out.push(full);
  }
  return out;
}

describe('quote-wizard same-day settings on every template', () => {
  it('every quote-wizard section has the public proxy URL and the three variant IDs', () => {
    const files = walkJson(templatesDir);
    let sections = 0;
    for (const file of files) {
      const { jsonText } = splitThemeJson(fs.readFileSync(file, 'utf8'));
      let data;
      try { data = JSON.parse(jsonText); } catch (e) { continue; }
      for (const [key, section] of Object.entries(data.sections || {})) {
        if (!section || section.type !== 'quote-wizard') continue;
        sections += 1;
        const settings = section.settings || {};
        for (const [id, value] of Object.entries(SETTINGS)) {
          assert.equal(
            settings[id],
            value,
            `${path.relative(templatesDir, file)} ${key} missing ${id}`
          );
        }
      }
    }
    assert.ok(sections >= 20, 'expected many quote-wizard sections, got ' + sections);
  });
});
