var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/src/" + "index.html");
});

app.get('/shop', function(req, res){
    
    res.render(__dirname + "/src/" + "item-shop.html", {title: 'aaaa'});
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
port:3000,
};