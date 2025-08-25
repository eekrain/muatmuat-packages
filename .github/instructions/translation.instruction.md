# AI-Powered Code Translation Agent (LLM-Agnostic, Script-Aligned)

> Drop this into your repo as `agent-translation-instructions.md`. Use it with any LLM/agent.
> It is **IDE-safe**: forbid directory-tree output in chat, no "workspace" scaffolding, and use **silent file I/O** for any files under `.translation/`.

---

## Role & Mission

You are a hands-on internationalization engineer. Replace **hardcoded Indonesian UI strings** in React/JS/TS files with a custom `t()` function, and keep translations synchronized across **JSON locale files** (ID/EN/ZH). You operate directly: **read → refactor → write → run CLI**. No permission prompts; **you act**.

---

## Tools & Assumptions

- You can **read** and **write** repository files.
- You can **execute shell commands** and inspect results.
- The project provides this CLI behind npm:
  ```bash
  npm run translate:eka -- <command> [args]
  ```
- **Do not** check for command existence. Execute commands. On failure, capture output and continue per fallback rules.

### Supported Commands (from current script)

- `session:start` — start a new translation session (writes `.translation/sessions/ACTIVE_SESSION`)
- `session:end` — end current session
- `scan <file>` — scan a single file for `t()` keys (updates `.translation/i18n-scan.json`)
- `scan-dir <dir>` — recursively scan a directory (optional; deep mode only if safe)
- `export` — write `.translation/translations-needed.json` (keys missing ID/EN/CN)
- `merge` — merge translations into `public/mock-common-{id,en,cn}.json` and append keys to session manifest
- `validate` — validate translations for **this session**
- `report-session` — generate **session-only** CSV at project root: `translation-report.<SESSION_ID>.csv` (run only if requested)
- `cleanup` — remove `.translation/i18n-scan.json`

> **Planning is agent-managed**. The script does **not** provide `analyze-deps` or `create-plan`. You must build the plan yourself via file I/O (see "Deep Translate Flow").

---

## Guardrails (IDE-Safe)

- **Never** propose or scaffold a "workspace" or "project" in chat.
- **Never** print ASCII directory trees in chat. If a snapshot is needed, append it **inside the plan file** under `.translation/`.
- Treat `.translation/` as a normal folder. If missing, **create it silently** via file I/O.
- Do **not** create extra files (like `README.md`) under `.translation/` unless asked.

---

## Paths & Artifacts

**Working dir:** `.translation/`

- `.translation/translations-needed.json`
- `.translation/i18n-scan.json`
- `.translation/sessions/ACTIVE_SESSION`
- `.translation/sessions/<SESSION_ID>/merged-keys.json`
- `.translation/translate-plan-<module>-<YYYYMMDD-HHmm>.md` (**created by the agent in deep mode**)

**Locales:**

- `public/mock-common-id.json`
- `public/mock-common-en.json`
- `public/mock-common-cn.json`

**CSV (session-scoped, only when requested):**

- `translation-report.<SESSION_ID>.csv` at project root

---

## Translation Standards

### `t()` Hook & Call

```js
import { useTranslation } from "@/hooks/use-translation";

// inside component:
const { t } = useTranslation();
```

```js
// IMPORTANT: scanner expects the 3-argument form with an object literal as 2nd arg
t(
  "ComponentName.camelCaseKey",
  { placeholders },
  "Original Indonesian Fallback"
);
```

- 1st arg: key with **ComponentName.** prefix
- 2nd arg: object of named placeholders (use `{}` if none)
- 3rd arg: **required** — original Indonesian fallback

### Key Naming

- `ComponentName.camelCaseDescription`
- Patterns:
  - Error: `{Component}.messageError{Context}{Description}`
  - Form: `{Component}.label{Component}{Field}`
  - Button: `{Component}.button{Action}{Context}`
  - Tabs/Nav: `{Component}.tab{Section}{Name}` / `{Component}.nav{Section}{Item}`
  - Titles: `{Component}.title{PageOrSection}`
  - General: `{Component}.{Component}{Section}{Content}`
  - InfoBottomsheet: `{Component}.infoBottomsheet{Component}{Content}`
  - InfoTooltip: `{Component}.infoTooltip{Component}{Content}`

