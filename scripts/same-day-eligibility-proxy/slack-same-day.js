'use strict';

const { findSameDayLine } = require('./paid-order');

function slackSameDayPrefix(order, extra) {
  if (extra && extra.reserveFailed) return 'SAME-DAY RESERVE FAILED';
  if (findSameDayLine(order)) return 'SAME-DAY';
  return '';
}

function annotateSuccessSlackText(text, order, extra) {
  const prefix = slackSameDayPrefix(order, extra);
  if (!prefix) return text;
  if (String(text || '').includes(prefix)) return text;
  return `*${prefix}*\n\n${text}`;
}

function sameDayTurnaroundTag(order) {
  return findSameDayLine(order) ? ' *SAME-DAY*' : null;
}

module.exports = {
  slackSameDayPrefix,
  annotateSuccessSlackText,
  sameDayTurnaroundTag
};
