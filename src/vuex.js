let Vue;
let store = {};
class Store {
  constructor(options) {
    console.log("拿到用户传的state/mutations的参数", options);
    // 让state可以被劫持
    store.state = new Vue({ data: options.state });
    store.getters = {};
    console.log(options.getters);
    Object.keys(options.getters).forEach(key => {
      console.log(key);
      const value = options.getters[key](store.state);
      console.log(value);
      store.getters[key] = value;
      console.log(111, store.getters);
    });
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
