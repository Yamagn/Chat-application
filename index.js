var app = require('express')(); // appとしてexpressを初期化 httpserver使えるようにする
var http = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});