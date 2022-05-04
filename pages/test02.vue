<template>
  <b-container >
    <b-row>
      <feasibility-check-component2
        :my-app="$store.state.fire.myApp"
        :page-id.sync="pageId"
        :max-page=10
        @update:myApp="updateMyApp"
      />
    </b-row>
  </b-container>
</template>

<script>
import feasibilityCheckComponent2 from "@/components/organisms/feasibilityCheckComponent2";

export default {
  components: {
    feasibilityCheckComponent2
  },
  data() {
    return {
      singleTarget: true,
      nutrition: [],
      fields: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
      pageId:2,
      nutritionTarget: [{id: 1, count: 1}],
      max: 10000
    }
  },
  computed:{
    DRI:function () {
      return this.$store.state.fire.myApp.dataSet.dri
    },
    FCT:function () {
      return this.$store.state.fire.myApp.dataSet.fct
    }
  },
  methods: {
    test(){
      //this.$store.dispatch('fire/initAll')
    },
    updateMyApp(val) {
      this.$store.dispatch('fire/updateMyApp', val)
    },
  }
}
</script>
