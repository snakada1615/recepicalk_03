<template>
  <b-container>
    hi: {{userRes}}
    <b-button @click="changeDoc">change</b-button>
  </b-container>
</template>

<script>
export default {
  name: 'Lifecycle',
  data: function () {
    return {
      hasChanged: true,
      hasChanged2: false,
      userRes:''
    }
  },
  methods: {
    changeDoc(){
      this.$store.dispatch('fire/setHasDocumentChanged', !this.$store.state.fire.hasDocumentChanged)
    }
  }
}
</script>
