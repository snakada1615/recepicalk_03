<template>
  <b-container>
    <country-names :key1.sync="country"/>
    {{country}}:{{checkRegion}}
    <b-button >test</b-button>
  </b-container>
</template>
<script>

import countryNames from "../components/atoms/countryNames";
import {checkUserRegion} from "../plugins/helper";

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
  computed: {
    checkRegion() {
      return checkUserRegion(this.$store.state.fire.myApp.user, {
        country: this.country
      })
    }
  },
  methods: {
  }
}
</script>
