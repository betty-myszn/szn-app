import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This app loads client-only data (localStorage via getSavedBirthData, loadGoals, etc.) and
      // guards SSR with mount flags (setNow(Date.now()) in an effect). Both are the correct Next.js
      // patterns: the data cannot be read during the server render, and a lazy useState initializer
      // would either crash on the server or reintroduce a hydration mismatch. This rule flags every
      // one of those as an error, so it is turned off deliberately rather than worked around with
      // refactors that would make the components wrong. Genuine impure-render reads are still caught
      // by react-hooks/purity, which stays on.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
