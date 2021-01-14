class Store {
  constructor(options) {
    this.options = options;
  }
}
export default {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        // 这里的this是vue的实例，其参数store就是store实例
        const hasStore = this.$options.store;
        // 根实例的store
        hasStore
          ? (this.$store = this.$options.store)
          : this.$parent && (this.$store = this.$parent.store);
      }
    });
  },
  Store
};
