import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

import { importConfig } from './flat/import.js'

/**
 * A shared ESLint configuration for the repository.
 * */
export const config = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-constant-binary-expression': 'off'
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase']
        }
      ]
    }
  },
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn'
    }
  },
  {
    ignores: ['dist/**']
  },
  ...importConfig
])
