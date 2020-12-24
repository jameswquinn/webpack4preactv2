const path = require('path');
const glob = require('glob')
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');





/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');




/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {GenerateSW} = require('workbox-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");


const PATHS = {
  src: path.join(__dirname, 'src')
}





module.exports = {
  mode: 'production',
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js'
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }),
    new HtmlCriticalWebpackPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false,
      }
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    new WebpackPwaManifest({
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      orientation: "portrait",
      display: "standalone",
      background_color: '#ffffff',
      theme_color: '#000000',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      start_url: ".",
      fingerprints: false,
      inject: true,
      icons: [
        
        {
          src: path.resolve('public/icons/icon.png'),
          sizes: [16, 32, 180, 256, 384, 512] // multiple sizes
        },
       
        {
          src: path.resolve('public/icons/large-icon.png'),
          size: '1024x1024' // you can also use the specifications pattern
        },
       
        {
          src: path.resolve('public/icons/maskable-icon.png'),
          size: '1024x1024',
          purpose: 'maskable'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: "public/template.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
    }),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.js$|\.css$|\.svg$|\.html$/,
      threshold: 10240,
      minRatio: 0.7
    }),
    new GenerateSW()
  ],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }, {
      test: /.(scss|css)$/,

      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: "css-loader",

        options: {
          sourceMap: false
        }
      }, {
        loader: "sass-loader",

        options: {
          sourceMap: false
        }
      }]
    }, {
      test: /\.(jpe?g|png|webp)$/i,
      use: [{
        loader: 'responsive-loader',
        options: {
           // If you want to enable sharp support:
           adapter: require('responsive-loader/sharp'),
        }
      }]
    }]
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  }
}