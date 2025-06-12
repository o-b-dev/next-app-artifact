import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { importConfig } from './flat/import.js'
import { prettierConfig } from './flat/prettier.js'

/**
 * A custom ESLint configuration for libraries that use workspace.
 * */
export const workspaceConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-constant-binary-expression': 'off'
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.browser
      }
    }
  },
  ...importConfig,
  eslintConfigPrettier,
  ...prettierConfig,
  {
    ignores: [
      '**/node_modules/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/next-env.d.ts',
      '**/.*/**',
      '**/.*',
      'apps/web/**',
      'ui/**'
    ]
  }
])
