<template>
  <span :class="computedClass" :style="styleIcon()"></span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "home"
    },
    color: {
      type: String,
      default: "var(--color-default)"
    }
  },
  computed: {
    computedClass() {
      return `mdi mdi-${this.name}`;
    }
  },
  methods: {
    styleIcon() {
      return `cursor: pointer; color: ${this.color};`;
    }
  }
};
</script>

<style>
</style>