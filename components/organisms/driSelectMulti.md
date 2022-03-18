driSelectMulti example:

```vue
<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
    <dri-select-all
      :singleTarget.sync="singleTarget"
      :max="max"
      :driPopulations="nutritionTarget"
      :driItems="DRI"
      @changeTarget="nutritionTarget = JSON.parse(JSON.stringify($event))"
      @changeNutrition="nutrition = $event"
    ></dri-select-all>
    <b-card>
      {{nutritionTarget}}
    </b-card>
  </b-container>
</template>

<script>
  import driSelectAll from "@/components/organisms/driSelectAll";

export default {
  components: {
    driSelectAll
  },
  data() {
    return {
      singleTarget: true,
      nutrition: [],
      fields:[
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
      nutritionTarget: [{ id: 1, count: 1}],
      max:10000,
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
  methods: {
  }
}
</script>

```
