const fs = require("fs");

const file =
  "d:/Builder/Builder(Fixed)/frontend/src/features/resume-builder/constants/registry.generated.js";
let content = fs.readFileSync(file, "utf8");

const templatesToHide = [
  "Art Deco",
  "Neon Cyber",
  "Tech Founder",
  "Organic Flow",
  "Split Horizon",
  "The Senator",
  "Elegant Duo",
  "Corporate Classic",
  "Soft UI",
  "Modern Split",
  "Exec Brief",
];

templatesToHide.forEach((templateName) => {
  // Regex explanation:
  // Match an open brace '{'
  // followed by lazily any characters until it finds `"name": "TEMPLATE_NAME"` (accounting for spaces/newlines)
  // and then lazily matching until the closing brace '}' followed optionally by a comma.
  // E.g. {\s*"id": "[^"]*",\s*"name": "Art Deco"[\s\S]*?\},?
  const regex = new RegExp(
    `\\{\\s*(?:[^{}]*)*"name": "${templateName}"[\\s\\S]*?\\},?`,
    "g",
  );
  content = content.replace(regex, "");
});

// Clean up any double commas or trailing commas in the array
content = content.replace(/,\s*,/g, ",");
content = content.replace(/,\s*\]/, "\n]");

fs.writeFileSync(file, content, "utf8");
console.log("Successfully removed templates from registry.");
