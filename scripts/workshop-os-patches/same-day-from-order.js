'use strict';

/**
 * Copy into workshop-os intake/shopify-order-handler/lib/same-day-from-order.js
 * (ESM re-export wrapper lives next to this file).
 */
const {
  findSameDayLine,
  reserveRequestFromOrder,
  sameDayDateFromOrder
} = require('../same-day-eligibility-proxy/paid-order');
const {
  annotateSuccessSlackText,
  slackSameDayPrefix,
  sameDayTurnaroundTag
} = require('../same-day-eligibility-proxy/slack-same-day');

async function reserveSameDayOnPaid(order, deps = {}) {
  const request = reserveRequestFromOrder(order);
  if (!request) return { skipped: true, reason: 'not_same_day' };
  if (!request.date) {
    return { ok: false, skipped: false, reason: 'missing_date', request };
  }
  const url = deps.reserveUrl || process.env.SAME_DAY_RESERVE_URL || 'http://127.0.0.1:8061/same-day/reserve';
  const secret = deps.reserveSecret || process.env.SAME_DAY_RESERVE_SECRET || '';
  const fetchImpl = deps.fetchImpl || fetch;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      Authorization: secret ? 'Bearer ' + secret : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ok: false, reason: 'http_' + response.status, request, body };
  }
  return { ok: Boolean(body.ok), request, body };
}

module.exports = {
  findSameDayLine,
  reserveRequestFromOrder,
  sameDayDateFromOrder,
  annotateSuccessSlackText,
  slackSameDayPrefix,
  sameDayTurnaroundTag,
  reserveSameDayOnPaid
};
