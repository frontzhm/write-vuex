let Vue;
let store = {};
class Store {
  constructor(options) {
    console.log("拿到用户传的state/mutations的参数", options);
    // 让state可以被劫持
    store.state = new Vue({ data: options.state });
  }
}
export default {
  install(_Vue) {
    Vue = _Vue;
    console.log("vuex正确安装啦", Vue);
    Vue.prototype.$store = store;
  },
  Store
};
