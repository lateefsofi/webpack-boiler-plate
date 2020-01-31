const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const glob = require("glob");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
};

// module.exports = {
//   plugins: [
//     new HtmlWebpackPlugin({
//       title: "Webpack demo",
//     }),
//   ],
//   devServer: {
//     stats: "errors-only", // Display only errors to reduce the amount of output
//     host: process.env.HOST, // default to localhost
//     port: process.env.PORT, // Defaults to 8080
//     open: true, // Open the page in browser
//     overlay: true, // Display overlay on webpage if there are errors
//   }
// };

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
    ],
  },
  parts.loadJavaScript({ include: PATHS.app })
]);

const productionConfig = merge([
  parts.extractCSS({
    use: [ "css-loader", parts.autoprefix(), "sass-loader" ],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 10,
      name: "./assets/[name].[ext]",
    },
  }),
  parts.generateSourceMaps({ type: "" }), //"source-map"
  {
    optimization: { // Split chunks
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    }
  }
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};