/**
 * Client quote email. One layout for every wizard route.
 *
 * Field map — wizard payload from quote-wizard.liquid postQuoteWizardWebhook
 * (source: quote-wizard-email-quote) into this template:
 *
 *   name            name
 *   deviceType      deviceType          shown with deviceModel
 *   deviceModel     deviceModel
 *   faultArea       faultArea           row omitted when empty
 *   issue           issue               row omitted when empty or same as fault
 *   deviceColor     deviceColor         row omitted when empty
 *   repairTitle     repairTitle         primary price-line label
 *   route           route               "repair" | "diagnostic" (copy + badge)
 *   basePrice       basePrice           number, GBP. Due-now line.
 *   expressName     expressName         row omitted when expressPrice is 0/empty
 *   expressMeta     expressMeta         turnaround chip when set
 *   expressPrice    expressPrice
 *   serviceName     serviceName         always shown (courier, mail-in, walk-in)
 *   servicePrice    servicePrice        0 renders as Free
 *   estimates       estimates           JSON string or array of {label, value}
 *                                       guide block; not added into the total
 *   totalPrice      totalPrice          already formatted ("£403"); else summed
 *   warranty        warranty            repair only. Diagnostic uses a fixed line.
 *   parts           parts
 *   productUrl      productUrl          book button. Fallback: site quote anchor
 *   turnaround      (not sent today)    optional. Else expressMeta, else
 *                                       diagnostic "Quote in 1 working day",
 *                                       else the chip is omitted.
 */

