/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const weexCSS = require('postcss-weex');
const ExtractText = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoPrefixer = require('autoprefixer');
const px2rem = require('@u51/postcss-px2rem');
const pkg = require('../package.json');

const isProduction = process.env.NODE_ENV === 'production';

// Web 降级是否使用 Flexible
const IS_FLEXIBLE = true;

// 打包时的 output.publicPath
const BUILD_PUBLIC_PATH = isProduction ?
    '//h5.u51.com/web.u51.com/storage/'.concat(pkg.name.replace('@u51/', ''), '/')
    : '/';

function resolve(dir) {
    return path.join(__dirname, '../', dir);
}

function chunksSortMode(chunk1, chunk2) {
    const orders = ['manifest', 'vendor', 'common'];
    const order1 = orders.indexOf(chunk1.names[0]);
    const order2 = orders.indexOf(chunk2.names[0]);
    const isCommon1 = order1 > -1;
    const isCommon2 = order2 > -1;
    if (isCommon1) {
        if (isCommon2) {
            return order1 > order2 ? 1 : -1;
        }
        return -1;
    }
    return isCommon2 ? 1 : 0;
}

const basepath = resolve('./src/entries');
const template = resolve((IS_FLEXIBLE ? 'flexible' : 'index').concat('.template.html'));
const dirs = fs.readdirSync(basepath);
const cssLoader = 'css-loader'.concat(isProduction ? '?minimize' : '');
const minifyOptions = {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
};

