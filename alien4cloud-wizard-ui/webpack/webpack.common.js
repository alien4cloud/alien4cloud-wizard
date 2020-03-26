const webpack = require('webpack');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const utils = require('./utils.js');

module.exports = (options) => ({
    resolve: {
        extensions: [ '.ts', '.js'],
        modules: ['node_modules'],
        alias: {
            app: utils.root('src/main/webapp/app/'),
            ...rxPaths()
        }
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    caseSensitive: true,
                    removeAttributeQuotes:false,
                    minifyJS:false,
                    minifyCSS:false
                },
                exclude: /(src\/main\/webapp\/index.html)/
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
                loader: 'file-loader',
                options: {
                    digest: 'hex',
                    hash: 'sha512',
                    name: 'content/[hash].[ext]'
                }
            },
            {
                test: /manifest.webapp$/,
                loader: 'file-loader',
                options: {
                    name: 'manifest.webapp'
                }
            },
            // Ignore warnings about System.import in Angular
            { test: /[\/\\]@angular[\/\\].+\.js$/, parser: { system: true } },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `'${options.env}'`,
                BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
                VERSION: `'${utils.parseVersion()}'`,
                DEBUG_INFO_ENABLED: options.env === 'development',
                // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
                // If this URL is left empty (""), then it will be relative to the current context.
                // If you use an API server, in `prod` mode, you will need to enable CORS
                // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
                SERVER_API_URL: `''`
            }
        }),
        new CopyWebpackPlugin([
             { from: './src/main/webapp/content/', to: 'content' },
             { from: './src/main/webapp/favicon.ico', to: 'favicon.ico' },
             { from: './src/main/webapp/assets/styles/built', to: 'assets/styles/built' },
			 { from: './src/main/webapp/assets/i18n', to: 'assets/i18n' }
        ]),
        new HtmlWebpackPlugin({
            template: './src/main/webapp/index-wizard.html',
            filename: 'index.html',
            chunks: ['polyfills', 'main', 'global'],
            chunksSortMode: 'manual'
        }),
        new HtmlWebpackPlugin({
          template: './src/main/webapp/index-a4c.html',
          filename: 'index-a4c.html',
          chunks: ['polyfills', 'main', 'global'],
          chunksSortMode: 'manual'
        }),
        new HtmlWebpackPlugin({
          template: './src/main/webapp/index.jsp',
          filename: 'wizard.jsp',
          chunks: ['polyfills', 'main', 'global'],
          chunksSortMode: 'manual',
          templateParameters: {
            base_href: '<%=base_href%>'
          },
        })
        //,new BaseHrefWebpackPlugin({ baseHref: './wizard/' })
    ]
});
