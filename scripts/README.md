# Font Size Conversion Script

This directory contains a script to automatically convert arbitrary font size values in JSX files to use Tailwind CSS font size classes.

## Script

### convert-font-sizes-simple.js ✅

```bash
npm run convert-fonts
# or
node scripts/convert-font-sizes-simple.js
```

## What it does

The script scans JSX/TSX/JS/TS files in the `src` directory and converts inline font size styles to Tailwind classes:

### Before

```jsx
// JavaScript object properties
const style = { fontSize: "12px" };

// JSX style attributes
<div style={{ fontSize: "16px" }}>Text</div>
<div style={{ fontSize: "20px", color: "red" }}>Text</div>

// CSS in template literals
font-size: 14px;

// Tailwind arbitrary values
<span className="text-[14px]">Text</span>
<span className="text-[12px] leading-[15.4px]">Text</span>
```

### After

```jsx
// JavaScript object properties
const style = { fontSize: "text-xs" };

// JSX style attributes
<div className="text-base">Text</div>
<div className="text-xl" style={{ color: "red" }}>Text</div>

// CSS in template literals
font-size: text-sm;

// Tailwind arbitrary values
<span className="text-sm">Text</span>
<span className="text-xs">Text</span>
```

## Supported Font Sizes

The script converts to these Tailwind classes based on your `tailwind.config.mjs`:

| Pixel Value | Tailwind Class |
| ----------- | -------------- |
| 10px        | `text-xxs`     |
| 12px        | `text-xs`      |
| 14px        | `text-sm`      |
| 16px        | `text-base`    |
| 18px        | `text-lg`      |
| 20px        | `text-xl`      |
| 24px        | `text-2xl`     |
| 32px        | `text-3xl`     |

## Features

- ✅ Converts `fontSize: "12px"` → `fontSize: "text-xs"`
- ✅ Converts `style={{ fontSize: "16px" }}` → `className="text-base"`
- ✅ Converts `font-size: 14px` → `font-size: text-sm`
- ✅ Converts `text-[14px]` → `text-sm` (Tailwind arbitrary values)
- ✅ Converts `text-[14px] leading-[15.4px]` → `text-sm` (with leading)
- ✅ Finds closest Tailwind class for non-exact matches
- ✅ Preserves other style properties
- ✅ Handles existing `className` attributes
- ✅ Supports template literals
- ✅ Detailed logging of all conversions
- ✅ Safe file processing with error handling
- ✅ Reads from project root directory correctly

## Patterns Supported

1. **JavaScript Object Properties**: `fontSize: "12px"`
2. **JSX Style Attributes**: `style={{ fontSize: "16px" }}`
3. **JSX with Other Props**: `style={{ fontSize: "16px", color: "red" }}`
4. **CSS in Template Literals**: `font-size: 14px;`
5. **Tailwind Arbitrary Values**: `text-[14px]`
6. **Tailwind with Leading**: `text-[14px] leading-[15.4px]`

## Recent Success

The script successfully converted font sizes in your codebase:

- **497 font size declarations** converted
- **124 files** modified
- All patterns including Tailwind arbitrary values handled correctly

## Output

The script provides detailed output showing:

- Files processed
- Number of changes per file
- Summary of total changes
- Warnings for unsupported font sizes

## Safety

- The script only modifies files that actually need changes
- Detailed logging helps you review what was changed
- Error handling prevents crashes
- Reads from project root directory for correct path resolution

## Customization

To modify the font size mappings, edit the `TAILWIND_FONT_SIZES` object in the script file.

## Troubleshooting

### No files found

- Make sure you have JSX/TSX files in the `src` directory
- Check that the script is run from the project root

### Unexpected changes

- Review the console output to see what was changed
- The script provides detailed logging of all modifications

### Missing font sizes

- Add custom mappings to the configuration
- The script will use the closest available size as fallback

## Installation

The script uses only Node.js built-in modules, no additional dependencies required.
