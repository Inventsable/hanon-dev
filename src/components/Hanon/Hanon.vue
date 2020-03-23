<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="layout.viewBox"
      :style="{ 
        maxHeight: options.maxHeight,
      }"
    >
      <g v-for="(key, i) in keys" :key="i" :id="prefix + key.name">
        <path
          :class="[key.class,
            key.disabled ? 'disabled' : ''
          ]"
          :d="key.points"
          :style="styleKey(key)"
          @mouseenter="keyHover(key, true)"
          @mouseleave="keyHover(key, false)"
          @mousedown="keyActive(key, true)"
          @mouseup="keyActive(key, false)"
        />
      </g>
    </svg>
    <div v-if="showNotes">
      <div
        class="anno"
        v-for="(key, i) in keys"
        :key="i"
        :style="annoPositionTo(key, i)"
      >{{showAsNote ? key.aliases[key.aliases.length - 1] : key.octave}}</div>
    </div>
  </div>
</template>

<script>
const schema = require("./schema.json");
export default {
  props: {
    amount: {
      type: Number,
      default: 88
    },
    debug: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      default: "a"
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: function() {
        return {
          maxHeight: "60px",
          padding: "10px 20px",
          fontSize: 6,
          color: {
            white: "#979797",
            black: "#131313",
            active: "#408fa0",
            hover: "#c3c3c3",
            disabled: "#",
            locked: "#"
          }
        };
      }
    },
    firstKey: {
      type: String,
      default: function() {
        if (this.amount == 32 || this.amount == 36 || this.amount == 37)
          return "c";
        else if (this.amount == 76) return "e";
        else if (this.amount == 88) return "a";
        else return "c";
      }
    }
  },
  data: () => ({
    keys: [],
    fullScale: [],
    isMounted: false,
    prefixAmount: 0,
    showNotes: false,
    showAsNote: true,
    mouseIsDown: false,
    offsets: {
      major: [0, 2, 4, 5, 7, 9, 11, 12],
      minor: [0, 2, 3, 5, 7, 8, 10, 12]
    },
    // scales: {
    //   major: {
    //     c: ["c", "d", "e", "f", "g", "a", "b", "c"],
    //     d: ["d", "e", "f#", "g", "a", "b", "c#", "d"]
    //   }
    // },
    chordFormulas: {
      major: {
        suffix: "",
        keys: [1, 3, 5]
      },
      fifth: {
        suffix: "5",
        keys: [1, 5]
      },
      suspendedFourth: {
        suffix: "sus4",
        keys: [1, 4, 5]
      },
      suspendedSecond: {
        suffix: "sus2",
        keys: [1, 2, 5]
      },
      addedNinth: {
        suffix: "(add9)",
        keys: [1, 3, 5, 9]
      },
      sixth: {
        suffix: "6",
        keys: [1, 3, 5, 6]
      },
      sixthAddedNinth: {
        suffix: "6/9",
        keys: [1, 3, 5, 6, 9]
      },
      majorSeventh: {
        suffix: "maj7",
        keys: [1, 3, 5, 7]
      },
      majorNinth: {
        suffix: "maj9",
        keys: [1, 3, 5, 7, 9]
      },
      majorSeventhSharpEleventh: {
        suffix: "maj7#11",
        keys: [1, 3, 5, 7, "11#"]
      },
      majorThirteenth: {
        suffix: "maj13",
        keys: [1, 3, 5, 7, 9, 13]
      },
      minor: {
        suffix: "m",
        keys: [1, "b3", 5]
      },
      minorAddedNinth: {
        suffix: "m(add9)",
        keys: [1, "b3", 5, 9]
      },
      minorSixth: {
        suffix: "m6",
        keys: [1, "b3", 5, 6]
      },
      minorSixthFlatSeventh: {
        suffix: "mb6",
        keys: [1, "b3", 5, "b6"]
      },
      minorSixthAddedNinth: {
        suffix: "m6/9",
        keys: [1, "b3", 5, 6, 9]
      },
      minorSeventh: {
        suffix: "m7",
        keys: [1, "b3", 5, "b7"]
      },
      minorSeventhFlatFifth: {
        suffix: "m7b5",
        keys: [1, "b3", "b5", "b7"]
      },
      minorNinth: {
        suffix: "m9",
        keys: [1, "b3", 5, "b7", 9]
      },
      minorEleventh: {
        suffix: "m11",
        keys: [1, "b3", 5, "b7", 9, 11]
      },
      minorThirteenth: {
        suffix: "m13",
        keys: [1, "b3", 5, "b7", 9, 11, 13]
      },
      dominantSeventh: {
        suffix: "7",
        keys: [1, 3, 5, "b7"]
      },
      seventhSuspendedFourth: {
        suffix: "7sus4",
        keys: [1, 4, 5, "b7"]
      },
      ninth: {
        suffix: "9",
        keys: [1, 3, 5, "b7", 9]
      },
      ninthSuspendedFourth: {
        suffix: "9sus4",
        keys: [1, 4, 5, "b7", 9]
      },
      eleventh: {
        suffix: "11",
        keys: [1, 5, "b7", 9, 11]
      },
      thirteenth: {
        suffix: "13",
        keys: [1, 3, 5, "b7", 9, 13]
      },
      thirteenthSuspendedFourth: {
        suffix: "13sus4",
        keys: [1, 4, 5, "b7", 9, 13]
      },
      diminished: {
        suffix: "dim",
        keys: [1, "b3", "b5"]
      }
    }
  }),
  watch: {
    layout(val) {
      if (val) {
        this.fullScale = this.fullNotarize();
        this.createKeys();
      }
    }
  },
  computed: {
    layout() {
      return schema.find(item => {
        if (this.firstKey.length)
          return (
            item.count == this.amount &&
            new RegExp(this.firstKey, "i").test(item.startsWith)
          );
        else return item.count == this.amount;
      });
    }
  },
  created() {
    // console.log(this.layout);
    this.createHanon();
    window.addEventListener("mousedown", () => {
      this.mouseIsDown = true;
    });
    window.addEventListener("mouseup", () => {
      this.mouseIsDown = false;
    });
  },
  mounted() {
    this.isMounted = true;
    // console.log();
    // let target = this.findKeyByName("c-1");
    // target.disabled = true;
    // if (this.debug) {
    //   console.log(this.layout);
    // }
    // targets.forEach(key => {
    //   key.colors.override = "#ff9900";
    // });
    // this.setKeysActive(["a-1", "b-1", "c-1"]);
    // let targets = this.findAllKeysByNote("c");
    // this.setKeysActive(targets);

    this.testAllChordPositions("c", 1);
  },
  methods: {
    createHanon() {
      this.fullScale = this.fullNotarize();
      this.createKeys();
    },
    testAllChordPositions(note, octave = 1) {
      Object.keys(this.chordFormulas).forEach(key => {
        let chordName = `${note}${this.chordFormulas[key].suffix}`;
        // console.log(chordName);
        let chord = this.getChord(chordName, octave);
        console.log(
          chordName,
          chord
            .map(item => {
              return item.note.toUpperCase();
            })
            .join("-")
        );
      });
    },
    configureScaleFromChord(name, octave) {
      let result = "test";
      let isMinor = /(\w)m[^aj]/.test(name);
      let key = name.match(/\w/)[0];
      let attempt = this.getScale(`${key}${isMinor ? "m" : ""}`);
      return attempt;
    },
    configureChordAsOffsetArray(scale) {
      let result = scale.map(item => {
        if (typeof item === "string") {
          let offset = /b/.test(item) ? -1 : 1;
          return +item.match(/\d{1,}/)[0] + offset;
        } else {
          return item - 1;
        }
      });
      return result;
    },
    deduceScale(input) {
      return {
        note: input.match(/^\w([#b])?/i)[0],
        scale: /m$/.test(input) ? "minor" : "major"
      };
    },
    colorChord(target, octave = 1, color = null) {
      let chord = this.getChord(target, octave);
      chord.forEach(key => {
        try {
          if (color && color.length) {
            this.colorKey(key, color);
          } else {
            this.keyActive(key, true);
          }
        } catch (e) {
          //
        }
      });
    },
    colorScale(target, octave = 1, color = null) {
      let scale = this.getScale(target, octave);
      // console.log(scale);
      if (!scale || !scale.length) return null;
      try {
        scale.forEach(key => {
          if (color && color.length) {
            this.colorKey(key, color);
          } else {
            this.keyActive(key, true);
          }
        });
      } catch (e) {
        //
      }
    },
    colorKeys(keys, color) {
      keys.forEach(key => {
        this.colorKey(key, color);
      });
    },
    colorKey(key, color) {
      if (key) key.colors.override = color;
    },
    getScale(input, octave = 1) {
      let target = this.deduceScale(input);
      let firstNote = this.keys.find(key => {
        return key.octave == octave && key.note == target.note;
      });

      firstNote = firstNote
        ? firstNote
        : this.searchKeysByAlias(target.note, octave);
      if (!target || !firstNote) return null;
      let offsets = this.offsets[target.scale];
      let scale = [];
      offsets.forEach(offset => {
        scale.push(this.findNextNoteOfKeyByIndex(firstNote, offset));
      });
      return scale;
    },
    getChord(target, octave = 1) {
      let note = target.match(/^\w([#b])?/i)[0];
      let suffix = target.replace(note, "");
      let firstNote = this.keys.find(key => {
        return key.octave == octave && key.note == note;
      });
      if (!firstNote) {
        firstNote = this.searchKeysByAlias(note, octave);
      }
      let chord = this.findChordFormula(note, suffix);
      let offsetArray = this.configureChordAsOffsetArray(chord.data.keys);
      let result = [firstNote];

      let thisScale = this.configureScaleFromChord(target);

      let doubleScale = [].concat(thisScale, thisScale.slice(1));

      if (!thisScale) console.errror("ERRORED OUT");
      // console.log(
      //   thisScale.map(item => {
      //     return item.note;
      //   })
      // );
      // console.log(
      //   doubleScale.map(item => {
      //     return item.note;
      //   })
      // );
      // console.log(offsetArray);
      let chordArray = offsetArray.map(item => {
        return doubleScale[item].note;
      });
      // console.log(chordArray);

      chordArray.forEach((item, i, arrs) => {
        // console.log(arrs);
        if (i > 0)
          result.push(this.findNextNoteOfKeyByNote(result[i - 1], item));
      });
      return result;
    },
    findChordFormula(note, suffix) {
      let found = null;
      Object.keys(this.chordFormulas).forEach(key => {
        if (this.chordFormulas[key].suffix == suffix) found = key;
      });
      return found
        ? {
            data: this.chordFormulas[found],
            name: found
          }
        : null;
    },
    setKeysActive(keys) {
      keys.forEach(key => {
        if (typeof key === "string") {
          // console.log("STRING");
        } else if (typeof key == "object") {
          key.active = true;
        }
      });
    },
    colorKeysAs(keys, color) {},
    findNextNoteOfKeyByNote(key, nextNote) {
      return this.keys.find(nextKey => {
        return nextKey.index > key.index && nextNote == nextKey.note;
      });
    },
    findNextNoteOfKeyByIndex(key, indexOffset) {
      let exists = this.keys.find(nextKey => {
        return nextKey.index == key.index + indexOffset;
      });
      return exists ? exists : null;
    },
    findAllKeysByNote(note, opts = { sharps: false, flats: false }) {
      return this.keys.filter(key => {
        return (
          new RegExp(note, "i").test(key.note) &&
          key.isSharp == opts.sharps &&
          key.isFlat == opts.flats
        );
      });
    },
    findByAlias(key, requested) {
      let hasNote = false;
      key.aliases.forEach(alias => {
        if (alias == requested) hasNote = true;
      });
      return hasNote ? key : false;
    },
    searchKeysByAlias(alias, octave = 1) {
      let isFound = this.keys.find(key => {
        return (
          (octave <= key.octave + 1 || octave >= key.octave - 1) &&
          this.findByAlias(key, `${alias}-${octave}`)
        );
      });

      return isFound;
    },
    findAllKeysByOctave(octave) {
      return this.keys.filter(key => {
        return key.octave == +octave;
      });
    },
    resetAllKeys() {
      this.keys.forEach(key => {
        key.active = false;
        key.hover = false;
        key.disabled = false;
        key.locked = false;
        key.colors.override = "";
        key.timecode = 0;
        key.velocity = 0;
      });
    },
    findKeyByName(name) {
      let note = name.match(/^\w([#b])?/i)[0];
      let octave = +name.match(/\d$/)[0];
      let isSharp = /\#/.test(name);
      let isFlat = /\wb/.test(name);
      let result = this.keys.find(key => {
        return (
          key.note == note &&
          key.octave == octave &&
          key.isSharp == isSharp &&
          key.isFlat == isFlat
        );
      });
      return result ? result : this.searchKeysByAlias(note, octave);
    },
    lockKeys(keys) {
      keys.forEach(key => {
        this.alterKey(this.findKeyByName(key), "locked", true);
      });
    },
    disableKeys(keys) {
      keys.forEach(key => {
        this.alterKey(this.findKeyByName(key), "disabled", true);
      });
    },
    alterKey(key, param, state) {
      key[param] = state;
    },
    keyHover(key, state) {
      if (key.locked || this.readOnly) return null;
      if (this.mouseIsDown && state) {
        (key.active = true), (key.hover = true);
        this.$emit("keyOn", key);
      } else if (!this.mouseIsDown && state) {
        (key.hover = true), (key.active = false);
        this.$emit("keyOver", key);
      } else if (this.mouseIsDown && !state) {
        (key.active = false), (key.hover = false);
      } else {
        key.hover = state;
        this.$emit(`key${state ? "Over" : "Out"}`, key);
      }
    },
    keyActive(key, state) {
      if (key.locked || this.readOnly) return null;
      key.active = state;
      this.$emit(`key${state ? "On" : "Off"}`, key);
    },
    emitKeyStatus(key) {},
    annoPositionTo(key, i) {
      if (!this.isMounted) return "";
      let style = "";
      let targEl = document.getElementById(this.prefix + key.name);
      if (!targEl) return "";
      let pos = targEl.getBoundingClientRect();
      style += `top: ${
        key.isSharp ? pos.y - this.options.fontSize - 2 : pos.y + pos.height
      }px;`;
      style += `left: ${pos.left}px; width: ${pos.width}px;`;
      style += `font-size: ${this.options.fontSize}px;`;
      return style;
    },
    styleKey(key) {
      let style = "";
      let currentColor = `fill: `;
      if (key.colors.override) currentColor += key.colors.override;
      else if (key.locked) currentColor += this.options.color.locked;
      else if (key.disabled) currentColor += this.options.color.disabled;
      else if (key.active) currentColor += this.options.color.active;
      else if (key.hover) currentColor += this.options.color.hover;
      else currentColor += key.colors.default;
      style += currentColor;
      // console.log(currentColor)
      return style;
    },
    createKeys() {
      this.keys = [];
      this.layout.keys.forEach((key, i) => {
        let child = {
          index: i,
          active: false,
          hover: false,
          locked: false,
          velocity: 0,
          points: key.points,
          class: key.class,
          disabled: false,
          isFlat: false,
          aliases: [],
          octave: 0,
          note: "",
          name: "",
          num: 0,
          colors: {
            override: "",
            default: "",
            hover: ""
          },
          timecode: 0
        };
        child = this.notarize(child, i);
        this.keys.push(child);
      });
    },
    // Determine this key's information, position, and any aliases
    notarize(key, index) {
      // Used for flat/sharp logic to next and previous key;
      let alphabet = ["a", "b", "c", "d", "e", "f", "g"];
      // Used to determine this.layout.startsWith's offset from first C key
      let cScale = [
        "c",
        "b",
        "a#",
        "a",
        "g#",
        "g",
        "f#",
        "f",
        "e",
        "d#",
        "d",
        "c#"
      ];
      let firstCIndex = cScale.findIndex(item => {
        return this.layout.startsWith == item;
      });
      key.note = this.fullScale[index];
      key.isSharp = /\W/.test(key.note);
      key.colors["default"] = key.isSharp
        ? this.options.color.black
        : this.options.color.white;
      let baseNote = key.note[0];

      // Octave must be index / 12 unless a C has not been encountered, in which case 0
      key.octave =
        index >= firstCIndex ? Math.floor((index - firstCIndex) / 12 + 1) : 0;

      // Keys may contain multiple names, such as c-sharp or d-flat
      key.aliases = [`${key.note}-${key.octave}`, index];
      key.name = `${key.note}-${key.octave}`;
      let nextNote =
        alphabet.indexOf(baseNote) + 1 < alphabet.length
          ? alphabet[alphabet.indexOf(baseNote) + 1]
          : alphabet[0];
      let lastNote =
        alphabet.indexOf(baseNote) - 1 >= 0
          ? alphabet[alphabet.indexOf(baseNote) - 1]
          : alphabet[alphabet.length - 1];
      if (key.isSharp) {
        key.aliases.push(`${nextNote}b-${key.octave}`);
      } else {
        if (baseNote == "c" || baseNote == "f") {
          key.aliases.push(`${lastNote}#-${key.octave}`);
        } else if (baseNote == "b" || baseNote == "e") {
          key.aliases.push(
            `${nextNote}b-${baseNote == "b" ? key.octave + 1 : key.octave}`
          );
        }
      }
      return key;
    },
    // Create entire range of note-specific keys as Array from this.amount
    fullNotarize() {
      let scale = [
        "a",
        "a#",
        "b",
        "c",
        "c#",
        "d",
        "d#",
        "e",
        "f",
        "f#",
        "g",
        "g#"
      ];
      let firstIndex = scale.findIndex(item => {
        return this.layout.startsWith == item;
      });
      let result = scale.filter((item, index) => {
        return index >= firstIndex;
      });
      this.prefixAmount = result.length;
      for (let i = 0; i < this.amount - this.prefixAmount; i++)
        result.push(scale[i % scale.length]);
      return result;
    }
  }
};
</script>

<style>
.hanon-wrapper {
  /* width: 100%; */
  /* height: 100%; */
  background-color: transparent;
}
svg {
  max-width: 100%;
  max-height: 100%;
}

.hanon-white {
  /* fill: #b7b7b7; */
}

.hanon-black {
  /* fill: #232323; */
}

.disabled {
  opacity: 0.5;
}

.anno {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  user-select: none;
  cursor: default;
  word-wrap: none;
  overflow: visible;
  white-space: nowrap;
}
</style>