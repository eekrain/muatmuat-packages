Here you go—rewritten as a **Copilot instructions** doc you can drop into `copilot.md` (or `instructions.md`) for Copilot Workspace / Tasks.

---

# Task: Codebase Translation & Refactor to `t()` + CSV & Locale Files

## Objective

Scan a given React component file, extract all **user-facing Indonesian** strings, refactor them to use a custom `t()` function, and produce:

1. a **CSV** catalog of keys and translations (ID → EN → ZH), and
2. merged **JSON locale files** for Indonesian, English, and Chinese.

---

## What to Work On

- **Input:** A single component file (React/TSX/JSX) using Indonesian UI strings.
- **Output:**

  - Refactored component using `t()`
  - `translations.csv`
  - `public/mock-common-id.json`
  - `public/mock-common-en.json`
  - `public/mock-common-cn.json`

---

## Conventions

### Hook & Function

- Import: `import { useTranslation } from "@/hooks/use-translation";`
- Instantiate at top of component: `const { t } = useTranslation();`
- Replace strings with:
  `t("ComponentName.uniqueKey", { placeholders }, "Original Fallback Text")`

  - If no placeholders: pass `{}` or omit.

### Label (Key) Format

- **camelCase** keys with a **ComponentName** prefix.
- Structure: `{ComponentName}.{context}{Section}{Description}`
- Patterns:

  - Error: `{Component}.messageError{Context}{Description}`
  - Form label: `{Component}.label{Component}{Field}`
  - Button: `{Component}.button{Action}{Context}`
  - Nav/Tab: `{Component}.nav{Section}{Item}` / `{Component}.tab{Section}{Name}`
  - Titles/Headings: `{Component}.title{PageOrSection}`
  - General content: `{Component}.{Component}{Section}{Content}`
  - InfoBottomsheet: `{Component}.infoBottomsheet{Component}{Content}`
  - InfoTooltip: `{Component}.infoTooltip{Component}{Content}`

### Placeholders for Dynamic Values

- Detect variables/numbers in strings and replace with named placeholders:

  - `"Kebutuhan: 3 Unit"` → `"Kebutuhan: {number} Unit"`
  - `"Menampilkan 5 dari 20 item"` → `"Menampilkan {current} dari {total} item"`

---

## Scope: What to Extract

Search for **all user-facing Indonesian strings** in:

- **JSX text nodes** (between tags)
- **Component props** that render text (e.g., `title`, `label`, `placeholder`)
- **Runtime strings** that reach the UI (alerts, errors, toasts, confirmations)
- **InfoBottomsheet** HTML content (special handling)
- **InfoTooltip** HTML content (special handling)

---

## Special Handling

### InfoBottomsheet

1. **Minify** inner HTML content into a **single line** string (preserve tags).
2. Generate key: `{Component}.infoBottomsheet{Component}{Content}`.
3. Translate the **HTML string** (ID → EN → ZH) preserving tags.
4. Implement with `render` prop.

**Before**

```jsx
<InfoBottomsheet title="Tipe Muatan yang Akan Dikirimkan">
  <ul>
    <li>
      <b>Panjang :</b> Ukuran terpanjang dari muatan.
    </li>
    <li>
      <b>Lebar :</b> Ukuran terlebar dari muatan.
    </li>
    <li>
      <b>Tinggi :</b> Ukuran tertinggi dari muatan
    </li>
  </ul>
  <p>
    Pengisian dimensi yang tepat akan membantu dalam pengelolaan dan pengiriman.
  </p>
</InfoBottomsheet>
```

**After**

```jsx
<InfoBottomsheet
  title={t(
    "InformasiMuatanScreen.titleCargoTypeDimensions",
    {},
    "Tipe Muatan yang Akan Dikirimkan"
  )}
  render={t(
    "InformasiMuatanScreen.infoBottomsheetCargoTypeDimensions",
    {},
    "<ul><li><b>Panjang :</b> Ukuran terpanjang dari muatan.</li><li><b>Lebar :</b> Ukuran terlebar dari muatan.</li><li><b>Tinggi :</b> Ukuran tertinggi dari muatan</li></ul><p>Pengisian dimensi yang tepat akan membantu dalam pengelolaan dan pengiriman.</p>"
  )}
/>
```

