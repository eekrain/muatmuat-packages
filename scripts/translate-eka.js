#!/usr/bin/env node

/**
 * translate-eka.js
 * A self-contained CLI for i18n scan/export/merge/session-report with session scoping.
 *
 * Commands:
 *   npm run translate:eka -- session:start
 *   npm run translate:eka -- session:end
 *   npm run translate:eka -- scan <path/to/file>
 *   npm run translate:eka -- scan-dir <path/to/dir>
 *   npm run translate:eka -- export
 *   npm run translate:eka -- merge
 *   npm run translate:eka -- validate
 *   npm run translate:eka -- report-session
 *   npm run translate:eka -- cleanup
 *
 * NOTES
 * - "scan" extracts keys from t("key", {...}, "Indonesian text") usage.
 * - "export" creates .translation/translations-needed.json for keys needing work.
 * - "merge" writes into public/mock-common-{id,en,cn}.json AND appends merged keys to
 *   .translation/sessions/<SESSION_ID>/merged-keys.json
 * - "report-session" writes translation-report.<SESSION_ID>.csv at project root (NOT in .translation/)
 *
 * Customize LOCALE paths below if your repo differs.
 */

const fs = require("fs");
const path = require("path");

/* =========================
   CONFIGURATION CONSTANTS
   ========================= */

const PROJECT_ROOT = process.cwd();

/** Where locale JSONs live (adjust if needed): */
const LOCALES_DIR = path.join(PROJECT_ROOT, "public");
const ID_PATH = path.join(LOCALES_DIR, "mock-common-id.json");
const EN_PATH = path.join(LOCALES_DIR, "mock-common-en.json");
const CN_PATH = path.join(LOCALES_DIR, "mock-common-cn.json");

/** Central working directory for translations: */
const TRANS_DIR = path.join(PROJECT_ROOT, ".translation");

/** Session management (inside .translation/): */
const SESS_DIR = path.join(TRANS_DIR, "sessions");
const ACTIVE_SESSION_FILE = path.join(SESS_DIR, "ACTIVE_SESSION");

/** Export artifacts (inside .translation/): */
const EXPORT_PATH = path.join(TRANS_DIR, "translations-needed.json");

/** Scan cache (inside .translation/): */
const SCAN_CACHE_PATH = path.join(TRANS_DIR, "i18n-scan.json");

/** Plan files are stored beside here (not directly used by this script):
 *   .translation/translate-plan-<module>-<YYYYMMDD-HHmm>.md
 */

/** File types to parse when scanning directories: */
const CODE_EXTS = new Set([".js", ".jsx", ".ts", ".tsx"]);

/* =========================
   UTILS
   ========================= */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJSON(p, fallback = {}) {
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJSON(p, data) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function csvEscape(s) {
  return `"${String(s ?? "").replace(/"/g, '""')}"`;
}

function getActiveSession() {
  if (!fs.existsSync(ACTIVE_SESSION_FILE)) {
    throw new Error(
      "No ACTIVE_SESSION found. Run `npm run translate:eka -- session:start` first."
    );
  }
  return fs.readFileSync(ACTIVE_SESSION_FILE, "utf8").trim();
}

function newUTCSessionId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function walkDir(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(p, out);
    } else if (e.isFile()) {
      out.push(p);
    }
  }
  return out;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

/** Derive component name from key (prefix before first dot) */
function keyToComponentName(key) {
  const i = key.indexOf(".");
  return i === -1 ? key : key.slice(0, i);
}

/* =========================
   SCANNING
   ========================= */

/**
 * Heuristic scanner for:
 *   t("Some.Key", {...}, "Indonesian Fallback")
 *   t('Some.Key', {...}, 'Indonesian Fallback')
 *
 * Notes:
 * - It expects the second arg to be an object literal and the third to be a quoted string.
 * - It’s intentionally pragmatic and may miss exotic formatting outside the agreed pattern.
 */
function scanFileForKeys(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Capture key and fallback text with lenient whitespace.
  // Group 1 = key, Group 2 = fallback (double-quoted) or Group 3 (single-quoted)
  const regex =
    /t\(\s*["']([^"']+)["']\s*,\s*\{[^)]*?\}\s*,\s*(?:"([^"]*?)"|'([^']*?)')\s*\)/g;

  const found = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    const key = m[1];
    const idText = m[2] ?? m[3] ?? "";
    if (key) {
      found.push({ key, id: idText });
    }
  }

  return found;
}

