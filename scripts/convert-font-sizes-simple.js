#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Font sizes from your Tailwind config
const TAILWIND_FONT_SIZES = {
  "10px": "text-xxs",
  "12px": "text-xs",
  "14px": "text-sm",
  "16px": "text-base",
  "18px": "text-lg",
  "20px": "text-xl",
  "24px": "text-2xl",
  "32px": "text-3xl",
  // Default Tailwind sizes
  "36px": "text-4xl",
  "48px": "text-5xl",
  "60px": "text-6xl",
  "72px": "text-7xl",
  "96px": "text-8xl",
  "128px": "text-9xl",
};

// Function to find the closest Tailwind font size
function findClosestFontSize(pxValue) {
  const px = parseInt(pxValue);
  const availableSizes = Object.keys(TAILWIND_FONT_SIZES).map((size) =>
    parseInt(size)
  );

  // Find the closest size
  let closest = availableSizes[0];
  let minDiff = Math.abs(px - closest);

  for (const size of availableSizes) {
    const diff = Math.abs(px - size);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }

  return `${closest}px`;
}

// Function to recursively find JSX files
function findJSXFiles(dir = "src") {
  const files = [];

  // Get the project root directory (where package.json is located)
  const projectRoot = path.resolve(__dirname, "..");
  const srcPath = path.join(projectRoot, dir);

  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules, .next, dist, etc.
          if (
            !item.startsWith(".") &&
            item !== "node_modules" &&
            item !== ".next" &&
            item !== "dist"
          ) {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          // Check if it's a JSX/TSX/JS/TS file
          const ext = path.extname(item).toLowerCase();
          if ([".jsx", ".tsx", ".js", ".ts"].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(
        `Warning: Could not read directory ${currentDir}: ${error.message}`
      );
    }
  }

  scanDirectory(srcPath);
  return files;
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    let modifiedContent = content;
    let changes = 0;

    console.log(`\n📁 Processing: ${filePath}`);

    // Pattern 1: fontSize in JavaScript object properties
    // Example: fontSize: "12px"
    const fontSizePattern = /fontSize:\s*["']?(\d+px)["']?/g;
    const fontSizeMatches = modifiedContent.match(fontSizePattern);

    if (fontSizeMatches) {
      console.log(`  Found ${fontSizeMatches.length} fontSize declarations`);

      modifiedContent = modifiedContent.replace(
        fontSizePattern,
        (match, fontSize) => {
          const tailwindClass = TAILWIND_FONT_SIZES[fontSize];
          if (tailwindClass) {
            console.log(`    Converting ${fontSize} to ${tailwindClass}`);
            changes++;
            return `fontSize: "${tailwindClass}"`;
          } else {
            const closestSize = findClosestFontSize(fontSize);
            const closestClass = TAILWIND_FONT_SIZES[closestSize];
            console.log(
              `    Converting ${fontSize} to closest match: ${closestSize} (${closestClass})`
            );
            changes++;
            return `fontSize: "${closestClass}"`;
          }
        }
      );
    }

    // Pattern 2: fontSize in JSX style attributes
    // Example: style={{ fontSize: "16px" }}
    const jsxFontSizePattern =
      /style\s*=\s*{\s*{\s*fontSize\s*:\s*["']?(\d+px)["']?([^}]*)\s*}\s*}/g;
    const jsxMatches = modifiedContent.match(jsxFontSizePattern);

    if (jsxMatches) {
      console.log(`  Found ${jsxMatches.length} JSX fontSize declarations`);

      modifiedContent = modifiedContent.replace(
        jsxFontSizePattern,
        (match, fontSize, otherProps) => {
          const tailwindClass = TAILWIND_FONT_SIZES[fontSize];
          if (tailwindClass) {
            console.log(`    Converting ${fontSize} to ${tailwindClass}`);
            changes++;
            const cleanedProps = otherProps.replace(/^,\s*/, "").trim();
            const styleContent = cleanedProps ? `{ ${cleanedProps} }` : "";
            return `className="${tailwindClass}"${styleContent ? ` style=${styleContent}` : ""}`;
          } else {
            const closestSize = findClosestFontSize(fontSize);
            const closestClass = TAILWIND_FONT_SIZES[closestSize];
            console.log(
              `    Converting ${fontSize} to closest match: ${closestSize} (${closestClass})`
            );
            changes++;
            const cleanedProps = otherProps.replace(/^,\s*/, "").trim();
            const styleContent = cleanedProps ? `{ ${cleanedProps} }` : "";
            return `className="${closestClass}"${styleContent ? ` style=${styleContent}` : ""}`;
          }
        }
      );
    }

    // Pattern 3: fontSize in CSS
    // Example: font-size: 12px;
    const cssFontSizePattern = /font-size:\s*(\d+px)/g;
    const cssMatches = modifiedContent.match(cssFontSizePattern);

    if (cssMatches) {
      console.log(`  Found ${cssMatches.length} CSS fontSize declarations`);

      modifiedContent = modifiedContent.replace(
        cssFontSizePattern,
        (match, fontSize) => {
          const tailwindClass = TAILWIND_FONT_SIZES[fontSize];
          if (tailwindClass) {
            console.log(`    Converting ${fontSize} to ${tailwindClass}`);
            changes++;
            return `font-size: ${tailwindClass}`;
          } else {
            const closestSize = findClosestFontSize(fontSize);
            const closestClass = TAILWIND_FONT_SIZES[closestSize];
            console.log(
              `    Converting ${fontSize} to closest match: ${closestSize} (${closestClass})`
            );
            changes++;
            return `font-size: ${closestClass}`;
          }
        }
      );
    }

    // Pattern 4: Tailwind arbitrary value font sizes
    // Example: text-[14px], text-[12px], etc.
    const tailwindFontSizePattern = /text-\[(\d+)px\]/g;
    const tailwindMatches = modifiedContent.match(tailwindFontSizePattern);

    if (tailwindMatches) {
      console.log(
        `  Found ${tailwindMatches.length} Tailwind arbitrary font size declarations`
      );

      modifiedContent = modifiedContent.replace(
        tailwindFontSizePattern,
        (match, fontSize) => {
          const pxValue = `${fontSize}px`;
          const tailwindClass = TAILWIND_FONT_SIZES[pxValue];
          if (tailwindClass) {
            console.log(
              `    Converting text-[${fontSize}px] to ${tailwindClass}`
            );
            changes++;
            return tailwindClass;
          } else {
            const closestSize = findClosestFontSize(pxValue);
            const closestClass = TAILWIND_FONT_SIZES[closestSize];
            console.log(
              `    Converting text-[${fontSize}px] to closest match: ${closestSize} (${closestClass})`
            );
            changes++;
            return closestClass;
          }
        }
      );
    }

    // Pattern 5: Tailwind arbitrary value font sizes with leading
    // Example: text-[14px] leading-[15.4px]
    const tailwindFontSizeWithLeadingPattern =
      /text-\[(\d+)px\].*?leading-\[([\d.]+)px\]/g;
    const tailwindWithLeadingMatches = modifiedContent.match(
      tailwindFontSizeWithLeadingPattern
    );

    if (tailwindWithLeadingMatches) {
      console.log(
        `  Found ${tailwindWithLeadingMatches.length} Tailwind font size with leading declarations`
      );

      modifiedContent = modifiedContent.replace(
        tailwindFontSizeWithLeadingPattern,
        (match, fontSize, leading) => {
          const pxValue = `${fontSize}px`;
          const tailwindClass = TAILWIND_FONT_SIZES[pxValue];
          if (tailwindClass) {
            console.log(
              `    Converting text-[${fontSize}px] leading-[${leading}px] to ${tailwindClass}`
            );
            changes++;
            return tailwindClass;
          } else {
            const closestSize = findClosestFontSize(pxValue);
            const closestClass = TAILWIND_FONT_SIZES[closestSize];
            console.log(
              `    Converting text-[${fontSize}px] leading-[${leading}px] to closest match: ${closestSize} (${closestClass})`
            );
            changes++;
            return closestClass;
          }
        }
      );
    }

    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent, "utf8");
      console.log(`  ✅ Updated ${changes} font size declarations`);
      return changes;
    } else {
      console.log(`  ℹ️  No changes needed`);
      return 0;
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Main function
function main() {
  console.log("🎨 Font Size Converter (Simple)");
  console.log("=================================");
  console.log("Converting arbitrary font sizes to Tailwind classes...\n");

  const files = findJSXFiles();
  console.log(`📂 Found ${files.length} files to process`);

  if (files.length === 0) {
    console.log("❌ No JSX files found in src directory");
    return;
  }

  let totalChanges = 0;
  let filesChanged = 0;

  files.forEach((file) => {
    const changes = processFile(file);
    if (changes > 0) {
      filesChanged++;
      totalChanges += changes;
    }
  });

  console.log("\n📊 Summary");
  console.log("===========");
  console.log(`Files processed: ${files.length}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`Total changes: ${totalChanges}`);

  if (totalChanges > 0) {
    console.log("\n✅ Conversion complete!");
    console.log("💡 Don't forget to:");
    console.log("   - Review the changes");
    console.log("   - Test your application");
    console.log("   - Update any custom font size logic");
  } else {
    console.log("\nℹ️  No font size conversions needed.");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  findJSXFiles,
  TAILWIND_FONT_SIZES,
  findClosestFontSize,
};
