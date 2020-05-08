import Vue from 'vue'
import App from './App.vue'
import VueSocketIo from 'vue-socket.io';

const option = { 
  connection: 'http://10.244.186.105:8099',
  // connection: 'http://127.0.0.1'
};

Vue.config.productionTip = false

Vue.use(new VueSocketIo(option))

new Vue({
  render: h => h(App),
}).$mount('#app')
