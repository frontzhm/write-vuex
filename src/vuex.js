class Store {
  constructor(obj) {
    console.log("拿到数据了", obj);
  }
}
export default {
  install(Vue) {
    console.log("vuex正确安装啦", Vue);
    Vue.prototype.$store = { a: 1 };
  },
  Store
};
