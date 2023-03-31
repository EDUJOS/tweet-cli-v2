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
    'keyword-spacing': [
      'error',
      {
        'after': true
      }
    ],
    'space-before-function-paren': [
      'error',
      'always'
    ],
    'space-infix-ops': [
      'error'
    ],
    'comma-spacing': [
      'error',
      {
        'after': true
      }
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'comma-style': [
      'error',
      'last'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'key-spacing': [
      'error',
      { 'afterColon': true }
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
    ],
    'eqeqeq': [
      'error',
      'always'
    ],
    'brace-style': [
      'erorr'
    ],
    'curly': [
      'error',
      'multi-line'
    ],
    'camelcase': [
      'error',
      'always'
    ]
  }
}