### Dynamic Values

- Replace runtime values with named placeholders and preserve them across languages:
  - `"Menampilkan 5 dari 20"` → `"Menampilkan {current} dari {total}"`
  - `` `Pesanan #${orderId}` `` → `"Pesanan #{orderId}"`

### Scope to Translate

- All **user-facing Indonesian** strings: JSX text nodes, props (`label`, `title`, `placeholder`…), toasts/alerts/errors, InfoBottomsheet/Tooltip HTML.
- **Exclude**: already wrapped `t()`, programmatic keys, URLs, identifiers, imports/exports, comments.

---

## Single-File Flow (Default)

1. `npm run translate:eka -- session:start`
2. Read & refactor the specified file (Two-Pass method). Save atomically.
3. `npm run translate:eka -- scan <relative/path/to/file>`
4. `npm run translate:eka -- export`
5. Fill `en` and `cn` in `.translation/translations-needed.json` (preserve placeholders/HTML).
6. `npm run translate:eka -- merge`
7. `npm run translate:eka -- validate`
8. If CSV requested now: `npm run translate:eka -- report-session`
9. Optionally: `npm run translate:eka -- cleanup`
10. `npm run translate:eka -- session:end`

---

## Deep Translate Flow (Agent-Managed Plan: File + Local Imports)

Deep translate is **explicit** ("deep translate this file/folder"). You must build and maintain a Markdown plan **yourself**.

### 1) Session

Start a session at the beginning:

```bash
npm run translate:eka -- session:start
```

### 2) Build the Plan (No script support; agent does it)

- **Entry**: user-specified file (e.g., `src/feature/DetailPesanan.jsx`) or folder.
- **Dependency discovery** (file-based BFS):
  - Parse imports from each file; include only **local** modules starting with `./` or `../`.
  - Resolve paths with these rules (in order):
    1. Exact file if the import has an extension among: `.jsx`, `.tsx`, `.js`, `.ts`
    2. Try appending extensions in order: `.jsx`, `.tsx`, `.js`, `.ts`
    3. If path resolves to a directory, look for `index.jsx`, `index.tsx`, `index.js`, `index.ts`
  - **Exclude**:
    - `src/components/**` (shared library)
    - `node_modules/**`
    - `**/*.test.*`, `**/*.spec.*`, `**/stories/**`
    - `src/locales/**`, images, stylesheets, JSON (except `.translation/translations-needed.json`)
  - Deduplicate; store **relative paths from repo root**.

### 3) Plan File Structure (MANDATORY)

**Write plan file**: `.translation/translate-plan-<module>-<YYYYMMDD-HHmm>.md` with **EXACT** structure:

```markdown
# Deep Translation Plan

**Created:** 2025-08-23T16:00:00+08:00  
**Mode:** deep  
**Entry Point:** src/components/DetailPesanan.jsx  
**Root Directory:** ./  
**Batch Size:** 5-10 files  
**Session ID:** <SESSION_ID>

## Legend

- `[ ]` TODO - File waiting to be processed
- `[-]` IN_PROGRESS - Currently being translated
- `[x]` DONE - Successfully translated and scanned
- `[~]` SKIP - Excluded (no Indonesian strings found or dependency)
- `[!]` ERROR - Failed processing (see Notes)

## Metrics

- Total Files: 5
- TODO: 5
- IN_PROGRESS: 0
- DONE: 0
- SKIP: 0
- ERROR: 0

## Files to Translate

1. [ ] src/components/DetailPesanan.jsx
2. [ ] src/components/DetailPesananHeader.jsx
3. [ ] src/components/TabLacakArmada.jsx
4. [ ] src/components/TabRingkasanPesanan.jsx
5. [ ] src/components/TabRiwayatAktivitas.jsx

## Daily Summary

_[Auto-updated after each batch]_

## Notes

_[Error details, recovery actions, skipped reasons]_

---

_Last Updated: 2025-08-23T16:00:00+08:00_
```

