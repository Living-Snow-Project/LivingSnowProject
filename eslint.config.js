// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/.expo/**",
      "**/assets/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/babel.config.js",
      "**/*test*.js",
      "**/jest.config.js",
      "**/jest.polyfills.js",
      "**/metro.config.js",
    ],
  },
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
        },
      ],

      "react/jsx-props-no-spreading": [
        "error",
        {
          custom: "ignore",
        },
      ],

      "react/require-default-props": ["off", {}],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/ban-ts-comment": ["off"],
    },
  },
];
