<template>
  <div id="app">
    <!-- <transition name="slide"> -->
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view />
      </keep-alive>
    <!-- </transition> -->
    <router-view v-if=" !$route.meta.keepAlive" />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  // background-color: red;
  // transform: translate(0,0);
  // transform: translate3d(0,0,0);
  // overflow-y: scroll;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
