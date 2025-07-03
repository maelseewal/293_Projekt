const fs = require("fs-extra");
const { execSync } = require("child_process");
const path = require("path");

const srcDir = "../public";
const distDir = "dist";

// 1. dist/ leeren und neu erstellen
fs.removeSync(distDir);
fs.mkdirSync(distDir);

// 2. HTML-Dateien minimieren
const htmlFiles = [
  "index.html",
  "about.html",
  "contact.html",
  "projekte.html",
  "skills.html",
];
htmlFiles.forEach((file) => {
  execSync(
    `npx html-minifier-terser ${srcDir}/${file} -o ${distDir}/${file} --collapse-whitespace --remove-comments --minify-css true --minify-js true`
  );
});

// 3. CSS minimieren
fs.mkdirSync(`${distDir}/css`);
execSync(`npx cleancss -o ${distDir}/css/styles.css ${srcDir}/css/styles.css`);

// 4. JS kopieren (optional kannst du auch minifizieren)
fs.mkdirSync(`${distDir}/js`);
fs.copyFileSync(`${srcDir}/js/script.js`, `${distDir}/js/script.js`);

// 5. Bilder kopieren
fs.mkdirSync(`${distDir}/img`);
fs.copySync(`${srcDir}/img`, `${distDir}/img`);

console.log("✅ Build abgeschlossen.");
