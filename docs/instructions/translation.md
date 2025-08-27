# Translation Instructions for AI Agents

> **Purpose:** This document guides AI agents on how to translate components.  
> **Audience:** AI assistants (Claude, etc.)  
> **Developer Guide:** See `docs/guides/translation.md`

## 🚫 CRITICAL RESTRICTION

**NEVER read or write to mock-common files directly:**

- ❌ `public/mock-common-id.json`
- ❌ `public/mock-common-en.json`
- ❌ `public/mock-common-cn.json`

**Only use:** ✅ `translations-needed.json` (small export file)

---

## Quick Usage - Decision Tree

### User Says: "Translate @[page-path]"

→ Execute **Single Component Translation** (Option A)
→ Translate ONLY the specified file

### User Says: "Deep translate @[page-path]" or "Translate with imports"

→ Execute **Deep Translation** (Option B)  
→ Translate the file AND all its imported components

### User Says: "Follow translation instructions for @[page-path]"

→ Default to **Single Component Translation** unless context suggests otherwise

### For Developers

**See the developer guide:** `docs/guides/translation.md`

- Real examples with actual commands
- Common scenarios and solutions
- Step-by-step workflows

## Translation Workflow Options

### Option A: Single Component Translation

Translate only the specified component.
**Trigger:** "Translate @[page-path]"

### Option B: Deep Translation (With All Imports)

Translate the component AND all its imported components recursively.
**Trigger:** "Deep translate @[page-path]" or "Translate with imports @[page-path]"

## Deep Translation Workflow (Complete Component Tree)

When user requests deep translation, follow these steps:

### Step 1: Build Component Dependency Tree

```javascript
// Example: For DaftarPesananAktif.jsx
Main Component: src/container/Transporter/Monitoring/DaftarPesananAktif/DaftarPesananAktif.jsx
├── Local Imports (ALWAYS translate):
│   └── ../Onboarding/Onboarding.jsx
├── Project Components (TRANSLATE if UI component):
│   ├── @/components/Button/Button.jsx
│   ├── @/components/Badge/BadgeStatus.jsx
│   ├── @/components/Search/Search.jsx
│   ├── @/components/Table/Table.jsx
│   └── @/container/Shared/OrderModal/* (various modals)
└── Skip (libraries/hooksutils):
    ├── react, next/navigation (external libraries)
    ├── @/hooks/use-translation (hooks)
    ├── @/lib/toast, @/lib/utils (utilities)
    └── @/services/*, @/utils/* (services/utils)
```

### Step 2: Determine What to Translate

**ALWAYS Translate:**

- Main component
- Local relative imports (./components/\*, ../Onboarding/\*, ../components/\*, etc.)
- UI components from @/components/\* that render text
- Container components from @/container/\*

**SKIP Translation:**

- External libraries (react, lucide-react, etc.)
- Hooks (@/hooks/\*)
- Utils/lib (@/lib/_, @/utils/_)
- Services (@/services/\*)
- Pure icon/image components without text

### Step 3: Process Components in Order

```bash
# Process order (deepest first):
1. Leaf components (no local imports)
2. Components that import leaves
3. Main component last

# This ensures all child translations exist before parent
```

### Step 4: AI Processing for Each Component

For each component in the tree:

1. **Read the component file**
2. **Identify ALL translatable strings:**
   - Static text in JSX
   - Button labels
   - Placeholders
   - Tooltips
   - Error messages
   - Conditional text
   - Array items with text
3. **Add useTranslation hook and t() calls**
4. **Use consistent key naming:**
   ```javascript
   // Component-specific keys
   FilterPopover.title;
   FilterPopover.applyButton;
   FilterPopover.clearButton;
   ```

### Step 5: Batch Process All Files

After processing all components:

```bash
# List all modified files
modified_files="
  src/container/Shared/Map/MapInterfaceOverlay.jsx
  src/container/Shared/Map/components/FilterPopover.jsx
  src/container/Shared/Map/components/LegendButton.jsx
  src/container/Shared/Map/components/SearchWithSuggestions.jsx
"

# Scan multiple files at once
npm run t scan file1.jsx file2.jsx file3.jsx

# OR scan the directory if all in same folder
npm run t scan-dir src/container/Shared/Map/
```

### Step 6: Export and Translate

```bash
npm run t export
# Now translations-needed.json has ALL keys from ALL components
```

### Step 7: Complete Translation

AI translates all keys with awareness of component relationships.

### Step 8: Apply All Translations

```bash
npm run t merge translations-needed.json
```

## The AI-First Translation Workflow (Recommended)

This workflow uses AI for perfect UI detection and the script for JSON management only.

### 1. Analyze the Component

