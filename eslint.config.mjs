import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Core ESLint rules
  js.configs.recommended,

  // 2. Next.js presets using the new recommended syntax.
  // 'next/core-web-vitals' includes React, Hooks, and Next.js specific rules.
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "prettier", // This must be last to override formatting rules.
    ],
  }),

  // 3. Your custom configurations, rules, and overrides.
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: {
      // Only plugins for your custom rules are needed here.
      prettier,
    },
    rules: {
      "no-console": "warn",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-constant-condition": "off",
      "no-constant-binary-expression": "off",
      "no-useless-escape": "off",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      semi: "error",
      quotes: ["error", "double"],

      // -- Your Other Overrides --
      "@next/next/no-img-element": "off",
    },
    languageOptions: {
      globals: {
        React: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },
  },
];

export default eslintConfig;
