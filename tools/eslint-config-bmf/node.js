module.exports = {
  extends: [
    '@rushstack/eslint-config/profile/node',
    '@rushstack/eslint-config/mixins/tsdoc',
  ],

  // plugins: ['@typescript-eslint/eslint-plugin'],

  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],
      // we override the parser with a newer version (to handle typescript 4)
      parser: '@typescript-eslint/parser',
    },
  ],
};
