<template>
  <div class="home">
    <hanon-test />
  </div>
</template>

<script>
// @ is an alias to /src
import HanonTest from "@/components/HanonTest.vue";

export default {
  name: "Home",
  components: {
    HanonTest
  }
};
</script>
