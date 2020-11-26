/**
 * adding webpack'ed frontend code and back bundles to the grails asset pipeline to use them in gsp
 * Docs:
 * https://stackoverflow.com/questions/40348588/is-it-possible-to-integrate-react-using-webpack-with-grails
 * https://grails.org/blog/2016-05-28.html
 *
 *
 * Frontend Code goes to ./src/main/js
 * or ./src/main/svelte
 * or ./src/main/some other frontend framework
 */

/* Rough process (bash history) of adding npm and swelte to oma.digital
    git add webpack.config.js
    npm init
    npm install --save svelte svelte-loader
    git add package.json
    npm install webpack webpack-cli --save-dev
    npm install --save lodash
    npx webpack --config webpack.config.js
    git add src/main/js/
 */


const path = require('path');



// https://github.com/sveltejs/svelte-loader

module.exports = {
    entry: './src/main/js/recordingUi.js',

    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },

    module: {
        rules: [
            {
                test: /\.(html|svelte)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        hotReload: true
                    }
                }
            },
        ]
    },

    output: {
        filename: 'recordingUiBundle.js',
        path: path.resolve(__dirname, 'grails-app/assets/javascripts/bundles'),
        publicPath: '/assets/',
    },

    performance: {
        maxEntrypointSize: 4096000,
        maxAssetSize: 4096000
    },

    optimization: {
        minimize: false
    },
};