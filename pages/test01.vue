<template>
  <b-container >
    <b-row>
      <b-col lg="5">
        <dri-select-single
          :target.sync="nutritionTarget"
          :items="DRI"
        ></dri-select-single>
        <dri-select-multi
          :target.sync="nutritionTarget"
          :items="DRI"
        ></dri-select-multi>
        <test/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectSingle from "@/components/organisms/driSelectSingle"
import driSelectMulti from "@/components/organisms/driSelectMulti"

export default {
  components: {
    test,
    driSelectSingle,
    driSelectMulti
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
      max: 10000,
      DRI: [
        {
          En: "1088.0",
          Fe: "5.8",
          max_vol: "900",
          Name: "child 6-23 month",
          Pr: "11.65",
          Va: "400.0",
          id: 0
        },
        {
          En: "3066.0",
          Fe: "44.4",
          max_vol: "2500",
          Name: "lactating",
          Pr: "61.0",
          Va: "850.0",
          id: 1
        },
        {
          En: "2913.0",
          Fe: "24.9",
          max_vol: "2600",
          Name: "adolescent all",
          Pr: "52.65",
          Va: "600.0",
          id: 2
        }
      ],
    }
  },
  methods: {}
}
</script>
