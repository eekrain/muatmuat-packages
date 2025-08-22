---
applyTo: "**"
---

# AI Agent Playbook: Automated Code Translation (Definitive Version v3)

## 1\. Primary Objective

Your mission is to act as an **automated translation engineer**. You will be given a file path and a scope ("single file" or "deep"). Your primary goal is to create a plan, refactor the necessary components, and orchestrate a CLI tool by outputting the correct commands to complete the translation and reporting process.

## 2\. Critical Rules of Engagement

- **Focus on Translation Only**: Your **sole focus** is the translation workflow. You **must not** suggest commands for running dev servers, testing, etc.
- **Follow the Plan**: For "deep translate" tasks, you **must** create a plan and follow it.
- **Detect All Dynamic Content**: Your accuracy in identifying dynamic values is critical. You **must** be extremely sensitive in finding names, numbers, dates, and IDs by following the detailed patterns in the Appendix. **Never hardcode them.**
- **Avoid Redundancy**: You **must** recognize and skip strings that are already inside a `t()` function or are clearly translation keys themselves.
- **Refer to the Guide**: For all refactoring tasks, you must adhere to the rules outlined in the **"Appendix: Detailed Refactoring Guide"** at the end of this document.

## 3\. The Workflow: Planning and Execution

### **Phase 1: Planning (for "Deep Translate" Only)**

If the user requests a "deep translate," you **must** start with this planning phase.

- **Your Action:**
  1.  Analyze the imports of the main file to create a list of all files that need refactoring, based on the **Dependency Analysis Rules**.
- **Your Output:** A Markdown block containing your **Translation Plan & Checklist**.

#### Dependency Analysis Rules

- ✅ **INCLUDE for Translation:**
  - The main file itself.
  - Components imported using a **relative path** (e.g., `./components/OrderHeader.jsx`).
  - Enum files (`.enum.js`) used by the included files.
- ❌ **EXCLUDE from Translation:**
  - Components imported from the shared components directory (e.g., `src/components/Button.jsx`).
  - Non-component imports like hooks, utilities, services, or external libraries.

### **Phase 2: Execution**

#### **Step 1: Refactor Code from Checklist**

- **Your Action**: For each file in your plan (or the single file requested), perform the full refactoring process according to the **Appendix**.
- **Your Output**: The full, refactored code for **one file at a time**, followed by the updated checklist (if in a plan).

#### **Step 2: Output the Scan Command**

- **Your Action**: Once all files are refactored, output the correct scan command.
- **Your Output**: A single `npm run t` command.

#### **Steps 3-7: Finalization**

You will then proceed by outputting the commands for `export`, `translating the JSON`, `merge`, `report`, and a `final confirmation` in sequence.

---

## Appendix: Detailed Refactoring Guide

You must follow these rules when modifying any file.

### **A. Key Generation**

- **Convention**: `ComponentName.description` or `fileNameEnum.KeyName`.
- **Format**: The part after the dot should be camelCase (e.g., `needAssignFleet`).

### **B. Critical Rule: Detecting and Handling Dynamic Values**

This is one of your most important tasks. You must meticulously scan every string for parts that are likely to change. Use the following patterns to identify them.

#### 🕵️‍♀️ Pattern Recognition Guide for Indonesian Strings

| Category                  | Pattern                                                                                        | Example String (Before)               | Processed Text (with Placeholder)           |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------- |
| **👤 Names**              | Capitalized words/phrases after a label or greeting.                                           | `"Selamat datang, Budi Santoso"`      | `"Selamat datang, {userName}"`              |
|                           |                                                                                                | `"Driver: Siti Aminah"`               | `"Driver: {driverName}"`                    |
| **🔢 Numbers & Currency** | Any digits, especially with units (`km`, `kg`) or currency (`Rp`).                             | `"Estimasi 172 km"`                   | `"Estimasi {distance} km"`                  |
|                           |                                                                                                | `"Harga: Rp50.000"`                   | `"Harga: {price}"`                          |
|                           | Phrases indicating a count or range.                                                           | `"Menampilkan 5 dari 20 item"`        | `"Menampilkan {current} dari {total} item"` |
| **🗓️ Dates & Times**      | Strings with Indonesian months (`Januari`, `Agustus`, etc.) or date formats like `DD/MM/YYYY`. | `"Dibuat pada 22 Agustus 2025"`       | `"Dibuat pada {date}"`                      |
|                           |                                                                                                | `"Update terakhir: 15/01/2024 15:30"` | `"Update terakhir: {datetime}"`             |
| **🆔 Unique IDs**         | Alphanumeric codes, order numbers, license plates.                                             | `"No. Pesanan: #ABC-123-XYZ"`         | `"No. Pesanan: {orderNumber}"`              |
|                           |                                                                                                | `"No. Polisi: L 1234 AB"`             | `"No. Polisi: {licensePlate}"`              |

### **C. Special Component: `InfoBottomsheet` / `InfoTooltip`**

- Identify rich HTML content, minify it into a single-line string, and use the `render` prop.
- **Example**: `<InfoTooltip render={t("MyComponent.infoData", {}, "<p><b>Penting:</b> Data sudah benar.</p>")} />`

### **D. Special Case: Enum-like Objects (`.enum.js`)**

1.  **Refactor the Enum File**: Replace string values with translation keys (e.g., `NEED_ASSIGN_FLEET: "orderStatusEnum.needAssignFleet"`).
2.  **Update the Consuming Component**: Wrap the enum lookup in the `t()` function (e.g., `<Badge>{t(OrderStatusEnum[status])}</Badge>`).

### **E. What to Skip: Identifying Already Translated Content**

#### **Rule 1: Content Inside Existing `t()` Functions**

Do not re-translate any string that is already a parameter within a `t()` function. It is already handled.

#### **Rule 2: Values That Are Already Translation Keys**

Do not translate string values that are formatted like programmatic keys (e.g., `camelCase`, no spaces). They are already part of the system.

- **Example to SKIP**:
  ```javascript
  // The values here are keys, NOT Indonesian phrases. Leave this file alone.
  export const StatusMap = {
    CONFIRMED_CHANGES: "statusPesananTerkonfirmasi",
    FLEET_CHANGE: "statusPergantianArmada",
  };
  ```
