// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['*/dist', '**/*.json'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'error',
    },
  },
  {
    files: ['client/**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      // @ts-expect-error Waiting for eslint-plugin-react-hooks to be updated ts(2322)
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // @ts-expect-error Property '"react-hooks/rules-of-hooks"' is incompatible with index signature ts(2322)
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['server/**/*.{ts,tsx}', 'tools/**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      // Prevent prettier spreading compact expressions over multiple lines
      '@typescript-eslint/no-confusing-void-expression': 'off',
      // Allow compact promise-returning arrow function event handlers
      '@typescript-eslint/no-misused-promises': 'off',
      // NestJS Modules are often sufficiently defined by decorator metadata alone
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
