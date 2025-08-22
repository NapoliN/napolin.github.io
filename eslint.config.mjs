import { fixupConfigRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const browserGlobals = Object.fromEntries(
    Object.entries(globals.browser).map(([k, v]) => [k.trim(), v])
);

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
)), {
    plugins: {
        "react-refresh": reactRefresh,
    },

    languageOptions: {
        globals: {
            ...browserGlobals,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
        "react-refresh/only-export-components": "warn",
    },
}];
