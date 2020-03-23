<template>
  <div class="hello">
    <div>
      <hanon
        :options="defOpts"
        :amount="25"
        debug
        @keyOn="showKey"
        @keyOff="showKey"
        @keyOver="showOver"
        @keyOut="showOut"
        prefix="a"
        ref="hannon25"
      />
    </div>
    <div class="splitter">
      <div class="split-item">
        <hanon :options="defOpts" ref="hannon32C" :amount="32" @keyOn="showKey" prefix="b1" />
      </div>
      <div class="split-item">
        <hanon
          :options="defOpts"
          ref="hannon32F"
          :amount="32"
          @keyOn="showKey"
          first-key="f"
          prefix="b"
        />
      </div>
    </div>
    <div class="splitter">
      <div class="split-item">
        <hanon :options="defOpts" :amount="36" ref="hannon36C" @keyOn="showKey" prefix="c1" />
      </div>
      <div class="split-item">
        <hanon
          :options="defOpts"
          :amount="36"
          ref="hannon36F"
          @keyOn="showKey"
          first-key="f"
          prefix="c"
        />
      </div>
    </div>
    <div class="splitter">
      <div class="split-item">
        <hanon :options="defOpts" :amount="37" ref="hannon37C" @keyOn="showKey" prefix="d1" />
      </div>
      <div class="split-item">
        <hanon
          :options="defOpts"
          :amount="37"
          ref="hannon37F"
          @keyOn="showKey"
          first-key="f"
          prefix="d"
        />
      </div>
    </div>
    <div>
      <span>Chord: c(add9)</span>
      <hanon :options="defOpts" :amount="49" ref="hannon49" @keyOn="showKey" prefix="e" />
    </div>
    <div>
      <span>Scale: F Minor 2</span>
      <hanon :options="defOpts" :amount="54" ref="hannon54" @keyOn="showKey" prefix="f" />
    </div>
    <div>
      <span>Scale: E Major 3</span>
      <hanon :options="defOpts" :amount="61" ref="hannon61" @keyOn="showKey" prefix="g" />
    </div>
    <div>
      <span>Scale: D Minor 4</span>
      <hanon :options="defOpts" :amount="76" ref="hannon76" @keyOn="showKey" prefix="h" />
    </div>
    <div>
      <span>Scale: C Major 6</span>
      <hanon :options="defOpts" :amount="88" ref="hannon88" @keyOn="showKey" prefix="i" />
    </div>
    <!-- <hanon :amount="25" @keyOn="showKey" /> -->
    <!-- <midi-tester /> -->
    <div class="toolbar-btns">
      <!-- <div class="btn">Test</div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "midi-tester": require("./MidiTester.vue").default,
    hanon: require("./Hanon").default
  },
  data: () => ({
    defOpts: {
      maxHeight: "60px",
      padding: "10px 20px",
      fontSize: 6,
      color: {
        white: "var(--color-white)",
        black: "var(--color-black)",
        active: "var(--color-default)",
        hover: "var(--color-hover)",
        disabled: "var(--color-disabled)",
        locked: "var(--color-locked)"
      }
    }
  }),
  mounted() {
    let hannons = ["25", "32C", "32F", "36C", "36F", "37C", "37F"];
    // "49",
    // "54",
    // "61",
    // "76",
    // "88"

    hannons.forEach(ref => {
      let piano = this.$refs[`hannon${ref}`];
      let targets = piano.findAllKeysByNote("c");
      piano.colorKeys(targets, "var(--color-a)");
    });

    this.$refs.hannon49.colorChord("c(add9)", 1, "var(--color-e)");
    this.$refs.hannon54.colorScale("fm", 2, "var(--color-d)");
    this.$refs.hannon61.colorScale("e", 3, "var(--color-c)");
    this.$refs.hannon76.colorScale("dm", 4, "var(--color-b)");
    let test = this.$refs.hannon88.colorScale("c", 6, "var(--color-a)");
    // this.$refs.hannon25.lockKeys(["c-1", "d-1", "f#-1"]);
    // this.$refs.hannon25.disableKeys(["c-2", "d-2", "f#-2"]);
    // this.$refs.piano.getScale("c#m");
    // this.$refs.piano.getScale("cb");
  },
  methods: {
    showKey(key) {
      console.log(key.note);
      console.log(key.aliases);
    },
    showOver(key) {
      // console.log("OVER", key.name);
    },
    showOut(key) {
      // console.log("OUT", key.name);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
span {
  color: var(--color-default);
  user-select: none;
  cursor: default;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.hello {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  height: 85vh;
  /* display: flex;
  flex-direction: column; */
}

.splitter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

.split-item {
  padding: 0px 10px;
}
</style>
