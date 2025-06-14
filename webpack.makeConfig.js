const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const electronPath = require('electron');
const webpack = require('webpack');
const merge = require('webpack-merge');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

const isProduction = (process.env.NODE_ENV === 'production');

// Temporarily clear NODE_OPTIONS to avoid conflicts with Electron
const originalNodeOptions = process.env.NODE_OPTIONS;
delete process.env.NODE_OPTIONS;
const electronVersion = childProcess.execSync(`${electronPath} --version`, {encoding: 'utf8'}).trim();
if (originalNodeOptions) {
    process.env.NODE_OPTIONS = originalNodeOptions;
}
console.log(`Targeting Electron ${electronVersion}`); // eslint-disable-line no-console

const makeConfig = function (defaultConfig, options) {
    const babelOptions = {
        // Explicitly disable babelrc so we don't catch various config in much lower dependencies.
        babelrc: false,
        plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-proposal-object-rest-spread'
        ],
        presets: [
            ['@babel/preset-env', {targets: {electron: electronVersion}}]
        ]
    };

    const sourceFileTest = options.useReact ? /\.jsx?$/ : /\.js$/;
    if (options.useReact) {
        babelOptions.presets = babelOptions.presets.concat('@babel/preset-react');
        babelOptions.plugins.push(['react-intl', {
            messagesDir: './translations/messages/'
        }]);
    }

    // TODO: consider adjusting these rules instead of discarding them in at least some cases
    if (options.disableDefaultRulesForExtensions) {
        defaultConfig.module.rules = defaultConfig.module.rules.filter(rule => {
            if (!(rule.test instanceof RegExp)) {
                // currently we don't support overriding other kinds of rules
                return true;
            }
            // disable default rules for any file extension listed here
            // we will handle these files in some other way (see below)
            // OR we want to avoid any processing at all (such as with fonts)
            const shouldDisable = options.disableDefaultRulesForExtensions.some(
                ext => rule.test.test(`test.${ext}`)
            );
            const statusWord = shouldDisable ? 'Discarding' : 'Keeping';
            console.log(`${options.name}: ${statusWord} electron-webpack default rule for ${rule.test}`);
            return !shouldDisable;
        });
    }

    const config = merge.smart(defaultConfig, {
        devtool: 'cheap-module-eval-source-map',
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: sourceFileTest,
                    include: options.babelPaths,
                    loader: 'babel-loader',
                    options: babelOptions
                },
                { // coped from scratch-gui
                    test: /\.css$/,
                    exclude: MONACO_DIR,
                    use: [{
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: function () {
                                return [
                                    postcssImport,
                                    postcssVars,
                                    autoprefixer
                                ];
                            }
                        }
                    }]
                },
                {
                    test: /\.(svg|png|wav|gif|jpg|ttf)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/'
                    }
                },
                {
                    test: /\.css$/,
                    include: MONACO_DIR,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /node_modules[/\\](iconv-lite)[/\\].+/,
                    resolve: {
                        aliasFields: ['main']
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.GA_ID': `"${process.env.GA_ID || 'UA-000000-01'}"`
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map'
            }),
            new MonacoWebpackPlugin({
                languages: ['c', 'cpp', 'python', 'lua', 'javascript'],
                features: ['!gotoSymbol']
            })
        ].concat(options.plugins || []),
        resolve: {
            cacheWithContext: false,
            symlinks: false,
            alias: {
                // act like scratch-gui has this line in its package.json:
                //   "browser": "./src/index.js"
                'openblock-gui$': path.resolve(__dirname, 'node_modules', 'openblock-gui', 'src', 'index.js')
            }
        }
    });

    // If we're not on CI, enable Webpack progress output
    // Note that electron-webpack enables this by default, so use '--no-progress' to avoid double-adding this plugin
    if (!process.env.CI) {
        config.plugins.push(new webpack.ProgressPlugin());
    }

    fs.writeFileSync(
        `dist/webpack.${options.name}.js`,
        `module.exports = ${util.inspect(config, {depth: null})};\n`
    );

    return config;
};

module.exports = makeConfig;
