import pluginNext from '@next/eslint-plugin-next'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

import { config as baseConfig } from './base.js'
import { prettierConfig } from './flat/prettier.js'
import { reactHooksConfig } from './flat/react-hooks.js'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 * */
export const nextJsConfig = defineConfig([
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker
      }
    }
  },
  {
    plugins: {
      '@next/next': pluginNext
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules
    }
  },
  globalIgnores(['**/*.d.json.ts']),
  ...reactHooksConfig,
  eslintConfigPrettier,
  ...prettierConfig
])
