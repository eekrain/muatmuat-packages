#!/usr/bin/env node

/**
 * Quick viewer for translation scan results
 * Usage: node scripts/view-scan-results.js [filter]
 */

const fs = require("fs");
const path = require("path");

function viewScanResults(filter = null) {
  const resultsFile = path.join(
    __dirname,
    "..",
    ".translation",
    "scan-results",
    "latest.json"
  );

  if (!fs.existsSync(resultsFile)) {
    console.log(
      "❌ No scan results found. Run `npm run scan:untranslated` first."
    );
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));

  console.log("📊 LATEST TRANSLATION SCAN RESULTS");
  console.log("===================================");
  console.log(`Scanned on: ${new Date(results.timestamp).toLocaleString()}`);
  console.log("");

  // Summary
  console.log("📈 SUMMARY:");
  console.log(`   Total files: ${results.summary.totalFiles}`);
  console.log(`   🔴 Untranslated: ${results.summary.untranslated}`);
  console.log(`   🟡 Partial: ${results.summary.partiallyTranslated}`);
  console.log(`   🟢 Complete: ${results.summary.fullyTranslated}`);
  console.log(`   ⚪ No content: ${results.summary.noTranslatableContent}`);
  console.log("");

  // Filter results if requested
  let untranslated = results.untranslated;
  let partiallyTranslated = results.partiallyTranslated;

  if (filter) {
    untranslated = untranslated.filter(
      (file) =>
        file.path.includes(filter) ||
        file.component.toLowerCase().includes(filter.toLowerCase())
    );
    partiallyTranslated = partiallyTranslated.filter(
      (file) =>
        file.path.includes(filter) ||
        file.component.toLowerCase().includes(filter.toLowerCase())
    );

    if (untranslated.length === 0 && partiallyTranslated.length === 0) {
      console.log(`❌ No files found matching filter: "${filter}"`);
      return;
    }

    console.log(`🔍 FILTERED RESULTS (${filter}):`);
    console.log("");
  }

  // Top Priority Untranslated
  if (untranslated.length > 0) {
    console.log("🔴 TOP PRIORITY UNTRANSLATED FILES:");
    untranslated
      .filter((file) => file.priority === "high" || file.priority === "medium")
      .slice(0, 10)
      .forEach((file, index) => {
        const priority =
          file.priority === "high"
            ? "🔥"
            : file.priority === "medium"
              ? "🟠"
              : "🟡";
        console.log(
          `   ${index + 1}. ${priority} ${file.component} (${file.translatableStrings} strings)`
        );
        console.log(`      📁 ${file.path}`);
      });

    if (untranslated.length > 10) {
      console.log(`   ... and ${untranslated.length - 10} more files`);
    }
    console.log("");
  }

  // Partially Translated
  if (partiallyTranslated.length > 0) {
    console.log("🟡 PARTIALLY TRANSLATED FILES:");
    partiallyTranslated.slice(0, 5).forEach((file, index) => {
      const issues = [];
      if (!file.hasImport) issues.push("❌ missing import");
      if (!file.hasHook) issues.push("❌ missing hook");
      if (!file.hasTCalls) issues.push("❌ no t() calls");

      console.log(`   ${index + 1}. ${file.component}`);
      console.log(`      📁 ${file.path}`);
      console.log(`      🔧 ${issues.join(", ")}`);
    });

    if (partiallyTranslated.length > 5) {
      console.log(`   ... and ${partiallyTranslated.length - 5} more files`);
    }
    console.log("");
  }

  // Next Steps
  console.log("🚀 NEXT STEPS:");
  if (untranslated.length > 0) {
    const topFile = untranslated[0];
    console.log(
      `   1. Start with highest priority: npm run t scan "${topFile.path}"`
    );
  }
  if (partiallyTranslated.length > 0) {
    const partialFile = partiallyTranslated[0];
    console.log(
      `   2. Complete partial translation: npm run t scan "${partialFile.path}"`
    );
  }
  console.log(
    "   3. Export and merge: npm run t export && npm run t merge translations-needed.json"
  );
}

// CLI interface
const filter = process.argv[2];

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Translation Scan Results Viewer

Usage: node scripts/view-scan-results.js [filter]

Examples:
  node scripts/view-scan-results.js                # View all results
  node scripts/view-scan-results.js Form           # Filter by "Form" in path/component
  node scripts/view-scan-results.js components     # Filter by "components" in path
  
Options:
  --help, -h    Show this help message
  `);
} else {
  viewScanResults(filter);
}
