module.exports = {
  extends: ['@rushstack/eslint-config'],

  // plugins: ['@typescript-eslint/eslint-plugin'],

  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],
      // we override the parser with a newer version (to handle typescript 4)
      parser: '@typescript-eslint/parser',
      rules: {
        'no-void': ['error', { allowAsStatement: true }],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
          },
        ],
        '@typescript-eslint/typedef': [
          'error',
          {
            arrayDestructuring: false,
            arrowParameter: false,
            memberVariableDeclaration: false,
            objectDestructuring: false,
            parameter: false,
            propertyDeclaration: false,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: false,
          },
        ],
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            classes: true,
            enums: true,
            functions: false,
            typedefs: false,
          },
        ],
      },
    },
  ],
};