function cmdScan(filePath) {
  const abs = path.resolve(PROJECT_ROOT, filePath);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    console.error(`[scan] Not a file: ${filePath}`);
    process.exit(2);
  }

  const ext = path.extname(abs);
  if (!CODE_EXTS.has(ext)) {
    console.warn(`[scan] Skipping non-code file: ${filePath}`);
    return;
  }

  const hits = scanFileForKeys(abs);
  const cache = readJSON(SCAN_CACHE_PATH, { keys: {} });

  let added = 0;
  for (const { key, id } of hits) {
    if (!cache.keys[key]) {
      cache.keys[key] = { id, files: [filePath] };
      added++;
    } else {
      const files = new Set(cache.keys[key].files || []);
      files.add(filePath);
      cache.keys[key].files = Array.from(files);
      if (!cache.keys[key].id && id) cache.keys[key].id = id;
    }
  }

  writeJSON(SCAN_CACHE_PATH, cache);
  console.log(
    `[scan] ${filePath}: found ${hits.length} key(s), added ${added}`
  );
}

function cmdScanDir(dirPath) {
  const absDir = path.resolve(PROJECT_ROOT, dirPath);
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) {
    console.error(`[scan-dir] Not a directory: ${dirPath}`);
    process.exit(2);
  }

  const files = walkDir(absDir);
  let totalFound = 0;
  let totalAdded = 0;

  for (const f of files) {
    const ext = path.extname(f);
    if (!CODE_EXTS.has(ext)) continue;

    const rel = path.relative(PROJECT_ROOT, f);
    const hits = scanFileForKeys(f);
    totalFound += hits.length;

    const cache = readJSON(SCAN_CACHE_PATH, { keys: {} });
    let added = 0;
    for (const { key, id } of hits) {
      if (!cache.keys[key]) {
        cache.keys[key] = { id, files: [rel] };
        added++;
      } else {
        const filesSet = new Set(cache.keys[key].files || []);
        filesSet.add(rel);
        cache.keys[key].files = Array.from(filesSet);
        if (!cache.keys[key].id && id) cache.keys[key].id = id;
      }
    }
    totalAdded += added;
    writeJSON(SCAN_CACHE_PATH, cache);
  }

  console.log(
    `[scan-dir] ${dirPath}: found ${totalFound} occurrence(s), added ${totalAdded} new key(s)`
  );
}

/* =========================
   EXPORT
   ========================= */

/**
 * Create .translation/translations-needed.json from scan cache.
 * By default, export keys that:
 *  - are missing in ID file, or
 *  - have missing EN or CN
 * This focuses translators on gaps instead of dumping everything.
 */
function cmdExport() {
  ensureDir(TRANS_DIR);

  const cache = readJSON(SCAN_CACHE_PATH, { keys: {} });
  const allKeys = Object.keys(cache.keys || {});
  if (allKeys.length === 0) {
    console.log("[export] No scanned keys found. Run scan/scan-dir first.");
    writeJSON(EXPORT_PATH, { translations: {} });
    return;
  }

  const idJSON = readJSON(ID_PATH, {});
  const enJSON = readJSON(EN_PATH, {});
  const cnJSON = readJSON(CN_PATH, {});

  const out = { translations: {} };
  for (const key of allKeys) {
    const idText = cache.keys[key]?.id ?? idJSON[key] ?? "";
    const haveEN = typeof enJSON[key] === "string" && enJSON[key].length > 0;
    const haveCN = typeof cnJSON[key] === "string" && cnJSON[key].length > 0;

    if (!haveEN || !haveCN || !idJSON[key]) {
      out.translations[key] = {
        id: idText,
        en: haveEN ? enJSON[key] : "",
        cn: haveCN ? cnJSON[key] : "",
      };
    }
  }

  writeJSON(EXPORT_PATH, out);
  const count = Object.keys(out.translations).length;
  console.log(
    `[export] Wrote ${count} key(s) to .translation/translations-needed.json`
  );
}

/* =========================
   MERGE (SESSIONIZED)
   ========================= */

