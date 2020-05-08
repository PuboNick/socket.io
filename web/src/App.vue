<template>
  <div id="app">
    <div class="login" :style="loginStyle">
      <input type="text" v-model="userInfo.username" placeholder="username"><br>
      <input type="password" @keyup.enter="login" v-model="userInfo.password" placeholder="password"><br>
      <label>{{ this.label }}</label><br>
      <button @click="login">登录</button>
    </div>
    <div class="container">
      <ul class="users">
        <li style="background: #262626;">
          <img src="./assets/w.png" style="width: 50%;" alt="">
        </li>
        <li v-for="user in userList" :key="user.id" @click="chatWith(user)" :style="user.userid === chatUser.userid ? { background: '#367459' }: { background: '#262626' }">{{ user.username }}</li>
      </ul>
      <div class="msg-box">
        <div class="msg-box-content">
          <div v-for="msg in messages" :key="msg.id"  :style="msg.userid === userInfo.userid ? { textAlign: 'right' }: { textAlign: 'left' }">
            <span v-if="msg.userid === userInfo.userid">
              <span class="msg" :style="{  background: '#45b97c', borderColor: '#45b97c', color: '#fff', }">{{ msg.content }}</span>
              <span class="tip-left"></span>
              <span class="user">{{ msg.username.slice(0, 1).toUpperCase() }}</span>
            </span>
            <span v-else>
              <span class="user">{{ msg.username.slice(0, 1).toUpperCase() }}</span>
              <span class="tip-right"></span>
              <span class="msg" :style="{ background: '#fff', color: '#666', borderColor: '#fff' }">{{ msg.content }}</span>
            </span>
          </div>
        </div>
        <div class="footer">
          <input type="text" @keyup.enter="sendText" v-model="text">
          <button @click="sendText" >发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      userList: [],
      userInfo: {
        username: '',
        password: '',
        userid: ''
      },
      store: {},
      messages: [],
      chatUser: { 
        userid: '',
        username: ''
      },
      text: '',
      loginStyle: {},
      label: ''
    }
  },
  methods: {
    login: function() {
      this.$socket.emit('login', { username: this.userInfo.username, password: this.userInfo.password });
      this.label = '';
    },
    chatWith: function(user) {
      this.store[this.chatUser.userid] = this.messages;
      this.chatUser = user;
      this.messages = this.store[this.chatUser.userid] || [];
    },
    sendText: function() {
      let params = {};
      params.toUserId = this.chatUser.userid;
      params.content = this.text;
      params.fromUserId = this.userInfo.userid;
      params.formUserName = this.userInfo.username;
      this.messages.push({ id: this.random(), username: this.userInfo.username, content: this.text, userid: this.userInfo.userid });
      this.$socket.emit('text', params);
      this.text = '';
    },
    random: function() {
      return Math.random().toString(32);
    },
    onLogin: function(data) {
      this.userInfo.userid = data.data.userid;
      this.loginStyle = { opacity: 0, visibility: 'hidden' };
    },
    onLoginFailed: function(data) {
      this.label = data.errmsg;
    }
  },
  sockets: {
    loginInfo: function(data) {
      data.code === 200 ? this.onLogin(data) : this.onLoginFailed(data);
    },
    userList: function(data) {
      this.userList = data.filter(item => item.userid !== this.userInfo.userid);
      this.chatUser = this.userList[0];
    },
    text: function(data) {
      this.messages.push({ id: this.random(), username: data.formUserName, content: data.content, userid: data.fromUserId });
    },
    connected: function(data) {
      window.console.log(data);
      this.$socket.emit('join', { sessionId: data, room: 'factoryTool' });
    },
    msg: function(data) {
      window.console.log(data);
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Microsoft Yahei', Arial;
  color: #666;
}

.login {
  top: 0;
  position: fixed;
  height: 100vh;
  background: rgba(0, 0, 0, .99);
  width: 100%;
  text-align: center;
  padding-top: 20vh;
  transition: all .3s;
  z-index: 100;
}

input {
  background: #fff;
  padding: 10px;
  border: 1px solid #bbbbbc;
  border-radius: 5px;
  outline: none;
  width: 200px;
  margin-top: 10px;
}

button {
  background: #1d953f;
  padding: 10px;
  border: 1px solid #1d953f;
  border-radius: 5px;
  outline: none;
  color: #fff;
  width: 200px;
  margin-top: 10px;
}

.container {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  box-shadow: 1px 2px 3px #666;
  height: 100vh;
}

.users {
  width: 10%;
  max-width: 60px;
  list-style: none;
  height: 100vh;
  border: 1px solid #262626;
  background: #262626;
  z-index: 10;
}

.users li {
  padding: 10px;
  background: #666;
  color: #fff;
  cursor: pointer;
}

.msg-box {
  height: 100vh;
  position: relative;
  width: 100%;
  background: #e8e8e8;
  border: 1px solid #bbbbbc;
}

.msg-box-content {
  height: 520px;
  overflow: auto;
}

.msg-box-content::-webkit-scrollbar{
	width:4px;
	height:4px;
}

.msg-box-content::-webkit-scrollbar-track{
	background: #f6f6f6;
	border-radius:2px;
}

.msg-box-content::-webkit-scrollbar-thumb{
	background: #aaa;
	border-radius:2px;
}

.msg-box-content::-webkit-scrollbar-thumb:hover{
	background: #747474;
}

.msg-box-content::-webkit-scrollbar-corner{
	background: #f6f6f6;
}

.footer {
  position: absolute;
  bottom: 10px;
  right: 5px;
  text-align: right;
}

.footer button {
  width: 50px;
  margin-left: 10px;
  padding: 7px 10px;
  font-size: 12px;
  border-color: #fff;
}

.footer input {
  padding: 7px 10px;
  width: 350px;
  font-size: 12px;
}

.msg-box div {
  width: 100%;
  padding: 10px;
}

.msg {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid;
  margin-top: 5px;
}

.user {
  display: inline-block;
  padding: 5px 13px;
  border-radius: 5px;
  border: 1px solid #bbbbbc;
  background: #bbbbbc;
  margin: 5px;
  font-weight: bold;
  color: #fff;
  cursor: default;
}

.tip-left {
  display: inline-block;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-left: 6px solid #45b97c;
}

.tip-right {
  display: inline-block;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-right: 6px solid #fff;
}

label {
  color: #cd2626;
  font-size: 12px;
}
</style>
