let Vue;
class Store {
  constructor(options) {
    this.options = options;
    this.state = new Vue({ data: options.state });
    if (options.getters) {
      this.getters = {};
      Object.keys(options.getters).forEach(key => {
        Object.defineProperty(this.getters, key, {
          get: () => {
            return options.getters[key](this.state);
          }
        });
      });
    }
  }
}
export default {
  install(_Vue) {
    Vue = _Vue;
    Vue.mixin({
      beforeCreate() {
        // 这里的this是vue的实例，其参数store就是store实例
        const hasStore = this.$options.store;
        // 根实例的store
        hasStore
          ? (this.$store = this.$options.store)
          : this.$parent && (this.$store = this.$parent.$store);
      }
    });
  },
  Store
};
