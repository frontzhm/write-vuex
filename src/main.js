import Vue from "vue";
import App from "./App.vue";
// 这里是自己写的vuex 不是官方插件哟
import Vuex from "./vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});

Vue.config.productionTip = false;

new Vue({
  // 这里是一个store的实例
  store,
  mounted() {
    // 测试$store有没有被注入
    console.log("打印$store", this.$store);
  },
  render: h => h(App)
}).$mount("#app");
