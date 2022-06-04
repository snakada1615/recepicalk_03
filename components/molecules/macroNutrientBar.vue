<template>
  <b-container>
    <my-canvas style="width: 100%; height: 20px;" class="my-0">
      <my-box
        v-for="(obj, index) of chartDataSet" :key="index"
        :x1="obj.x1"
        :x2="obj.x2"
        :y1="100"
        :y2="0"
        :color="obj.color"
        :value="obj.x2-obj.x1"
      />
    </my-canvas>
  </b-container>
</template>

<script>
import myCanvas from '@/components/atoms/myCanvas.vue';
import myBox from '@/components/atoms/myBox.vue';
import {validateMacroNutrient} from "@/plugins/helper";

/**
 * @desc 3つの数値（PFCエネルギー供給量）から、それぞれのシェアを
 *    横棒グラフで表すコンポーネント
 */

export default {
  components: {
    myCanvas,
    myBox,
  },
  props: {
    /**
     * 3つの数値(PFC値)＋色をまとめたArray of Object
     */
    chartValues: {
      type: Array,
      validator: function (value) {
        return validateMacroNutrient(value)
      },
      required: true
    }
  },
  computed: {
    /**
     * chartValueの値を描画用の座標へ変換するための関数
     * @returns {[{color, x1: number, x2: number},{color, x1: number, x2: number},{color, x1: number, x2: number}]}
     */
    chartDataSet() {
      const sum = this.chartValues[0].val + this.chartValues[1].val + this.chartValues[2].val
      const val1 = Math.round(this.chartValues[0].val * 100 / sum)
      const val2 = Math.round((this.chartValues[0].val + this.chartValues[1].val) * 100 / sum)
      return [
        {'x1': 0, 'x2': val1, color: this.chartValues[0].color},
        {'x1': val1, 'x2': val2, color: this.chartValues[1].color},
        {'x1': val2, 'x2': 100, color: this.chartValues[2].color},
      ]
    }
  }
};
</script>
