import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "plugin:react/recommended",
    "next/core-web-vitals",
    "prettier"
  ),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier,
      react,
    },
    rules: {
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      semi: "error",
      quotes: ["error", "double"],
      // React specific rules (optional overrides)
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
