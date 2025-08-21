#!/usr/bin/env node

/**
 * Translation Management Script v3.0 - Minimal AI-First Version
 * Simplified for AI-based translation workflow
 */

const fs = require("fs");
const path = require("path");

class MinimalTranslationManager {
  constructor() {
    this.projectRoot = path.join(__dirname, "..");
    this.jsonFiles = {
      id: path.join(this.projectRoot, "public", "mock-common-id.json"),
      en: path.join(this.projectRoot, "public", "mock-common-en.json"),
      cn: path.join(this.projectRoot, "public", "mock-common-cn.json"),
    };
    this.sessionFile = path.join(this.projectRoot, ".translation-session.json");
    this.exportFile = path.join(this.projectRoot, "translations-needed.json");
    this.loadSession();
  }

  // Session management for tracking new keys
  loadSession() {
    if (fs.existsSync(this.sessionFile)) {
      try {
        this.session = JSON.parse(fs.readFileSync(this.sessionFile, "utf8"));
      } catch {
        this.session = { newKeys: [], timestamp: new Date().toISOString() };
      }
    } else {
      this.session = { newKeys: [], timestamp: new Date().toISOString() };
    }
  }

  saveSession() {
    fs.writeFileSync(this.sessionFile, JSON.stringify(this.session, null, 2));
  }

  clearSession() {
    this.session = { newKeys: [], timestamp: new Date().toISOString() };
    if (fs.existsSync(this.sessionFile)) {
      fs.unlinkSync(this.sessionFile);
    }
  }

  addNewKeysToSession(keys) {
    const newKeys = Object.keys(keys).filter(
      (k) => !this.session.newKeys.includes(k)
    );
    this.session.newKeys.push(...newKeys);
    this.session.timestamp = new Date().toISOString();
    this.saveSession();
  }

  // Load JSON translation files
  loadJsonFiles() {
    const data = {};
    Object.entries(this.jsonFiles).forEach(([lang, filePath]) => {
      if (fs.existsSync(filePath)) {
        data[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        data[lang] = {};
      }
    });
    return data;
  }

  // Save JSON translation files
  saveJsonFiles(data) {
    Object.entries(this.jsonFiles).forEach(([lang, filePath]) => {
      fs.writeFileSync(filePath, JSON.stringify(data[lang], null, 2) + "\n");
    });
  }

  // Scan file for t() calls without modifying code
  scanForTranslations(filePath, options = {}) {
    const targetPath = this.resolvePath(filePath);

    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Path not found: ${targetPath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(targetPath, "utf8");

    // Look for t() calls - supporting various formats
    const patterns = [
      // Standard t('key', {}, 'fallback')
      /t\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\{[^}]*\})?\s*,\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // With template literals t(`key`, {}, `fallback`)
      /t\s*\(\s*`([^`]+)`\s*,\s*(\{[^}]*\})?\s*,\s*`([^`]+)`\s*\)/g,
      // Mixed quotes t("key", {}, 'fallback')
      /t\s*\(\s*["']([^"']+)["']\s*,\s*(\{[^}]*\})?\s*,\s*["']([^"']+)["']\s*\)/g,
    ];

