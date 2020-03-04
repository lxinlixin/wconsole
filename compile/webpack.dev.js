/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractText = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const [webBaseConfig, nativeBaseConfig] = require('./webpack.base');

const baseConfig = {
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
    ],
};

const weexWebConfig = merge(webBaseConfig, baseConfig);
const weexNativeConfig = merge(nativeBaseConfig, baseConfig);

const entries = weexWebConfig.entry;
const commonEntries = ['manifest', 'vendor', 'common'];
Object.keys(entries).forEach(entry => {
    if (commonEntries.indexOf(entry) < 0) {
        entries[entry].push('webpack-hot-middleware/client');
    }
});
weexWebConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new ExtractText('css/[name].css') // eslint-disable-line
);

module.exports = [weexWebConfig, weexNativeConfig];
