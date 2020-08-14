module.exports = {
  extends: ['@rushstack/eslint-config'],
  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],
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
