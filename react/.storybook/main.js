module.exports = {
  webpackFinal(config) {
    config.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@storybook/preset-create-react-app',
    'storybook-addon-apollo-client',
  ],
  framework: '@storybook/react',
};
