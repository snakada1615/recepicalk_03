<template>
  <b-container>
    hi: {{userRes}}
    <b-button @click="changeDoc">change</b-button>
    <b-button @click="convJson">convJson</b-button>
  </b-container>
</template>

<script>
export default {
  name: 'Lifecycle',
  data: function () {
    return {
      hasChanged: true,
      hasChanged2: false,
      userRes:'',
      orgMyApp: '',
      convMyApp: ''
    }
  },
  methods: {
    getCircularReplacer(){
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    },
    convJson(){
      this.orgMyApp = this.$store.state.fire.myApp
      this.convMyApp = JSON.stringify(this.orgMyApp, this.getCircularReplacer())
      console.log(this.orgMyApp)
      console.log(this.convMyApp)
    },
    changeDoc(){
      this.$store.dispatch('fire/setHasDocumentChanged', !this.$store.state.fire.hasDocumentChanged)
    }
  }
}
</script>
