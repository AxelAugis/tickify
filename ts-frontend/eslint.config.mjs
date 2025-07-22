import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:jest/recommended", "plugin:jest-dom/recommended", "plugin:testing-library/react"),
  {
    plugins: {
      jest,
      "jest-dom": jestDom,
      "testing-library": testingLibrary
    },
    rules: {
      "jest/no-identical-title": "error",
    }
  }
];

export default eslintConfig;
