import Vue from "vue";
import App from "./App.vue";
// 这里是自己写的vuex 不是官方插件哟
import Vuex from "./vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { a: 1, b: 2 },
  mutations: {},
  actions: {},
  modules: {}
});

Vue.config.productionTip = false;

new Vue({
  store,
  mounted() {
    // 测试$store有没有被注入
    console.log(this.$store);
  },
  render: h => h(App)
}).$mount("#app");