    const foundKeys = new Map();

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const key = match[1];
        const fallbackText = match[3];
        if (key && fallbackText) {
          foundKeys.set(key, fallbackText);
        }
      }
    });

    if (foundKeys.size === 0 && !options.silent) {
      console.log(`⚠️  No t() calls found in ${path.basename(targetPath)}`);
      console.log(
        "\n💡 Make sure you've added t() calls manually first, then run this command."
      );
      return 0;
    }

    if (!options.silent) {
      console.log(
        `\n✅ Found ${foundKeys.size} t() calls in ${path.basename(targetPath)}`
      );
    }

    // Update JSON files
    const jsonData = this.loadJsonFiles();
    let addedCount = 0;

    foundKeys.forEach((fallbackText, key) => {
      if (!jsonData.id[key]) {
        // Convert JavaScript template literal syntax ${variable} to i18n syntax {variable}
        const cleanedFallbackText = fallbackText.replace(
          /\$\{([^}]+)\}/g,
          "{$1}"
        );

        jsonData.id[key] = cleanedFallbackText;
        jsonData.en[key] = ""; // Empty for translation
        jsonData.cn[key] = ""; // Empty for translation
        addedCount++;
      }
    });

    if (addedCount > 0) {
      this.saveJsonFiles(jsonData);

      // Convert Map to object for session
      const keysObject = {};
      foundKeys.forEach((value, key) => {
        keysObject[key] = value;
      });
      this.addNewKeysToSession(keysObject);

      if (!options.silent) {
        console.log(`✅ Added ${addedCount} new keys to JSON files`);
        console.log(`✅ Added ${addedCount} keys to session`);
      }
    } else if (!options.silent) {
      console.log(`ℹ️  All keys already exist in JSON files`);
    }

    return foundKeys.size;
  }

  // Scan multiple files
  scanMultiple(filePaths) {
    console.log(`\n🔍 Scanning ${filePaths.length} files for t() calls...\n`);

    let totalFound = 0;
    filePaths.forEach((filePath) => {
      const found = this.scanForTranslations(filePath, { silent: true });
      totalFound += found;
      console.log(`   ✓ ${path.basename(filePath)} - ${found} t() calls`);
    });

    console.log(`\n✅ Scan complete! Total: ${totalFound} t() calls`);

    if (totalFound > 0) {
      console.log(`\n📋 Next steps:`);
      console.log(`   1. Run 'npm run t export' to export new keys`);
      console.log(`   2. Translate the exported file`);
      console.log(`   3. Run 'npm run t merge' to apply translations\n`);
    }
  }

  // Scan directory recursively
  scanDirectory(dirPath) {
    const targetPath = this.resolvePath(dirPath);

    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
      console.error("❌ Path is not a directory");
      process.exit(1);
    }

    const files = [];
    const scanDir = (dir) => {
      fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (
          stat.isDirectory() &&
          !file.startsWith(".") &&
          file !== "node_modules"
        ) {
          scanDir(fullPath);
        } else if (
          stat.isFile() &&
          (file.endsWith(".jsx") || file.endsWith(".tsx"))
        ) {
          files.push(fullPath);
        }
      });
    };

    scanDir(targetPath);

    if (files.length > 0) {
      const relativePaths = files.map((f) =>
        path.relative(this.projectRoot, f)
      );
      this.scanMultiple(relativePaths);
    } else {
      console.log("⚠️  No JSX/TSX files found in directory");
    }
  }

  // Export new keys for translation
  exportNewKeys() {
    if (this.session.newKeys.length === 0) {
      console.log("⚠️  No new keys to export");
      console.log("\n💡 Steps to add new keys:");
      console.log("   1. AI adds t() calls to your components");
      console.log("   2. Run 'npm run t scan <file>' to detect them");
      console.log("   3. Then run 'npm run t export' again");
      return;
    }

    const idData = JSON.parse(fs.readFileSync(this.jsonFiles.id, "utf8"));
    const enData = JSON.parse(fs.readFileSync(this.jsonFiles.en, "utf8"));
    const cnData = JSON.parse(fs.readFileSync(this.jsonFiles.cn, "utf8"));

    const exportData = {};
    this.session.newKeys.forEach((key) => {
      if (idData[key]) {
        exportData[key] = {
          id: idData[key],
          en: enData[key] || "",
          cn: cnData[key] || "",
        };
      }
    });

    fs.writeFileSync(
      this.exportFile,
      JSON.stringify(exportData, null, 2) + "\n"
    );

    console.log(
      `\n✅ Exported ${this.session.newKeys.length} new keys to: ${path.relative(this.projectRoot, this.exportFile)}`
    );
    console.log("\n📋 Next steps:");
    console.log("   1. Translate the keys in 'translations-needed.json'");
    console.log("   2. Run: npm run t merge translations-needed.json");
  }

  // Merge translated keys back to JSON files
  mergeTranslations(filePath) {
    const importPath = path.join(this.projectRoot, filePath);

    if (!fs.existsSync(importPath)) {
      console.error(`❌ File not found: ${importPath}`);
      process.exit(1);
    }

    const importData = JSON.parse(fs.readFileSync(importPath, "utf8"));
    let mergedCount = 0;

    // Load existing data
    const jsonData = this.loadJsonFiles();

    // Update translations
    Object.entries(importData).forEach(([key, value]) => {
      if (value.en || value.cn) {
        if (value.en) jsonData.en[key] = value.en;
        if (value.cn) jsonData.cn[key] = value.cn;
        // Ensure ID is set
        if (!jsonData.id[key] && value.id) {
          jsonData.id[key] = value.id;
        }
        mergedCount++;
      }
    });

    // Save updated JSON files
    this.saveJsonFiles(jsonData);

    console.log(`\n✅ Merged ${mergedCount} translations successfully`);

    // Clear session after successful merge
    this.clearSession();

    // Auto-cleanup export file
    if (fs.existsSync(this.exportFile)) {
      fs.unlinkSync(this.exportFile);
      console.log("✅ Cleaned up temporary files");
    }
  }

  // Validate translations - check for orphaned or missing
  validateTranslations(targetPath) {
    console.log("\n🔍 Validating translations...\n");

    const jsonData = this.loadJsonFiles();
    const usedKeys = new Set();
    const orphanedCalls = [];

    // Find all t() calls in codebase
    const scanPath = targetPath
      ? this.resolvePath(targetPath)
      : path.join(this.projectRoot, "src");

    const scanFiles = (dir) => {
      if (!fs.existsSync(dir)) return;

      const stat = fs.statSync(dir);
      if (stat.isFile()) {
        if (dir.endsWith(".jsx") || dir.endsWith(".tsx")) {
          this.validateFile(dir, jsonData.id, usedKeys, orphanedCalls);
        }
      } else if (
        stat.isDirectory() &&
        !path.basename(dir).startsWith(".") &&
        path.basename(dir) !== "node_modules"
      ) {
        fs.readdirSync(dir).forEach((file) => {
          scanFiles(path.join(dir, file));
        });
      }
    };

    scanFiles(scanPath);

    // Find unused keys
    const allKeys = Object.keys(jsonData.id);
    const unusedKeys = allKeys.filter((key) => !usedKeys.has(key));

    // Find keys missing translations
    const missingTranslations = allKeys
      .filter((key) => {
        const missing = [];
        if (!jsonData.en[key]) missing.push("EN");
        if (!jsonData.cn[key]) missing.push("CN");
        return missing.length > 0 ? { key, missing } : null;
      })
      .filter(Boolean);

    // Report results
    if (orphanedCalls.length > 0) {
      console.log(`⚠️  Found ${orphanedCalls.length} orphaned t() calls:\n`);
      orphanedCalls.forEach(({ file, key }) => {
        console.log(`   - ${key} in ${path.relative(this.projectRoot, file)}`);
      });
    }

    if (unusedKeys.length > 0) {
      console.log(
        `\n⚠️  Found ${unusedKeys.length} unused translation keys:\n`
      );
      unusedKeys.slice(0, 10).forEach((key) => {
        console.log(`   - ${key}`);
      });
      if (unusedKeys.length > 10) {
        console.log(`   ... and ${unusedKeys.length - 10} more`);
      }
    }

    if (missingTranslations.length > 0) {
      console.log(
        `\n⚠️  Found ${missingTranslations.length} keys with missing translations:\n`
      );
      missingTranslations.slice(0, 10).forEach(({ key, missing }) => {
        console.log(`   - ${key} (missing: ${missing.join(", ")})`);
      });
      if (missingTranslations.length > 10) {
        console.log(`   ... and ${missingTranslations.length - 10} more`);
      }
    }

    const totalIssues =
      orphanedCalls.length + unusedKeys.length + missingTranslations.length;

    if (totalIssues === 0) {
      console.log("✅ No translation issues found!");
    } else {
      console.log(`\n📊 Summary: ${totalIssues} total issues found`);
    }
  }

  // Validate a single file
  validateFile(filePath, idData, usedKeys, orphanedCalls) {
    const content = fs.readFileSync(filePath, "utf8");

    const patterns = [/t\s*\(\s*['"`]([^'"`]+)['"`]/g];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const key = match[1];
        if (idData[key]) {
          usedKeys.add(key);
        } else {
          orphanedCalls.push({ file: filePath, key });
        }
      }
    });
  }

  // Show current status
  showStatus() {
    console.log("\n📊 Translation Status\n");

    // Load JSON files
    const jsonData = this.loadJsonFiles();
    const totalKeys = Object.keys(jsonData.id).length;
    const translatedEn = Object.values(jsonData.en).filter(
      (v) => v && v !== ""
    ).length;
    const translatedCn = Object.values(jsonData.cn).filter(
      (v) => v && v !== ""
    ).length;

    console.log(`Total Keys: ${totalKeys}`);
    console.log(
      `English Translations: ${translatedEn}/${totalKeys} (${Math.round((translatedEn / totalKeys) * 100)}%)`
    );
    console.log(
      `Chinese Translations: ${translatedCn}/${totalKeys} (${Math.round((translatedCn / totalKeys) * 100)}%)`
    );

    // Session info
    if (this.session.newKeys.length > 0) {
      console.log(`\n📝 Current Session:`);
      console.log(`   New keys pending export: ${this.session.newKeys.length}`);
      console.log(
        `   Session started: ${new Date(this.session.timestamp).toLocaleString()}`
      );
    }

    // Check for export file
    if (fs.existsSync(this.exportFile)) {
      const exportData = JSON.parse(fs.readFileSync(this.exportFile, "utf8"));
      const exportCount = Object.keys(exportData).length;
      console.log(`\n📦 Export File:`);
      console.log(`   Keys ready for translation: ${exportCount}`);
    }
  }

  // Clean up temporary files
  cleanup() {
    const files = [this.sessionFile, this.exportFile];
    let cleaned = 0;

    files.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🗑️  Removed: ${path.basename(file)}`);
        cleaned++;
      }
    });

    if (cleaned === 0) {
      console.log("ℹ️  No temporary files to clean");
    } else {
      console.log(`\n✅ Cleaned ${cleaned} temporary files`);
    }
  }

  // Helper to resolve paths
  resolvePath(filePath) {
    if (filePath.startsWith("@")) {
      return path.join(this.projectRoot, filePath.slice(1));
    }
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.join(this.projectRoot, filePath);
  }

  // Show help
  showHelp() {
    console.log(`
Translation Management Script v3.0 - AI-First Workflow

Usage: npm run t <command> [options]

Core Commands:
  scan <path>          Scan file for t() calls and update JSON
                       Example: npm run t scan src/components/Header.jsx
                       
  scan-dir <path>      Scan all JSX/TSX files in directory
                       Example: npm run t scan-dir src/components
                       
  export               Export new keys for translation
                       Example: npm run t export
                       
  merge <file>         Merge translated keys back to JSON
                       Example: npm run t merge translations-needed.json
                       
  validate [path]      Check for orphaned/missing translations
                       Example: npm run t validate
                       Example: npm run t validate src/components
                       
  status               Show translation statistics
                       Example: npm run t status
                       
  cleanup              Remove temporary files
                       Example: npm run t cleanup
                       
  help                 Show this help message

AI-First Workflow:
  1. AI manually adds t() calls to components
  2. npm run t scan <file>              # Detect t() calls
  3. npm run t export                   # Export new keys
  4. AI translates the exported file
  5. npm run t merge translations-needed.json  # Apply translations

Quick Example:
  npm run t scan src/components/Header.jsx
  npm run t export
  # Translate the file...
  npm run t merge translations-needed.json

For deep translation (with imports):
  npm run t scan-dir src/components/Map/
  npm run t export
  # Translate all keys...
  npm run t merge translations-needed.json
`);
  }
}

