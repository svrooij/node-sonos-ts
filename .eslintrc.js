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
    "no-return-await": "off",
    "import/no-cycle": "off",
    "class-methods-use-this":"off",
    "max-len":"off",
    "no-console": "off",
    "max-classes-per-file":"off",
    "import/first": "warn",
    "import/no-duplicates": "warn",
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
        'import/order': 'warn'
      }
    },
  ]
};