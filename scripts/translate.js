#!/usr/bin/env node

/**
 * Translation Management Script v4.0 - With Deep Translate Session Management
 * A comprehensive, AI-first script for the entire translation workflow.
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
    this.reportFile = path.join(this.projectRoot, "translation-report.csv");
    this.planFile = path.join(this.projectRoot, ".deep-translate-plan.json"); // For deep translate sessions
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

  // #region Plan Management for Deep Translate
  startPlan(files) {
    if (!files || files.length === 0) {
      console.error("❌ No files provided to start a plan.");
      process.exit(1);
    }
    const plan = {
      allFiles: files,
      completedFiles: [],
      status: "in_progress",
      startedAt: new Date().toISOString(),
    };
    fs.writeFileSync(this.planFile, JSON.stringify(plan, null, 2));
    console.log(`✅ Plan created successfully with ${files.length} file(s).`);
    console.log(
      `💡 Run 'npm run t plan-next' to get the first file to translate.`
    );
  }

  getNextFileInPlan() {
    if (!fs.existsSync(this.planFile)) {
      console.error("❌ No active plan found. Run 'plan-start' first.");
      process.exit(1);
    }
    const plan = JSON.parse(fs.readFileSync(this.planFile, "utf-8"));
    const nextFile = plan.allFiles.find(
      (file) => !plan.completedFiles.includes(file)
    );

    if (nextFile) {
      // Output ONLY the file path for the AI to consume
      console.log(nextFile);
    } else {
      // Output a clear completion signal
      console.log("PLAN_COMPLETE");
      plan.status = "completed";
      fs.writeFileSync(this.planFile, JSON.stringify(plan, null, 2));
    }
  }

  markPlanFileAsDone(file) {
    if (!fs.existsSync(this.planFile)) {
      console.error("❌ No active plan found.");
      process.exit(1);
    }
    if (!file) {
      console.error("❌ Please provide a file to mark as done.");
      process.exit(1);
    }
    const plan = JSON.parse(fs.readFileSync(this.planFile, "utf-8"));
    if (!plan.allFiles.includes(file)) {
      console.error(`❌ File '${file}' is not part of the current plan.`);
      process.exit(1);
    }
    if (!plan.completedFiles.includes(file)) {
      plan.completedFiles.push(file);
    }
    fs.writeFileSync(this.planFile, JSON.stringify(plan, null, 2));
    console.log(`✅ Marked '${path.basename(file)}' as complete.`);
    console.log(
      `   Progress: ${plan.completedFiles.length}/${plan.allFiles.length}`
    );
  }
  // #endregion

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

    const patterns = [
      // Pattern for template literals with backticks - handle complex expressions
      /t\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\{[^}]*\})?\s*,\s*`([^`]*(?:`[^`]*)*)`\s*\)/g,
      // Pattern for regular string quotes - handle escaped quotes
      /t\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\{[^}]*\})?\s*,\s*['"`]((?:[^'"`\\]|\\.)*?)['"`]\s*\)/g,
      // Fallback pattern for simple cases
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
      return 0;
    }

    if (!options.silent) {
      console.log(
        `\n✅ Found ${foundKeys.size} t() calls in ${path.basename(targetPath)}`
      );
    }

    const jsonData = this.loadJsonFiles();
    let addedCount = 0;

    foundKeys.forEach((fallbackText, key) => {
      if (!jsonData.id[key]) {
        const cleanedFallbackText = fallbackText.replace(
          /\$\{([^}]+)\}/g,
          "{$1}"
        );
        jsonData.id[key] = cleanedFallbackText;
        jsonData.en[key] = "";
        jsonData.cn[key] = "";
        addedCount++;
      }
    });

    if (addedCount > 0) {
      this.saveJsonFiles(jsonData);
      const keysObject = {};
      foundKeys.forEach((value, key) => {
        keysObject[key] = value;
      });
      this.addNewKeysToSession(keysObject);
      if (!options.silent) {
        console.log(
          `✅ Added ${addedCount} new keys to JSON files and session.`
        );
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
    console.log(`\n✅ Scan complete! Total: ${totalFound} t() calls found.`);
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
      console.log("⚠️  No new keys to export. Run 'scan' first.");
      return;
    }
    const idData = this.loadJsonFiles().id;
    const exportData = {};
    this.session.newKeys.forEach((key) => {
      if (idData[key]) {
        exportData[key] = { id: idData[key], en: "", cn: "" };
      }
    });
    fs.writeFileSync(
      this.exportFile,
      JSON.stringify(exportData, null, 2) + "\n"
    );
    console.log(
      `\n✅ Exported ${this.session.newKeys.length} new keys to: ${path.basename(this.exportFile)}`
    );
  }

  // Merge translated keys back to JSON files
  mergeTranslations(filePath) {
    const importPath = this.resolvePath(filePath);
    if (!fs.existsSync(importPath)) {
      console.error(`❌ File not found: ${importPath}`);
      process.exit(1);
    }
    const importData = JSON.parse(fs.readFileSync(importPath, "utf8"));
    let mergedCount = 0;
    const jsonData = this.loadJsonFiles();
    Object.entries(importData).forEach(([key, value]) => {
      if (value.en || value.cn) {
        if (value.en) jsonData.en[key] = value.en;
        if (value.cn) jsonData.cn[key] = value.cn;
        if (!jsonData.id[key] && value.id) jsonData.id[key] = value.id;
        mergedCount++;
      }
    });
    this.saveJsonFiles(jsonData);
    console.log(`\n✅ Merged ${mergedCount} translations successfully`);
    this.clearSession();
    console.log("✅ Session cleared. Ready for next batch.");
  }

  // Generates and merges a CSV report
  generateCsvReport() {
    const sanitizeCsvField = (field) => {
      const str = String(field || "");
      const escapedStr = str.replace(/"/g, '""');
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${escapedStr}"`;
      }
      return escapedStr;
    };
    try {
      if (!fs.existsSync(this.exportFile)) {
        console.error(`❌ File not found: ${path.basename(this.exportFile)}`);
        process.exit(1);
      }
      const newJsonData = JSON.parse(fs.readFileSync(this.exportFile, "utf-8"));
      const newKeys = Object.keys(newJsonData);
      if (newKeys.length === 0) {
        console.warn("⚠️ No new translations in the export file to report.");
        return;
      }
      const mergedData = new Map();
      const header = [
        "component_name",
        "unique_label",
        "original_text_indonesian",
        "english_translation",
        "chinese_translation",
      ];
      if (fs.existsSync(this.reportFile)) {
        const fileContent = fs.readFileSync(this.reportFile, "utf-8");
        const lines = fileContent.trim().split("\n");
        const existingHeader = lines.shift()?.split(",") || [];
        const keyIndex = existingHeader.indexOf("unique_label");
        if (keyIndex !== -1) {
          lines.forEach((line) => {
            const key = line.split(",")[keyIndex];
            if (key) mergedData.set(key, line);
          });
        }
      }
      newKeys.forEach((key) => {
        const value = newJsonData[key];
        const componentName = key.split(".")[0] || "UnknownComponent";
        const newRowArray = [
          componentName,
          key,
          value.id || "",
          value.en || "",
          value.cn || "",
        ];
        mergedData.set(key, newRowArray.map(sanitizeCsvField).join(","));
      });
      const finalCsvContent = [
        header.join(","),
        ...Array.from(mergedData.values()),
      ].join("\n");
      fs.writeFileSync(this.reportFile, finalCsvContent, "utf-8");
      console.log(
        `✅ Success! Report updated. Total entries: ${mergedData.size}.`
      );
      console.log(`📄 Report saved to: ${path.basename(this.reportFile)}`);
    } catch (err) {
      console.error("❌ Error generating CSV report:", err);
      process.exit(1);
    }
  }

  // Validate translations - check for orphaned or missing
  validateTranslations(targetPath) {
    console.log("\n🔍 Validating translations...\n");
    const jsonData = this.loadJsonFiles();
    const usedKeys = new Set();
    const orphanedCalls = [];
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
        fs.readdirSync(dir).forEach((file) => scanFiles(path.join(dir, file)));
      }
    };
    scanFiles(scanPath);
    const allKeys = Object.keys(jsonData.id);
    const unusedKeys = allKeys.filter((key) => !usedKeys.has(key));
    const missingTranslations = allKeys
      .map((key) => {
        const missing = [];
        if (!jsonData.en[key]) missing.push("EN");
        if (!jsonData.cn[key]) missing.push("CN");
        return missing.length > 0 ? { key, missing } : null;
      })
      .filter(Boolean);
    if (orphanedCalls.length > 0) {
      console.log(
        `⚠️  Found ${orphanedCalls.length} orphaned t() calls (keys not in JSON):\n`
      );
      orphanedCalls.forEach(({ file, key }) =>
        console.log(`   - ${key} in ${path.relative(this.projectRoot, file)}`)
      );
    }
    if (unusedKeys.length > 0) {
      console.log(
        `\n⚠️  Found ${unusedKeys.length} unused translation keys (keys in JSON but not in code):\n`
      );
      unusedKeys.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
      if (unusedKeys.length > 10)
        console.log(`   ... and ${unusedKeys.length - 10} more`);
    }
    if (missingTranslations.length > 0) {
      console.log(
        `\n⚠️  Found ${missingTranslations.length} keys with missing translations:\n`
      );
      missingTranslations
        .slice(0, 10)
        .forEach(({ key, missing }) =>
          console.log(`   - ${key} (missing: ${missing.join(", ")})`)
        );
      if (missingTranslations.length > 10)
        console.log(`   ... and ${missingTranslations.length - 10} more`);
    }
    const totalIssues =
      orphanedCalls.length + unusedKeys.length + missingTranslations.length;
    if (totalIssues === 0) console.log("✅ No translation issues found!");
    else console.log(`\n📊 Summary: ${totalIssues} total issues found`);
  }

  // Helper for validateTranslations
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
    const jsonData = this.loadJsonFiles();
    const totalKeys = Object.keys(jsonData.id).length;
    if (totalKeys === 0) {
      console.log("No translations found yet. Start by running 'scan'.");
      return;
    }
    const translatedEn = Object.values(jsonData.en).filter(
      (v) => v && v !== ""
    ).length;
    const translatedCn = Object.values(jsonData.cn).filter(
      (v) => v && v !== ""
    ).length;
    const enPercentage = Math.round((translatedEn / totalKeys) * 100);
    const cnPercentage = Math.round((translatedCn / totalKeys) * 100);
    console.log(`Total Keys: ${totalKeys}`);
    console.log(
      `English Translations: ${translatedEn}/${totalKeys} (${enPercentage}%)`
    );
    console.log(
      `Chinese Translations: ${translatedCn}/${totalKeys} (${cnPercentage}%)`
    );
    if (this.session.newKeys.length > 0) {
      console.log(`\n📝 Current Session:`);
      console.log(`   New keys pending export: ${this.session.newKeys.length}`);
      console.log(
        `   Session started: ${new Date(this.session.timestamp).toLocaleString()}`
      );
    }
    if (fs.existsSync(this.exportFile)) {
      const exportData = JSON.parse(fs.readFileSync(this.exportFile, "utf8"));
      const exportCount = Object.keys(exportData).length;
      console.log(`\n📦 Export File:`);
      console.log(
        `   Keys ready for translation: ${exportCount} in ${path.basename(this.exportFile)}`
      );
    }
    if (fs.existsSync(this.planFile)) {
      const plan = JSON.parse(fs.readFileSync(this.planFile, "utf-8"));
      console.log(`\n📋 Deep Translate Plan:`);
      console.log(`   Status: ${plan.status}`);
      console.log(
        `   Progress: ${plan.completedFiles.length}/${plan.allFiles.length}`
      );
    }
  }

  // Clean up temporary files
  cleanup() {
    const files = [this.sessionFile, this.exportFile, this.planFile];
    let cleaned = 0;
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🗑️  Removed: ${path.basename(file)}`);
        cleaned++;
      }
    });
    if (cleaned === 0) console.log("ℹ️  No temporary files to clean");
    else console.log(`\n✅ Cleaned ${cleaned} temporary files`);
  }

  // Helper to resolve paths
  resolvePath(filePath) {
    if (filePath.startsWith("@"))
      return path.join(this.projectRoot, filePath.slice(1));
    if (path.isAbsolute(filePath)) return filePath;
    return path.join(this.projectRoot, filePath);
  }

  // Show help
  showHelp() {
    console.log(`
Translation Management Script v4.0 - AI-First Workflow with Session Management

Usage: npm run t <command> [options]

Core Commands:
  scan <path...>         Scan file(s) for t() calls and update JSON.
  scan-dir <path>      Scan all JSX/TSX files in a directory.
  export               Export new keys from the current session for translation.
  merge <file>         Merge translated keys from a file back to JSON.
  report               Generate or merge a CSV report from the last exported file.

Deep Translate Planning Commands:
  plan-start <files...> Create a new deep translation plan session.
  plan-next            Get the next file to translate from the active plan.
  plan-done <file>     Mark a file as complete in the active plan.

Utility Commands:
  validate [path]      Check for orphaned or missing translations.
  status               Show translation statistics and session status.
  cleanup              Remove ALL temporary files (session, export, and plan).
  help                 Show this help message.
`);
  }
}

// CLI Entry Point
const manager = new MinimalTranslationManager();
const [, , command, ...args] = process.argv;

switch (command) {
  case "plan-start":
    manager.startPlan(args);
    break;
  case "plan-next":
    manager.getNextFileInPlan();
    break;
  case "plan-done":
    manager.markPlanFileAsDone(args[0]);
    break;
  case "scan":
    if (args.length === 0) {
      console.error("❌ Please provide a file to scan");
      manager.showHelp();
      process.exit(1);
    }
    if (args.length > 1) manager.scanMultiple(args);
    else manager.scanForTranslations(args[0]);
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
      process.exit(1);
    }
    manager.mergeTranslations(args[0]);
    break;
  case "report":
    manager.generateCsvReport();
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
    if (command) console.error(`❌ Unknown command: ${command}\n`);
    manager.showHelp();
    break;
}
