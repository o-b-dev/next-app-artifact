import { defineConfig } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/**
 * A custom ESLint configuration for Prettier.
 * */
export const prettierConfig = defineConfig([
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn'
    }
  }
])
