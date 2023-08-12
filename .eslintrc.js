module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks'
    ],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    root: true,
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        // "indent" is already covered by "@typescript-eslint/indent", but differs on indentation of switch statements
        '@typescript-eslint/indent': ['error', 2],
        'react/jsx-indent': ['error', 2],
        'react/jsx-indent-props': ['error', 2],
        'indent': 'off',

        // Because long file lengths reduce readability. Also nobody reads imports so their readability value is less
        'max-len': ['error', 180],
        '@typescript-eslint/lines-between-class-members': 'off',
        'object-curly-newline': ['error', { 'ImportDeclaration': 'never' }],

        // Non-default exports preserve symbols across the workspace making code easier to trace
        'import/prefer-default-export': 'off',
        // Enforces type imports
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        // Enforces import order - github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'unknown',
                    'internal',
                    ['sibling', 'parent'],
                    'index',
                    'object',
                    'type',
                ],
            },
        ],

        // React doesnt need to be imported in every file for it to be in scope?
        'react/react-in-jsx-scope': 'off',

        'no-bitwise': 'off',    // WebGL uses bitwise flags
        'no-plusplus': 'off',   // Sometimes it's clearer

        // Arrow functions can be typehinted and support intuitive usage of 'this'
        'react/function-component-definition': [
            'error',
            {
                'namedComponents': 'arrow-function',
                'unnamedComponents': 'arrow-function',
            },
        ],
        // class methods are still useful for grouping related code
        'class-methods-use-this': 'off',
    },
};
