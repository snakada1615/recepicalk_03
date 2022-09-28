<template>
  <b-container>
    <country-names :key1.sync="country"/>
    {{country}}:{{myResult}}
    <b-button @click="onClick">test</b-button>
  </b-container>
</template>
<script>

import countryNames from "../components/atoms/countryNames";

export default {
  components: {
    countryNames
  },
  data() {
    return {
      country: '',
      myResult: false
    }
  },
  methods: {
    onClick(){
      this.myResult = this.checkRegion()
    },
    checkRegion() {
      return this.$store.dispatch('fire/checkUserRegion', {
        country: this.country
      })
    }
  }
}
</script>
