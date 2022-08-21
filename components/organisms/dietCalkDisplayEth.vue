<template>
  <b-container>
    <b-row class="my-2">
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Dietary diversity</div>
          </template>
          <div
            v-for="(grp, index) in foodGroup"
            class="border my-1 px-1"
            :class="{
                'bg-warning': !diversityStatus[index][grp],
                'bg-success': diversityStatus[index][grp]
              }"
          >
            {{ grp }}
          </div>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Key Nutrients Sufficiency</div>
          </template>
          <b-row>
            <b-col cols="2" class="d-flex justify-content-center">Target</b-col>
            <b-col cols="2" class="d-flex justify-content-center">Supply</b-col>
            <b-col class="d-flex justify-content-start pl-5">sufficiency rate</b-col>
          </b-row>
          <nutrition-bar2
            v-for="index in 4" :key="index"
            :colWidthFirst="3"
            :colwidthSecond="2"
            :colwidthThird="5"
            :colwidthFourth="2"
            :label="nutritionLabel[index-1]"
            :max-rating="maxRating"
            :rating="rating[nutritionLabel[index-1]]"
            :maxRatingAbsolute="nutritionSupplyWatcher[nutritionLabel[index-1]]"
          />
          <b-row>
            <b-col>
              <div class="small">
                * the amount of protein and fe from staple is excluded from total
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Dietary energy supply from PFC(Protein, Fat, Carbohydrate)</div>
          </template>
          <b-row>
            <b-col cols="4">
              <div>PFC recommend</div>
            </b-col>
            <b-col cols="7">
              <macro-nutrient-bar
                :chart-values="[
                  {val: 35, color: 'green', label: '%'},
                  {val: 10, color: 'yellow', label: '%'},
                  {val: 55, color: 'red', label: '%'},
                ]"
              ></macro-nutrient-bar>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <div>Current PFC</div>
            </b-col>
            <b-col cols="7">
              <macro-nutrient-bar
                :chart-values="pfcBalanceCurrent"
              ></macro-nutrient-bar>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Record of Diet</div>
          </template>
          <recepi-table
            :items="myCrops"
            @itemDeleted="notifiRecepiEdit"
            @rowClick="notifiRecepiEdit"
          ></recepi-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectModal from "@/components/organisms/driSelectModal";
import recepiTable from "@/components/molecules/recepiTable"
import nutritionBar2 from "@/components/molecules/nutritionBar2"
import macroNutrientBar from "@/components/molecules/macroNutrientBar";
import {getNutritionSupply, getNutritionDemand, updatePfc} from "../../plugins/helper";

/**
 * @desc 6つのコンポーネントを組み合わせて食事評価
 * 1. driSelectModa\
 *    対象グループの選択→栄養必要量の決定
 * 2. FctTableModal\
 *    利用する品目の選択→栄養供給量の決定
 * 3. foodModal\
 *    利用する品目の摂取量決定→栄養供給量の決定
 * 4. recepiTable\
 *    選択された品目一覧を示す
 * 5. nutritionBar\
 *    栄養素の充足状況をバーチャートで示す
 *
 */

