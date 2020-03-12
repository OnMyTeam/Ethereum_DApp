var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views','./src');
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/shop', function (req, res) {
  var address = req.body.address;
  res.render('item-shop', {address: address});
});
app.get('/shop', function (req, res) {
  var address = req.query.address;
  res.render('item-shop', {address: address});
});
app.get('/myaccount', function (req, res) {
  var address = req.query.address;
  res.render('cart', {address: address});
  
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