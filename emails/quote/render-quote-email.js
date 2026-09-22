/**
 * Client quote email. A summary of the quote card the wizard is already
 * showing, plus the client's name. Empty blocks are left out.
 *
 * Visible card (scraped at send time from the resolution screen):
 *   screenTitle, badge, repairTitle (the card heading), paragraphs,
 *   estimates, postcode + postcodeLabel, noticeTitle/noticeDetail,
 *   serviceLabel, serviceName, serviceMeta, servicePriceLabel,
 *   collectionLabel, collectionDow/Day/Mon, collectionWindowLabel/Detail,
 *   colorLabel, deviceColor, turnaroundLabel, expressName/Meta/PriceLabel,
 *   journey [{title, meta}], etaLabel, etaDate, etaNote,
 *   trust [{title, sub, kind}], priceLabel, totalPrice, productUrl
 *
 * deviceModel is shown only when the card heading does not already name it.
 * deviceType is never shown.
 */

function gbp(amount) {
  var num = Number(amount);
  if (!isFinite(num)) return "";
  return "£" + num.toLocaleString("en-GB", {
    minimumFractionDigits: Math.round(num * 100) % 100 !== 0 ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clean(value) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
}

function parseList(raw) {
  if (!raw) return [];
  var list = raw;
  if (typeof raw === "string") {
    var text = raw.trim();
    if (!text) return [];
    if (text.charAt(0) !== "[" && text.charAt(0) !== "{") return [text];
    try { list = JSON.parse(text); } catch (e) { return [text]; }
  }
  if (typeof list === "string") return [list];
  if (!Array.isArray(list)) return [];
  return list;
}

function paragraphsOf(data) {
  var list = parseList(data.paragraphs);
  if (!list.length && data.copy) list = [data.copy];
  return list.map(clean).filter(Boolean);
}

function estimatesOf(data) {
  return parseList(data.estimates).map(function (row) {
    if (typeof row === "string") return null;
    return { label: clean(row && row.label), value: clean(row && row.value) };
  }).filter(function (row) { return row && row.label && row.value; });
}

function journeyOf(data) {
  return parseList(data.journey).map(function (step) {
    if (!step || typeof step === "string") return null;
    return { title: clean(step.title), meta: clean(step.meta) };
  }).filter(function (step) { return step && step.title; });
}

function trustOf(data) {
  var list = parseList(data.trust).map(function (cell) {
    if (!cell || typeof cell === "string") return null;
    return { title: clean(cell.title), sub: clean(cell.sub), kind: clean(cell.kind) };
  }).filter(function (cell) { return cell && cell.title; });
  if (list.length) return list;
  var fallback = [];
  if (clean(data.parts)) fallback.push({ title: clean(data.parts), sub: "" });
  if (clean(data.warranty)) fallback.push({ title: clean(data.warranty), sub: "" });
  return fallback;
}

function badgeTone(data, badge) {
  var tone = clean(data.badgeTone).toLowerCase();
  if (tone === "amber" || tone === "green" || tone === "blue") return tone;
  var text = badge.toLowerCase();
  if (text.indexOf("take a look") !== -1 || text.indexOf("can't help") !== -1) return "amber";
  if (text.indexOf("chat") !== -1) return "blue";
  return "green";
}

function badgeStyle(tone) {
  if (tone === "amber") return "background:#fff8ea;color:#8c5a00;";
  if (tone === "blue") return "background:#f0f7ff;color:#0070f3;";
  return "background:#e6f6ec;color:#1a6b34;";
}

function renderQuoteEmail(input) {
  var data = input || {};
  var name = clean(data.name);
  var screenTitle = clean(data.screenTitle);
  var badge = clean(data.badge);
  var heading = clean(data.repairTitle);
  var model = clean(data.deviceModel);
  var showModel = !!(model && heading.indexOf(model) === -1);
  var paragraphs = paragraphsOf(data);
  var estimates = estimatesOf(data);
  var journey = journeyOf(data);
  var trust = trustOf(data);
  var total = clean(data.totalPrice);
  var priceLabel = clean(data.priceLabel) || (total ? "All-in total" : "");
  var bookUrl = clean(data.productUrl);
  var title = heading || screenTitle || "Quote";

  return [
    "<!doctype html>",
    "<html lang=\"en\">",
    "<head>",
    "<meta charset=\"utf-8\">",
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>" + esc(title) + "</title>",
    "</head>",
    "<body style=\"margin:0;padding:0;background:#fafafa;\">",
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#fafafa;margin:0;padding:0;\">",
    "<tr><td align=\"center\" style=\"padding:32px 16px;\">",
    "<table role=\"presentation\" width=\"640\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:640px;max-width:640px;background:#ffffff;border:1px solid #ebebeb;border-radius:12px;\">",
    "<tr><td style=\"padding:28px 28px 8px 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<img src=\"https://intake.icorrect.co.uk/client/logo.png\" width=\"168\" height=\"33\" alt=\"iCorrect\" style=\"display:block;border:0;width:168px;height:auto;\">",
    name ? "<p style=\"margin:22px 0 0 0;font-size:16px;line-height:1.4;color:#171717;\">Hi " + esc(name) + ",</p>" : "",
    screenTitle ? "<h1 style=\"margin:18px 0 0 0;font-size:28px;line-height:1.15;letter-spacing:-0.8px;font-weight:600;color:#171717;\">" + esc(screenTitle) + "</h1>" : "",
    showModel ? "<p style=\"margin:8px 0 0 0;font-size:15px;line-height:1.4;color:#4d4d4d;\">" + esc(model) + "</p>" : "",
    badgeHtml(badge, badgeTone(data, badge)),
    heading ? "<h2 style=\"margin:12px 0 0 0;font-size:20px;line-height:1.25;letter-spacing:-0.4px;font-weight:600;color:#171717;\">" + esc(heading) + "</h2>" : "",
    paragraphsHtml(paragraphs),
    clean(data.urgent) ? "<p style=\"margin:14px 0 0 0;padding:10px 12px;background:#fff8ea;border-radius:8px;font-size:14px;line-height:1.45;color:#171717;\">" + esc(data.urgent) + "</p>" : "",
    "</td></tr>",
    estimatesHtml(estimates),
    postcodeHtml(data),
    noticeHtml(data),
    serviceHtml(data),
    collectionHtml(data),
    choiceHtml(clean(data.colorLabel), clean(data.deviceColor), ""),
    choiceHtml(clean(data.turnaroundLabel), clean(data.expressName), expressDetail(data)),
    journeyHtml(journey, data),
    trustHtml(trust, priceLabel, total),
    bookUrl ? ctaHtml(bookUrl) : "",
    "<tr><td style=\"padding:8px 28px 28px 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<p style=\"margin:0;font-size:13px;line-height:1.5;color:#666666;\">iCorrect · 12 Margaret Street, Audley House, London W1W 8JQ<br>020 7099 8517 · support@icorrect.co.uk</p>",
    "</td></tr>",
    "</table>",
    "</td></tr>",
    "</table>",
    "</body></html>"
  ].join("");
}

function badgeHtml(badge, tone) {
  if (!badge) return "";
  return "<div style=\"margin:16px 0 0 0;\">" +
    "<span style=\"display:inline-block;" + badgeStyle(tone) + "font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;padding:5px 10px;border-radius:999px;\">" +
    esc(badge) + "</span></div>";
}

function paragraphsHtml(paragraphs) {
  return paragraphs.map(function (text) {
    return "<p style=\"margin:10px 0 0 0;font-size:14px;line-height:1.55;color:#4d4d4d;\">" + esc(text) + "</p>";
  }).join("");
}

function sectionLabel(text) {
  if (!text) return "";
  return "<p style=\"margin:0 0 8px 0;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#666666;\">" + esc(text) + "</p>";
}

function estimatesHtml(rows) {
  if (!rows.length) return "";
  var body = rows.map(function (row, i) {
    var border = i === rows.length - 1 ? "" : "border-bottom:1px solid #ebebeb;";
    return "<tr>" +
      "<td style=\"padding:10px 0;" + border + "font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;color:#171717;\">" + esc(row.label) + "</td>" +
      "<td align=\"right\" style=\"padding:10px 0;" + border + "font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:14px;font-weight:500;color:#171717;white-space:nowrap;\">" + esc(row.value) + "</td>" +
      "</tr>";
  }).join("");
  return "<tr><td style=\"padding:8px 28px 0 28px;\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + body + "</table></td></tr>";
}

function postcodeHtml(data) {
  var postcode = clean(data.postcode);
  if (!postcode) return "";
  return "<tr><td style=\"padding:18px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    sectionLabel(data.postcodeLabel) +
    "<div style=\"padding:14px 16px;background:#fafafa;border-radius:12px;border:1px solid #e6e6e6;font-size:18px;font-weight:600;letter-spacing:-0.3px;color:#171717;\">" + esc(postcode) + "</div>" +
    "</td></tr>";
}

function noticeHtml(data) {
  var title = clean(data.noticeTitle);
  var detail = clean(data.noticeDetail);
  if (!title && !detail) return "";
  return "<tr><td style=\"padding:10px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<div style=\"padding:10px 12px;background:#f0f7ff;border-radius:8px;\">" +
    (title ? "<div style=\"font-size:13px;font-weight:600;line-height:1.35;color:#171717;\">" + esc(title) + "</div>" : "") +
    (detail ? "<div style=\"margin-top:2px;font-size:12px;line-height:1.35;color:#4d4d4d;\">" + esc(detail) + "</div>" : "") +
    "</div></td></tr>";
}

function serviceAmount(data) {
  var label = clean(data.servicePriceLabel);
  if (label && label !== "—" && label !== "-") return label;
  if (data.servicePrice === 0 || data.servicePrice) return gbp(data.servicePrice);
  return "";
}

function serviceHtml(data) {
  var name = clean(data.serviceName);
  if (!name) return "";
  var meta = clean(data.serviceMeta);
  var amount = serviceAmount(data);
  return "<tr><td style=\"padding:16px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    sectionLabel(data.serviceLabel) +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f7f7f7;border-radius:12px;border:1.5px solid #171717;\">" +
    "<tr>" +
    "<td width=\"28\" valign=\"middle\" style=\"padding:14px 0 14px 14px;width:28px;\">" +
    "<div style=\"width:16px;height:16px;border-radius:50%;background:#171717;text-align:center;line-height:16px;font-size:9px;color:#ffffff;\">&#9679;</div>" +
    "</td>" +
    "<td valign=\"middle\" style=\"padding:14px 12px;\">" +
    "<div style=\"font-size:15px;font-weight:600;line-height:1.3;color:#171717;\">" + esc(name) + "</div>" +
    (meta ? "<div style=\"margin-top:2px;font-size:13px;line-height:1.35;color:#4d4d4d;\">" + esc(meta) + "</div>" : "") +
    "</td>" +
    (amount ? "<td align=\"right\" valign=\"middle\" style=\"padding:14px 14px 14px 0;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:600;color:#171717;white-space:nowrap;\">" + esc(amount) + "</td>" : "") +
    "</tr></table></td></tr>";
}

function collectionHtml(data) {
  var dow = clean(data.collectionDow);
  var day = clean(data.collectionDay);
  var mon = clean(data.collectionMon);
  var label = clean(data.collectionWindowLabel);
  var detail = clean(data.collectionWindowDetail);
  if (!dow && !day && !label) return "";
  var dateCell = (dow || day || mon)
    ? "<td valign=\"top\" style=\"padding-right:8px;\">" +
      "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#171717;border-radius:10px;\">" +
      "<tr><td align=\"center\" style=\"padding:10px 14px;min-width:64px;font-family:Geist,Arial,Helvetica,sans-serif;color:#ffffff;\">" +
      (dow ? "<div style=\"font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,0.7);\">" + esc(dow) + "</div>" : "") +
      (day ? "<div style=\"margin-top:4px;font-size:18px;font-weight:600;letter-spacing:-0.4px;line-height:1.1;\">" + esc(day) + "</div>" : "") +
      (mon ? "<div style=\"margin-top:2px;font-size:11px;color:rgba(255,255,255,0.7);\">" + esc(mon) + "</div>" : "") +
      "</td></tr></table></td>"
    : "";
  var windowCell = label
    ? "<td valign=\"top\">" +
      "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#171717;border-radius:10px;\">" +
      "<tr><td style=\"padding:14px 16px;font-family:Geist,Arial,Helvetica,sans-serif;color:#ffffff;\">" +
      "<div style=\"font-size:14px;font-weight:600;line-height:1.2;\">" + esc(label) + "</div>" +
      (detail ? "<div style=\"margin-top:4px;font-size:12px;line-height:1.3;color:rgba(255,255,255,0.75);\">" + esc(detail) + "</div>" : "") +
      "</td></tr></table></td>"
    : "";
  return "<tr><td style=\"padding:16px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    sectionLabel(data.collectionLabel) +
    "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr>" + dateCell + windowCell + "</tr></table>" +
    "</td></tr>";
}

function expressDetail(data) {
  var meta = clean(data.expressMeta);
  var price = clean(data.expressPriceLabel);
  if (!price && (data.expressPrice === 0 || data.expressPrice) && clean(data.expressName)) price = gbp(data.expressPrice);
  return [meta, price].filter(Boolean).join(" · ");
}

function choiceHtml(label, title, detail) {
  if (!title) return "";
  return "<tr><td style=\"padding:16px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    sectionLabel(label) +
    "<div style=\"padding:12px 14px;background:#f7f7f7;border-radius:12px;border:1.5px solid #171717;\">" +
    "<div style=\"font-size:15px;font-weight:600;color:#171717;\">" + esc(title) + "</div>" +
    (detail ? "<div style=\"margin-top:2px;font-size:13px;color:#4d4d4d;\">" + esc(detail) + "</div>" : "") +
    "</div></td></tr>";
}

function journeyHtml(steps, data) {
  var etaLabel = clean(data.etaLabel);
  var etaDate = clean(data.etaDate);
  var etaNote = clean(data.etaNote);
  if (!steps.length && !etaLabel && !etaDate && !etaNote) return "";
  var stepCells = steps.map(function (step, i) {
    return "<td valign=\"top\" align=\"center\" width=\"" + Math.floor(100 / steps.length) + "%\" style=\"padding:0 4px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      "<div style=\"width:24px;height:24px;line-height:24px;border-radius:50%;background:#171717;color:#ffffff;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:600;text-align:center;margin:0 auto 8px auto;\">" + (i + 1) + "</div>" +
      "<div style=\"font-size:13px;font-weight:600;line-height:1.25;color:#171717;\">" + esc(step.title) + "</div>" +
      (step.meta ? "<div style=\"margin-top:3px;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.3;color:#525252;\">" + esc(step.meta) + "</div>" : "") +
      "</td>";
  }).join("");
  var eta = "";
  if (etaLabel || etaDate || etaNote) {
    eta = "<div style=\"margin-top:14px;padding:12px 14px;background:#ffffff;border-radius:8px;border:1px solid rgba(0,0,0,0.08);text-align:center;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      (etaLabel ? "<div style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#525252;\">" + esc(etaLabel) + "</div>" : "") +
      (etaDate ? "<div style=\"margin-top:6px;font-size:20px;font-weight:700;letter-spacing:-0.4px;color:#171717;\">" + esc(etaDate) + "</div>" : "") +
      (etaNote ? "<div style=\"margin-top:4px;font-size:12px;line-height:1.3;color:#6b6b6b;\">" + esc(etaNote) + "</div>" : "") +
      "</div>";
  }
  return "<tr><td style=\"padding:16px 28px 0 28px;\">" +
    "<div style=\"padding:18px 12px 16px 12px;background:#fafafa;border-radius:12px;border:1px solid rgba(0,0,0,0.08);\">" +
    (steps.length ? "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr>" + stepCells + "</tr></table>" : "") +
    eta +
    "</div></td></tr>";
}

function trustCell(cell) {
  var stars = cell.kind === "reviews"
    ? "<div style=\"color:#e6b800;font-size:11px;letter-spacing:1px;line-height:1;\">&#9733;&#9733;&#9733;&#9733;&#9733;</div>"
    : "";
  var titleStyle = cell.kind === "reviews"
    ? "font-size:28px;font-weight:700;letter-spacing:-1px;line-height:1;color:#171717;"
    : "font-size:13px;font-weight:600;line-height:1.25;color:#171717;";
  return "<td valign=\"middle\" width=\"50%\" style=\"padding:14px 12px;border-bottom:1px solid #e6e6e6;border-right:1px solid #e6e6e6;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<div style=\"" + titleStyle + "\">" + esc(cell.title) + "</div>" +
    stars +
    (cell.sub ? "<div style=\"margin-top:3px;font-size:12px;line-height:1.3;color:#808080;\">" + esc(cell.sub) + "</div>" : "") +
    "</td>";
}

function trustHtml(cells, priceLabel, total) {
  if (!cells.length && !total) return "";
  var rows = "";
  for (var i = 0; i < cells.length; i += 2) {
    var left = trustCell(cells[i]);
    var right = cells[i + 1]
      ? trustCell(cells[i + 1])
      : "<td width=\"50%\" style=\"border-bottom:1px solid #e6e6e6;\">&nbsp;</td>";
    rows += "<tr>" + left + right + "</tr>";
  }
  var price = total
    ? "<td rowspan=\"" + Math.max(Math.ceil(cells.length / 2), 1) + "\" valign=\"middle\" align=\"center\" width=\"168\" style=\"width:168px;background:#f5f5f5;border-left:1px solid #e6e6e6;padding:16px 12px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      (priceLabel ? "<div style=\"font-size:12px;font-weight:500;color:#808080;\">" + esc(priceLabel) + "</div>" : "") +
      "<div style=\"margin-top:4px;font-size:36px;font-weight:700;letter-spacing:-1.2px;line-height:1;color:#171717;\">" + esc(total) + "</div>" +
      "</td>"
    : "";
  if (!rows && price) {
    rows = "<tr>" + price + "</tr>";
  } else if (rows && price) {
    rows = rows.replace("</tr>", price + "</tr>");
  }
  return "<tr><td style=\"padding:16px 28px 0 28px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border:1px solid #e6e6e6;border-radius:12px;border-collapse:separate;\">" +
    rows + "</table></td></tr>";
}

function ctaHtml(url) {
  return "<tr><td style=\"padding:20px 28px 12px 28px;\">" +
    "<a href=\"" + esc(url) + "\" style=\"display:block;background:#171717;color:#ffffff;text-decoration:none;text-align:center;font-family:Geist,Arial,Helvetica,sans-serif;font-size:16px;font-weight:500;line-height:1;padding:16px 28px;border-radius:10px;\">Proceed to checkout &#8594;</a>" +
    "</td></tr>";
}

module.exports = {
  renderQuoteEmail: renderQuoteEmail,
  gbp: gbp
};
