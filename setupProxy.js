const createProxyMiddleware  = require('http-proxy-middleware');
// console.log("I am being called here")
const WEWILLWIN = 'http://wewillwin.co.in:8080';
// console.log("I am the we will win : ", WEWILLWIN)
module.exports = function (app) {
    app.use(
        '/ferryArt',
        createProxyMiddleware({
            target: WEWILLWIN + '/getResponse',
            changeOrigin: true,
            pathRewrite: function (path, req) {
                // console.log("I am here in the proxy")
                return `?city=${encodeURIComponent(req.query.c)}&category=${encodeURIComponent(req.query.cat)}`;
            }
        })
    );
};