<template>
  <b-container>
    <my-canvas style="width: 100%; height: 20px;" className="my-0">
      <my-box
        v-for="(obj, index) of chartDataSet(chartValues)" :key="index"
        :x1="obj.x1"
        :x2="obj.x2"
        :y1="100"
        :y2="0"
        :color="obj.color"
        :value="String(obj.label)"
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
  methods: {
    /**
     * chartValueの値を描画用の座標へ変換するための関数
     * @returns {[{color, x1: number, x2: number},{color, x1: number, x2: number},{color, x1: number, x2: number}]}
     */
    chartDataSet(dat) {
      const sum = dat.reduce((accum, curr) => {
        return accum + curr.val
      }, 0)

      let x1 = 0
      let x2 = 0
      return dat.map((item) => {
        x1 = x2
        x2 += Math.round(item.val * 100 / sum)

        //labelの値に応じて表示用のテキストを設定
        let myLabel = item.label
        switch (item.label) {
          case '%': myLabel = String(Math.round(item.val * 100 / sum)) + '%'
            break;
          case '$': myLabel = String(Math.round(item.val))
            break;
        }

        return {
          'x1': x1,
          'x2': x2,
          'label': myLabel,
          'color': item.color
        }
      })
    }
  }
};
</script>
