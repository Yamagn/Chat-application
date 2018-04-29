var express = require('express'); // appとしてexpressを初期化 httpserver使えるようにする
var app = express();
var fs = require('fs');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findByID(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
    },
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'ユーザIDが正しくありません' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'パスワードが正しくありません' });
            }
            return done(null, user);
        });
    }
));

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

io.on('connection', function(socket) {
    console.log('a user connected'); // userがコネクトしたら表示
    io.emit("chat message", "user connected");
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