function getBaseConfig(platform) {
    const configEntries = {};
    const configPlugins = [];
    for (let i = 0, l = dirs.length; i < l; i++) {
        const file = dirs[i];
        if (/^([^_]\S*)\.js$/.test(file)) {
            const base = RegExp.$1;
            const entryPath = path.join(basepath, file);
            configEntries[base] = [entryPath];
            configPlugins.push(new HtmlWebpackPlugin({
                title: /\/\/\s*?title:\s*([^\n]*?)\s*?(\n|$)/.test(fs.readFileSync(entryPath, 'utf8')) ? RegExp.$1 : '',
                template,
                chunksSortMode,
                minify: minifyOptions,
                filename: base.concat('.html'),
                chunks: ['manifest', 'vendor', 'common', base],
            }));
        }
    }
    configPlugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: Object.keys(configEntries),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest'],
        }) // eslint-disable-line
    );
    const baseConfig = {
        entry: configEntries,
        output: {
            path: resolve('build'),
            publicPath: isProduction ? BUILD_PUBLIC_PATH : '/',
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
        },
        resolveLoader: {
            alias: {
                'scss-loader': 'sass-loader?'.concat(JSON.stringify({
                    indentedSyntax: false,
                    // SASS 代码注入，可用于主题定制
                    data: '',
                })),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|vue)$/,
                    // loader: 'eslint-loader',
                    exclude: /node_modules/,
                    enforce: 'pre',
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    // exclude: /node_modules\/(?!@u51\/week-ui)/,
                    exclude: /node_modules\/(?!@u51\/[week-ui|wconsole])/,
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ttf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000000,
                        name: isProduction
                            ? 'img/[name].[hash:7].[ext]'
                            : 'img/[name].[ext]',
                    },
                },
                {
                    test: /\.s[ca]ss$/,
                    include: /\.js\.s[ca]ss$/,
                    loaders: ['css-obj-loader', 'scss-loader'],
                },
                // {
                //     test: /\.less/,
                //     include: /\.js\.less$/,
                //     loaders: ['css-obj-loader', 'less-loader'],
                // },
                {
                    test: /\.less/,
                    loaders: ['css-obj-loader', 'less-loader'],
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    PLATFORM: JSON.stringify(platform),
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    // test | pre | stable_project
                    BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
                    WKUI_RATIO: process.env.WKUI_RATIO,
                },
            }),
        ],
    };

    if (platform === 'vue') {
        return merge.smart(baseConfig, {
            entry: {
                vendor: resolve('src/vendor.js'),
            },
            output: {
                filename: isProduction
                    ? 'js/[name].[chunkhash:6].js'
                    : 'js/[name].js',
            },
            resolve: {
                alias: {
                    vue$: 'vue/dist/vue.runtime.esm.js',
                    // vue$: 'vue/dist/vue.common.js',
                },
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        // exclude: /node_modules\/(?!@u51\/week-ui)/,
                        exclude: /node_modules\/(?!@u51\/[week-ui|wconsole])/,
                        options: {
                            compilerModules: [{
                                postTransformNode(el) {
                                    el.staticStyle = '$processStyle('.concat(el.staticStyle, ')');
                                    el.styleBinding = '$processStyle('.concat(el.styleBinding, ')');
                                },
                            }],
                            loaders: {
                                css: (isProduction ? [] : ['css-hot-loader']).concat(ExtractText.extract({
                                    fallback: 'vue-style-loader',
                                    allChunks: true,
                                    use: [cssLoader],
                                })),
                                scss: (isProduction ? [] : ['css-hot-loader']).concat(ExtractText.extract({
                                    fallback: 'vue-style-loader',
                                    allChunks: true,
                                    use: [cssLoader, 'scss-loader'],
                                })),
                                sass: (isProduction ? [] : ['css-hot-loader']).concat(ExtractText.extract({
                                    fallback: 'vue-style-loader',
                                    allChunks: true,
                                    use: [cssLoader, 'scss-loader'],
                                })),
                                less: (isProduction ? [] : ['css-hot-loader']).concat(ExtractText.extract({
                                    fallback: 'vue-style-loader',
                                    allChunks: true,
                                    use: [cssLoader, 'less-loader'],
                                })),
                                js: ['babel-loader'],
                            },
                            postcss: IS_FLEXIBLE ? [
                                /*
                                    * 不使用 !no 语法，因为 Native 上不支持，统一用 pt
                                    * !px 转 [data-dpr] 下的 px，Native 上也不会支持而是转 rem
                                    * 转完的 px 在 weexCSS 中不会被捕获
                                    * pt 在 px2rem 中不被捕获在 weexCSS 中转成 px
                                */
                                px2rem({
                                    baseDpr: 1,
                                    remUnit: 37.5,
                                    forcePxComment: '!px',
                                    keepComment: '!no',
                                    forcePxProperty: ['font-size'],
                                }),
                                weexCSS({ env: 'vue', remUnit: 37.5, relLenUnit: 'do_not_apply' }),
                                autoPrefixer({ browsers: ['last 20 versions'] }),
                            ] : [
                                weexCSS({ env: 'vue', remUnit: 37.5 }),
                                autoPrefixer({ browsers: ['last 20 versions'] }),
                            ],
                        },
                    },
                    {
                        test: /\.css$/,
                        oneOf: [{
                            include: /@u51\/weex-vue-polyfill/,
                            loader: (isProduction ? [] : ['css-hot-loader']).concat(ExtractText.extract({
                                fallback: 'style-loader',
                                allChunks: true,
                                use: [cssLoader],
                            })),
                        }, {
                            include: /\.js\.css$/,
                            loader: 'css-obj-loader',
                        }],
                    },
                ],
            },
            plugins: configPlugins,
        });
    }
    return merge.smart(baseConfig, {
        output: {
            filename: 'js/[name].weex.js',
        },
        resolve: {
            alias: {
                '@u51/pg': '@u51/weex-pg',
                axios: '@u51/weex-axios',
            },
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'weex-vue-loader',
                    // exclude: /node_modules\/(?!@u51\/week-ui)/,
                    exclude: /node_modules\/(?!@u51\/[week-ui|wconsole])/,
                    options: {
                        // 这里配置 Weex Native 的样式处理
                        postcss: [
                            weexCSS({ env: 'weex', remUnit: 37.5 }),
                        ],
                        loaders: {
                            js: [{ loader: 'babel-loader' }],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    include: /\.js\.css$/,
                    loader: 'css-obj-loader',
                },
            ],
        },
        plugins: [
            new webpack.BannerPlugin({
                raw: true,
                entryOnly: true,
                test: /\.js$/,
                banner: '// { "framework": "Vue" }\n// build at '.concat(new Date().toLocaleString(), '\n'),
            }),
        ],
    });
}

const webConfig = getBaseConfig('vue');
const nativeConfig = getBaseConfig('weex');

module.exports = [webConfig, nativeConfig];