### InfoTooltip

1. **Minify** inner HTML into single line.
2. Key: `{Component}.infoTooltip{Component}{Content}`.
3. Translate HTML (preserve tags).
4. Use `render` prop.

**After**

```jsx
<InfoTooltip
  className="w-[336px]"
  side="right"
  render={t(
    "InformasiMuatanScreen.infoTooltipHalalLogistics",
    {},
    "<p>Centang opsi ini jika pengiriman memerlukan pengelolaan rantai pasok yang memastikan produk tetap sesuai prinsip halal, mulai dari transportasi hingga penyimpanan</p>"
  )}
/>
```

---

## Translations

For **every** processed string (plain or HTML):

- Keep Indonesian (original, with placeholders).
- Provide **English** and **Chinese** translations.
- Preserve HTML tags in HTML strings.
- Preserve placeholder names verbatim across languages.

**Example**

- ID: `"Kebutuhan: {number} Unit"`
- EN: `"Requirement: {number} Unit"`
- ZH: `"需求：{number} 单位"`

---

## CSV Output

Create `translations.csv` with columns:

\| component_name | original_text_indonesian | english_translation | unique_label | chinese_translation |

**Example**

```csv
component_name,original_text_indonesian,english_translation,unique_label,chinese_translation
DetailPesananScreen,Detail Pesanan,Order Details,DetailPesananScreen.titleDetailPesanan,订单详情
DetailPesananScreen,Ringkasan,Summary,DetailPesananScreen.tabRingkasan,摘要
DetailPesananScreen,Informasi Lainnya,Other Information,DetailPesananScreen.tabInformasiLainnya,其他信息
DetailPesananScreen,Detail PIC,PIC Details,DetailPesananScreen.tabDetailPIC,PIC详情
```

---

## Locale Files

Create or merge into:

- `public/mock-common-id.json` (Indonesian)
- `public/mock-common-en.json` (English)
- `public/mock-common-cn.json` (Chinese)

### Rules

1. **Read existing** files if present.
2. **Merge** new keys, **preserve** existing.
3. **No duplicates**.
4. All three files should share the **same set of keys** (values differ by language).

### Example Structures

**`public/mock-common-id.json`**

```json
{
  "InformasiMuatanScreen.titleDetailPesanan": "Detail Pesanan",
  "InformasiMuatanScreen.tabRingkasan": "Ringkasan",
  "InformasiMuatanScreen.tabInformasiLainnya": "Informasi Lainnya",
  "InformasiMuatanScreen.tabDetailPIC": "Detail PIC",
  "InformasiMuatanScreen.titleCargoTypeDimensions": "Tipe Muatan yang Akan Dikirimkan",
  "InformasiMuatanScreen.infoBottomsheetCargoTypeDimensions": "<ul><li><b>Panjang :</b> Ukuran terpanjang dari muatan.</li><li><b>Lebar :</b> Ukuran terlebar dari muatan.</li><li><b>Tinggi :</b> Ukuran tertinggi dari muatan</li></ul><p>Pengisian dimensi yang tepat akan membantu dalam pengelolaan dan pengiriman.</p>",
  "InformasiMuatanScreen.infoTooltipHalalLogistics": "<p>Centang opsi ini jika pengiriman memerlukan pengelolaan rantai pasok yang memastikan produk tetap sesuai prinsip halal, mulai dari transportasi hingga penyimpanan</p>"
}
```

**`public/mock-common-en.json`**

```json
{
  "InformasiMuatanScreen.titleDetailPesanan": "Order Details",
  "InformasiMuatanScreen.tabRingkasan": "Summary",
  "InformasiMuatanScreen.tabInformasiLainnya": "Other Information",
  "InformasiMuatanScreen.tabDetailPIC": "PIC Details",
  "InformasiMuatanScreen.titleCargoTypeDimensions": "Cargo Type to be Shipped",
  "InformasiMuatanScreen.infoBottomsheetCargoTypeDimensions": "<ul><li><b>Length:</b> The longest dimension of the cargo.</li><li><b>Width:</b> The widest dimension of the cargo.</li><li><b>Height:</b> The tallest dimension of the cargo</li></ul><p>Filling in the correct dimensions will help in management and shipping.</p>",
  "InformasiMuatanScreen.infoTooltipHalalLogistics": "<p>Check this option if shipping requires supply chain management that ensures products remain compliant with halal principles, from transportation to storage</p>"
}
```

