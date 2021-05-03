const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));


const apiProxy = proxy('http://wewillwin.co.in:8080', {
  // target: 'http://wewillwin.co.in:8080/',
  proxyReqPathResolver: function (req) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // console.log("requesrt ", req.query.c)
        resolve(`/getResponse?city=${encodeURIComponent(req.query.c)}&category=${encodeURIComponent(req.query.cat)}`);
      }, 2000)
    })
  }
}
);
app.use('/getArt', apiProxy);

// app.use('/api', createProxyMiddleware({ 
//   target: 'http://wewillwin.co.in:8080', 
//   changeOrigin: true,
//   pathRewrite: function (path, req) {
//     // console.log("I am getting fired here: ", req)
//     return path.replace('/api', `getResponse?city=${encodeURIComponent(req.query.c)}&category=${encodeURIComponent(req.query.cat)}`) 
//   }
// }));




app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});






app.listen(9000);