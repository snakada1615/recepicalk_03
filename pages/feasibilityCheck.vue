<template>
  <b-container >
    <b-row>
      <feasibility-check-component
        :my-app="$store.state.fire.myApp"
        :page-id.sync="pageId"
        :max-page=10
        @update:myApp="updateMyApp"
        @update:pageMemo="updatePageMemo"
      />
    </b-row>
  </b-container>
</template>

<script>
import feasibilityCheckComponent from "@/components/organisms/feasibilityCheckComponent";

export default {
  components: {
    feasibilityCheckComponent
  },
  data() {
    return {
      pageId:2,
    }
  },
  methods: {
    updateMyApp(val) {
      this.$store.dispatch('fire/updateMyApp', val)
    },
    updatePageMemo(val) {
      this.$store.dispatch('fire/updateMyApp', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
  }
}
</script>
