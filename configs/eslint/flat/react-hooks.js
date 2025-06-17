import { defineConfig } from 'eslint/config'
import pluginReactHooks from 'eslint-plugin-react-hooks'

/**
 * A custom ESLint configuration for React hooks.
 * */
export const reactHooksConfig = defineConfig([
  {
    plugins: {
      'react-hooks': pluginReactHooks
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-literals': 'error'
    }
  }
])
