#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { renderQuoteEmail } = require("./render-quote-email");

const root = __dirname;
const fixtures = JSON.parse(fs.readFileSync(path.join(root, "fixtures.json"), "utf8"));
const outDir = path.join(root, "preview");
fs.mkdirSync(outDir, { recursive: true });

const font = [
  "<style>",
  "@font-face{font-family:Geist;src:url(https://intake.icorrect.co.uk/client/fonts/Geist-Variable.woff2) format('woff2');font-weight:100 900;font-display:swap}",
  "@font-face{font-family:'Geist Mono';src:url(https://intake.icorrect.co.uk/client/fonts/GeistMono-Variable.woff2) format('woff2');font-weight:100 900;font-display:swap}",
  "html,body{margin:0;background:#fafafa}",
  "</style>"
].join("");

const files = {};
Object.keys(fixtures).forEach(function (key) {
  const html = renderQuoteEmail(fixtures[key]).replace("</head>", font + "</head>");
  const file = path.join(outDir, key + ".html");
  fs.writeFileSync(file, html);
  files[key] = key + ".html";
});

const index = [
  "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Quote email mockups</title>",
  font,
  "<style>body{font-family:Geist,Arial,sans-serif;color:#171717}h1{font-weight:600;letter-spacing:-1px;font-size:28px;margin:0 0 8px}p{color:#4d4d4d}nav a{color:#171717;margin-right:16px}iframe{width:680px;height:1180px;border:0;background:#fafafa;display:block}</style>",
  "</head><body style=\"padding:32px\">",
  "<h1>Quote email</h1>",
  "<p>Same template. Repair with courier and express, diagnostic with a price guide, simple mail-in repair.</p>",
  "<nav><a href=\"repair.html\">Repair</a><a href=\"diagnostic.html\">Diagnostic</a><a href=\"simple.html\">Simple</a></nav>",
  "<h2 style=\"margin-top:32px;font-size:18px\">Repair</h2><iframe src=\"repair.html\" title=\"Repair quote\"></iframe>",
  "<h2 style=\"margin-top:32px;font-size:18px\">Diagnostic</h2><iframe src=\"diagnostic.html\" title=\"Diagnostic quote\"></iframe>",
  "<h2 style=\"margin-top:32px;font-size:18px\">Simple</h2><iframe src=\"simple.html\" title=\"Simple quote\"></iframe>",
  "</body></html>"
].join("");
fs.writeFileSync(path.join(outDir, "index.html"), index);
console.log("wrote", Object.keys(files).join(", "));
