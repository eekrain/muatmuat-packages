# Translation Scanner Documentation

This document explains how to use the translation scanning scripts to identify files that need `useTranslation` implementation.

## Available Scripts

### 1. Full Scan (`npm run scan:untranslated`)

Performs a comprehensive scan of all pages, components, and containers to identify translation implementation status.

```bash
npm run scan:untranslated
```

**Features:**

- Scans `src/app` (excluding API routes), `src/components`, and `src/container` directories
- Categorizes files into: untranslated, partially translated, fully translated
- Generates simplified JSON reports in `.translation/scan-results/`
- Shows examples of translatable content found
- Automatically excludes API routes (`src/app/api`) since they don't contain UI components

**Output includes:**

- Summary statistics and percentages
- Simplified list of files requiring translation with priority levels
- Files that are partially implemented
- Top 20 highest priority files

### 2. Quick Scan (`npm run scan:quick`)

Performs a focused scan with priority-based results, ideal for daily workflow.

```bash
# Scan all directories (quick overview)
npm run scan:quick

# Scan specific directory
npm run scan:quick src/app/transporter
npm run scan:quick src/components/Form
npm run scan:quick src/container/Shipper
```

**Features:**

- Focuses on high-priority untranslated files
- Shows actionable next steps
- Sorts files by amount of translatable content
- Minimal output for quick decision making

### 3. Additional Options

```bash
# Show help
npm run scan:untranslated -- --help
npm run scan:quick -- --help

# Full scan with action plan
npm run scan:untranslated -- --action-plan

# JSON-only output (minimal console)
npm run scan:untranslated -- --json-only
```

## Understanding the Results

### File Categories

1. **🔴 Untranslated Files**

   - Contains translatable Indonesian text
   - Missing `useTranslation` import/hook
   - No `t()` function calls
   - **Priority**: High - needs immediate attention

2. **🟡 Partially Translated Files**

   - Has some translation implementation
   - May be missing import, hook usage, or t() calls
   - **Priority**: Medium - needs completion

3. **🟢 Fully Translated Files**

   - Has `useTranslation` import
   - Uses the hook correctly
   - Contains `t()` function calls
   - **Priority**: Low - review for completeness

4. **⚪ No Translatable Content**
   - Utility files, hooks, or components without UI text
   - **Priority**: None - can be ignored

### Translatable Content Patterns

The scanner detects:

- Indonesian text in JSX elements (`>Text<`)
- Common Indonesian words in strings
- Form labels, placeholders, and titles
- Button text and UI labels
- Toast/alert messages
- HTML content in component props

### Excluded Directories

The scanner automatically skips:

- `src/app/api` - API routes don't contain UI components
- `node_modules` - Third-party packages
- `.next`, `dist`, `build` - Build output directories
- Hidden directories (starting with `.`)

## Workflow Integration

### Daily Development Workflow

1. **Before starting work on a component:**

   ```bash
   npm run scan:quick src/components/YourComponent
   ```

2. **Check specific feature directory:**

   ```bash
   npm run scan:quick src/app/transporter/monitoring
   ```

3. **Weekly translation audit:**
   ```bash
   npm run scan:untranslated
   ```

### Working with Results

#### For Untranslated Files

1. **Add translation imports:**

   ```jsx
   import { useTranslation } from "@/hooks/use-translation";
   ```

2. **Add hook usage:**

   ```jsx
   const { t } = useTranslation();
   ```

3. **Wrap translatable strings:**

   ```jsx
   // Before
   <button>Simpan Data</button>

   // After
   <button>{t('ComponentName.saveData', {}, 'Simpan Data')}</button>
   ```

4. **Use existing translation tools:**
   ```bash
   npm run t scan path/to/your/file.jsx
   npm run t export
   npm run t status
   ```

#### For Partially Translated Files

1. **Check what's missing:**

   - Look for the specific issues in scan results
   - Add missing imports/hooks
   - Complete remaining `t()` calls

2. **Verify implementation:**
   ```bash
   npm run t scan path/to/your/file.jsx
   ```

## Output Files

### Simplified Scan Results (`.translation/scan-results/`)

The scanner now creates simplified, organized output:

- **`latest.json`** - Always contains the most recent scan results
- **`scan-YYYY-MM-DD_HH-MM-SS.json`** - Timestamped historical results

**Simplified structure includes:**

- Summary statistics
- Untranslated files with priority levels (high/medium/low/very-low)
- Partially translated files with specific missing components
- Top 20 highest priority files for immediate attention

### Usage in CI/CD

You can integrate these scripts into your CI/CD pipeline:

```bash
# In your CI script
npm run scan:untranslated -- --json-only

# Check if untranslated files exist
if [ $(jq '.summary.untranslated' .translation/scan-results/latest.json) -gt 0 ]; then
  echo "Warning: Untranslated files found"
  # Could fail the build or create a PR comment
fi

# Get high priority files count
HIGH_PRIORITY=$(jq '.untranslated | map(select(.priority == "high")) | length' .translation/scan-results/latest.json)
echo "High priority files: $HIGH_PRIORITY"
```

## Troubleshooting

### Common Issues

1. **"No translatable content found" but file has Indonesian text:**

   - The patterns might not catch your specific text format
   - Check if text is in complex JSX structures
   - Manually verify and add to exceptions if needed

2. **False positives in scanning:**

   - Some utility files might be flagged incorrectly
   - Check the file manually to confirm
   - Consider adding file exclusions

3. **Missing t() calls not detected:**
   - The script looks for specific patterns
   - Some complex dynamic content might be missed
   - Always do manual review after scanning

### Getting Help

1. **Check script help:**

   ```bash
   npm run scan:untranslated -- --help
   npm run scan:quick -- --help
   ```

2. **Review existing translation workflow:**

   ```bash
   npm run t help
   ```

3. **Check implementation examples:**
   - Look at existing translated components
   - Review translation documentation in `docs/`

## Best Practices

1. **Regular Scanning:**

   - Run quick scans before committing changes
   - Include translation status in PR descriptions

2. **Prioritize by Impact:**

   - Start with user-facing pages (src/app)
   - Then commonly used components
   - Finally, admin/internal tools

3. **Batch Processing:**

   - Group similar components for translation
   - Use the existing translation export/import workflow
   - Coordinate with translation team for efficiency

4. **Quality Assurance:**
   - Always test translated components
   - Verify dynamic content renders correctly
   - Check for layout issues with longer translations
