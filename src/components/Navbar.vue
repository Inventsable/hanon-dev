<template>
  <div class="navbar">
    <div id="nav">
      <div class="nav-item" @click="goto('/')">
        <NavIcon
          name="music-note"
          :color="`var(--color-${$route.path == '/' ? 'selection' : 'default'})`"
        />
      </div>

      <div class="nav-item" @click="goto('/chords')">
        <NavIcon
          name="piano"
          :color="`var(--color-${$route.path == '/chords' ? 'selection' : 'default'})`"
        />
      </div>
      <div class="nav-item" @click="goto('/midi')">
        <NavIcon
          name="midi"
          :color="`var(--color-${$route.path == '/midi' ? 'selection' : 'default'})`"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    NavIcon: require("./NavIcon.vue").default
  },
  methods: {
    goto(path) {
      if (this.$route.path !== path) this.$router.push(path);
    }
  }
};
</script>

<style>
.navbar {
  padding: 10px 0px 10px 0px;
  width: 100%;
  background-color: var(--color-black);
  margin: 0px 20px 20px 0px;
}

#nav {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
}
.nav-item {
  font-size: 30px;
  padding: 0px 10px;
  cursor: pointer;
}
.nav-item:last-of-type {
  margin-right: 30px;
}
.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
</style>