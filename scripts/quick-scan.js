#!/usr/bin/env node

/**
 * Quick scan helper for specific directories or files
 * Usage: node scripts/quick-scan.js [directory]
 */

const path = require("path");
const UntranslatedScanner = require("./scan-untranslated.js");

class QuickScanner extends UntranslatedScanner {
  constructor(targetPath = null) {
    super();

    if (targetPath) {
      const resolvedPath = path.resolve(targetPath);
      this.scanPaths = [resolvedPath];
    }
  }

  // Override to show only priority results for quick scanning
  printDetailedResults() {
    // Only show untranslated files for quick scan
    if (this.results.untranslated.length > 0) {
      console.log("🔴 FILES NEEDING USETRANSLATION (Priority List):");
      console.log("===============================================");

      // Sort by number of translatable patterns (most content first)
      const sorted = this.results.untranslated.sort((a, b) => {
        const aTotal = a.translatableMatches.reduce(
          (sum, match) => sum + match.count,
          0
        );
        const bTotal = b.translatableMatches.reduce(
          (sum, match) => sum + match.count,
          0
        );
        return bTotal - aTotal;
      });

      sorted.forEach((file, index) => {
        const totalMatches = file.translatableMatches.reduce(
          (sum, match) => sum + match.count,
          0
        );

        console.log(`${index + 1}. ${file.path}`);
        console.log(`   📝 ${totalMatches} translatable strings found`);
        console.log(`   🧩 Component: ${file.componentName}`);

        // Show example of translatable content
        if (
          file.translatableMatches.length > 0 &&
          file.translatableMatches[0].examples.length > 0
        ) {
          const example = file.translatableMatches[0].examples[0]
            .replace(/\n/g, " ")
            .substring(0, 60);
          console.log(`   📄 Example: ${example}...`);
        }
        console.log("");
      });

      // Show action commands
      console.log("🚀 NEXT STEPS:");
      console.log("To translate these files, use:");
      sorted.slice(0, 5).forEach((file, index) => {
        console.log(`${index + 1}. npm run t scan "${file.path}"`);
      });
    } else {
      console.log(
        "🎉 All files in this directory have useTranslation implemented!"
      );
    }

    // Show partially translated files briefly
    if (this.results.partiallyTranslated.length > 0) {
      console.log(
        `\n🟡 ${this.results.partiallyTranslated.length} files partially translated - may need completion`
      );
      this.results.partiallyTranslated.slice(0, 3).forEach((file) => {
        const issues = [];
        if (!file.hasUseTranslationImport) issues.push("missing import");
        if (!file.hasUseTranslationHook) issues.push("missing hook");
        if (!file.hasTCalls) issues.push("no t() calls");

        console.log(`   - ${file.path} (${issues.join(", ")})`);
      });
    }
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Quick Translation Scanner

Usage:
  node scripts/quick-scan.js [directory]          # Scan specific directory
  node scripts/quick-scan.js                      # Scan all standard directories
  node scripts/quick-scan.js src/app              # Scan pages only
  node scripts/quick-scan.js src/components       # Scan components only
  node scripts/quick-scan.js src/container        # Scan containers only

Examples:
  node scripts/quick-scan.js src/app/transporter  # Scan transporter pages
  node scripts/quick-scan.js src/components/Form  # Scan form components
    `);
    return;
  }

  const targetDir = args[0];
  const scanner = new QuickScanner(targetDir);

  if (targetDir) {
    console.log(`🎯 Quick scanning: ${targetDir}\n`);
  }

  scanner.scan();
}

if (require.main === module) {
  main();
}
