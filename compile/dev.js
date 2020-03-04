/* eslint-disable import/no-extraneous-dependencies, no-console */
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const proxyMiddleware = require('http-proxy-middleware');
const [webConfig, nativeConfig] = require('./webpack.dev');
const proxyConfig = require('./proxy.config');

const app = express();
// 默认端口，可以通过指定环境变量切换端口，如
// > PORT=7777 nbm run dev
const port = process.env.PORT || 8899;

const webCompiler = webpack(webConfig);
const webHotReload = hotMiddleware(webCompiler, { log: false });

webCompiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        webHotReload.publish({ action: 'reload' });
        cb();
    });
});

app.use(webHotReload);
app.use(devMiddleware(webpack(nativeConfig), { quiet: true }));
app.use(devMiddleware(webCompiler, { quiet: true }));
app.use('/favicon.ico', (req, res) => res.end());

Object.keys(proxyConfig).forEach(key => {
    app.use(key, proxyMiddleware(proxyConfig[key]));
});

console.log('> Starting Dev server...');
app.listen(port, () => {
    console.log('> Listening at http://localhost:'.concat(port));
});
