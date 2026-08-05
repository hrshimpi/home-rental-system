// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // This app is built entirely on NgModules + constructor
      // injection - neither is deprecated, both are still fully
      // supported. These "recommended" rules push toward standalone
      // components / inject() as a modernization preference, not a
      // bug; enforcing them here would mean a large, high-risk
      // architectural rewrite with no functional benefit, well
      // outside a lint pass's job.
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      // This codebase uses `any` pervasively and deliberately -
      // tsconfig.json already sets strict:false to match. Flagging
      // every occurrence here would be ~130 findings that are a
      // pre-existing style choice, not defects; the rules below still
      // catch real problems (unused vars/imports, dead assignments).
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
