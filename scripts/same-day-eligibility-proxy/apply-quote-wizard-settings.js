#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SETTINGS = {
  fast_variant_id: 46150011027709,
  iphone_sameday_variant_id: 71304855585021,
  macbook_sameday_variant_id: 46150010962173,
  same_day_eligibility_url: 'https://api.icorrect.co.uk/same-day/eligibility'
};

function walkJson(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walkJson(full));
    else if (name.endsWith('.json')) out.push(full);
  }
  return out;
}

function splitThemeJson(raw) {
  const match = String(raw).match(/^\s*(\/\*[\s\S]*?\*\/)\s*/);
  if (!match) return { header: '', jsonText: raw };
  return { header: match[1] + '\n', jsonText: raw.slice(match[0].length) };
}

function applyFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { header, jsonText } = splitThemeJson(raw);
  let data;
  try { data = JSON.parse(jsonText); } catch (e) { return 0; }
  const sections = data.sections || {};
  let changed = 0;
  for (const section of Object.values(sections)) {
    if (!section || section.type !== 'quote-wizard') continue;
    section.settings = section.settings || {};
    for (const [key, value] of Object.entries(SETTINGS)) {
      if (section.settings[key] !== value) {
        section.settings[key] = value;
        changed += 1;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, header + JSON.stringify(data, null, 2) + '\n');
  }
  return changed;
}

function applyAll(templatesDir) {
  const root = templatesDir || path.join(__dirname, '../../templates');
  let files = 0;
  let keys = 0;
  for (const file of walkJson(root)) {
    const n = applyFile(file);
    if (n) {
      files += 1;
      keys += n;
    }
  }
  return { files, keys };
}

if (require.main === module) {
  const result = applyAll();
  process.stdout.write(JSON.stringify(result) + '\n');
}

module.exports = { SETTINGS, applyFile, applyAll, splitThemeJson };
