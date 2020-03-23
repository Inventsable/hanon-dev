<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
export default {
  components: {
    navbar: require("./components/Navbar.vue").default
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding: 0px;
  /* width: 100vw;
  height: 100vh; */
  overflow: hidden;
}
body {
  margin: 0px;
}

:root {
  --color-background: #282c34;
  --color-white: #353b45;
  --color-black: #21252b;
  --color-default: #abb2bf;
  --color-disabled: #5c6370;
  --color-locked: #231f20;
  --color-hover: #2c313c;
  --color-selection: #0dbc79;
  --color-a: #0dbc79;
  --color-b: #29b8db;
  --color-c: #e06c75;
  --color-d: #d19a56;
  --color-e: #c678dd;

  --color-input: #333;
  --color-input-border: var(--color-selection);
  --color-input-focus: var(--color-disabled);
  --color-input-focus-text: var(--color-selection);
  --color-highlight-bg: var(--color-selection);
  --color-highlight-text: var(--color-background);

  --dropdown-color: #ececec;
  --dropdown-border: #181a1f;
  --dropdown-bg: #353b45;
  --color-icon: #ececec;
  --dropdown-menu-bg: #353b45;
  --dropdown-menu-color: #c3c3c4;
  --dropdown-menu-border: #353b45;
  --dropdown-menu-item-hover: #2c313a;
  --dropdown-scrollbar-bg: transparent;
  --dropdown-scrollbar-track: transparent;
  --dropdown-scrollbar-thumb: #3b414d;
  --dropdown-scrollbar-thumb-hover: #4e5463;

  background-color: var(--color-background);
  color: var(--color-default);
}
</style>