Read the file and identify ALL translatable UI strings:

- Button labels
- Tooltips
- Placeholders
- Error messages
- Status texts
- Navigation items
- Any user-facing text

**⚠️ Critical Check:** Ensure the component imports `useTranslation`:

```javascript
// ✅ Required import - add if missing
import { useTranslation } from "@/hooks/use-translation";

// ✅ Required hook usage - add if missing
const { t } = useTranslation();
```

**Common missing patterns:**

- Components without any translation imports
- Components with hardcoded strings throughout
- Constants defined outside component scope

### 2. Add Translation Support Manually

Add the useTranslation hook and wrap all UI strings with t() calls:

```javascript
// Add import
import { useTranslation } from "@/hooks/use-translation";

// Inside component
const { t } = useTranslation();

// Wrap UI strings
<button>{t("ComponentName.buttonLabel", {}, "Original Text")}</button>;
```

### 2.1. Special Case: Constants Outside Component

**Problem:** Constants defined outside the component cannot access the `useTranslation` hook.

**Solution:** Move constants inside the component where they can access the `t` function.

```javascript
// ❌ WRONG - Constants outside component
const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard" }, // Can't use t() here
];

const MyComponent = () => {
  const { t } = useTranslation();
  // Constants are already defined above, can't use t()
};

// ✅ CORRECT - Move constants inside component
const MyComponent = () => {
  const { t } = useTranslation();

  // Move constants inside where t() is available
  const MENU_ITEMS = [
    {
      label: t('MyComponent.dashboard', {}, 'Dashboard'),
      href: "/dashboard"
    },
  ];

  // Now you can use MENU_ITEMS with translations
};
```

**When to apply this:**

- Navigation menus with labels
- Button configurations
- Dropdown options
- Any constant arrays/objects containing translatable text
- Map/UI control configurations
- Form field definitions

**Alternative (if constants must stay global):**
Create factory functions that accept the `t` function:

```javascript
// Factory function approach
const createMenuItems = (t) => [
  { label: t("MyComponent.dashboard", {}, "Dashboard"), href: "/dashboard" },
];

const MyComponent = () => {
  const { t } = useTranslation();
  const MENU_ITEMS = createMenuItems(t);
};
```

### 2.2. Special Case: Dynamic/Conditional Text

**Problem:** Text that changes based on conditions or contains variables.

**Solution:** Handle each pattern appropriately with t() calls.

```javascript
// ❌ WRONG - Conditional text without translation
const tooltip = isFullscreen ? "Kecilkan" : "Besarkan";

// ✅ CORRECT - Translate each condition separately
const tooltip = isFullscreen
  ? t('MapInterface.minimize', {}, 'Kecilkan')
  : t('MapInterface.maximize', {}, 'Besarkan');

// ❌ WRONG - Template literal without translation
const message = `SOS (${count})`;

// ✅ CORRECT - Use translation with interpolation
// Note: Template literals in fallback are OK, script will convert ${} to {}
const message = count > 0
  ? t('MapInterface.sosWithCount', { count }, `SOS (${count})`)
  : t('MapInterface.sosHistory', {}, 'Riwayat SOS');

// ❌ WRONG - Mixed conditional with template literal
const text = active > 0 ? `SOS (${active})` : "Riwayat SOS";

// ✅ CORRECT - Separate translations for each case
const text = active > 0
  ? t('MapInterface.sosActive', { count: active }, `SOS (${active})`)
  : t('MapInterface.sosHistory', {}, 'Riwayat SOS');
```

**Patterns to handle:**

- Conditional text (ternary operators)
- Template literals with variables
- Dynamic button labels
- Status messages with counts
- Pluralization scenarios

### 2.3. Special Case: Arrays with Mixed Content

**Problem:** Arrays containing both translatable and non-translatable properties.

**Solution:** Only translate the translatable properties, leave others as-is.

```javascript
// ❌ WRONG - Trying to translate everything
const controls = [
  {
    icon: t('icon.path'), // Don't translate paths!
    tooltip: "Zoom In",
    onClick: t('handler'), // Don't translate functions!
  }
];

// ✅ CORRECT - Only translate user-facing text
const controls = [
  {
    icon: "/icons/zoom-in.svg", // ✅ Keep as-is
    tooltip: t('MapControls.zoomIn', {}, 'Zoom In'), // ✅ Translate this
    onClick: handleZoomIn, // ✅ Keep as-is
  }
];
```

**What to translate in objects:**

- `label`, `title`, `tooltip` - ✅ Translate
- `placeholder`, `errorMessage` - ✅ Translate
- `description`, `helperText` - ✅ Translate
- `icon`, `href`, `onClick` - ❌ Don't translate
- `id`, `key`, `className` - ❌ Don't translate

