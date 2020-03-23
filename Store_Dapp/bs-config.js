var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views','./src/views');
app.use(bodyParser.urlencoded({ extended: false}))
// login
app.get('/', function (req, res) {
  res.render('index');
});
app.get('/join', function (req, res) {
  res.render('join');
});
app.post('/shop', function (req, res) {
  var address = req.body.address;
  res.render('item-shop', {address: address, menu:'shop'});
});
app.get('/shop', function (req, res) {
  var address = req.query.address;
  res.render('item-shop', {address: address, menu:'shop'});
});

app.get('/myaccount', function (req, res) {
  var address = req.query.address;
  res.render('cart', {address: address, menu:'myaccount'});
  
});


module.exports = {
  "server": {
    "baseDir": ["./src", "./build/contracts"],
    "routes": {
      "/node_modules": "node_modules"
    },
    middleware: {
      1: app,
    },
  },
  port: 3000,
};