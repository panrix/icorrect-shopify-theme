/**
 * Client quote email. The confirmed quote in the wizard’s style:
 * repair, postcode, chosen service, a working-day journey, trust, price.
 * Calendar dates, unavailable-courier notices, and question prompts stay out.
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

function isDiagnostic(data) {
  return clean(data.route).toLowerCase() === "diagnostic";
}

function daysLabel(n) {
  var days = Number(n);
  if (!isFinite(days) || days <= 0) return "";
  if (days === 1) return "1 working day";
  return days + " working days";
}

function benchOf(data) {
  if (data.benchDays === 0 || data.benchDays) {
    var n = Number(data.benchDays);
    if (isFinite(n) && n > 0) return n;
  }
  if (isDiagnostic(data)) return 1;
  var device = clean(data.deviceType || data.device).toLowerCase();
  if (device.indexOf("iphone") !== -1) return 1;
  if (device.indexOf("watch") !== -1) return 3;
  return 2;
}

function isMailin(data) {
  var kind = clean(data.serviceKind).toLowerCase();
  if (kind === "mailin" || kind === "mail-in") return true;
  if (kind === "courier") return false;
  var name = clean(data.serviceName).toLowerCase();
  return name.indexOf("mail") !== -1 || name.indexOf("post") !== -1;
}

function emailJourney(data) {
  var diagnostic = isDiagnostic(data);
  var bench = benchOf(data);
  var repair = daysLabel(bench);
  if (isMailin(data)) {
    if (diagnostic) {
      return {
        steps: [
          { title: "We send packaging", meta: "Same working day" },
          { title: "You receive the pack", meta: "The following working day" },
          { title: "We diagnose & email your quote", meta: "1 working day after it arrives" },
          { title: "You decide next", meta: "Device stays with us until you approve" }
        ],
        etaLabel: "Typical time to your quote",
        etaValue: "3 working days",
        etaNote: "From when we send the pack"
      };
    }
    return {
      steps: [
        { title: "We send packaging", meta: "Same working day" },
        { title: "You receive the pack", meta: "The following working day" },
        { title: "We repair", meta: repair },
        { title: "We return it", meta: "Typically " + daysLabel(bench + 3) }
      ],
      etaLabel: "Typical turnaround",
      etaValue: daysLabel(bench + 3),
      etaNote: "Often sooner"
    };
  }
  if (diagnostic) {
    return {
      steps: [
        { title: "We collect", meta: "From your door" },
        { title: "We diagnose & email your quote", meta: "1 working day after collection" },
        { title: "You decide next", meta: "Device stays with us until you approve" }
      ],
      etaLabel: "Typical time to your quote",
      etaValue: "1 working day",
      etaNote: "From collection"
    };
  }
  return {
    steps: [
      { title: "We collect", meta: "From your door" },
      { title: "We repair", meta: repair },
      { title: "We return it", meta: repair + " from collection" }
    ],
    etaLabel: "Typical turnaround",
    etaValue: repair,
    etaNote: "From collection · often sooner"
  };
}

function warrantyTitle(data) {
  var raw = clean(data.warranty);
  if (!raw) return "2-yr warranty";
  if (/2[-\s]?year/i.test(raw) || /2[-\s]?yr/i.test(raw)) return "2-yr warranty";
  return raw;
}

function trustOf(data) {
  var list = parseList(data.trust).map(function (cell) {
    if (!cell || typeof cell === "string") return null;
    return { title: clean(cell.title), sub: clean(cell.sub), kind: clean(cell.kind) };
  }).filter(function (cell) { return cell && cell.title; });
  if (list.length) return list;
  var parts = clean(data.parts);
  var warranty = clean(data.warranty);
  if (!parts && !warranty) return [];
  var diagnostic = isDiagnostic(data);
  return [
    { title: "4.9", sub: "719 Google reviews", kind: "reviews" },
    { title: parts || "Original parts", sub: "Calibrated in-house" },
    {
      title: diagnostic ? "Quote in 1 working day" : daysLabel(benchOf(data)),
      sub: diagnostic ? "Diagnosis emailed to you" : "Typical repair time"
    },
    { title: warrantyTitle(data), sub: "Double the standard" }
  ];
}

function badgeTone(data, badge) {
  var tone = clean(data.badgeTone).toLowerCase();
  if (tone === "amber" || tone === "green" || tone === "blue") return tone;
  var text = badge.toLowerCase();
  if (text.indexOf("take a look") !== -1 || text.indexOf("can't help") !== -1) return "amber";
  if (text.indexOf("chat") !== -1) return "blue";
  return "green";
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
  var heading = clean(data.repairTitle);
  var model = clean(data.deviceModel);
  var showModel = !!(model && heading.indexOf(model) === -1);
  var estimates = estimatesOf(data);
  var journey = emailJourney(data);
  var trust = trustOf(data);
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
    badgeHtml(badge, badgeTone(data, badge)),
    heading ? "<h2 style=\"margin:12px 0 0 0;font-size:20px;line-height:1.25;letter-spacing:-0.4px;font-weight:600;color:#171717;\">" + esc(heading) + "</h2>" : "",
    showModel ? "<p style=\"margin:8px 0 0 0;font-size:15px;line-height:1.4;color:#4d4d4d;\">" + esc(model) + "</p>" : "",
    clean(data.urgent) ? "<p style=\"margin:14px 0 0 0;padding:10px 12px;background:#fff8ea;border-radius:8px;font-size:14px;line-height:1.45;color:#171717;\">" + esc(data.urgent) + "</p>" : "",
    "</td></tr>",
    estimatesHtml(estimates),
    factHtml("Postcode", clean(data.postcode)),
    serviceHtml(clean(data.serviceName), serviceAmount(data)),
    factHtml("Colour", clean(data.deviceColor)),
    factHtml("Turnaround", expressLine(data)),
    journeyHtml(journey),
    trustHtml(trust, priceLabel, total),
    !trust.length ? priceHtml(priceLabel, total) : "",
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
  if (!badge) return "";
  var style = "background:#e6f6ec;color:#1a6b34;";
  if (tone === "amber") style = "background:#fff8ea;color:#8c5a00;";
  if (tone === "blue") style = "background:#f0f7ff;color:#0070f3;";
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
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f7f7f7;border-radius:12px;border:1.5px solid #171717;\">" +
    "<tr>" +
    "<td valign=\"middle\" style=\"padding:14px 16px;font-size:15px;font-weight:600;line-height:1.3;color:#171717;\">" + esc(name) + "</td>" +
    (amount ? "<td align=\"right\" valign=\"middle\" style=\"padding:14px 16px;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:600;color:#171717;white-space:nowrap;\">" + esc(amount) + "</td>" : "") +
    "</tr></table></td></tr>";
}

function journeyHtml(model) {
  var steps = (model && model.steps) || [];
  if (!steps.length && !(model && (model.etaLabel || model.etaValue))) return "";
  var stepCells = steps.map(function (step, i) {
    return "<td valign=\"top\" align=\"center\" width=\"" + Math.floor(100 / steps.length) + "%\" style=\"padding:0 4px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      "<div style=\"width:24px;height:24px;line-height:24px;border-radius:50%;background:#171717;color:#ffffff;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:11px;font-weight:600;text-align:center;margin:0 auto 8px auto;\">" + (i + 1) + "</div>" +
      "<div style=\"font-size:13px;font-weight:600;line-height:1.25;color:#171717;\">" + esc(step.title) + "</div>" +
      (step.meta ? "<div style=\"margin-top:3px;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.3;color:#525252;\">" + esc(step.meta) + "</div>" : "") +
      "</td>";
  }).join("");
  var eta = "";
  if (model && (model.etaLabel || model.etaValue || model.etaNote)) {
    eta = "<div style=\"margin-top:14px;padding:12px 14px;background:#ffffff;border-radius:8px;border:1px solid rgba(0,0,0,0.08);text-align:center;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      (model.etaLabel ? "<div style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#525252;\">" + esc(model.etaLabel) + "</div>" : "") +
      (model.etaValue ? "<div style=\"margin-top:6px;font-size:20px;font-weight:700;letter-spacing:-0.4px;color:#171717;\">" + esc(model.etaValue) + "</div>" : "") +
      (model.etaNote ? "<div style=\"margin-top:4px;font-size:12px;line-height:1.3;color:#6b6b6b;\">" + esc(model.etaNote) + "</div>" : "") +
      "</div>";
  }
  return "<tr><td style=\"padding:16px 28px 0 28px;\">" +
    "<div style=\"padding:18px 12px 16px 12px;background:#fafafa;border-radius:12px;border:1px solid rgba(0,0,0,0.08);\">" +
    (steps.length ? "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr>" + stepCells + "</tr></table>" : "") +
    eta +
    "</div></td></tr>";
}

function trustInner(cell) {
  if (!cell) return "&nbsp;";
  var stars = cell.kind === "reviews"
    ? "<div style=\"color:#e6b800;font-size:11px;letter-spacing:1px;line-height:1;\">&#9733;&#9733;&#9733;&#9733;&#9733;</div>"
    : "";
  var titleStyle = cell.kind === "reviews"
    ? "font-size:28px;font-weight:700;letter-spacing:-1px;line-height:1;color:#171717;"
    : "font-size:13px;font-weight:600;line-height:1.25;color:#171717;";
  return "<div style=\"" + titleStyle + "\">" + esc(cell.title) + "</div>" +
    stars +
    (cell.sub ? "<div style=\"margin-top:3px;font-size:12px;line-height:1.3;color:#808080;\">" + esc(cell.sub) + "</div>" : "");
}

function trustColumn(top, bottom) {
  var bottomRule = bottom ? "border-bottom:1px solid #e6e6e6;" : "";
  var lower = bottom
    ? "<tr><td valign=\"middle\" style=\"padding:14px 12px;font-family:Geist,Arial,Helvetica,sans-serif;\">" + trustInner(bottom) + "</td></tr>"
    : "";
  return "<td width=\"33%\" valign=\"top\" style=\"width:33.33%;border-right:1px solid #e6e6e6;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\">" +
    "<tr><td valign=\"middle\" style=\"padding:14px 12px;" + bottomRule + "font-family:Geist,Arial,Helvetica,sans-serif;\">" + trustInner(top) + "</td></tr>" +
    lower +
    "</table></td>";
}

function trustHtml(cells, priceLabel, total) {
  if (!cells.length && !total) return "";
  if (!cells.length) return "";
  var columns = "";
  var pairCount = Math.ceil(cells.length / 2);
  for (var col = 0; col < pairCount; col++) {
    columns += trustColumn(cells[col] || null, cells[col + pairCount] || null);
  }
  var price = total
    ? "<td width=\"33%\" valign=\"middle\" align=\"center\" style=\"width:33.33%;background:#f5f5f5;padding:16px 12px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      (priceLabel ? "<div style=\"font-size:12px;font-weight:500;color:#808080;\">" + esc(priceLabel) + "</div>" : "") +
      "<div style=\"margin-top:4px;font-size:36px;font-weight:700;letter-spacing:-1.2px;line-height:1;color:#171717;\">" + esc(total) + "</div>" +
      "</td>"
    : "";
  return "<tr><td style=\"padding:16px 28px 0 28px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;table-layout:fixed;border:1px solid #e6e6e6;border-radius:12px;border-collapse:separate;border-spacing:0;\">" +
    "<tr>" + columns + price + "</tr></table></td></tr>";
}

function priceHtml(label, total) {
  if (!total) return "";
  return "<tr><td style=\"padding:20px 28px 0 28px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<div style=\"padding:16px 18px;background:#f5f5f5;border-radius:12px;\">" +
    (label ? "<div style=\"font-size:12px;font-weight:500;color:#666666;\">" + esc(label) + "</div>" : "") +
    "<div style=\"margin-top:4px;font-size:36px;font-weight:700;letter-spacing:-1.2px;line-height:1;color:#171717;\">" + esc(total) + "</div>" +
    "</div></td></tr>";
}

function ctaHtml(url, label) {
  return "<tr><td style=\"padding:20px 28px 12px 28px;\">" +
    "<a href=\"" + esc(url) + "\" style=\"display:block;background:#171717;color:#ffffff;text-decoration:none;text-align:center;font-family:Geist,Arial,Helvetica,sans-serif;font-size:16px;font-weight:500;line-height:1;padding:16px 28px;border-radius:10px;\">" + esc(label) + " &#8594;</a>" +
    "</td></tr>";
}

module.exports = {
  renderQuoteEmail: renderQuoteEmail,
  emailJourney: emailJourney,
  gbp: gbp
};
