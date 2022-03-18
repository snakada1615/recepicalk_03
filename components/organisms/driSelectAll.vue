<template>
  <b-container border-variant="primary" bg-variant="light" class="py-2">
    <b-form inline class="my-2">
      <span class="mr-2">multiple</span>
      <b-form-checkbox
        id="mySwitch"
        switch
        :checked="targetSwitch"
        @change="$emit('update:targetSwitch', $event)"
      ></b-form-checkbox>
      <span>single</span>
    </b-form>
    <div v-if="targetSwitch">
      <dri-select-single
        :items="driItems"
        :target="driPopulations"
        @changeNutritionGroup="updateSelection"
        @changeNutritionValue="updateNutrition"
        @initTarget="$emit('initTarget', $event)"
      >
      </dri-select-single>
    </div>
    <div v-else>
      <dri-select-multi
        :driItems="driItems"
        :driPopulations="driPopulations"
        :max="max"
        @changeNutritionGroup="updateSelection"
        @changeNutritionValue="updateNutrition"
        @initTarget="$emit('initTarget', $event)"
      >
      </dri-select-multi>
    </div>
  </b-container>
</template>

<script>
  import driSelectSingle from "@/components/organisms/driSelectSingle";
  import driSelectMulti from "@/components/organisms/driSelectMulti";
  import leftRightSwitch from "@/components/atoms/leftRightSwitch";

  export default {
    components: {
      driSelectSingle,
      driSelectMulti,
      leftRightSwitch
    },
    props: {
      targetSwitch:{
        type:Boolean,
        default: true
      },
      max: {
        type: Number,
        default: 1000
      },
      driPopulations: {
        type: Array,
        required: true,
        // [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
      },
      driItems: {
        type: Array,
        required: true,
        // ex.
        // [{
        //   En: "1088.0",
        //   Fe: "5.8",
        //   max_vol: "900",
        //   Name: "child 6-23 month",
        //   Pr: "11.65",
        //   Va: "400.0",
        //   id: 0
        //  }],
      }
    },
    methods: {
      updateSelection(val) {
        //this.nutritionTarget = JSON.parse(JSON.stringify(val))
        this.$emit('changeTarget', val)
      },
      updateNutrition(val) {
        console.log('updateNutrition')
        const res = JSON.parse(JSON.stringify(val))
        this.$emit('changeNutrition', res)
      },
    }
  }
</script>
