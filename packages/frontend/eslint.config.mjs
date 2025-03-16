import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import pluginQuery from "@tanstack/eslint-plugin-query"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
  ),
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["src/clients/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "no-control-regex": "off",
      "no-useless-escape": "off",
      "@typescript-eslint/no-namespace": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
]

export default eslintConfig
