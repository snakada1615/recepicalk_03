<template>
  <b-container>
    <edit-calendar-eth
      :calendar-id.sync="calendarId"
      :fct="$store.state.fire.myApp.dataSet.fct"
    />
  </b-container>
</template>
<script>
import editCalendarEth from '../components/molecules/editCalendarEth'

export default {
  components: {
    editCalendarEth
  },
  data () {
    return {
    }
  },
  computed: {
    calendarId: {
      get () {
        return this.$store.state.fire.myApp.dataSet.cropCalendarId
      },
      set (val) {
        this.$store.dispatch('fire/updateCropCalendarId', val)
      }
    }
  }
}
</script>
