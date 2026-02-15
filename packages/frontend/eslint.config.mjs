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
  { ignores: ["dist/", "src/clients/"] },
  ...compat.extends("plugin:prettier/recommended"),
  ...pluginQuery.configs["flat/recommended"],
]

export default eslintConfig