**`public/mock-common-cn.json`**

```json
{
  "InformasiMuatanScreen.titleDetailPesanan": "订单详情",
  "InformasiMuatanScreen.tabRingkasan": "摘要",
  "InformasiMuatanScreen.tabInformasiLainnya": "其他信息",
  "InformasiMuatanScreen.tabDetailPIC": "PIC详情",
  "InformasiMuatanScreen.titleCargoTypeDimensions": "要运送的货物类型",
  "InformasiMuatanScreen.infoBottomsheetCargoTypeDimensions": "<ul><li><b>长度：</b> 货物的最长尺寸。</li><li><b>宽度：</b> 货物的最宽尺寸。</li><li><b>高度：</b> 货物的最高尺寸</li></ul><p>填写正确的尺寸将有助于管理和运输。</p>",
  "InformasiMuatanScreen.infoTooltipHalalLogistics": "<p>如果运输需要确保产品从运输到储存都符合清真原则的供应链管理，请勾选此选项</p>"
}
```

---

## Step-by-Step Plan

1. **Parse Component**

   - Identify all user-facing Indonesian strings in JSX text nodes, props, and render-path logic.
   - Detect InfoBottomsheet / InfoTooltip blocks and minify their HTML content.

2. **Create Keys**

   - Generate unique, context-aware keys per conventions.
   - Replace dynamic parts with `{placeholders}`.

3. **Refactor to `t()`**

   - Add `useTranslation` import & hook call.
   - Replace strings with `t(key, { placeholders }, "Original")`.
   - Use `render={t(..., "<minified html>")}` for InfoBottomsheet/InfoTooltip.

4. **Translate**

   - Produce EN and ZH for each Indonesian string (preserving placeholders and HTML).

5. **CSV**

   - Write `translations.csv` with required columns and rows for all strings.

6. **Locales**

   - Read/merge into `public/mock-common-id.json`, `public/mock-common-en.json`, `public/mock-common-cn.json`.
   - Ensure keys are aligned across files.

---

## Acceptance Criteria (Definition of Done)

- [ ] All Indonesian UI strings in the input component are replaced with `t()` calls.
- [ ] Keys follow naming conventions and are **prefixed by the component name**.
- [ ] Dynamic values use **named placeholders** consistently across languages.
- [ ] InfoBottomsheet/InfoTooltip HTML content is **minified** and translated, and implemented via `render`.
- [ ] `translations.csv` includes **every** translated string with all required columns.
- [ ] Locale JSON files exist, are merged (no lost keys), have **identical key sets**, and language-appropriate values.
- [ ] The original Indonesian text is preserved as the fallback in each `t()` call.
- [ ] Hook `useTranslation` is imported and instantiated at the top of the component.

---

## Reference Example (Before → After)

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
      <TabsTriggerWithSeparator value="detail-pic" showSeparator={false}>
        Detail PIC
      </TabsTriggerWithSeparator>
    </TabsList>
  </Tabs>
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
      <Tabs className="w-full bg-white" defaultValue={"ringkasan"}>
        <TabsList className="w-full">
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
          <TabsTriggerWithSeparator value="detail-pic" showSeparator={false}>
            {t("DetailPesananScreen.tabDetailPIC", {}, "Detail PIC")}
          </TabsTriggerWithSeparator>
        </TabsList>
      </Tabs>
    </FormResponsiveLayout>
  );
};
```

---

## Best Practices

- Prefer clear placeholder names (e.g., `{count}`, `{number}`, `{total}`).
- Keep labels descriptive and hierarchical to avoid collisions.
- Add `useTranslation()` near other hooks.
- Always use the original Indonesian text as the **fallback** (3rd arg to `t()`).
- For HTML strings, **do not reflow**—keep them **minified** and **tag-safe**.

---

## Notes

- If you encounter existing language files, **do not overwrite**; merge.
- Ensure no **duplicate keys** and maintain **stable ordering** (alphabetical is ok but not required).
- If a value isn’t clearly Indonesian/user-facing, **skip** it.
