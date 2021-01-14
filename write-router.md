---
title: 从零实现vuex
tags: js
categories: js
---

想要更好的使用一个插件，可以尝试理解其实现的方式。

当然，了解一个优秀的插件，本身也会增强自己的能力。

本文，努力从零开始实现一个简易版的`vuex`，期间会用到很多编程思想，希望自己越来越灵活使用。

## vuex的初版样子

先可以用`vue create xx`创建一个项目，不带`vuex`的。  

先看看，以前如果有`vuex`的`main.js`。

![write-router1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router1.png)

从这推理出`vuex`，应该具有的特征：

- `Vue.use`表明，vuex肯定有`install`方法
- `new Vuex.Store`表明，vuex导出对象里，有个`Store`的类
- 每个组件内部都可以`this.$store`表明，需要注入`$store`

> 如果对插件一脸懵的话，可以简单看下[vue插件的入门说明](https://juejin.cn/post/6899639171124559886)

第一版`vuex.js`就出来了:

![write-router2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/write-router2.png)

## 实现state

state放在模板里，当state变化的时候，模板自动更新。
显然，state是被劫持的。
而vue本身就实现了属性劫持。

