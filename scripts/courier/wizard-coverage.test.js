/**
 * Wizard completeness formula.
 * Run: node --test scripts/courier/wizard-coverage.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  FORMULA,
  auditWizardCoverage,
  loadInputs,
  parseWizardLogic,
} = require('./wizard-coverage');
const { findModel } = require('../../assets/repair-catalogue.js');

describe('wizard coverage formula', () => {
  it('holds for every live wizard collection SKU', () => {
    const report = auditWizardCoverage(loadInputs());
    assert.equal(report.ok, true, JSON.stringify(report.gaps, null, 2));
    assert.ok(report.checked >= 100, 'models ' + report.checked);
    assert.ok(report.skus >= 800, 'skus ' + report.skus);
    assert.match(FORMULA, /liveTypes\(M\) ⊆ wizardTypes\(M\)/);
  });

  it('fails if iPad Air 11 M3 loses its screen SKU', () => {
    const inputs = loadInputs();
    const before = auditWizardCoverage(inputs);
    assert.equal(before.ok, true);
    const model = findModel(
      inputs.map,
      'ipad',
      'iPad Air 11" 7th Gen \'M3\' (2025)'
    );
    assert.ok(model && model.repairs && model.repairs.screen);
    delete model.repairs.screen;
    const after = auditWizardCoverage(inputs);
    assert.equal(after.ok, false);
    assert.ok(
      after.gaps.some(
        (g) =>
          /M3/.test(g.menu) &&
          (g.kind === 'missing-type' || g.kind === 'hidden-issue') &&
          (g.type === 'screen' || (g.issueTypes || []).includes('screen'))
      ),
      JSON.stringify(after.gaps.filter((g) => /M3/.test(g.menu)), null, 2)
    );
  });

  it('fails if Watch Ultra 2 loses side-button', () => {
    const inputs = loadInputs();
    const model = findModel(inputs.map, 'watch', 'Apple Watch Ultra 2');
    assert.ok(model.repairs['side-button']);
    delete model.repairs['side-button'];
    const after = auditWizardCoverage(inputs);
    assert.equal(after.ok, false);
    assert.ok(
      after.gaps.some(
        (g) => /Ultra 2/.test(g.menu) && g.type === 'side-button'
      )
    );
  });

  it('reads HANDLE_SUFFIX_MAP and watch remap from quote-wizard.liquid', () => {
    const inputs = loadInputs();
    const logic = parseWizardLogic(inputs.liquid);
    assert.equal(logic.suffixMap['lcd-display-repair'], 'screen');
    assert.equal(logic.suffixMap['side-button-repair'], 'side-button');
    assert.equal(logic.typeToFault.screen, 'Screen / Display');
    assert.equal(logic.typeToFault['side-button'], 'Buttons');
    assert.ok(logic.faultLabels.watch.includes('Buttons / Crown'));
    assert.ok(
      logic.quoteIssues.ipad['Screen / Display'].includes('screen')
    );
    assert.ok(
      logic.quoteIssues.watch['Buttons / Crown'].includes('side-button')
    );
  });
});