### 3. Update JSON Files with Script

After manually adding all t() calls, let the script detect them and update JSON:

```bash
npm run t scan [file-path]
```

This will:

- Detect all t() calls you added
- Create translation keys in all JSON files
- Track new keys in session

### 4. Export New Keys Only

```bash
npm run t export
```

Creates `translations-needed.json` with ONLY the new keys.

### 5. Translate the Exported Keys

Read `translations-needed.json` and provide proper English and Chinese translations:

```javascript
{
  "ComponentName.buttonLabel": {
    "id": "Tombol Aksi",
    "en": "Action Button",  // Add proper English
    "cn": "操作按钮"          // Add proper Chinese
  }
}
```

### 6. Apply Translations

```bash
npm run t merge translations-needed.json
```

---

## Enhanced Script Commands

### Core Workflow Commands

```bash
npm run t scan <path>         # Scan for t() calls and update JSON (no code changes)
npm run t export              # Export new keys for translation
npm run t merge <file>        # Merge translated keys back
```

### Utility Commands

```bash
npm run t validate [path]     # Check for orphaned/missing translations
npm run t cleanup             # Remove temporary files
npm run t status              # Show translation status
npm run t remove-duplicates   # Remove duplicate keys from all mock files
```

---

## Complete Example: Deep Translation of MapInterfaceOverlay

### When User Says:

> "Deep translate @src/container/Shared/Map/MapInterfaceOverlay.jsx"

### AI Should:

#### 1. First, identify all imports:

```javascript
// Read MapInterfaceOverlay.jsx and find:
// ✅ Translate
import Button from "@/components/Button/Button";
// ✅ Check for text
import { InfoTooltip } from "@/components/Form/InfoTooltip";
// ✅ Check for text
import IconComponent from "@/components/IconComponent";

// ❌ Skip (icon only)
import { useAuth } from "@/hooks/use-auth";

// ❌ Skip (hook)
import { cn } from "@/lib/utils";

import { FilterPopover } from "./components/FilterPopover";
// ✅ Translate
import { LegendButton } from "./components/LegendButton";
// ✅ Translate
import { SearchWithSuggestions } from "./components/Search";

// ✅ Translate

// ❌ Skip (utility)
```

#### 2. Process each component (deepest first):

```bash
# Order of processing:
1. Onboarding.jsx (no local imports)
2. Button.jsx, Badge.jsx, Search.jsx, Table.jsx (if have translatable text)
3. OrderModal components (if have translatable text)
4. DaftarPesananAktif.jsx (imports all above)
```

#### 3. For each file, add translations:

```javascript
// FilterPopover.jsx
import { useTranslation } from "@/hooks/use-translation";

export const FilterPopover = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("FilterPopover.title", {}, "Filter Armada")}</h3>
      <button>{t("FilterPopover.apply", {}, "Terapkan")}</button>
      <button>{t("FilterPopover.clear", {}, "Hapus Filter")}</button>
    </div>
  );
};
```

#### 4. After all files are processed:

```bash
# Run batch scan
npm run t scan-dir src/container/Shared/Map/

# Output:
✅ Found 12 t() calls in MapInterfaceOverlay.jsx
✅ Found 5 t() calls in FilterPopover.jsx
✅ Found 3 t() calls in LegendButton.jsx
✅ Found 2 t() calls in SearchWithSuggestions.jsx
✅ Total: 22 new keys added to session
```

#### 5. Export and see all keys:

```bash
npm run t export

# translations-needed.json will contain:
{
  "MapInterfaceOverlay.minimize": { "id": "Kecilkan", "en": "", "cn": "" },
  "MapInterfaceOverlay.maximize": { "id": "Besarkan", "en": "", "cn": "" },
  "FilterPopover.title": { "id": "Filter Armada", "en": "", "cn": "" },
  "FilterPopover.apply": { "id": "Terapkan", "en": "", "cn": "" },
  "LegendButton.tooltip": { "id": "Legenda", "en": "", "cn": "" },
  // ... all 22 keys from all components
}
```

## Complete Example: MapInterfaceOverlay

### Step 1: AI identifies all UI strings

```
Found:
- "Kecilkan" / "Besarkan" (tooltip)
- "Pusatkan" (tooltip)
- "Zoom In" / "Zoom Out" (tooltip)
- "Data Tidak Ditemukan" (message)
- "Kembali" / "Daftar Armada" (button)
- "Cari No. Polisi / Nama Driver" (placeholder)
- "Riwayat SOS" / "SOS" (button)
- "No. Polisi" (toggle label)
```

### Step 2: AI adds t() calls manually

