module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'mocha': true,
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'indent': ['error', 4]
    }
};
