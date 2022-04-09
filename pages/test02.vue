<template>
  <b-container >
    <b-row>
      <b-col lg="5">
        <b-button @click="test" variant="warning">XXXXX</b-button>
        <b-button to="logintest" variant="info">sign in</b-button>
        <b-card>
        </b-card>
        <dri-select-all
          :targetSwitch.sync="singleTarget"
          :max="max"
          :driPopulations="nutritionTarget"
          :driItems="DRI"
          @update:target="nutritionTarget = JSON.parse(JSON.stringify($event))"
          @changeNutritionValue="nutrition = $event"
          style="max-width: 540px"
        ></dri-select-all>
        <fct-table
          :items="FCT"
        ></fct-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/molecules/FctTable"

export default {
  components: {
    driSelectAll,
    FctTable,
  },
  data() {
    return {
      singleTarget: true,
      nutrition: [],
      fields: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
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
    }
  }
}
</script>
