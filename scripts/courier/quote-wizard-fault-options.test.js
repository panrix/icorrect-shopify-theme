/**
 * iPhone and iPad fault options approved by Michael (Oct 2026).
 * Client-facing label and copy must match the CS text exactly.
 * Run: node --test scripts/courier/quote-wizard-fault-options.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const wizard = fs.readFileSync(path.join(root, 'assets/quote-wizard.js'), 'utf8');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'assets/repair-catalogue-map.json'), 'utf8'));
const { repairsMapForModel } = require('../../assets/repair-catalogue.js');

const SCRIPT_LIMIT = 262144;

const CHARGE_COPY = "We'll replace the charging port, which usually fixes this, and confirm the fault during the repair. If it turns out the issue is with the logic board instead, we'll let you know and send you a quote before doing anything further. Nothing extra is ever done without your go-ahead.";
const LENS_COPY = "A cracked camera lens cover lets dust and moisture in. We'll replace the lens cover to protect your cameras.";
const GENERAL_COPY = "Not sure what's wrong, or want a second opinion? We'll run a full diagnostic and send you our findings with a quote before doing any work.";
const BOARD_COPY = "We'll run our own diagnostic to confirm the fault and whether it can be repaired. You'll get our findings and a quote before we do anything.";
const SEVERAL_COPY = "If your device has a bent frame or more than one broken part, get in touch and we'll put together a quote for everything it needs.";
const SOFTWARE_COPY = "Stuck on the Apple logo, restarting, or showing a restore or update error? We'll diagnose the cause and confirm the fix and price before going ahead.";
const NFC_COPY = "We'll run a diagnostic to find the cause and send you a quote before doing any work.";
const SIGNAL_COPY = "We'll run a diagnostic to find out what's causing it and send you a quote before doing any work.";

function unescapeJs(s) {
  return s.replace(/\\'/g, "'");
}

function parseIssues(src) {
  const start = src.indexOf('var TS = {');
  const end = src.indexOf('var VG_DB = [');
  assert.ok(start >= 0 && end > start, 'TS issue map missing');
  const issues = [];
  let device = null;
  let category = null;
  for (const line of src.slice(start, end).split('\n')) {
    const dev = line.match(/^    (macbook|iphone|ipad|watch): \{$/);
    if (dev) {
      device = dev[1];
      category = null;
      continue;
    }
    const cat = line.match(/^      '([^']+)': \[$/);
    if (cat) {
      category = cat[1];
      continue;
    }
    if (!line.includes('label:')) continue;
    const lab = line.match(/label:\s*'((?:\\'|[^'])*)'/);
    const route = line.match(/route:\s*'([^']+)'/);
    const repairType = line.match(/repairType:\s*(null|'([^']*)')/);
    const copy = line.match(/copy:\s*'((?:\\'|[^'])*)'/);
    if (!lab || !route || !copy) continue;
    issues.push({
      device,
      category,
      label: unescapeJs(lab[1]),
      route: route[1],
      repairType: repairType && repairType[2] ? repairType[2] : null,
      copy: unescapeJs(copy[1]),
      alsoListed: /alsoListed:\s*true/.test(line),
      faceIdOnly: /faceIdOnly:\s*true/.test(line),
      noFaceIdOnly: /noFaceIdOnly:\s*true/.test(line),
    });
  }
  return issues;
}

function findOne(issues, device, category, label) {
  const hits = issues.filter((i) => i.device === device && i.category === category && i.label === label);
  assert.equal(hits.length, 1, `${device} / ${category} / ${label} count ${hits.length}`);
  return hits[0];
}

const issues = parseIssues(wizard);

describe('quote wizard script size', () => {
  it('stays under the 256 KB Shopify asset limit', () => {
    const bytes = Buffer.byteLength(wizard);
    assert.ok(bytes <= SCRIPT_LIMIT, `${bytes} bytes exceeds ${SCRIPT_LIMIT}`);
  });
});

describe('camera category display name', () => {
  it('renames the iPhone and iPad cards only, and keeps the internal key', () => {
    const labels = wizard.match(/\{ v: 'Camera', icon: 'camera', label: 'Front or Rear Camera' \}/g) || [];
    assert.equal(labels.length, 2);
    assert.equal((wizard.match(/label: 'Camera'/g) || []).length, 0);
    assert.match(wizard, /if \(titleEl\) titleEl\.textContent = faultDisplayLabel\(dev, fault\);/);
    assert.match(wizard, /fault_area: S\.fault/);
  });
});

describe('charging port: charges but will not connect', () => {
  for (const device of ['iphone', 'ipad']) {
    it(`${device} books the charging-port repair with the approved copy`, () => {
      const iss = findOne(issues, device, 'Power / Battery / Charging', "Charges, but won't connect to a computer");
      assert.equal(iss.route, 'repair');
      assert.equal(iss.repairType, 'charging-port');
      assert.equal(iss.copy, CHARGE_COPY);
      assert.equal(iss.faceIdOnly, false);
      assert.equal(iss.noFaceIdOnly, false);
    });
  }

  it('is not added for MacBook or Watch', () => {
    const extra = issues.filter((i) => i.label === "Charges, but won't connect to a computer" && i.device !== 'iphone' && i.device !== 'ipad');
    assert.deepEqual(extra, []);
  });
});

describe('rear camera lens under Front or Rear Camera', () => {
  it('iPhone lists the same lens repair under Camera and Rear Glass', () => {
    const camera = findOne(issues, 'iphone', 'Camera', 'Camera lens cover cracked');
    const glass = findOne(issues, 'iphone', 'Rear Glass', 'Camera lens cover cracked');
    assert.equal(camera.route, 'repair');
    assert.equal(camera.repairType, 'rear-camera-lens');
    assert.equal(camera.alsoListed, true);
    assert.equal(glass.alsoListed, false);
    assert.equal(camera.repairType, glass.repairType);
    assert.equal(camera.copy, LENS_COPY);
    assert.equal(glass.copy, LENS_COPY);
  });

  it('price-page prefill still opens Rear Glass', () => {
    const start = wizard.indexOf('  function faultForRepairType(');
    const end = wizard.indexOf('\n  }\n', start);
    const src = [
      wizard.slice(wizard.indexOf('  var TS = {'), wizard.indexOf('\n  };', wizard.indexOf('  var TS = {')) + '\n  };'.length),
      wizard.slice(wizard.indexOf('  var REPAIR_TYPE_TO_FAULT = {'), wizard.indexOf('\n  };', wizard.indexOf('  var REPAIR_TYPE_TO_FAULT = {')) + '\n  };'.length),
      wizard.slice(wizard.indexOf('  var REPAIR_TYPE_ALIASES = {'), wizard.indexOf('};', wizard.indexOf('  var REPAIR_TYPE_ALIASES = {')) + '};'.length),
      wizard.slice(start, end + '\n  }\n'.length),
    ].join('\n');
    const { faultForRepairType } = new Function(
      src + '\nreturn { faultForRepairType: faultForRepairType };'
    )();
    assert.equal(faultForRepairType('iphone', 'rear-camera-lens'), 'Rear Glass');
  });
});

describe('Other options', () => {
  const expected = [
    ['General diagnostic', 'diagnostic', 'diagnostic', GENERAL_COPY],
    ['Board fault confirmed elsewhere', 'diagnostic', 'diagnostic', BOARD_COPY],
    ['Several parts damaged', 'contact', null, SEVERAL_COPY],
    ['Software issue', 'diagnostic', 'diagnostic', SOFTWARE_COPY],
  ];

  for (const device of ['iphone', 'ipad']) {
    for (const [label, route, repairType, copy] of expected) {
      it(`${device} / ${label} routes to ${route}`, () => {
        const iss = findOne(issues, device, 'Other', label);
        assert.equal(iss.route, route);
        assert.equal(iss.repairType, repairType);
        assert.equal(iss.copy, copy);
      });
    }
  }

  it('iPhone and iPad open the Other list; MacBook and Watch stay a contact shortcut', () => {
    assert.match(
      wizard,
      /if \(v === 'Other' && \(S\.device === 'macbook' \|\| S\.device === 'watch'\)\)/
    );
  });

  it('is not added for MacBook or Watch', () => {
    const labels = new Set(expected.map((row) => row[0]));
    const extra = issues.filter((i) => labels.has(i.label) && i.device !== 'iphone' && i.device !== 'ipad');
    assert.deepEqual(extra, []);
  });
});

describe('iPhone connectivity diagnostics', () => {
  it('Apple Pay / NFC not working books a diagnostic', () => {
    const iss = findOne(issues, 'iphone', 'Connectivity', 'Apple Pay / NFC not working');
    assert.equal(iss.route, 'diagnostic');
    assert.equal(iss.repairType, 'diagnostic');
    assert.equal(iss.copy, NFC_COPY);
  });

  it('NFC / Apple Pay not working is the iPad option, and iPhone keeps a single Apple Pay label', () => {
    const ipad = findOne(issues, 'ipad', 'Other', 'NFC / Apple Pay not working');
    assert.equal(ipad.route, 'diagnostic');
    assert.equal(ipad.repairType, 'diagnostic');
    assert.equal(ipad.copy, NFC_COPY);
    const iphoneSwap = issues.filter((i) => i.device === 'iphone' && i.label === 'NFC / Apple Pay not working');
    assert.deepEqual(iphoneSwap, []);
    const iphone = findOne(issues, 'iphone', 'Connectivity', 'Apple Pay / NFC not working');
    assert.equal(iphone.route, 'diagnostic');
    const elsewhere = issues.filter((i) => i.label === 'NFC / Apple Pay not working' && i.device !== 'ipad');
    assert.deepEqual(elsewhere, []);
  });

  it('Won\'t activate books a diagnostic', () => {
    const iss = findOne(issues, 'iphone', 'Connectivity', "Won't activate");
    assert.equal(iss.route, 'diagnostic');
    assert.equal(iss.repairType, 'diagnostic');
    assert.equal(iss.copy, SIGNAL_COPY);
  });

  it('iPad has no Connectivity category to hang these on', () => {
    const ipadConnectivity = issues.filter((i) => i.device === 'ipad' && i.category === 'Connectivity');
    assert.deepEqual(ipadConnectivity, []);
    assert.equal(wizard.includes("{ v: 'Connectivity'"), true);
    const ipadBlock = wizard.slice(wizard.indexOf('    ipad: ['), wizard.indexOf('    watch: ['));
    assert.equal(ipadBlock.includes('Connectivity'), false);
  });
});

describe('sample catalogue routes', () => {
  it('iPhone 15 Pro resolves charging port, lens, and diagnostic', () => {
    const map = repairsMapForModel(catalogue, 'iphone', 'iPhone 15 Pro');
    assert.equal(map['charging-port'].handle, 'iphone-15-pro-charging-port-repair');
    assert.equal(map['rear-camera-lens'].handle, 'iphone-15-pro-rear-camera-lens-repair');
    assert.equal(map.diagnostic.handle, 'iphone-15-pro-diagnostic');
  });

  it('iPad Pro 11 2019 short name books the same products as 1st Gen', () => {
    const names = [
      'iPad Pro 11" 1st Gen (2019)',
      'iPad Pro 11-inch 1st Gen (2019)',
      'iPad Pro 11-inch (2019)',
      'iPad Pro 11 (2019)',
    ];
    for (const name of names) {
      const map = repairsMapForModel(catalogue, 'ipad', name);
      assert.equal(map['charging-port'].handle, 'ipad-pro-11-2019-charging-port-repair', name);
      assert.equal(map.diagnostic.handle, 'ipad-pro-11-2019-diagnostic', name);
      assert.equal(map.battery.handle, 'ipad-pro-11-2019-battery-repair', name);
      assert.equal(map.screen.handle, 'ipad-pro-11-1st-gen-2019-lcd-display-repair', name);
    }
    const full = catalogue.models['ipad::ipad-pro-11-inch-1st-gen-2019'].repairs;
    const short = catalogue.models['ipad::ipad-pro-11-inch-2019'].repairs;
    assert.deepEqual(
      Object.keys(short).sort().map((key) => short[key].handle),
      Object.keys(full).sort().map((key) => full[key].handle)
    );
  });

  it('iPad Pro 11-inch 3rd Gen M1 resolves charging port and diagnostic, not a lens', () => {
    const map = repairsMapForModel(catalogue, 'ipad', 'iPad Pro 11-inch 3rd Gen M1 (2021)');
    assert.equal(map['charging-port'].handle, 'ipad-pro-11-2021-m1-charging-port-repair');
    assert.equal(map.diagnostic.handle, 'ipad-pro-11-2021-m1-diagnostic');
    assert.equal(map['rear-camera-lens'], undefined);
    const ipadLens = issues.filter((i) => i.device === 'ipad' && i.repairType === 'rear-camera-lens');
    assert.deepEqual(ipadLens, []);
  });
});
