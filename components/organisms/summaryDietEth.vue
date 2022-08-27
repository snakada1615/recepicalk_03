<template>
  <b-container>
    <b-row>
      <b-col cols="12" lg="6" class="my-1">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
        >
          <template #header>
            <div class="font-weight-bold">Comparison of Diet assessment</div>
          </template>
          <b-card>
            Note for each case
            <div v-for="pageId in sceneCount" :key="pageId" v-if="myAppComputed" class="border bg-light">
              Case {{ pageId }}: {{ myAppComputed.menuCases[pageId - 1].note }}
            </div>
          </b-card>
          <b-form-select v-model="selectedCaseId" :options="noteList" v-if="myAppComputed"></b-form-select>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
        >
          <template #header>
            <div class="font-weight-bold">Dietary diversity</div>
          </template>
          <b-table
            bordered
            small
            :items="diversityStatus"
            :fields="fieldsFoodGroup"
            :row-class="(row) => row.id === 1 ? 'is-hidden' : ''"
          >
          </b-table>
        </b-card>
      </b-col>
      <b-col cols="12" lg="12" class="my-1">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
        >
          <template #header>
            <div class="font-weight-bold">Key nutrient sufficiency</div>
          </template>
          <b-row>
            <b-col cols="6" v-for="pageId in sceneCount" :key="pageId" class="my-1">
              <b-card>
                Case {{ pageId }}: {{ myAppComputed.menuCases[pageId - 1].note }}
                <nutrition-bar2
                  v-for="index in 4" :key="index"
                  :colWidthFirst="3"
                  :colwidthSecond="0"
                  :colwidthThird="0"
                  :colwidthFourth="2"
                  :show-max-number="false"
                  :label="nutritionLabel[index-1]"
                  :max-rating="maxRating"
                  :rating="ratingGetter[pageId-1][nutritionLabel[index-1]]"
                />
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="12" class="my-1">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
        >
          <template #header>
            <div class="font-weight-bold">PFC balance</div>
          </template>
          <b-row>
            <b-col cols="12" lg="6" v-for="pageId in sceneCount" :key="pageId" class="my-1">
              <b-card>
                Case {{ pageId }}: {{ myAppComputed.menuCases[pageId - 1].note }}
                <b-row>
                  <b-col cols="6">Recommended</b-col>
                  <b-col cols="6">Current</b-col>
                </b-row>
                <b-row>
                  <b-col cols="6">
                    <pie-chart
                      v-if="pfcStandard"
                      :chart-data="pfcStandard"
                      :options="myChartOptions"
                      :styles="myChartStylesOriginal"
                    />
                  </b-col>
                  <b-col cols="6">
                    <pie-chart
                      v-if="pfcBalanceCurrent[pageId-1]"
                      :chart-data="pfcBalanceCurrent[pageId-1]"
                      :options="myChartOptions"
                      :styles="myChartStyles[pageId-1]"
                    />
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import nutritionBar2 from "@/components/molecules/nutritionBar2";
import macroNutrientBar from "@/components/molecules/macroNutrientBar";
import {
  getDiversityStatus,
  getNutritionDemandList,
  getNutritionSupplyList,
  getRating,
  updatePfc
} from "../../plugins/helper";
import pieChart from "../atoms/pieChart";