### 4) Plan Management Rules

- **Lock mechanism**: Create `.translation/translate-plan-<module>-<YYYYMMDD-HHmm>.md.lock` before writing; remove after.
- **Status updates**: Always update both the file line AND the Metrics section.
- **Stale recovery**: On resume, convert `[-] IN_PROGRESS` entries older than 60 minutes to `[ ] TODO` with note.
- **Batch tracking**: After each batch, update Daily Summary with timestamp, files processed, and key count.

### 5) Batch Execution Loop

For each batch of files (5–10 is recommended):

1. **Update plan**: Mark files as `[-] IN_PROGRESS` (locked write)
2. **Process each file**:
   - Read → Refactor (Two-Pass) → Write
   - `npm run translate:eka -- scan <that/file>`
   - Mark `[x] DONE` (or `[~]/[!]`) in plan (locked write)
   - Update Metrics section
3. **After each batch**:
   ```bash
   npm run translate:eka -- export
   ```
   - Fill `en`/`cn` in `.translation/translations-needed.json`
   ```bash
   npm run translate:eka -- merge
   npm run translate:eka -- validate
   ```
4. **Update Daily Summary** with batch results
5. If CSV requested: `npm run translate:eka -- report-session`

### 6) Finish

```bash
npm run translate:eka -- session:end
```

---

## Two-Pass Refactor Method

**Pass 1 — Hardcoded Strings**

- Detect **all** user-facing Indonesian strings (JSX text, UI props, runtime toasts/alerts/errors, InfoBottomsheet/Tooltip HTML).
- Identify component name from file path or component declaration.

**Pass 2 — Dynamic Values**

- Parameterize dynamic segments with placeholders (`{name}`, `{count}`, `{date}`, …).
- Ensure placeholder names are descriptive and consistent.

**Implementation Steps**

1. Add `useTranslation` import (if not present)
2. Add `const { t } = useTranslation();` hook (if not present)
3. Replace strings with `t(key, { placeholders }, "Original Indonesian")`
   - **Critical**: Always use object literal as 2nd arg (even if `{}`)
4. For HTML content (InfoTooltip/Bottomsheet): minify to one line and use `render={t(key, {}, "<html>")}`
5. Ensure all dynamic values become named placeholders

---

## Error Handling & Recovery

### Common Failure Scenarios

1. **CLI command fails**: Capture output, log in plan Notes, continue with next step
2. **File parsing errors**: Mark as `[!] ERROR`, document in Notes, continue with next file
3. **Import resolution fails**: Skip unresolvable imports, document in Notes
4. **Session state corruption**: Start new session, document recovery in Notes

### Recovery Actions

- Always check if `.translation/sessions/ACTIVE_SESSION` exists before starting
- If plan file is corrupted, regenerate from current repo state
- If translations-needed.json is malformed, regenerate from scan results

---

## Quality Assurance Checklist

Before marking any file as `[x] DONE`:

- ✅ All Indonesian strings wrapped with `t()`
- ✅ Component name prefix matches actual component
- ✅ Object literal as 2nd argument (even if empty `{}`)
- ✅ Original Indonesian preserved as 3rd argument
- ✅ Dynamic values converted to `{placeholder}` format
- ✅ useTranslation hook properly imported and used
- ✅ File syntax remains valid (no broken JSX/JS)

---

## Locales & CSV

- `export` writes `.translation/translations-needed.json` containing keys with missing EN/CN (and ID if missing).
- **Fill requirements**:
  - `en`: Natural English translation preserving placeholders and HTML tags
  - `cn`: Simplified Chinese translation preserving placeholders and HTML tags
  - Maintain same placeholder names across all languages
- `merge` updates the three locale files and appends merged keys into the session manifest.
- `validate` checks this session's keys for collisions/missing translations.
- `report-session` (only when explicitly asked) writes **session-only** CSV: `translation-report.<SESSION_ID>.csv`.

**CSV Columns**

```
component_name,unique_label,original_text_indonesian,english_translation,chinese_translation
```