// CLI Entry Point
const manager = new MinimalTranslationManager();
const [, , command, ...args] = process.argv;

// Execute command
switch (command) {
  case "scan":
    if (args.length === 0) {
      console.error("❌ Please provide a file to scan");
      manager.showHelp();
      process.exit(1);
    }

    // Handle multiple files
    if (args.length > 1) {
      manager.scanMultiple(args);
    } else {
      manager.scanForTranslations(args[0]);
    }
    break;

  case "scan-dir":
    if (args.length === 0) {
      console.error("❌ Please provide a directory to scan");
      manager.showHelp();
      process.exit(1);
    }
    manager.scanDirectory(args[0]);
    break;

  case "export":
    manager.exportNewKeys();
    break;

  case "merge":
    if (args.length === 0) {
      console.error("❌ Please provide a file to merge");
      console.log("   Example: npm run t merge translations-needed.json");
      process.exit(1);
    }
    manager.mergeTranslations(args[0]);
    break;

  case "validate":
    manager.validateTranslations(args[0]);
    break;

  case "status":
    manager.showStatus();
    break;

  case "cleanup":
    manager.cleanup();
    break;

  case "help":
  case "--help":
  case "-h":
    manager.showHelp();
    break;

  default:
    if (command) {
      console.error(`❌ Unknown command: ${command}\n`);
    }
    manager.showHelp();
    break;
}
