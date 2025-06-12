import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

import { config as baseConfig } from './base.js'
import { prettierConfig } from './flat/prettier.js'
import { reactHooksConfig } from './flat/react-hooks.js'

/**
 * A custom ESLint configuration for libraries that use React.
 * @type {import("eslint").Linter.Config} */
export const config = defineConfig([
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    }
  },
  {
    rules: {
      'react/no-unknown-property': 'off'
    }
  },
  ...reactHooksConfig,
  eslintConfigPrettier,
  ...prettierConfig
])