export default {
  components: {
    recepiTable,
    nutritionBar2,
    driSelectModal,
    macroNutrientBar,
  },
  data() {
    return {
      /**
       * 使用する全変数のobject
       * myFamilyから読み込んでこのページで利用。更新された時にemitを返す
       */
      myFamilyWatcher: {},
      myDri: [],
      myFct: [],
      myMember: [],
      myCrops: [],
      /**
       * menuテーブルから計算される栄養供給量の合計値
       * menuCases[].menuから読み込んでこのページで利用。参照専用
       */
      nutritionSupplyWatcher: {},
      /**
       * menuテーブルから計算される栄養供給目標の合計値
       * nutritionDemandから読み込んでこのページで利用。参照専用
       */
      nutritionDemandWatcher: {},
      /**
       * nutritionBar用のレーティング
       * nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算
       */
      rating: {},
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
      /**
       * PFCバランスの推奨値
       */
      pfcBalanceStandard: [
        {val: 35, color: 'green', label: '%'},
        {val: 10, color: 'yellow', label: '%'},
        {val: 55, color: 'red', label: '%'},
      ],
      /**
       * PFCバランスの現状
       */
      pfcBalanceCurrent: [
        {val: 55, color: 'red', label: '%'},
        {val: 35, color: 'green', label: '%'},
        {val: 10, color: 'yellow', label: '%'},
        {val: 500, color: 'silver', label: '$'},
      ]
    }
  },
  props: {
    myFamily: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /**
     * FCTからfood Groupを抽出
     * @returns {*}
     */
    foodGroup() {
      return this.myFct.reduce((accumulator, dat) => {
        if (accumulator.indexOf(dat.Group) < 0) {
          accumulator.push(dat.Group)
        }
        return accumulator
      }, [])
    },
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus(crops) {
      const vm = this
      let res = vm.foodGroup.map((groupTemp) => {
        return {[groupTemp]: false}
      })
      if (crops.length > 0) {
        crops.forEach((dat1) => {
          const indexTemp = vm.foodGroup.indexOf(dat1.Group)
          if (indexTemp >= 0) {
            res[indexTemp][dat1.Group] = true
          }
        })
      }
      return res
    },
  },
  watch: {
    /**
     * myFamily Property(オブジェクト)の変更を検知してコンポーネントに反映させる
     */
    myFamily: {
      deep: true,
      handler(newVal) {
        const vm = this
        vm.myFamilyWatcher = JSON.parse(JSON.stringify(newVal))
        vm.myCrops = vm.myFamilyWatcher.myCrops
        vm.myMember = vm.myFamilyWatcher.myMember
        vm.myFct = vm.myFamilyWatcher.myFct
        vm.myDri = vm.myFamilyWatcher.myDri

        this.nutritionDemandWatcher = JSON.parse(JSON.stringify(getNutritionDemand(
          vm.myMember,
          vm.myDri
        )))
        vm.nutritionSupplyWatcher = JSON.parse(JSON.stringify(getNutritionSupply(
          vm.myCrops, 1)))
        vm.rating = JSON.parse(JSON.stringify(vm.ratingGetter(
          vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)))
        this.pfcBalanceCurrent  = JSON.parse(JSON.stringify(
          updatePfc(this.nutritionSupplyWatcher)
        ))
      }
    },
  },
  /**
   * 初期値の代入
   */
  created() {
    const vm = this
    vm.myFamilyWatcher = JSON.parse(JSON.stringify(vm.myFamily))
    console.log(vm.myFamilyWatcher)
    vm.myCrops = vm.myFamilyWatcher.myCrops
    vm.myMember = vm.myFamilyWatcher.myMember
    vm.myFct = vm.myFamilyWatcher.myFct
    vm.myDri = vm.myFamilyWatcher.myDri
    this.nutritionDemandWatcher = JSON.parse(JSON.stringify(getNutritionDemand(
      vm.myMember,
      vm.myDri
    )))
    vm.nutritionSupplyWatcher = JSON.parse(JSON.stringify(getNutritionSupply(
      vm.myCrops, 1)))
    vm.rating = JSON.parse(JSON.stringify(vm.ratingGetter(
      vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)))
    this.pfcBalanceCurrent  = JSON.parse(JSON.stringify(
      updatePfc(this.nutritionSupplyWatcher)
    ))
  },
  methods: {
    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter(supply, demand) {
      return {
        En: demand.En ?
          Math.round(100 * supply.En / demand.En) / 10 : 0,
        Pr: demand.Pr ?
          Math.round(100 * supply.Pr / demand.Pr) / 10 : 0,
        Va: demand.Va ?
          Math.round(100 * supply.Va / demand.Va) / 10 : 0,
        Fe: demand.Fe ?
          Math.round(100 * supply.Fe / demand.Fe) / 10 : 0
      }
    },
    notifiRecepiEdit() {
      alert('you can edit diet record by clicking [add crop] button')
    }
  }
}
</script>