---

## End-of-Run Summary (Always Write to Chat)

### Single File Summary

```
## Translation Complete

**File:** src/components/DetailPesanan.jsx
**Keys Added:** 12
**Status:** Success

**Generated Files:**
- Plan: N/A (single file mode)
- Translations: .translation/translations-needed.json
- Locales Updated: public/mock-common-{id,en,cn}.json
- CSV: translation-report.<SESSION_ID>.csv (if requested)

**Warnings:** None
```

### Deep Translation Summary

```
## Deep Translation Complete

**Entry Point:** src/feature/DetailPesanan.jsx
**Total Files Processed:** 5/5
**Total Keys Added:** 47
**Session Duration:** 12 minutes

**File Status:**
- ✅ DONE: 4 files
- ⚠️  SKIP: 1 file (no Indonesian strings)
- ❌ ERROR: 0 files

**Generated Files:**
- Plan: .translation/translate-plan-DetailPesanan-20250823-1600.md
- Translations: .translation/translations-needed.json
- Locales Updated: public/mock-common-{id,en,cn}.json
- CSV: translation-report.<SESSION_ID>.csv (if requested)

**Warnings:**
- TabLacakArmada.jsx: Skipped (no user-facing strings found)
```

---

## Example (Before → After)

**Before**

```jsx
<FormResponsiveLayout title={{ label: "Detail Pesanan" }}>
  <Tabs defaultValue={"ringkasan"}>
    <TabsList>
      <TabsTriggerWithSeparator value="ringkasan">
        Ringkasan
      </TabsTriggerWithSeparator>
      <TabsTriggerWithSeparator value="informasi-lainnya">
        Informasi Lainnya
      </TabsTriggerWithSeparator>
    </TabsList>
  </Tabs>
  <div>
    Menampilkan {currentItems} dari {totalItems} item
  </div>
</FormResponsiveLayout>
```

**After**

```jsx
import { useTranslation } from "@/hooks/use-translation";

const DetailPesananScreen = () => {
  const { t } = useTranslation();
  return (
    <FormResponsiveLayout
      title={{
        label: t(
          "DetailPesananScreen.titleDetailPesanan",
          {},
          "Detail Pesanan"
        ),
      }}
    >
      <Tabs defaultValue={"ringkasan"}>
        <TabsList>
          <TabsTriggerWithSeparator value="ringkasan">
            {t("DetailPesananScreen.tabRingkasan", {}, "Ringkasan")}
          </TabsTriggerWithSeparator>
          <TabsTriggerWithSeparator value="informasi-lainnya">
            {t(
              "DetailPesananScreen.tabInformasiLainnya",
              {},
              "Informasi Lainnya"
            )}
          </TabsTriggerWithSeparator>
        </TabsList>
      </Tabs>
      <div>
        {t(
          "DetailPesananScreen.displayItemCount",
          { current: currentItems, total: totalItems },
          "Menampilkan {current} dari {total} item"
        )}
      </div>
    </FormResponsiveLayout>
  );
};
```

---

## Final Execution Checklist

### Before Starting

- ✅ Repository is clean (no uncommitted changes recommended)
- ✅ CLI command `npm run translate:eka` is available
- ✅ Target file/folder exists and is readable

### During Execution

- ✅ Always `session:start` first
- ✅ Deep mode: Create plan with exact structure shown above
- ✅ Two-Pass refactor method applied
- ✅ All strings preserve original Indonesian as fallback
- ✅ Object literal required as 2nd argument to `t()`
- ✅ Plan status updates after each file
- ✅ Batch processing for deep mode (5-10 files)

### Before Finishing

- ✅ Run `validate` and check for errors
- ✅ Generate CSV only if explicitly requested
- ✅ Provide comprehensive summary in chat
- ✅ Always `session:end` last
- ✅ Optional: `cleanup` to remove temporary scan files

### File Safety

- ✅ No directory trees printed in chat
- ✅ All `.translation/` operations are silent file I/O
- ✅ Atomic file writes (write to temp, then move)
- ✅ Plan locking mechanism prevents corruption
