const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 8099;
const users = [
  { username: 'pubo', password: '123456', userid: 'pubo' },
  { username: 'rose', password: '123456', userid: 'rose' },
  { username: 'jack', password: '123456', userid: 'jack' },
  { username: 'mark', password: '123456', userid: 'mark' }
];
let sockets = [];

const onLogin = (socket, user) => {
  let isFirst = true;
  socket.id = user.userid;
  for(let i = 0; i < sockets.length; i++) {
    if(sockets[i].id === user.userid) {
      isFirst = false;
      sockets[i] = socket;
    }
  }
  isFirst && sockets.push(socket);
  socket.emit('loginInfo', { code: 200, errmsg: '登录成功', data: { username: user.username, userid: user.userid } });
  socket.emit('userList', users);
};

const onLoginFailed = socket => {
  socket.emit('loginInfo', { code: 401, errmsg: '用户名或密码错误！', data: [] });
}

const login = (socket, req) => {
  let hasUser = false;
  for(let i = 0; i < users.length; i++) {
    if(req.username === users[i].username && req.password === users[i].password) {
      onLogin(socket, users[i]);
      hasUser = true;
      break;
    }
  }
  hasUser || onLoginFailed(socket);
}

io.on('connect', function(socket) {
  socket.on('login', req => login(socket, req));
  socket.on('text', req => sockets.forEach(item => item.id === req.toUserId && item.emit('text', req)));
});

io.on('disconnect', function(socket) {
  sockets = sockets.filter(item => socket.id !== item.id);
})

http.listen(PORT, () => console.log(`服务器开启成功，端口: ${http.address().port}`));
