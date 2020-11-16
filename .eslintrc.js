module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends:  [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
  ],
 parserOptions:  {
    project: './tsconfig.json'
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "class-methods-use-this":"off",
    "import/first": "warn",
    "import/no-cycle": "off",
    "import/no-duplicates": "warn",
    "max-classes-per-file":"off",
    "max-len":"off",
    "no-console": "off",
    "no-return-await": "off",
    "linebreak-style": "off"
  },
  overrides: [
    {
      files: ['src/services/virtual-line-in.service.ts'],
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    },
    {
      files: ['src/helpers/*.ts'],
      rules: {
        'no-bitwise': 'warn',
        'no-underscore-dangle': 'warn',
        'no-useless-escape': 'warn',
        'prefer-destructuring': 'warn'
      }
    },
    {
      files: ['src/models/*.ts'],
      rules: {
        'import/prefer-default-export': 'warn'
      }
    },
    {
      files: ['src/services/*.ts'],
      rules: {
        'import/order': 'warn',
        'no-multiple-empty-lines': 'warn'
      }
    },
    {
      files: ['src/sonos-device.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'warn'
      }
    }
  ]
};