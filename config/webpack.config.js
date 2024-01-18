const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const paths = require('./paths')
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/'

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
    mode: 'development',
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: 'cheap-module-source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    // The first two entry points enable "hot" CSS and auto-refreshes for JS.
    entry: [
        // this is your app's code:
        paths.appIndexJs,
        // We include the app code last so that if there is a runtime error during
        // initialization, it doesn't blow up the WebpackDevServer client, and
        // changing JS code would still trigger a refresh.
    ],
    output: {
        path: paths.appBuild,
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: 'static/js/bundle.js',
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: 'static/js/[name].chunk.js',
        // This is the URL that app is served from. We use "/" in development.
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules],
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebookincubator/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: ['.mjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: {
            // Create an alias for file paths starting with ~,
            // to be able to leave the file extension out (when it's .js or .jsx)
            '~': paths.appSrc,
            styles: paths.appSrc + '/scss',
        },
		fallback: { "url": false}
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: paths.appSrc,
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                        },
                    },

                    // Compile .tsx?
                    {
                        test: /\.(ts|tsx)$/,
                        include: paths.appSrc,
                        use: [
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    // disable type checker - we will use it in fork plugin
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                        use: ['raw-loader'],
                    },
                    {
                        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                        use: [
                            {
                                loader: 'style-loader',
                                options: {
                                    injectType: 'singletonStyleTag',
                                    attributes: {
                                        'data-cke': true,
                                    },
                                },
                            },
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: styles.getPostCssConfig({
                                        themeImporter: {
                                            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                                        },
                                        minify: true,
                                    }),
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
                        type: 'asset/resource',
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use a plugin to extract that CSS to a file, but
                    // in development "style" loader enables hot editing of CSS.
                    {
                        test: /\.s?css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            require.resolve('sass-loader'),
                        ],
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [
                            /\.(js|jsx|mjs)$/,
                            /\.html$/,
                            /\.json$/,
                            /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                            /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                        ],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new MiniCssExtractPlugin(),
        new ESLintPlugin(),
        new CKEditorTranslationsPlugin({
            // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
            // When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
            language: 'nl',
            additionalLanguages: ['en'],
            addMainLanguageTranslationsToAllAssets: true,
            outputDirectory: 'CKEditorTranslations',
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        // Perform type checking and linting in a separate process to speed up compilation
        new ForkTsCheckerWebpackPlugin(),
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: false,
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
    },
    stats: 'errors-warnings',
}
