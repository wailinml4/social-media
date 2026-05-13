import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/dist/**', '**/node_modules/**']),

  // TypeScript configuration for frontend
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './frontend/tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      tailwindcss: tailwindPlugin,
    },
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    rules: {
      ...reactRefresh.configs.vite.rules,
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript configuration for backend
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './backend/tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  // JavaScript configuration for backend
  {
    files: ['backend/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },

  // JavaScript configuration for other files
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
