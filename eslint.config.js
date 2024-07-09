import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";

const flatCompat = new FlatCompat();

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/assets/**",
      "**/babel.config.js",
      "**/*test*.js",
    ],
  },
];