/**
 * Merges .translation/translations-needed.json into public/mock-common-{id,en,cn}.json
 * and appends merged keys into the current session manifest:
 *   .translation/sessions/<SESSION_ID>/merged-keys.json
 */
function cmdMerge() {
  if (!fs.existsSync(EXPORT_PATH)) {
    console.error(
      "[merge] .translation/translations-needed.json not found. Run export first."
    );
    process.exit(2);
  }
  const needed = readJSON(EXPORT_PATH, { translations: {} });
  const kv = needed.translations || {};
  const keys = Object.keys(kv);
  if (keys.length === 0) {
    console.log("[merge] No keys to merge.");
    return;
  }

  ensureDir(LOCALES_DIR);
  const idJSON = readJSON(ID_PATH, {});
  const enJSON = readJSON(EN_PATH, {});
  const cnJSON = readJSON(CN_PATH, {});

  let mergedCount = 0;
  for (const key of keys) {
    const entry = kv[key] || {};
    if (typeof entry.id === "string" && entry.id.trim().length) {
      idJSON[key] = entry.id;
    }
    if (typeof entry.en === "string") enJSON[key] = entry.en;
    if (typeof entry.cn === "string") cnJSON[key] = entry.cn;
    mergedCount++;
  }

  writeJSON(ID_PATH, idJSON);
  writeJSON(EN_PATH, enJSON);
  writeJSON(CN_PATH, cnJSON);
  console.log(`[merge] Merged ${mergedCount} key(s) into mock-common-*.json`);

  // Update session manifest inside .translation/
  const sessionId = getActiveSession();
  const sessDir = path.join(SESS_DIR, sessionId);
  ensureDir(sessDir);
  const manifestPath = path.join(sessDir, "merged-keys.json");
  const manifest = readJSON(manifestPath, []);
  const updated = unique([...manifest, ...keys]);
  writeJSON(manifestPath, updated);
  console.log(
    `[merge] Updated session manifest: .translation/sessions/${sessionId}/merged-keys.json`
  );
}

/* =========================
   VALIDATE
   ========================= */

/**
 * Basic validation for the current session:
 *  - For each session key, ensure Indonesian text exists and (optionally) EN/CN exist
 *  - Detect “key collision” where the same key has different Indonesian `id`
 *    compared to what scanner saw in code fallback
 */
function cmdValidate() {
  let problems = 0;
  let warnings = 0;

  let sessionKeys = [];
  try {
    const sessionId = getActiveSession();
    const manifestPath = path.join(SESS_DIR, sessionId, "merged-keys.json");
    sessionKeys = readJSON(manifestPath, []);
  } catch {
    // If no session, validate entire set of scanned keys for ID collisions only
    const cache = readJSON(SCAN_CACHE_PATH, { keys: {} });
    sessionKeys = Object.keys(cache.keys || {});
    console.log("[validate] No active session, validating scanned keys.");
  }

  const idJSON = readJSON(ID_PATH, {});
  const enJSON = readJSON(EN_PATH, {});
  const cnJSON = readJSON(CN_PATH, {});
  const cache = readJSON(SCAN_CACHE_PATH, { keys: {} });

  for (const key of sessionKeys) {
    const scannedId = cache.keys?.[key]?.id;
    const idText = idJSON[key];

    if (scannedId && idText && scannedId !== idText) {
      console.error(
        `[validate] COLLISION: ${key} scannedId="${scannedId}" vs id.json="${idText}"`
      );
      problems++;
    }

    if (!idText || !String(idText).trim()) {
      console.warn(`[validate] Missing ID text for key: ${key}`);
      warnings++;
    }
    if (!enJSON[key]) {
      console.warn(`[validate] Missing EN for key: ${key}`);
      warnings++;
    }
    if (!cnJSON[key]) {
      console.warn(`[validate] Missing CN for key: ${key}`);
      warnings++;
    }
  }

  if (problems > 0) {
    console.error(`[validate] FAILED with ${problems} collision(s).`);
    process.exit(2);
  }

  console.log(
    `[validate] OK with ${warnings} warning(s) for ${sessionKeys.length} key(s).`
  );
}

/* =========================
   REPORT (SESSION-ONLY)
   ========================= */

