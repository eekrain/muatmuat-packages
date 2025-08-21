# Translation Guide for Developers

> **Purpose:** Practical guide for developers to translate pages and components.  
> **Audience:** Frontend developers working on the MuatTrans project  
> **AI Instructions:** See `docs/instructions/translation.md`

## ⚠️ Important: Always Reference AI Instructions

**When asking AI to translate, always use:**

```
"Follow @docs/instructions/translation.md to translate @[file-path]"
```

This ensures different AI agents (Claude, ChatGPT, etc.) follow the same workflow and maintain consistency.

## Quick Start: "I Want to Translate a Page"

### Scenario 1: Single Page Translation

**"I want to translate `/monitoring/page.jsx`"**

```bash
# Step 1: Tell AI to translate the page
"Follow @docs/instructions/translation.md to translate @src/app/transporter/(main)/monitoring/page.jsx"

# AI will:
# - Read the file
# - Add import { useTranslation } from '@/hooks/use-translation'
# - Add const { t } = useTranslation()
# - Wrap all UI text with t() calls

# Step 2: Scan the file to detect t() calls
npm run t scan src/app/transporter/(main)/monitoring/page.jsx

# Output:
# ✅ Found 15 t() calls in page.jsx
# ✅ Added 15 new keys to JSON files

# Step 3: Export keys for translation
npm run t export

# Output:
# ✅ Exported 15 new keys to: translations-needed.json

# Step 4: AI translates the exported file
# (AI reads translations-needed.json and adds EN/CN translations)

# Step 5: Apply translations
npm run t merge translations-needed.json

# Output:
# ✅ Merged 15 translations successfully
# ✅ Cleaned up temporary files
```

### Scenario 2: Page with Components (Deep Translation)

**"I want to translate a page AND all its components"**

```bash
# Step 1: Tell AI to deep translate
"Follow @docs/instructions/translation.md to deep translate @src/container/Shared/Map/MapInterfaceOverlay.jsx"

# AI will:
# - Find all imported components
# - Add t() calls to main file + all components
# - Process: FilterPopover.jsx, LegendButton.jsx, etc.

# Step 2: Scan the entire directory
npm run t scan-dir src/container/Shared/Map/

# Output:
# ✓ MapInterfaceOverlay.jsx - 12 t() calls
# ✓ FilterPopover.jsx - 5 t() calls
# ✓ LegendButton.jsx - 3 t() calls
# ✅ Scan complete! Total: 20 t() calls

# Step 3-5: Same as above (export, translate, merge)
```

## Real Example: Translating the Monitoring Page

### Initial State

```jsx
// src/app/transporter/(main)/monitoring/page.jsx
export default function MonitoringPage() {
  return (
    <div>
      <h1>Daftar Pesanan Aktif</h1>
      <button>Pilih Armada</button>
      <span>Menampilkan 10 pesanan</span>
    </div>
  );
}
```

### After AI Translation (Step 1)

```jsx
import { useTranslation } from "@/hooks/use-translation";

export default function MonitoringPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("MonitoringPage.activeOrders", {}, "Daftar Pesanan Aktif")}</h1>
      <button>{t("MonitoringPage.selectFleet", {}, "Pilih Armada")}</button>
      <span>
        {t(
          "MonitoringPage.showingOrders",
          { count: 10 },
          "Menampilkan 10 pesanan"
        )}
      </span>
    </div>
  );
}
```

### After Running Commands (Steps 2-3)

```json
// translations-needed.json (exported)
{
  "MonitoringPage.activeOrders": {
    "id": "Daftar Pesanan Aktif",
    "en": "",
    "cn": ""
  },
  "MonitoringPage.selectFleet": {
    "id": "Pilih Armada",
    "en": "",
    "cn": ""
  },
  "MonitoringPage.showingOrders": {
    "id": "Menampilkan 10 pesanan",
    "en": "",
    "cn": ""
  }
}
```

### After AI Translation (Step 4)

```json
// translations-needed.json (translated)
{
  "MonitoringPage.activeOrders": {
    "id": "Daftar Pesanan Aktif",
    "en": "Active Orders",
    "cn": "活跃订单"
  },
  "MonitoringPage.selectFleet": {
    "id": "Pilih Armada",
    "en": "Select Fleet",
    "cn": "选择车队"
  },
  "MonitoringPage.showingOrders": {
    "id": "Menampilkan 10 pesanan",
    "en": "Showing 10 orders",
    "cn": "显示10个订单"
  }
}
```

