/**
 * Client quote email. Layout only. Every visible value comes from the
 * quote-wizard payload (source quote-wizard-email-quote). Empty values are
 * left out. No extra sentences.
 *
 *   name            greeting
 *   deviceModel     Device row. deviceType is not shown.
 *   faultArea       Fault
 *   issue           Issue
 *   deviceColor     Colour
 *   repairTitle     heading, and the repair price line when there are no estimate rows
 *   basePrice       that price line
 *   expressName     express line, only when a speed option was selected
 *   expressMeta     second line on that row (wizard card text)
 *   expressPrice    express amount
 *   serviceName     service line
 *   servicePrice    service amount, including £0
 *   estimates       wizard rows, label and value unchanged
 *   totalPrice      Total
 *   warranty        Warranty
 *   parts           Parts
 *   productUrl      Proceed to checkout
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

function renderQuoteEmail(input) {
  var data = input || {};
  var name = clean(data.name);
  var device = clean(data.deviceModel);
  var fault = clean(data.faultArea);
  var issue = clean(data.issue);
  var color = clean(data.deviceColor);
  var title = clean(data.repairTitle);
  var serviceName = clean(data.serviceName);
  var expressName = clean(data.expressName);
  var expressMeta = clean(data.expressMeta);
  var expressPrice = Number(data.expressPrice);
  var hasExpress = !!expressName || (isFinite(expressPrice) && expressPrice > 0);
  var estimates = parseEstimates(data.estimates);
  var parts = clean(data.parts);
  var warranty = clean(data.warranty);
  var bookUrl = clean(data.productUrl);
  var total = clean(data.totalPrice);

  var facts = [];
  if (device) facts.push(["Device", device]);
  if (fault) facts.push(["Fault", fault]);
  if (issue) facts.push(["Issue", issue]);
  if (color) facts.push(["Colour", color]);
  if (warranty) facts.push(["Warranty", warranty]);
  if (parts) facts.push(["Parts", parts]);

  var lines = [];
  if (estimates.length) {
    estimates.forEach(function (row) {
      lines.push({ label: row.label, meta: "", amount: row.value });
    });
  } else if (title) {
    lines.push({ label: title, meta: "", amount: gbp(data.basePrice) });
  }
  if (hasExpress) {
    lines.push({
      label: expressName,
      meta: expressMeta,
      amount: gbp(expressPrice)
    });
  }
  if (serviceName) {
    lines.push({ label: serviceName, meta: "", amount: gbp(data.servicePrice) });
  }

  var greeting = name
    ? "<p style=\"margin:20px 0 0 0;font-size:16px;line-height:1.5;color:#171717;\">Hi " + esc(name) + "</p>"
    : "";
  var heading = title
    ? "<h1 style=\"margin:8px 0 0 0;font-size:28px;line-height:1.2;letter-spacing:-1px;font-weight:600;color:#171717;\">" + esc(title) + "</h1>"
    : "";

  return [
    "<!doctype html>",
    "<html lang=\"en\">",
    "<head>",
    "<meta charset=\"utf-8\">",
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
    "<title>" + esc(title || "Quote") + "</title>",
    "</head>",
    "<body style=\"margin:0;padding:0;background:#fafafa;\">",
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#fafafa;margin:0;padding:0;\">",
    "<tr><td align=\"center\" style=\"padding:32px 16px;\">",
    "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:600px;max-width:600px;background:#ffffff;border:1px solid #ebebeb;border-radius:12px;\">",
    "<tr><td style=\"padding:32px 32px 0 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<img src=\"https://intake.icorrect.co.uk/client/logo.png\" width=\"168\" height=\"33\" alt=\"iCorrect\" style=\"display:block;border:0;width:168px;height:auto;\">",
    greeting,
    heading,
    "</td></tr>",
    factsHtml(facts),
    linesHtml(lines),
    total ? totalHtml(total) : "",
    bookUrl ? ctaHtml(bookUrl, "Proceed to checkout") : "",
    "<tr><td style=\"padding:8px 32px 28px 32px;font-family:Geist,Arial,Helvetica,sans-serif;\">",
    "<p style=\"margin:0;font-size:13px;line-height:1.5;color:#666666;\">iCorrect · 12 Margaret Street, Audley House, London W1W 8JQ<br>020 7099 8517 · support@icorrect.co.uk</p>",
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

function totalHtml(total) {
  return "<tr><td style=\"padding:16px 32px 0 32px;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#171717;border-radius:8px;\">" +
    "<tr>" +
    "<td style=\"padding:16px 18px;font-family:Geist,Arial,Helvetica,sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#ffffff;\">Total</td>" +
    "<td align=\"right\" style=\"padding:16px 18px;font-family:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;font-size:20px;font-weight:500;color:#ffffff;\">" + esc(total) + "</td>" +
    "</tr></table></td></tr>";
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
