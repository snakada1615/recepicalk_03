<template>
  <b-container >
    <b-row>
      <b-col lg="5">
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
          :items="myItems"
        ></fct-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/organisms/FctTable"

export default {
  components: {
    driSelectAll,
    FctTable
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
      myItems:[
        {
          Carbohydrate: "67.9",
          En: "315",
          Fe: "1.9",
          Fat: "0.4",
          Food_grp: "Starchy roots, tubers and their products",
          Name: "Yam tuber, flour",
          Pr: "3.4",
          Va: "",
          Group: "Grains, roots and tubers",
          food_grp_id: "2",
          id: "110",
        },
        {
          Carbohydrate: "58.9",
          En: "380",
          Fe: "3.3",
          Fat: "5.9",
          Food_grp: "Legumes and their products",
          Name: "Bambara groundnut, dried ",
          Pr: "20.1",
          Va: "2",
          Group: "Legumes and nuts ",
          food_grp_id: "3",
          id: "111",
        },
        {
          Carbohydrate: "20.3",
          En: "562",
          Fe: "3.7",
          Fat: "43.2",
          Food_grp: "Nuts, seeds and their products",
          Name: "Groundnut, rose",
          Pr: "20.4",
          Va: "0",
          Group: "Legumes and nuts ",
          food_grp_id: "6",
          id: "273",
        }
      ]
    }
  },
  methods: {}
}
</script>
