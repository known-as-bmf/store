module.exports = {
  build: {
    entry: ['src/commands/*', 'src/index.ts'],
    format: [
      {
        format: 'es',
        entryFileNames: '[name].js',
        preserveModules: true,
      },
    ],
  },
  lint: {
    input: ['src'],
  },
};
