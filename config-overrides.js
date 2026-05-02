const { override, fixBabelImports } = require('customize-cra');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const addLessLoader = (loaderOptions = {}) => (config) => {
  const isEnvDevelopment = process.env.NODE_ENV === 'development';

  const lessRule = {
    test: /\.less$/,
    use: [
      isEnvDevelopment ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: { importLoaders: 3 },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              'postcss-flexbugs-fixes',
              ['postcss-preset-env', {
                autoprefixer: { flexbox: 'no-2019' },
                stage: 3,
              }],
            ],
          },
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: loaderOptions,
      },
    ],
  };

  const oneOf = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  oneOf.splice(oneOf.length - 1, 0, lessRule);

  return config;
};

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      modifyVars: { '@primary-color': '#FF5A5F' },
      javascriptEnabled: true,
    },
  }),
);
