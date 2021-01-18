---
title: 从零实现vuex
tags: js
categories: js
---

想要更好的使用一个插件，可以尝试理解其实现的方式。

当然，了解一个优秀的插件，本身也会增强自己的能力。

本文，努力从零开始实现一个简易版的`vuex`，期间会用到很多编程思想，希望自己越来越灵活使用。

## vuex 的初版样子

先可以用`vue create xx`创建一个项目，不带`vuex`的。

先看看，如果有`vuex`插件的`main.js`。

![write-router1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router1.png)

！！！特别注意

- `{state:{},mutations:...}`，是用户传的参数
- store 虽然可以`this.$store.state`，但这个 state 不完全是用户传的 state，而是处理过的 state，这两有本质区别
- 同样，用户传过来的其他属性，也会做处理，这样才有后期的`this.$store.getters.xx`等等
- 换言之，`store`就是对用户传的参数做各种处理，以方便用户操作她的数据。

从这推理出`vuex`，应该具有的特征：

- `Vue.use`表明，vuex 肯定有`install`方法
- `new Vuex.Store`表明，vuex 导出对象里，有个`Store`的类
- 每个组件内部都可以`this.$store`表明，需要注入`$store`

> 如果对插件一脸懵的话，可以简单看下[vue 插件的入门说明](https://juejin.cn/post/6899639171124559886)

第一版`vuex.js`就出来了:

![write-router2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router2.png)

但这样，`$store`和`store实例`并没有挂钩，此时可以借助`Vue.mixins的beforeCreate钩子`拿到当前的 Vue 实例，从而拿到实例的`$options` 。

```js
export default {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        // 这里的this是vue的实例，其参数store就是store实例
        (!Vue.prototype.$store) && (Vue.prototype.$store = this.$options.store;)
      }
    });
  },
  Store
};
```

改进：不要轻易在原型上面添加属性，应该只在根实例有`store`的时候才设置`$store`，子实例会拿到根实例的`$store`

![write-router6.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router6.png)

github 切换到`c1`分支

## 处理用户传的 state

store 实例的`state`可以出现在视图里，值变化的时候，视图也一并更新。
所以，`state`是被劫持的，这里投机取巧的用下`Vue`。

```js
// vuex.js
class Store {
  constructor(options) {
    this.options = options;
    this.state = new Vue({ data: options.state });
  }
}
```

```html
<!-- App.vue -->
<div id="app">
  {{ $store.state.a }}
  <button @click="$store.state.a++">
    增加
  </button>
</div>
```

github 切换到`c2`分支

<!-- TODO：state的处理需要优化 -->

## 处理用户传的 getters

- 用户传的`getters`是一个函数集合
- 但是实际使用中，属性值是函数的返回值
- 属性依旧是劫持的，这边因为是函数，所以不能再投机取巧了

```js
// vuex.js
constructor(options) {
    this.options = options;
    this.state = new Vue({ data: options.state });
    if (options.getters) {
      this.getters = {};
      Object.keys(options.getters).forEach(key => {
        //   这里必须是属性劫持
        Object.defineProperty(this.getters, key, {
          get: () => {
            return options.getters[key](this.state);
          }
        });
      });
    }
  }
```

```js
// main.js
state: { a: 1, b: 2 },
getters: { a1(state) { return state.a + 1; } }
```

```html
<!-- app.vue -->
<div id="app">
  {{ $store.state.a }} {{ $store.getters.a1 }}
  <button @click="$store.state.a++">
    增加
  </button>
</div>
```

![write-router1.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router1.gif)

github 切换到`c3`分支

## 处理 mutations

`mutations`，传的参数是一个函数集合的对象，使用的时候`commit('函数名',payload)`

代码翻译：

```js
mutations:{
  addA(state,payload){state.a+=payload}
}
// 使用的时候
this.$store.commit('addA',2)

```

由此推理出，vuex 其实写了一个`commit`方法。这个就很简单了，直接溜上来。

```js
// vuex.js
class Store {
  constructor(options) {
    //  ...
    if (options.mutations) {
      this.mutations = { ...options.mutations };
    }
  }
  commit(mutationName, ...payload) {
    console.log(mutationName, ...payload);
    this.mutations[mutationName](this.state, ...payload);
  }
}
```

![write-router2.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router2.gif)

```js
// <button @click="$store.commit('addA', 2)"> 增加 </button>
const store = new Vuex.Store({
  state: { a: 1, b: 2 },
  getters: {
    a1(state) {
      return state.a + 1;
    },
  },
  mutations: {
    addA(state, num) {
      state.a += num;
    },
  },
});
```

github 切换到`c4`分支

<!-- 升级 -->

## 处理 actions

`actions`和`mutations`是很相似的。

```js
actions:{
  // 注意！！！，这里的第一个参数是store实例
  addA({commit},payload){setTimeout(()=>{commit('addA',payload)},1000)}
}
// 使用的时候
this.$store.dispatch('addA',100)
```

这下更容易了，直接copy

```js
  commit(mutationName, ...payload) {
    this.mutations[mutationName](this.state, ...payload);
  }
  dispatch(actionName, ...payload) {
    // 注意这里是this，不是this.state
    this.actions[actionName](this, ...payload);
  }
```

![write-router3.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router3.gif)

```js
// <button @click="$store.dispatch('addA', 2)"> 1s后增加100 </button>
const store = new Vuex.Store({
  // ...
  actions: {
    addA(store, num) {
      setTimeout(() => {
        store.commit("addA", num);
      }, 1000);
    }
  },
});
```

github 切换到`c5`分支





