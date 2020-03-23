<template>
  <div class="about">
    <div class="menu">
      <div class="menu-content">
        <!-- <div class="menu-item toggle">
          <div class="toggle-content">
            <Toggle label="Scale" :state="isScale" @update="val => (isScale = val)" />
            <Toggle label="Chord" :state="!isScale" @update="val => (isScale = !val)" />
          </div>
        </div>-->
        <div class="menu-top">
          <div class="menu-item toggle">
            <Toggle label="Scale" :state="isScale" @update="val => (isScale = val)" />
          </div>
          <div class="menu-item toggle">
            <Toggle label="Chord" :state="!isScale" @update="val => (isScale = !val)" />
          </div>
          <div class="menu-item menu-input">
            <Input-Scroll
              label="Octave"
              @change="val => activeOctave = val"
              :value="1"
              :min="1"
              :size="16"
              :max="octaveMax"
            />
          </div>
        </div>
        <div class="menu-bottom">
          <div class="menu-item menu-note">
            <Dropdown
              label="Note"
              :items="keys"
              :active="activeKey"
              @update="val => (activeKey = val)"
            />
          </div>
          <div class="menu-item menu-chord">
            <Dropdown
              debug
              v-show="!isScale"
              label="Chord"
              :items="chords"
              :active="activeChord"
              @update="val => (activeChord = val)"
            />
            <Dropdown
              v-show="isScale"
              label="Scale"
              :items="scales"
              :active="activeScale"
              @update="val => (activeScale = val)"
            />
          </div>

          <div class="menu-item menu-layout">
            <Dropdown
              label="Layout"
              :items="layouts"
              :active="activeLayout"
              @update="val => (activeLayout = val)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="hanon-chord-wrapper">
      <hanon
        :options="defOpts"
        ref="master"
        :amount="activePiano.layout"
        :first-key="activePiano.firstKey"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Dropdown: require("../components/Dropdown").default,
    Toggle: require("../components/Toggle").default,
    "Input-Scroll": require("../components/Input-Scroll").default
  },
  mounted() {
    console.log(this.activePiano);
    this.isMounted = true;
    this.activeOctave = "1";
    this.activeChord = "";
    this.$nextTick(() => {
      this.lightUp();
    });
  },
  watch: {
    activePiano(val) {
      console.log(val);
    },
    pianoParams(val) {
      console.log(val);
      // this.reset();
      this.lightUp();
    },
    activeOctave(val) {
      console.log(val);
    },
    activeChord(val) {
      console.log(val);
    }
  },
  data: () => ({
    defOpts: {
      maxHeight: "200px",
      maxWidth: "100%",
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
    },
    defLayout: {
      firstKey: "e",
      layout: 76
    },
    isMounted: false,
    isScale: true,
    activeKey: "C",
    keys: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    activeLayout: "88A",
    layouts: [
      {
        label: "25C",
        value: "25C"
      },
      {
        label: "32C",
        value: "32C"
      },
      {
        label: "32F",
        value: "32F"
      },
      {
        label: "36C",
        value: "36C"
      },
      {
        label: "36F",
        value: "36F"
      },
      {
        label: "37C",
        value: "37C"
      },
      {
        label: "37F",
        value: "37F"
      },
      {
        label: "49C",
        value: "49C"
      },
      {
        label: "54C",
        value: "54C"
      },
      {
        label: "61C",
        value: "61C"
      },
      {
        label: "76E",
        value: "76E"
      },
      {
        label: "88A",
        value: "88A"
      }
    ],
    activeOctave: 1,
    activeScale: "Major",
    scales: [
      {
        label: "Major",
        value: "major"
      },
      {
        label: "Minor",
        value: "minor"
      }
    ],
    activeChord: "",
    chords: [
      {
        name: "major",
        label: "major",
        value: "major"
      },
      {
        label: "fifth",
        value: "5"
      },
      {
        name: "suspendedFourth",
        label: "sus4",
        value: "sus4"
      },
      {
        name: "suspendedSecond",
        label: "sus2",
        value: "sus2"
      },
      {
        name: "addedNinth",
        label: "(add9)",
        value: "(add9)"
      },
      {
        name: "sixth",
        label: "6",
        value: "6"
      },
      {
        name: "sixthAddedNinth",
        label: "6(add9)",
        value: "6/9"
      },
      {
        name: "majorSeventh",
        label: "maj7",
        value: "maj7"
      },
      {
        name: "majorNinth",
        label: "maj9",
        value: "maj9"
      },
      {
        name: "majorSeventhSharpEleventh",
        label: "maj7#11",
        value: "maj7#11"
      },
      {
        name: "majorThirteenth",
        label: "maj13",
        value: "maj13"
      },
      {
        name: "minor",
        label: "m",
        value: "m"
      },
      {
        name: "minorAddedNinth",
        label: "m(add9)",
        value: "m(add9)"
      },
      {
        name: "minorSixth",
        label: "m6",
        value: "m6"
      },
      {
        name: "minorSixthFlatSeventh",
        label: "mb6",
        value: "mb6"
      },
      {
        name: "minorSixthAddedNinth",
        label: "m6",
        value: "m6/9"
      },
      {
        name: "minorSeventh",
        label: "m7",
        value: "m7"
      },
      {
        name: "minorSeventhFlatFifth",
        label: "m7b5",
        value: "m7b5"
      },
      {
        name: "minorNinth",
        label: "m9",
        value: "m9"
      },
      {
        name: "minorEleventh",
        label: "m11",
        value: "m11"
      },
      {
        name: "minorThirteenth",
        label: "m13",
        value: "m13"
      },
      {
        name: "dominantSeventh",
        label: "7",
        value: "7"
      },
      {
        name: "seventhSuspendedFourth",
        label: "7sus4",
        value: "7sus4"
      },
      {
        name: "ninth",
        label: "9",
        value: "9"
      },
      {
        name: "ninthSuspendedFourth",
        label: "9sus4",
        value: "9sus4"
      },
      {
        name: "eleventh",
        label: "11",
        value: "11"
      },
      {
        name: "thirteenth",
        label: "13",
        value: "13"
      },
      {
        name: "thirteenthSuspendedFourth",
        label: "13sus4",
        value: "13sus4"
      },
      {
        name: "diminished",
        label: "dim",
        value: "dim"
      }
    ]
  }),
  computed: {
    pianoParams() {
      return `${this.isScale}${this.activeScale}${this.activeKey}${this.activeChord}${this.activeScale}${this.activeOctave}${this.activeLayout}`;
    },
    activePiano() {
      if (!this.isMounted) return this.defLayout;
      let attempt = {
        firstKey: this.activeLayout.match(/\D/)[0].toLowerCase(),
        layout: +this.activeLayout.match(/\w{2}/)[0]
      };
      return this.isMounted ? attempt : this.defLayout;
    },
    octaveMax() {
      // if (!this.isMounted) return [];
      let results = [];
      let possibles = [
        {
          count: 25,
          startsWith: "c",
          value: 3
        },
        {
          count: 32,
          startsWith: "c",
          value: 3
        },
        {
          count: 32,
          startsWith: "f",
          value: 3
        },
        {
          count: 36,
          startsWith: "c",
          value: 3
        },
        {
          count: 36,
          startsWith: "f",
          value: 3
        },
        {
          count: 37,
          startsWith: "c",
          value: 4
        },
        {
          count: 37,
          startsWith: "f",
          value: 3
        },
        {
          count: 49,
          startsWith: "c",
          value: 5
        },
        {
          count: 54,
          startsWith: "c",
          value: 5
        },
        {
          count: 61,
          startsWith: "c",
          value: 6
        },
        {
          count: 76,
          startsWith: "e",
          value: 6
        },
        {
          count: 88,
          startsWith: "a",
          value: 8
        }
      ];
      let target = possibles.find(item => {
        return (
          this.activePiano.firstKey == item.startsWith &&
          this.activePiano.layout == item.count
        );
      });
      return target.value;
    },
    octaves() {
      for (var i = 1; i < this.octaveMax; i++)
        results.push({
          label: i + "",
          value: i + ""
        });
      return results;
    }
  },
  methods: {
    reset() {
      this.$refs.master.resetAllKeys();
    },
    lightUp() {
      this.$nextTick(() => {
        let color = "var(--color-d)";
        this.reset();
        let piano = this.$refs.master;
        let data = {
          octave: +this.activeOctave,
          firstKey: this.activePiano.firstKey,
          note: this.activeKey.toLowerCase(),
          amount: this.activePiano.layout,
          type: this.isScale ? "scale" : "chord",
          chord: this.activeChord.replace("major", "")
        };
        if (this.isScale) {
          piano.colorScale(
            `${data.note}${this.activeScale == "minor" ? "m" : ""}`,
            data.octave,
            color
          );
        } else {
          let fullChord = `${data.note}${data.chord}`;
          piano.colorChord(fullChord, data.octave, color);
        }
      });
    }
  }
};
</script>

<style>
.menu,
.about {
  overflow: visible;
}
.menu {
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: nowrap;
  width: 100%;
}

.hanon-chord-wrapper {
  max-height: 200px;
  padding: 20px;
}

.toggle-content {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 60px;
}

.menu-item.toggle {
  width: 70px;
  height: 100%;
}

.menu-top,
.menu-bottom {
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-top {
  width: 260px;
}
.menu-bottom {
  width: 340px;
}

.menu-item.menu-note {
  width: 80px;
}
.menu-item.menu-layout {
  width: 80px;
}
.menu-item.menu-chord {
  width: 140px;
}
.menu-item {
  padding: 0px 10px;
  height: 60px;
}

.menu-item.menu-input {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.about {
  height: calc(100vh - 80px);
  overflow: hidden;
}
</style>