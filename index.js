var app = require('express')(); // appとしてexpressを初期化 httpserver使えるようにする
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected'); // userがコネクトしたら表示
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg); // char maessage が入力されたらすべての人にメッセージを送信
    });
    socket.on('disconnect', function() {
        console.log("user disconnected"); // userがディスコネクトしたら表示
    });
});


http.listen(3000, function() {
    console.log('listening on *:3000');
});