function gbp(amount) {
  var num = Number(amount);
  if (!isFinite(num)) return "";
  var pence = Math.round(num * 100) % 100 !== 0;
  return "£" + num.toLocaleString("en-GB", {
    minimumFractionDigits: pence ? 2 : 0,
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
  var text = String(value == null ? "" : value).trim();
  return text;
}

function parseEstimates(raw) {
  if (!raw) return [];
  var list = raw;
  if (typeof raw === "string") {
    try { list = JSON.parse(raw); } catch (e) { return []; }
  }
  if (!Array.isArray(list)) return [];
  return list
    .map(function (row) {
      return {
        label: clean(row && row.label),
        value: clean(row && row.value)
      };
    })
    .filter(function (row) { return row.label && row.value; });
}

function moneyOrFree(amount) {
  var num = Number(amount);
  if (!isFinite(num) || num === 0) return "Free";
  return gbp(num);
}

function renderQuoteEmail(input) {
  var data = input || {};
  var route = clean(data.route).toLowerCase() === "diagnostic" ? "diagnostic" : "repair";
  var isDiag = route === "diagnostic";
  var name = clean(data.name) || "there";
  var first = name.split(/\s+/)[0];
  var device = [clean(data.deviceType), clean(data.deviceModel)].filter(Boolean).join(" · ");
  var fault = clean(data.faultArea);
  var issue = clean(data.issue);
  var color = clean(data.deviceColor);
  var title = clean(data.repairTitle) || (isDiag ? "Diagnostic" : "Repair");
  var serviceName = clean(data.serviceName) || "Collection";
  var expressPrice = Number(data.expressPrice);
  var hasExpress = isFinite(expressPrice) && expressPrice > 0;
  var estimates = parseEstimates(data.estimates);
  var turnaround = clean(data.turnaround) || clean(data.expressMeta) || (isDiag ? "Quote in 1 working day" : "");
  var parts = clean(data.parts) || "Original specification";
  var warranty = isDiag
    ? "Repair warranty confirmed after you accept the quote"
    : (clean(data.warranty) || "2-year warranty");
  var bookUrl = clean(data.productUrl) || "https://icorrect.co.uk/#get-free-quote";
  var total = clean(data.totalPrice);
  if (!total) {
    var sum = (Number(data.basePrice) || 0) + (hasExpress ? expressPrice : 0) + (Number(data.servicePrice) || 0);
    total = gbp(sum);
  }

  var facts = [];
  if (device) facts.push(["Device", device]);
  if (fault) facts.push(["Fault", fault]);
  if (issue && issue.toLowerCase() !== fault.toLowerCase()) facts.push(["Issue", issue]);
  if (color) facts.push(["Colour", color]);

  var lines = [{
    label: title,
    meta: isDiag ? "Due now" : "",
    amount: gbp(data.basePrice) || "—"
  }];
  if (hasExpress) {
    lines.push({
      label: clean(data.expressName) || "Express",
      meta: clean(data.expressMeta),
      amount: gbp(expressPrice)
    });
  }
  lines.push({
    label: serviceName,
    meta: "",
    amount: moneyOrFree(data.servicePrice)
  });

  var badge = isDiag ? "We need to take a look" : "We can fix this";
  var headline = isDiag ? "Your diagnostic quote" : "Your repair quote";
  var lead = isDiag
    ? "This is the quote you asked us to email. The diagnostic is the amount due now. Anything listed under the price guide is not charged until you accept a repair."
    : "This is the quote you asked us to email. The total is the repair plus the collection option you picked.";
  var cta = isDiag ? "Book this diagnostic" : "Book this repair";
  var guideNote = "Guide only. After the device arrives we diagnose within 1 working day and email the confirmed repair price. The device stays with us until you decide.";

  return [
    "<!doctype html>",
    "<html lang=\"en\">",
    "<head>",
    "<meta charset=\"utf-8\">",
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>" + esc(headline) + "</title>",
    "</head>",
    "<body style=\"margin:0;padding:0;background:#fafafa;\">",
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#fafafa;margin:0;padding:0;\">",
    "<tr><td align=\"center\" style=\"padding:32px 16px;\">",
    "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:600px;max-width:600px;background:#ffffff;border:1px solid #ebebeb;border-radius:12px;\">",
    "<tr><td style=\"padding:32px 32px 8px 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<img src=\"https://intake.icorrect.co.uk/client/logo.png\" width=\"168\" height=\"33\" alt=\"iCorrect\" style=\"display:block;border:0;width:168px;height:auto;\">",
    "</td></tr>",
    "<tr><td style=\"padding:20px 32px 0 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<div style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#666666;\">" + esc(badge) + "</div>",
    "<h1 style=\"margin:12px 0 0 0;font-size:28px;line-height:1.2;letter-spacing:-1px;font-weight:600;color:#171717;\">" + esc(headline) + "</h1>",
    "<p style=\"margin:12px 0 0 0;font-size:16px;line-height:1.5;color:#4d4d4d;\">Hi " + esc(first) + ", " + esc(lead) + "</p>",
    "</td></tr>",
    factsHtml(facts),
    linesHtml(lines),
    estimatesHtml(estimates, guideNote),
    totalHtml(total),
    trustHtml(parts, warranty, turnaround),
    ctaHtml(bookUrl, cta),
    "<tr><td style=\"padding:8px 32px 28px 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<p style=\"margin:0;font-size:13px;line-height:1.5;color:#666666;\">iCorrect · 12 Margaret Street, Audley House, London W1W 8JQ<br>020 7099 8517 · support@icorrect.co.uk</p>",
    "<p style=\"margin:8px 0 0 0;font-size:12px;line-height:1.4;color:#808080;\">You asked for this quote on icorrect.co.uk. Reply to this email if a detail looks wrong.</p>",
    "</td></tr>",
    "</table>",
    "</td></tr>",
    "</table>",
    "</body></html>"
  ].join("");
}

function factsHtml(facts) {
  if (!facts.length) return "";
  var rows = facts.map(function (pair) {
    return "<tr>" +
      "<td style=\"padding:10px 0;border-bottom:1px solid #ebebeb;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#666666;width:88px;vertical-align:top;\">" + esc(pair[0]) + "</td>" +
      "<td style=\"padding:10px 0 10px 12px;border-bottom:1px solid #ebebeb;font-family:Geist,Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;line-height:1.35;color:#171717;\">" + esc(pair[1]) + "</td>" +
      "</tr>";
  }).join("");
  return "<tr><td style=\"padding:24px 32px 0 32px;\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + rows + "</table></td></tr>";
}

function linesHtml(lines) {
  var rows = lines.map(function (line) {
    var meta = line.meta
      ? "<div style=\"margin-top:4px;font-size:13px;font-weight:400;color:#4d4d4d;\">" + esc(line.meta) + "</div>"
      : "";
    return "<tr>" +
      "<td style=\"padding:14px 16px;border:1px solid #ebebeb;border-radius:8px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
      "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr>" +
      "<td style=\"font-size:16px;font-weight:600;color:#171717;line-height:1.3;\">" + esc(line.label) + meta + "</td>" +
      "<td align=\"right\" style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:15px;font-weight:500;color:#171717;white-space:nowrap;padding-left:16px;vertical-align:top;\">" + esc(line.amount) + "</td>" +
      "</tr></table></td></tr>" +
      "<tr><td style=\"height:8px;font-size:0;line-height:0;\">&nbsp;</td></tr>";
  }).join("");
  return "<tr><td style=\"padding:24px 32px 0 32px;\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + rows + "</table></td></tr>";
}

function estimatesHtml(estimates, note) {
  if (!estimates.length) return "";
  var rows = estimates.map(function (row) {
    return "<tr>" +
      "<td style=\"padding:8px 0;border-bottom:1px solid #ebebeb;font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;color:#4d4d4d;\">" + esc(row.label) + "</td>" +
      "<td align=\"right\" style=\"padding:8px 0;border-bottom:1px solid #ebebeb;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:500;color:#171717;white-space:nowrap;\">" + esc(row.value) + "</td>" +
      "</tr>";
  }).join("");
  return "<tr><td style=\"padding:8px 32px 0 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">" +
    "<div style=\"font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#666666;margin-bottom:8px;\">Price guide</div>" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + rows + "</table>" +
    "<p style=\"margin:12px 0 0 0;font-size:14px;line-height:1.45;color:#4d4d4d;\">" + esc(note) + "</p>" +
    "</td></tr>";
}

function totalHtml(total) {
  return "<tr><td style=\"padding:16px 32px 0 32px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#171717;border-radius:8px;\">" +
    "<tr>" +
    "<td style=\"padding:16px 18px;font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#ffffff;\">Total</td>" +
    "<td align=\"right\" style=\"padding:16px 18px;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:20px;font-weight:500;color:#ffffff;\">" + esc(total) + "</td>" +
    "</tr></table></td></tr>";
}

function trustHtml(parts, warranty, turnaround) {
  var chips = [
    ["Parts", parts],
    ["Warranty", warranty]
  ];
  if (turnaround) chips.push(["Turnaround", turnaround]);
  var rows = chips.map(function (pair) {
    return "<tr>" +
      "<td style=\"padding:10px 12px;background:#fafafa;border-bottom:1px solid #ffffff;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#666666;width:110px;vertical-align:top;\">" + esc(pair[0]) + "</td>" +
      "<td style=\"padding:10px 12px;background:#fafafa;border-bottom:1px solid #ffffff;font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;font-weight:500;line-height:1.35;color:#171717;\">" + esc(pair[1]) + "</td>" +
      "</tr>";
  }).join("");
  return "<tr><td style=\"padding:16px 32px 0 32px;\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-radius:8px;\">" + rows + "</table></td></tr>";
}

function ctaHtml(url, label) {
  return "<tr><td style=\"padding:24px 32px 16px 32px;\">" +
    "<a href=\"" + esc(url) + "\" style=\"display:inline-block;background:#171717;color:#ffffff;text-decoration:none;font-family:Geist,Arial,Helvetica,sans-serif;font-size:16px;font-weight:500;line-height:1;padding:16px 28px;border-radius:10px;\">" + esc(label) + "</a>" +
    "</td></tr>";
}

module.exports = {
  renderQuoteEmail: renderQuoteEmail,
  gbp: gbp
};
