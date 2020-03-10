var express = require('express');
var app = express();

app.get('/shop', function(req, res){
    
    console.log(1111);
});
app.get('/', function(req, res){
    console.log(2222);
})
app.listen(3000, function(){
    console.log('Connected 3000 port!!');
});