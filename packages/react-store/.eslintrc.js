require('@known-as-bmf/eslint-config-bmf/patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    '@known-as-bmf/eslint-config-bmf/web',
    '@known-as-bmf/eslint-config-bmf/react',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
};
