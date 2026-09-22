/**
 * Client quote email. Facts from the quote the client already confirmed:
 * repair, postcode, chosen service, collection, journey, price, warranty.
 * Wizard prompts, unavailable-courier notices, and marketing blurbs are left out.
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

function estimatesOf(data) {
  return parseList(data.estimates).map(function (row) {
    if (typeof row === "string") return null;
    return { label: clean(row && row.label), value: clean(row && row.value) };
  }).filter(function (row) { return row && row.label && row.value; });
}

function journeyOf(data) {
  var etaDate = clean(data.etaDate);
  var sooner = /often sooner/i.test(clean(data.etaNote));
  return parseList(data.journey).map(function (step) {
    if (!step || typeof step === "string") return null;
    var meta = clean(step.meta);
    if (sooner && etaDate && meta === etaDate) meta = meta + ", often sooner";
    return { title: clean(step.title), meta: meta };
  }).filter(function (step) { return step && step.title; });
}

function badgeTone(data, badge) {
  var tone = clean(data.badgeTone).toLowerCase();
  if (tone === "amber" || tone === "green" || tone === "blue") return tone;
  var text = badge.toLowerCase();
  if (text.indexOf("take a look") !== -1 || text.indexOf("can't help") !== -1) return "amber";
  if (text.indexOf("chat") !== -1) return "blue";
  return "green";
}

function isDiagnostic(data) {
  return clean(data.route).toLowerCase() === "diagnostic";
}

function collectionLine(data) {
  var explicit = clean(data.collectionLine);
  if (explicit) return explicit;
  var date = [clean(data.collectionDow), clean(data.collectionDay), clean(data.collectionMon)].filter(Boolean).join(" ");
  var windowText = [clean(data.collectionWindowLabel), clean(data.collectionWindowDetail)].filter(Boolean).join(" · ");
  return [date, windowText].filter(Boolean).join(" · ");
}

function serviceAmount(data) {
  var label = clean(data.servicePriceLabel);
  if (label && label !== "—" && label !== "-") return label;
  if (data.servicePrice === 0 || data.servicePrice) return gbp(data.servicePrice);
  return "";
}

function expressLine(data) {
  var name = clean(data.expressName);
  if (!name) return "";
  var paid = Number(data.expressPrice) > 0 || /[£+]/.test(clean(data.expressPriceLabel));
  if (!paid) return "";
  var bits = [name];
  var meta = clean(data.expressMeta);
  var price = clean(data.expressPriceLabel);
  if (!price && (data.expressPrice === 0 || data.expressPrice)) price = gbp(data.expressPrice);
  if (meta) bits.push(meta);
  if (price) bits.push(price);
  return bits.join(" · ");
}

function termsLine(data) {
  return [clean(data.parts), clean(data.warranty)].filter(Boolean).join(" · ");
}

function bookLabel(data) {
  return isDiagnostic(data) ? "Book the diagnostic" : "Book this repair";
}

function priceLabelOf(data, total) {
  if (!total) return "";
  if (isDiagnostic(data)) return "Diagnostic";
  return clean(data.priceLabel) || "All-in total";
}

function renderQuoteEmail(input) {
  var data = input || {};
  var name = clean(data.name);
  var diagnostic = isDiagnostic(data);
  var screenTitle = diagnostic ? "" : clean(data.screenTitle);
  var badge = clean(data.badge);
  var tone = badgeTone(data, badge);
  if (tone === "green") badge = "";
  var heading = clean(data.repairTitle);
  var model = clean(data.deviceModel);
  var showModel = !!(model && heading.indexOf(model) === -1);
  var estimates = estimatesOf(data);
  var journey = journeyOf(data);
  var total = clean(data.totalPrice);
  var priceLabel = priceLabelOf(data, total);
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
    badgeHtml(badge, tone),
    heading ? "<h2 style=\"margin:12px 0 0 0;font-size:20px;line-height:1.25;letter-spacing:-0.4px;font-weight:600;color:#171717;\">" + esc(heading) + "</h2>" : "",
    showModel ? "<p style=\"margin:8px 0 0 0;font-size:15px;line-height:1.4;color:#4d4d4d;\">" + esc(model) + "</p>" : "",
    clean(data.urgent) ? "<p style=\"margin:14px 0 0 0;padding:10px 12px;background:#fff8ea;border-radius:8px;font-size:14px;line-height:1.45;color:#171717;\">" + esc(data.urgent) + "</p>" : "",
    "</td></tr>",
    estimatesHtml(estimates),
    factHtml("Postcode", clean(data.postcode)),
    serviceHtml(clean(data.serviceName), serviceAmount(data)),
    factHtml("Collection", collectionLine(data)),
    factHtml("Colour", clean(data.deviceColor)),
    factHtml("Turnaround", expressLine(data)),
    journeyHtml(journey),
    priceHtml(priceLabel, total, termsLine(data)),
    bookUrl ? ctaHtml(bookUrl, bookLabel(data)) : "",
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
  if (!badge || tone === "green") return "";
  var style = tone === "amber"
    ? "background:#fff8ea;color:#8c5a00;"
    : "background:#f0f7ff;color:#0070f3;";
  return "<div style=\"margin:16px 0 0 0;\">" +
    "<span style=\"display:inline-block;" + style + "font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;padding:5px 10px;border-radius:999px;\">" +
    esc(badge) + "</span></div>";
}

function sectionLabel(text) {
  return "<p style=\"margin:0 0 6px 0;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#666666;\">" + esc(text) + "</p>";
}

function factHtml(label, value) {
  if (!value) return "";
  return "<tr><td style=\"padding:16px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    sectionLabel(label) +
    "<div style=\"font-size:16px;font-weight:600;line-height:1.35;color:#171717;\">" + esc(value) + "</div>" +
    "</td></tr>";
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

function serviceHtml(name, amount) {
  if (!name) return "";
  return "<tr><td style=\"padding:16px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
    "<tr>" +
    "<td style=\"font-size:16px;font-weight:600;line-height:1.35;color:#171717;\">" + esc(name) + "</td>" +
    (amount ? "<td align=\"right\" style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:600;color:#171717;white-space:nowrap;\">" + esc(amount) + "</td>" : "") +
    "</tr></table></td></tr>";
}

function journeyHtml(steps) {
  if (!steps.length) return "";
  var rows = steps.map(function (step, i) {
    var border = i === steps.length - 1 ? "" : "border-bottom:1px solid #ebebeb;";
    return "<tr>" +
      "<td width=\"28\" valign=\"top\" style=\"padding:10px 0;" + border + "font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:600;color:#171717;\">" + (i + 1) + "</td>" +
      "<td valign=\"top\" style=\"padding:10px 8px;" + border + "font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#171717;\">" + esc(step.title) + "</td>" +
      "<td align=\"right\" valign=\"top\" style=\"padding:10px 0;" + border + "font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:13px;color:#525252;\">" + esc(step.meta) + "</td>" +
      "</tr>";
  }).join("");
  return "<tr><td style=\"padding:16px 28px 0 28px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#fafafa;border:1px solid #ebebeb;border-radius:12px;\">" +
    "<tr><td style=\"padding:6px 16px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + rows + "</table>" +
    "</td></tr></table></td></tr>";
}

function priceHtml(label, total, terms) {
  if (!total && !terms) return "";
  return "<tr><td style=\"padding:20px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<div style=\"padding:16px 18px;background:#f5f5f5;border-radius:12px;\">" +
    (label ? "<div style=\"font-size:12px;font-weight:500;color:#666666;\">" + esc(label) + "</div>" : "") +
    (total ? "<div style=\"margin-top:4px;font-size:36px;font-weight:700;letter-spacing:-1.2px;line-height:1;color:#171717;\">" + esc(total) + "</div>" : "") +
    (terms ? "<div style=\"margin-top:8px;font-size:13px;line-height:1.4;color:#4d4d4d;\">" + esc(terms) + "</div>" : "") +
    "</div></td></tr>";
}

function ctaHtml(url, label) {
  return "<tr><td style=\"padding:20px 28px 12px 28px;\">" +
    "<a href=\"" + esc(url) + "\" style=\"display:block;background:#171717;color:#ffffff;text-decoration:none;text-align:center;font-family:Geist,Arial,Helvetica,sans-serif;font-size:16px;font-weight:500;line-height:1;padding:16px 28px;border-radius:10px;\">" + esc(label) + " &#8594;</a>" +
    "</td></tr>";
}

module.exports = {
  renderQuoteEmail: renderQuoteEmail,
  gbp: gbp
};
