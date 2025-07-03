const fs = require("fs-extra");
const path = require("path");
const { minify } = require("html-minifier-terser");
const CleanCSS = require("clean-css");

const srcDir = path.resolve(__dirname, "../public");
const distDir = path.resolve(__dirname, "dist");

async function build() {
  // 1. dist/ leeren und neu erstellen
  await fs.remove(distDir);
  await fs.mkdir(distDir);

  // 2. HTML-Dateien minimieren
  const htmlFiles = [
    "index.html",
    "about.html",
    "contact.html",
    "projekte.html",
    "skills.html",
  ];

  for (const file of htmlFiles) {
    const filePath = path.join(srcDir, file);
    const html = await fs.readFile(filePath, "utf-8");
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
    await fs.outputFile(path.join(distDir, file), minified);
  }

  // 3. CSS minimieren
  const cssInput = await fs.readFile(
    path.join(srcDir, "css/styles.css"),
    "utf-8"
  );
  const cssOutput = new CleanCSS({}).minify(cssInput).styles;
  await fs.outputFile(path.join(distDir, "css/styles.css"), cssOutput);

  // 4. JS kopieren (optional: minifizieren, hier nur kopieren)
  await fs.copy(path.join(srcDir, "js"), path.join(distDir, "js"));

  // 5. Bilder kopieren
  await fs.copy(path.join(srcDir, "img"), path.join(distDir, "img"));

  console.log("✅ Build abgeschlossen.");
}

build().catch((err) => {
  console.error("Build fehlgeschlagen:", err);
  process.exit(1);
});
