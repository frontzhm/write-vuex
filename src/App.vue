<template>
  <div id="app">
    {{ $store.state.a }}
    {{ $store.getters.a1 }}
    <button @click="$store.commit('addA', 2)">
      增加
    </button>
    <button @click="$store.dispatch('addA', 100)">
      1s后增加100
    </button>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
