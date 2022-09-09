module.exports = {
  webpackFinal(config) {
    config.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      type: "json",
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      
    });
    return config;
  },
  core: {
    builder: 'webpack4',
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-addon-apollo-client',
  ],
  framework: '@storybook/react',
};
