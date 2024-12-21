module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Easier to see difference with indent 4 than 2, also more obvious when nesting is getting too deep/complex
    // "indent" is already covered by "@typescript-eslint/indent", but differs on indentation of switch statements
    "@typescript-eslint/indent": ["error", 4],
    "indent": "off",

    'prettier/prettier': 0,

    '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',

    // Because long file lengths reduce readability. Also nobody reads imports so their readability value is less
    "max-len": ["error", 150],
    "@typescript-eslint/lines-between-class-members": "off",
    "object-curly-newline": [
      "error",
      {
        "ImportDeclaration": "never",
      }
    ],
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "allowTemplateLiterals": true
      }
    ],

    // Non-default exports preserve symbols across the workspace making code easier to trace
    "import/prefer-default-export": "off",
  },
};