export default {
  components: {
    nutritionBar2,
    macroNutrientBar,
    pieChart
  },
  methods: {
    getPfcScale(rating) {
      const res = rating.En / 10
      if (res < 0.5) {
        return 0.5
      }
      if (res > 1.5) {
        return 1.5
      }
      return res
    },
  },
  computed: {
    myAppComputed: function () {
      return JSON.parse(JSON.stringify(
        this.myApp
      ))
    },
    myChartStyles() {
      return this.pfcScale.map((item) => {
        return {
          height: `${this.chartHeight * item}px`,
          position: 'relative'
        }
      })
    },
    myChartStylesOriginal() {
      return {
        height: `${this.chartHeight}px`,
        position: 'relative'
      }
    },
    /**
     * currentとrecommendを比較した場合のエネルギー量の充足度
     * rating[].Enの値を1.5と0.5で足切りしたもの
     */
    pfcScale() {
      if (!this.ratingGetter) {
        return []
      }
      return this.ratingGetter.map((item) => {
        return JSON.parse(JSON.stringify(
          this.getPfcScale(item)
        ))
      })
    },
    /**
     * 同一グループのidリスト
     * @returns {*[]}
     */
    selectedCase() {
      if (this.selectedCaseId === -1) {
        return []
      }
      const selectedItem = this.noteList.find((dat) => dat.value === this.selectedCaseId).key
      return this.noteList.filter((val) => {
        return val.key === selectedItem
      }).map((val2) => {
        return val2.value
      })
    },
    /**
     * 表示するfeasibilityCaseを選択するためのリスト
     * @returns {*[]}
     */
    noteList() {
      let res = []
      for (let index = 1; index <= this.sceneCount; index++) {
        const myNote = this.myAppComputed.menuCases[index - 1].note
        if (myNote) {
          res.push({
            'text': 'Case' + index + ':' + myNote,
            'value': index - 1,
            'key': myNote
          })
        }
      }
      return res
    },
    sceneCount: function () {
      return this.myAppComputed.menuCases.length
    },
    /**
     * FCTからfood Groupを抽出
     * @returns {*}
     */
    foodGroup() {
      return this.myAppComputed.fct.reduce((accumulator, dat) => {
        if (accumulator.indexOf(dat.Group) < 0) {
          accumulator.push(dat.Group)
        }
        return accumulator
      }, [])
    },
    targetGroup() {
      const res = JSON.parse(JSON.stringify(this.myAppComputed.member))
      return [...Array(this.myAppComputed.menuCases.length)].map(() => res)
    },
    fieldsFoodGroup() {
      const vm = this
      let res = [{key: 'case', label: 'Case'}]
      vm.foodGroup.forEach((grp, index) => {
        res.push(
          {key: grp, label: 'F' + (index + 1)}
        )
      })
      return res
    },
    diversityStatusFiltered() {
      return this.diversityStatus.filter((val, index) => {
        return this.selectedCase.includes(index)
      })
    },
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      return getDiversityStatus(this.myAppComputed.menuCases, this.foodGroup)
    },
    /**
     * myAppComputed.menuCases.targetの値を集計してnutritionDemandWatcherに代入するための関数
     * @returns {*[]} 栄養素必要量の合計値
     */
    nutritionDemandGetter() {
      const vm = this
      return getNutritionDemandList(vm.targetGroup, vm.myAppComputed.dri)
    },
    /**
     * myAppComputed.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter() {
      const vm = this
      return getNutritionSupplyList(vm.myAppComputed.menuCases, vm.myAppComputed.menuCases.length)
    },
    rating() {
      return this.ratingGetter
    },
    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter() {
      return getRating(this.nutritionSupplyGetter, this.nutritionDemandGetter, this.sceneCount)
    },
    /**
     *
     * @returns {[{val: number, color: string},{val: number, color: string},{val: number, color: string}][]}
     */
    pfcBalanceCurrent() {
      return updatePfc(this.nutritionSupplyGetter)
    }
  },
  props: {
    myApp: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      /**
       * pie-chartのオプション
       */
      myChartOptions: {
        maintainAspectRatio: false,
        responsive: true,
      },
      /**
       * チャートの基本の高さ
       */
      chartHeight: window.innerHeight / 5,
      /**
       * チャートの基本の幅
       */
      chartWidth: window.innerHeight / 5,
      /**
       * PFCバランスの推奨値
       */
      pfcStandard: {
        labels: ['protein', 'fat', 'carbo.'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['green', 'yellow', 'red'],
            data: [35, 10, 55]
          }
        ]
      },
      /**
       * 選択されたfeasibilityCase
       */
      selectedCaseId: -1,
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
    }
  },
}
</script>
