/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptAttrPlugin = require('@u51/script-attr-html-webpack-plugin');

const [webBaseConfig, nativeBaseConfig] = require('./webpack.base');

const uglifyPlugin = new UglifyPlugin(({
    uglifyOptions: {
        output: {
            comments: false,
        },
    },
}));

webBaseConfig.output.crossOriginLoading = 'anonymous';
webBaseConfig.plugins.unshift(
    new ScriptAttrPlugin({
        chunks: [/\/\/h5.u51.com\//i],
        attributes: { crossorigin: 'anonymous' },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin('css/[name].[contenthash:6].css'),
    uglifyPlugin // eslint-disable-line
);

nativeBaseConfig.plugins.unshift(uglifyPlugin);

module.exports = [webBaseConfig, nativeBaseConfig];
