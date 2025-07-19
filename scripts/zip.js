const fs = require("node:fs");
const archiver = require("archiver");
const { format } = require("date-fns");

const now = new Date();
const formattedDate = format(now, "dd-MM-yyyy_HH:mm:ss");
const outputFileName = `zipped-muatrans-${formattedDate}.zip`;

const output = fs.createWriteStream(outputFileName);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

output.on("end", function () {
  console.log("Data has been drained");
});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

const filesToZip = [
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
  "public",
  "src",
  "tailwind.config.js",
];

filesToZip.forEach((file) => {
  archive.file(file, { name: file });
});

const directoriesToZip = ["public", "src"];

directoriesToZip.forEach((dir) => {
  archive.directory(dir, dir);
});

archive.finalize();
