const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    { ignores: ['node_modules/**', 'uploads/**', 'coverage/**'] },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
];
