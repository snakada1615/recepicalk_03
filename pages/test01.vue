<template>
  <b-container>
    Hi!
    <reload-warning :has-changed="hasChanged"/>
  </b-container>
</template>

<script>
import reloadWarning from "../components/atoms/reloadWarning";

export default {
  data(){
    return {
      hasChanged: true
    }
  },
  components:{
    reloadWarning
  },
}
</script>