## Common Developer Scenarios

### "I added new text to an already translated component"

```bash
# Just scan that file again
npm run t scan src/components/OrderCard.jsx

# It will only add NEW keys, existing ones are preserved
```

### "I want to check what's not translated yet"

```bash
npm run t validate

# Output:
# ⚠️ Found 3 orphaned t() calls:
#    - OrderCard.newButton in src/components/OrderCard.jsx
# ⚠️ Found 5 keys with missing translations:
#    - MonitoringPage.title (missing: EN, CN)
```

### "I want to see translation progress"

```bash
npm run t status

# Output:
# 📊 Translation Status
# Total Keys: 1173
# English Translations: 1170/1173 (99%)
# Chinese Translations: 1022/1173 (87%)
```

### "I made a typo in a translation key"

```bash
# Option 1: Fix in the code and re-scan
# Change: t('MonitoingPage.title', ...)
# To:     t('MonitoringPage.title', ...)
npm run t scan src/app/transporter/(main)/monitoring/page.jsx

# Option 2: Use validate to find orphaned keys
npm run t validate
# Shows which keys are orphaned (typos)
```

### "I want to translate multiple specific files"

```bash
# List multiple files in one command
npm run t scan src/components/Header.jsx src/components/Footer.jsx src/components/Sidebar.jsx

# Output:
# ✓ Header.jsx - 8 t() calls
# ✓ Footer.jsx - 4 t() calls
# ✓ Sidebar.jsx - 12 t() calls
```

## AI-First Workflow

### ✅ Current Workflow

1. Tell AI: "Follow @docs/instructions/translation.md to translate @[file]"
2. Run: `npm run t scan [file]`
3. Run: `npm run t export`
4. AI translates the exported file
5. Run: `npm run t merge translations-needed.json`

**Time: 5-10 minutes per file with 100% accuracy**

## Tips for Developers

### 1. Always validate after big changes

```bash
npm run t validate
```

### 2. Use scan-dir for feature folders

```bash
# Instead of scanning files one by one
npm run t scan-dir src/features/orders/
```

### 3. Check before committing

```bash
# Make sure no orphaned t() calls
npm run t validate

# If found, scan those files
npm run t scan [file-with-orphaned-calls]
```

### 4. Keep translations consistent

Use the same terms across the app:

- "Armada" → "Fleet" (not "Vehicle Group")
- "Pesanan" → "Order" (not "Booking")
- "Driver" → "Driver" (not "Chauffeur")

## Troubleshooting

### "No t() calls found"

**Cause:** AI hasn't added t() calls yet
**Fix:** Ask AI to translate the file first

### "Key already exists with different value"

**Cause:** Same key used for different text
**Fix:** Use more specific keys (OrderCard.saveButton vs Form.saveButton)

### "Translations not showing"

**Check:**

1. Did you run `npm run t merge`?
2. Is the language switcher working?
3. Check browser console for errors

### "Export says no new keys"

**Cause:** No new t() calls since last export
**Fix:**

1. Make sure AI added t() calls
2. Run `npm run t scan` on your files
3. Then try export again

## Complete Example: New Feature

**Scenario:** "I'm building a new Reports feature"

```bash
# 1. Build your feature UI first
# Create: src/app/transporter/(main)/reports/page.jsx

# 2. When UI is ready, translate everything
"Follow @docs/instructions/translation.md to deep translate @src/app/transporter/(main)/reports/"

# 3. Scan the entire feature
npm run t scan-dir src/app/transporter/(main)/reports/

# Output: ✅ Found 45 t() calls in 5 files

# 4. Export all at once
npm run t export

# 5. AI translates (or send to translation team)

# 6. Apply all translations
npm run t merge translations-needed.json

# Done! Your feature is now multi-language ready
```

## Quick Reference Card

```bash
# Single file
AI: "Follow @docs/instructions/translation.md to translate @[file]"
npm run t scan [file]
npm run t export
npm run t merge translations-needed.json

# Multiple files with imports
AI: "Follow @docs/instructions/translation.md to deep translate @[file]"
npm run t scan-dir [directory]
npm run t export
npm run t merge translations-needed.json

# Check status
npm run t status      # Overall progress
npm run t validate    # Find issues

# Clean up
npm run t cleanup     # Remove temp files
npm run t remove-duplicates  # Remove duplicate keys
```

Remember: **AI detects, Script manages!**
