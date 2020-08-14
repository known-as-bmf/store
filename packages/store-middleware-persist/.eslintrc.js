require('eslint-config-bmf/patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['bmf'],
  parserOptions: { tsconfigRootDir: __dirname },
};
