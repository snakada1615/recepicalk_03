<template>
  <b-container>
    <macro-nutrient-bar
      :chart-values="chartValues"
    ></macro-nutrient-bar>
  </b-container>
</template>

<script>
import macroNutrientBar from "@/components/molecules/macroNutrientBar";

export default {
  components: {
    macroNutrientBar,
  },
  data() {
    return {
      chartValues: [
        {val: 24, color: 'red'},
        {val: 32, color: 'green'},
        {val: 66, color: 'yellow'},
      ],
    }
  },
};
</script>
