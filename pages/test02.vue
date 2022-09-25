<template>
  <b-container>
    <select-db-from-fire
      :doc-name.sync="currentCalendarName"
      db-key="FCT_id"
      db-filter="fct"
      @selected="setMyDoc"
    />
  </b-container>
</template>
<script>
import selectDbFromFire from "../components/organisms/selectDbFromFire";

export default {
  layout: 'defaultEth',
  components: {
    selectDbFromFire
  },
  data() {
    return {
      currentCalendarName: '',
    }
  },
  methods: {
    setMyDoc(doc) {
      console.log(doc)
    }
  },
}
</script>
