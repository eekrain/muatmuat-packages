const fs = require("node:fs");
const path = require("node:path");
const archiver = require("archiver");
const { format } = require("date-fns");

const now = new Date();
// Use cross-platform safe timestamp
const formattedDate = format(now, "dd-MM-yyyy_HH-mm-ss");
const outputFileName = `zipped-muatrans-${formattedDate}.zip`;

const output = fs.createWriteStream(outputFileName);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`${archive.pointer()} total bytes`);
  console.log("Archive finalized and output file closed.");
});

output.on("end", () => {
  console.log("Data has been drained");
});

archive.on("warning", (err) => {
  if (err.code === "ENOENT") {
    console.warn("Warning:", err.message);
  } else {
    throw err;
  }
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

// Helper to check if path exists
const safeAdd = (itemPath, addFunc) => {
  if (fs.existsSync(itemPath)) {
    addFunc();
  } else {
    console.warn(`Skipped missing: ${itemPath}`);
  }
};

const pathsToInclude = [
  ".cursor",
  ".example.env",
  ".gitignore",
  ".husky",
  ".next",
  ".prettierrc",
  ".vscode",
  "eslint.config.mjs",
  "jsconfig.json",
  "next.config.mjs",
  "package-lock.json",
  "package.json",
  "postcss.config.js",
  "postcss.config.mjs",
  "tailwind.config.mjs",
];

// Add individual files and folders
pathsToInclude.forEach((item) => {
  const fullPath = path.resolve(item);
  safeAdd(fullPath, () => {
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      archive.directory(fullPath, item); // preserve original folder name
    } else {
      archive.file(fullPath, { name: item });
    }
  });
});

// Optionally add these known directories too
["public", "src"].forEach((dir) => {
  const fullDirPath = path.resolve(dir);
  safeAdd(fullDirPath, () => {
    archive.directory(fullDirPath, dir);
  });
});

archive.finalize();
