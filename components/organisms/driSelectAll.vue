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
        @update:target="$emit('update:target', $event)"
        @changeNutritionValue="updateNutrition"
        class="single"
      >
      </dri-select-single>
    </div>
    <div v-else>
      <dri-select-multi
        :items="driItems"
        :target="driPopulations"
        :max="max"
        @update:target="$emit('update:target', $event)"
        @changeNutritionValue="updateNutrition"
        class="multi"
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
      /**
       * driPopulationsの切替スイッチ（singleモード/multiモード）
       */
      targetSwitch:{
        type:Boolean,
        default: true
      },
      /**
       * driPopulations.countの上限値
       */
      max: {
        type: Number,
        default: 1000
      },
      /**
       * ターゲットグループの構成：v-modelで使用
       *  [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]
       */
      driPopulations: {
        type: Array,
        required: true,
      },
      /**
       *  driのデータセット
       *   ex.
       *          [{
       *            En: "1088.0",
       *            Fe: "5.8",
       *            max_vol: "900",
       *            Name: "child 6-23 month",
       *            Pr: "11.65",
       *            Va: "400.0",
       *            id: 0
       *           }],
       */
      driItems: {
        type: Array,
        required: true,
      }
    },
    methods: {
      /**
       * driPopulationsの更新時に値を親コンポーネントに通知
       * @param {array} val 更新された栄養必要量
       */
      updateNutrition(val) {
        const res = JSON.parse(JSON.stringify(val))
        this.$emit('changeNutritionValue', res)
      },
    }
  }
</script>
