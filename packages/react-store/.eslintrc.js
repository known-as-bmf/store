require('eslint-config-bmf/patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['bmf', 'bmf/react'],
  parserOptions: { tsconfigRootDir: __dirname },
};
