module.exports = {
  'env': {
    'browser': false,
    'node': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'block-spacing': [
      'error',
      'always'
    ],
    'no-multi-spaces': [
      'error',
      {
        'ignoreEOLComments': false
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1
      }
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
