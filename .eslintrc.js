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
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this':'off',
    'max-classes-per-file':'off',
    'max-len':'off',
    'no-return-await': 'off',
    'linebreak-style': 'off'
  },
  overrides: [
    {
      files: ['src/helpers/metadata-helper.ts'],
      rules: {
        'no-underscore-dangle': 'off',
      }
    },
    {
      files: ['src/models/*.ts'],
      rules: {
        'import/prefer-default-export': 'off'
      }
    },
    {
      files: ['src/services/q-play.service.ts'],
      rules: {
        'no-multiple-empty-lines': 'off'
      }
    },
    {
      files: ['src/services/*.extension.ts'],
      rules: {
        'import/prefer-default-export': 'off',
      }
    },
    {
      files: ['src/sonos-event-listener.ts', 'src/services/base-service.ts'],
      rules: {
        'import/no-cycle': 'off',
      }
    }
  ]
};