/**
 * Generates translation-report.<SESSION_ID>.csv at project root using ONLY the keys
 * merged in this session (from .translation/sessions/<SESSION_ID>/merged-keys.json).
 */
function cmdReportSession() {
  const sessionId = getActiveSession();
  const manifestPath = path.join(SESS_DIR, sessionId, "merged-keys.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(
      `[report-session] No merged-keys.json for session ${sessionId}. Did you run merge?`
    );
    process.exit(2);
  }

  const keys = readJSON(manifestPath, []);
  const idJSON = readJSON(ID_PATH, {});
  const enJSON = readJSON(EN_PATH, {});
  const cnJSON = readJSON(CN_PATH, {});

  let csv =
    "component_name,unique_label,original_text_indonesian,english_translation,chinese_translation\n";
  for (const key of keys) {
    const component = keyToComponentName(key);
    const row = [
      component,
      key,
      idJSON[key] ?? "",
      enJSON[key] ?? "",
      cnJSON[key] ?? "",
    ]
      .map(csvEscape)
      .join(",");
    csv += row + "\n";
  }

  const out = path.join(PROJECT_ROOT, `translation-report.${sessionId}.csv`);
  fs.writeFileSync(out, csv, "utf8");
  console.log(
    `[report-session] Created ${path.basename(out)} with ${keys.length} row(s).`
  );
}

/* =========================
   SESSION MANAGEMENT
   ========================= */

function cmdSessionStart() {
  ensureDir(SESS_DIR);
  const id = newUTCSessionId();
  ensureDir(path.join(SESS_DIR, id));
  fs.writeFileSync(ACTIVE_SESSION_FILE, id, "utf8");
  console.log(`[session:start] ACTIVE_SESSION=${id}`);
}

function cmdSessionEnd() {
  if (fs.existsSync(ACTIVE_SESSION_FILE)) {
    fs.unlinkSync(ACTIVE_SESSION_FILE);
    console.log("[session:end] Cleared ACTIVE_SESSION");
  } else {
    console.log("[session:end] No ACTIVE_SESSION to clear");
  }
}

/* =========================
   CLEANUP
   ========================= */

function cmdCleanup() {
  if (fs.existsSync(SCAN_CACHE_PATH)) {
    fs.unlinkSync(SCAN_CACHE_PATH);
    console.log("[cleanup] Removed .translation/i18n-scan.json");
  } else {
    console.log("[cleanup] Nothing to remove.");
  }
}

/* =========================
   CLI DISPATCH
   ========================= */

function usage() {
  console.log(`translate-eka.js

Usage:
  npm run translate:eka <command> [args]

Commands:
  session:start             Start a new translation session
  session:end               End the current session
  scan <file>               Scan a single file for t() keys
  scan-dir <dir>            Scan a directory (recursively)
  export                    Write .translation/translations-needed.json
  merge                     Merge translations into mock-common-*.json and session manifest
  validate                  Validate merged translations for this session
  report-session            Generate session-only CSV at project root
  cleanup                   Remove scan cache (.translation/i18n-scan.json)

Paths:
  Working dir:              .translation/
    - Export file:          .translation/translations-needed.json
    - Scan cache:           .translation/i18n-scan.json
    - Sessions:             .translation/sessions/<SESSION_ID>/merged-keys.json
    - Plans (by agent):     .translation/translate-plan-<module>-<YYYYMMDD-HHmm>.md
  Locale JSONs:             public/mock-common-{id,en,cn}.json
  CSV report:               translation-report.<SESSION_ID>.csv (project root)
`);
}

function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd) {
    usage();
    process.exit(1);
  }

  try {
    switch (cmd) {
      case "session:start":
        cmdSessionStart();
        break;
      case "session:end":
        cmdSessionEnd();
        break;
      case "scan":
        if (!args[0]) return usage();
        cmdScan(args[0]);
        break;
      case "scan-dir":
        if (!args[0]) return usage();
        cmdScanDir(args[0]);
        break;
      case "export":
        cmdExport();
        break;
      case "merge":
        cmdMerge();
        break;
      case "validate":
        cmdValidate();
        break;
      case "report-session":
        cmdReportSession();
        break;
      case "cleanup":
        cmdCleanup();
        break;
      default:
        usage();
        process.exit(1);
    }
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    process.exit(2);
  }
}

main();
