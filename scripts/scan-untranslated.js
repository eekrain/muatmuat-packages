#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to scan for pages/components/containers that have not implemented useTranslation
 * This script identifies files that contain translatable strings but lack translation implementation
 */
class UntranslatedScanner {
  constructor() {
    this.projectRoot = path.join(__dirname, "..");
    this.scanPaths = [
      path.join(this.projectRoot, "src", "app"), // Next.js pages
      path.join(this.projectRoot, "src", "components"), // Components
      path.join(this.projectRoot, "src", "container"), // Containers
    ];

    // Patterns to identify translatable content
    this.translatablePatterns = [
      // Indonesian text in JSX
      />\s*[A-Z][a-zA-Z\s]{2,}\s*</g,
      // Common Indonesian words/phrases
      /['"`][^'"`]*(?:dengan|untuk|dari|yang|ini|adalah|akan|dapat|sudah|belum|tidak|ya|batal|simpan|ubah|hapus|pilih|cari|lihat|detail|informasi|data|nama|alamat|nomor|email|password|masuk|keluar|daftar|login|logout)[^'"`]*['"`]/gi,
      // Button/form labels
      /(?:placeholder|label|title|alt)[\s]*=[\s]*['"`][^'"`]{3,}['"`]/g,
      // String literals with Indonesian content
      /['"`][^'"`]*(?:Masukkan|Pilih|Simpan|Hapus|Ubah|Cari|Detail|Info|Nama|Alamat|Email)[^'"`]*['"`]/gi,
      // Toast messages and alerts
      /(?:toast|alert|message)[\s\w.]*\(['"`][^'"`]{5,}['"`]\)/gi,
      // HTML content in JSX props
      /(?:render|content)[\s]*=[\s]*['"`]<[^'"`]+>.*<\/[^'"`]+>['"`]/g,
    ];

    this.useTranslationPatterns = [
      // Import statement
      /import\s*{\s*useTranslation\s*}\s*from\s*['"`]@\/hooks\/use-translation['"`]/,
      // Hook usage
      /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/,
      // Alternative destructuring patterns
      /const\s*{\s*t\s*,\s*[^}]*\s*}\s*=\s*useTranslation\(\)/,
      /const\s*{\s*[^}]*\s*,\s*t\s*}\s*=\s*useTranslation\(\)/,
    ];

    this.tCallPatterns = [
      // t() function calls with the expected 3-parameter format
      /t\s*\(\s*['"`][^'"`]+['"`]\s*,\s*\{[^}]*\}\s*,\s*['"`][^'"`]+['"`]\s*\)/g,
      // Simpler t() calls
      /t\s*\(\s*['"`][^'"`]+['"`][^)]*\)/g,
    ];

    this.results = {
      untranslated: [],
      partiallyTranslated: [],
      fullyTranslated: [],
      noTranslatableContent: [],
      errors: [],
    };
  }

  /**
   * Main scanning method
   */
  scan() {
    console.log(
      "🔍 Scanning for files without useTranslation implementation...\n"
    );

    this.scanPaths.forEach((scanPath) => {
      if (fs.existsSync(scanPath)) {
        this.scanDirectory(scanPath);
      }
    });

    this.generateReport();
  }

  /**
   * Recursively scan directory for React files
   */
  scanDirectory(dirPath) {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      entries.forEach((entry) => {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Skip node_modules, .next, and other build directories
          // Also skip API routes since they don't contain UI components
          if (
            !entry.name.startsWith(".") &&
            entry.name !== "node_modules" &&
            entry.name !== "dist" &&
            entry.name !== "build" &&
            !(entry.name === "api" && dirPath.includes("src/app"))
          ) {
            this.scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          // Check React files
          if (this.isReactFile(entry.name)) {
            this.analyzeFile(fullPath);
          }
        }
      });
    } catch (error) {
      this.results.errors.push({
        path: dirPath,
        error: error.message,
      });
    }
  }

  /**
   * Check if file is a React component file
   */
  isReactFile(filename) {
    return (
      /\.(jsx|tsx|js|ts)$/.test(filename) &&
      !filename.endsWith(".test.js") &&
      !filename.endsWith(".test.jsx") &&
      !filename.endsWith(".test.ts") &&
      !filename.endsWith(".test.tsx") &&
      !filename.endsWith(".d.ts")
    );
  }

  /**
   * Analyze individual file for translation implementation
   */
  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(this.projectRoot, filePath);

      // Skip non-React files (no JSX/TSX content)
      if (!this.containsReactContent(content)) {
        return;
      }

      const analysis = {
        path: relativePath,
        hasTranslatableContent: this.hasTranslatableContent(content),
        hasUseTranslationImport: this.hasUseTranslationImport(content),
        hasUseTranslationHook: this.hasUseTranslationHook(content),
        hasTCalls: this.hasTCalls(content),
        translatableMatches: this.findTranslatableContent(content),
        tCallCount: this.countTCalls(content),
        fileSize: content.length,
        componentName: this.extractComponentName(content, filePath),
      };

      this.categorizeFile(analysis);
    } catch (error) {
      this.results.errors.push({
        path: path.relative(this.projectRoot, filePath),
        error: error.message,
      });
    }
  }

  /**
   * Check if file contains React/JSX content
   */
  containsReactContent(content) {
    return /(?:import\s+React|from\s*['"`]react['"`]|export\s+(?:default\s+)?(?:function|const)|<[A-Z][\w]*|<\/[\w]+>|\breturn\s*\(?\s*<)/.test(
      content
    );
  }

  /**
   * Check if file has translatable content
   */
  hasTranslatableContent(content) {
    return this.translatablePatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if file has useTranslation import
   */
  hasUseTranslationImport(content) {
    return this.useTranslationPatterns[0].test(content);
  }

  /**
   * Check if file has useTranslation hook usage
   */
  hasUseTranslationHook(content) {
    return this.useTranslationPatterns
      .slice(1)
      .some((pattern) => pattern.test(content));
  }

  /**
   * Check if file has t() function calls
   */
  hasTCalls(content) {
    return this.tCallPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Find translatable content matches
   */
  findTranslatableContent(content) {
    const matches = [];
    this.translatablePatterns.forEach((pattern, index) => {
      const patternMatches = Array.from(
        content.matchAll(new RegExp(pattern.source, pattern.flags))
      );
      if (patternMatches.length > 0) {
        matches.push({
          pattern: index,
          count: patternMatches.length,
          examples: patternMatches
            .slice(0, 3)
            .map((match) => match[0].substring(0, 100)),
        });
      }
    });
    return matches;
  }

  /**
   * Count t() function calls
   */
  countTCalls(content) {
    let count = 0;
    this.tCallPatterns.forEach((pattern) => {
      const matches = Array.from(content.matchAll(pattern));
      count += matches.length;
    });
    return count;
  }

  /**
   * Extract component name from file
   */
  extractComponentName(content, filePath) {
    // Try to find component name from export statements
    const exportMatch = content.match(
      /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/
    );
    if (exportMatch) {
      return exportMatch[1];
    }

    // Fallback to filename
    const filename = path.basename(filePath, path.extname(filePath));
    return filename.charAt(0).toUpperCase() + filename.slice(1);
  }

  /**
   * Categorize file based on translation implementation status
   */
  categorizeFile(analysis) {
    if (!analysis.hasTranslatableContent) {
      this.results.noTranslatableContent.push(analysis);
      return;
    }

    if (
      analysis.hasUseTranslationImport &&
      analysis.hasUseTranslationHook &&
      analysis.hasTCalls
    ) {
      this.results.fullyTranslated.push(analysis);
    } else if (
      analysis.hasUseTranslationImport ||
      analysis.hasUseTranslationHook ||
      analysis.hasTCalls
    ) {
      this.results.partiallyTranslated.push(analysis);
    } else {
      this.results.untranslated.push(analysis);
    }
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const total =
      this.results.untranslated.length +
      this.results.partiallyTranslated.length +
      this.results.fullyTranslated.length;

    console.log("📊 SCAN RESULTS SUMMARY");
    console.log("=======================");
    console.log(
      `Total React files analyzed: ${total + this.results.noTranslatableContent.length}`
    );
    console.log(`Files with translatable content: ${total}`);
    console.log(
      `Files without translatable content: ${this.results.noTranslatableContent.length}`
    );
    console.log("");

    if (total > 0) {
      const percentUntranslated = Math.round(
        (this.results.untranslated.length / total) * 100
      );
      const percentPartial = Math.round(
        (this.results.partiallyTranslated.length / total) * 100
      );
      const percentComplete = Math.round(
        (this.results.fullyTranslated.length / total) * 100
      );

      console.log("📈 TRANSLATION STATUS:");
      console.log(
        `🔴 Not translated: ${this.results.untranslated.length} files (${percentUntranslated}%)`
      );
      console.log(
        `🟡 Partially translated: ${this.results.partiallyTranslated.length} files (${percentPartial}%)`
      );
      console.log(
        `🟢 Fully translated: ${this.results.fullyTranslated.length} files (${percentComplete}%)`
      );
      console.log("");
    }

    // Detailed reports
    this.printDetailedResults();

    // Save results to JSON file
    this.saveResultsToFile();

    if (this.results.errors.length > 0) {
      console.log("⚠️  ERRORS:");
      this.results.errors.forEach((error) => {
        console.log(`   ${error.path}: ${error.error}`);
      });
    }
  }

  /**
   * Print detailed results for each category
   */
  printDetailedResults() {
    // Untranslated files (highest priority)
    if (this.results.untranslated.length > 0) {
      console.log("🔴 FILES REQUIRING USETRANSLATION IMPLEMENTATION:");
      console.log("================================================");
      this.results.untranslated.forEach((file, index) => {
        console.log(`${index + 1}. ${file.path}`);
        console.log(`   Component: ${file.componentName}`);
        console.log(
          `   Translatable content patterns found: ${file.translatableMatches.length}`
        );
        if (file.translatableMatches.length > 0) {
          file.translatableMatches.forEach((match) => {
            console.log(
              `   - Pattern ${match.pattern}: ${match.count} matches`
            );
          });
        }
        console.log("");
      });
    }

    // Partially translated files
    if (this.results.partiallyTranslated.length > 0) {
      console.log("🟡 PARTIALLY TRANSLATED FILES:");
      console.log("===============================");
      this.results.partiallyTranslated.forEach((file, index) => {
        console.log(`${index + 1}. ${file.path}`);
        console.log(`   Component: ${file.componentName}`);
        console.log(
          `   Has import: ${file.hasUseTranslationImport ? "✅" : "❌"}`
        );
        console.log(`   Has hook: ${file.hasUseTranslationHook ? "✅" : "❌"}`);
        console.log(
          `   Has t() calls: ${file.hasTCalls ? "✅" : "❌"} (${file.tCallCount} calls)`
        );
        console.log("");
      });
    }

    // Summary of fully translated files
    if (this.results.fullyTranslated.length > 0) {
      console.log(
        `🟢 FULLY TRANSLATED FILES: ${this.results.fullyTranslated.length} files`
      );
      console.log("Top 10 by t() call count:");
      this.results.fullyTranslated
        .sort((a, b) => b.tCallCount - a.tCallCount)
        .slice(0, 10)
        .forEach((file, index) => {
          console.log(
            `   ${index + 1}. ${file.path} (${file.tCallCount} t() calls)`
          );
        });
      console.log("");
    }
  }

  /**
   * Save detailed results to JSON file
   */
  saveResultsToFile() {
    // Create .translation/scan-results directory
    const scanResultsDir = path.join(
      this.projectRoot,
      ".translation",
      "scan-results"
    );
    if (!fs.existsSync(scanResultsDir)) {
      fs.mkdirSync(scanResultsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const timestampForFile = timestamp
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .split(".")[0];

    // Create simplified results
    const simplifiedResults = {
      timestamp,
      summary: {
        totalFiles:
          this.results.untranslated.length +
          this.results.partiallyTranslated.length +
          this.results.fullyTranslated.length +
          this.results.noTranslatableContent.length,
        untranslated: this.results.untranslated.length,
        partiallyTranslated: this.results.partiallyTranslated.length,
        fullyTranslated: this.results.fullyTranslated.length,
        noTranslatableContent: this.results.noTranslatableContent.length,
        errors: this.results.errors.length,
      },
      untranslated: this.results.untranslated
        .map((file) => ({
          path: file.path,
          component: file.componentName,
          translatableStrings: file.translatableMatches.reduce(
            (sum, match) => sum + match.count,
            0
          ),
          priority: this.calculatePriority(file),
        }))
        .sort((a, b) => b.translatableStrings - a.translatableStrings),

      partiallyTranslated: this.results.partiallyTranslated.map((file) => ({
        path: file.path,
        component: file.componentName,
        hasImport: file.hasUseTranslationImport,
        hasHook: file.hasUseTranslationHook,
        hasTCalls: file.hasTCalls,
        tCallCount: file.tCallCount,
      })),

      topPriority: this.results.untranslated
        .map((file) => ({
          path: file.path,
          component: file.componentName,
          translatableStrings: file.translatableMatches.reduce(
            (sum, match) => sum + match.count,
            0
          ),
        }))
        .sort((a, b) => b.translatableStrings - a.translatableStrings)
        .slice(0, 20),
    };

    // Save simplified results
    const simplifiedFile = path.join(
      scanResultsDir,
      `scan-${timestampForFile}.json`
    );
    fs.writeFileSync(
      simplifiedFile,
      JSON.stringify(simplifiedResults, null, 2)
    );

    // Save latest results (overwrite)
    const latestFile = path.join(scanResultsDir, "latest.json");
    fs.writeFileSync(latestFile, JSON.stringify(simplifiedResults, null, 2));

    console.log(`📄 Simplified results saved to: .translation/scan-results/`);
    console.log(`   - Timestamped: scan-${timestampForFile}.json`);
    console.log(`   - Latest: latest.json`);
  }

  /**
   * Calculate priority score for a file based on translatable content
   */
  calculatePriority(file) {
    const totalStrings = file.translatableMatches.reduce(
      (sum, match) => sum + match.count,
      0
    );

    if (totalStrings > 50) return "high";
    if (totalStrings > 20) return "medium";
    if (totalStrings > 5) return "low";
    return "very-low";
  }

  /**
   * Generate actionable next steps
   */
  generateActionPlan() {
    console.log("\n🎯 RECOMMENDED ACTION PLAN:");
    console.log("===========================");

    if (this.results.untranslated.length > 0) {
      console.log(
        `1. Start with ${this.results.untranslated.length} untranslated files:`
      );
      console.log("   - Add useTranslation import and hook");
      console.log("   - Wrap hardcoded strings with t() calls");
      console.log(
        "   - Use the format: t('ComponentName.key', {}, 'fallback text')"
      );
      console.log("");
    }

    if (this.results.partiallyTranslated.length > 0) {
      console.log(
        `2. Complete ${this.results.partiallyTranslated.length} partially translated files:`
      );
      console.log("   - Review missing imports/hooks");
      console.log("   - Add missing t() calls for remaining strings");
      console.log("");
    }

    console.log("3. Use existing translation tools:");
    console.log("   npm run t scan <file>     - Scan specific file");
    console.log("   npm run t scan-dir <dir>  - Scan entire directory");
    console.log("   npm run t export          - Export keys for translation");
    console.log("   npm run t status          - Check translation status");
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const scanner = new UntranslatedScanner();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: node scan-untranslated.js [options]

Scans pages, components, and containers for missing useTranslation implementation.

Options:
  --help, -h          Show this help message
  --action-plan       Show recommended action plan after scan
  --json-only         Only generate JSON output, minimal console output

Examples:
  node scan-untranslated.js                    # Full scan with console output
  node scan-untranslated.js --action-plan      # Include action plan
  node scan-untranslated.js --json-only        # Minimal output, JSON file only
    `);
    return;
  }

  scanner.scan();

  if (args.includes("--action-plan")) {
    scanner.generateActionPlan();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = UntranslatedScanner;