```javascript
import { useTranslation } from '@/hooks/use-translation';

export const MapInterfaceOverlay = ({ ... }) => {
  const { t } = useTranslation();

  // In tooltip
  tooltip: isFullscreen
    ? t('MapInterfaceOverlay.minimize', {}, 'Kecilkan')
    : t('MapInterfaceOverlay.maximize', {}, 'Besarkan'),

  // In button
  {showPilihArmada
    ? t('MapInterfaceOverlay.back', {}, 'Kembali')
    : t('MapInterfaceOverlay.fleetList', {}, 'Daftar Armada')}
```

### Step 3: Use script to update JSON

```bash
npm run t scan src/container/Shared/Map/MapInterfaceOverlay.jsx
```

### Step 4-6: Export, translate, merge

```bash
npm run t export
# AI translates the file
npm run t merge translations-needed.json
```

---

## Translation Guidelines

### Key Naming Convention

```
ComponentName.elementType
```

Examples:

- `MapInterfaceOverlay.minimize` (action)
- `MapInterfaceOverlay.searchPlaceholder` (placeholder)
- `MapInterfaceOverlay.dataNotFound` (message)
- `MapInterfaceOverlay.fleetList` (label)

### Quality Over Literal Translation

- "Daftar Pesanan Aktif" → "Active Orders" ✅ (not "List Order Active" ❌)
- "Pilih Armada" → "Select Fleet" ✅ (not "Choose Armada" ❌)

### Common Terms (Keep Consistent)

| Indonesian | English          | Chinese  |
| ---------- | ---------------- | -------- |
| Armada     | Fleet            | 车队     |
| Pesanan    | Order            | 订单     |
| Muat       | Load/Loading     | 装货     |
| Bongkar    | Unload/Unloading | 卸货     |
| Driver     | Driver           | 司机     |
| Lokasi     | Location         | 位置     |
| Jadwal     | Schedule         | 时间表   |
| Status     | Status           | 状态     |
| Cari       | Search           | 搜索     |
| Tambah     | Add              | 添加     |
| Simpan     | Save             | 保存     |
| Batal      | Cancel           | 取消     |
| Lihat      | View             | 查看     |
| Detail     | Details          | 详情     |
| Gagal      | Failed           | 失败     |
| Berhasil   | Success          | 成功     |
| Tersedia   | Available        | 可用     |
| Aktif      | Active           | 活跃     |
| Selesai    | Completed        | 完成     |
| Menunggu   | Waiting          | 等待     |
| Konfirmasi | Confirm          | 确认     |
| Pusatkan   | Center           | 居中     |
| Perbesar   | Zoom In          | 放大     |
| Perkecil   | Zoom Out         | 缩小     |
| Kecilkan   | Minimize         | 最小化   |
| Besarkan   | Maximize         | 最大化   |
| Riwayat    | History          | 历史记录 |
| No. Polisi | License Plate    | 车牌号   |

---

## Why This Workflow?

### AI Handles (What it does best):

✅ Perfect UI string detection
✅ Understanding context and conditionals
✅ Complex JSX patterns
✅ Dynamic content
✅ Providing quality translations

### Script Handles (What it does best):

✅ JSON file management
✅ Key consistency
✅ Session tracking
✅ Bulk operations
✅ Merge operations

### Benefits:

- 100% UI string coverage
- No missed translations
- Consistent key format
- Minimal token usage
- Fast and accurate

---

## Troubleshooting

### Issue: Script says "No t() calls found"

**Cause:** You haven't added t() calls yet
**Fix:** Make sure to add t() calls manually first, then run `npm run t scan`

### Issue: Keys not showing in export

**Cause:** Script didn't detect your t() calls
**Fix:** Check t() call format matches: `t('Component.key', {}, 'fallback')`

### Issue: Merge shows "0 translations merged"

**Cause:** EN/CN fields are empty in translations-needed.json
**Fix:** Fill in the English and Chinese translations before merging

### Issue: Variables showing as "${variable}" in UI

**Cause:** Template literal syntax not converted to i18n syntax
**Fix:** The script automatically converts `${variable}` to `{variable}` in JSON files. If this didn't happen:

1. Make sure you're using the latest translate script
2. Re-scan the file: `npm run t scan [file-path]`
3. Check that fallback text in t() calls uses proper syntax

---

## Quick Reference

```bash
# AI-First Workflow
1. AI reads file and identifies UI strings
2. AI adds useTranslation hook and t() calls
3. npm run t scan <file>         # Update JSON files
4. npm run t export              # Export new keys only
5. AI translates exported file
6. npm run t merge translations-needed.json  # Apply translations

# Validation
npm run t validate              # Check for issues
npm run t status                # Show progress
```

Simple workflow, perfect detection!
