<template>
  <div style="position: absolute; width: 0px; height: 0px; margin: 0px; padding: 0px;" />
</template>

<script>
export default {
  data: () => ({
    device: null,
    midiAccess: null,
    outputID: null,
  }),
  mounted() {
    this.launchWebAPI();
  },
  watch: {
    device(data) {
      if (data) {
        console.log(data)
      }
    }
  },
  methods: {
    launchWebAPI() {
      if (navigator.requestMIDIAccess) {
        navigator
          .requestMIDIAccess()
          .then(this.onMIDISuccess, this.onMIDIFailure);
      }
    },
    onMIDISuccess(midiAccess) {
      this.listenForKeys(midiAccess);
      midiAccess.onstatechange = e => {
        if (e.port.state !== 'disconnected') 
          this.listenForKeys(midiAccess);
        else this.device = null;        
      }
    },
    listenForKeys(midiAccess) {
      const self = this;
      let count = 0;
      this.midiAccess = midiAccess;
      for (var output of midiAccess.outputs.values()) 
        this.outputID = output.id || null;
      for (var input of midiAccess.inputs.values()) {
        count++;
        if (count == 1) this.device = input;
        input.onmidimessage = function(message) {
          if (self.device && (message.data[0] == 144 || message.data[0] == 128))
            self.handleKey(message.data)
        };
      }
    },
    handleKey(data) {
      data[0] == 144 ? this.keyOn(data) : this.keyOff(data)
    },
    keyOn(data) {
      try {
        console.log('ON', data)
      } catch(e) {
        // console.log(e)
      }
    },
    keyOff(data) {
      try {
        console.log('OFF', data)
      } catch(e) {
        // 
      }
    },
  }
}
</script>