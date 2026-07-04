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

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
), {
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],

        // "prettier/prettier": ["error", {
        //     endOfLine: "auto",
        // }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],
    
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-duplicate-enum-values': 'off',
    },
},
{
    files: ["src/tests/helpers/metadata-helper.test.ts", "src/tests/helpers/legacy-helpers.js"],
    rules: {
        '@typescript-eslint/no-require-imports':'off',
        'no-undef':'off',
    }
}];