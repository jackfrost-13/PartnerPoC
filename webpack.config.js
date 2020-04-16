const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';

    return {
        entry: {
            demo: './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProd ? '[name].[chunkhash].js' : '[name].js',
        },
        devtool: isProd ? 'source-map' : 'inline-source-map',
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        '@babel/preset-env',
                      ],
                      plugins: [
                        '@babel/plugin-proposal-class-properties',
                      ],
                    },
                  }
            }, {
                test: /\.css$/,
                use: (isProd ? [MiniCssExtractPlugin.loader] : ['style-loader']).concat([
                    'css-loader'
                ]),
            }],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'index.html'),
            })
        ].concat(isProd ? [
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css',
            })] : []
        ),
    };
}