module.exports = function override(config, env) {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ];
  
    // This ignores "Failed to parse source-map" warnings for packages within node_modules.
    // https://github.com/facebook/create-react-app/discussions/11767#discussioncomment-2421668
    config.ignoreWarnings = [
      function ignoreSourcemapsloaderWarnings(warning) {
        return (
          warning.module &&
          warning.module.resource.includes('node_modules') &&
          warning.details &&
          warning.details.includes('source-map-loader')
        );
      },
    ];
  
    return config;
  };
  