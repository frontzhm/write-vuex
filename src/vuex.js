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
    if (options.mutations) {
      this.mutations = {};
      Object.keys(options.mutations).forEach(mutationName => {
        this.mutations[mutationName] = (...payload) => {
          options.mutations[mutationName](...payload);
        };
      });
    }
    if (options.actions) {
      this.actions = {};
      Object.keys(options.actions).forEach(actionName => {
        this.actions[actionName] = (...payload) => {
          options.actions[actionName](...payload);
        };
      });
    }
  }
  commit = (mutationName, ...payload) => {
    this.mutations[mutationName](this.state, ...payload);
  };
  dispatch = (actionName, ...payload) => {
    this.actions[actionName](this, ...payload);
  };
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
