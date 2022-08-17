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
            <b-list-group>
              <b-list-group-item
                v-for="pageId in sceneCount" :key="pageId" v-if="myApp"
                button
                @click="clickCaseName(pageId)"
                :variant="cellColor[pageId - 1]"
              >
                Case {{ pageId }}: {{ myApp.menuCases[pageId - 1].note }}
              </b-list-group-item>
            </b-list-group>
          </b-card>
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
            :items="diversityStatusFiltered"
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
          <b-row class="mb-2">
            <b-col cols="6">
              <b-card
                header="Overall Average"
                border-variant="success">
                <nutrition-bar2
                  v-for="index in 4" :key="index"
                  :colWidthFirst="3"
                  :colwidthSecond="0"
                  :colwidthThird="0"
                  :colwidthFourth="2"
                  :show-max-number="false"
                  :label="nutritionLabel[index-1]"
                  :max-rating="maxRating"
                  :rating="averageRatingGetter[nutritionLabel[index-1]]"
                />
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6" v-for="pageId in sceneCount" :key="pageId" class="my-1" v-if="showScore[pageId-1]">
              <b-card>
                Case{{ pageId }}
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
            <b-col>
              <b-card
                header="Overall Average"
                border-variant="success">
                <b-row>
                  <b-col cols="3">
                    <div style="font-size: 1vw">Recommend</div>
                  </b-col>
                  <b-col cols="9">
                    <macro-nutrient-bar
                      :chart-values="pfcBalanceStandard"
                    ></macro-nutrient-bar>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="3">
                    <div style="font-size: 1vw">Current</div>
                  </b-col>
                  <b-col cols="9">
                    <macro-nutrient-bar
                      v-if="averagePfcBalance"
                      :chart-values="averagePfcBalance"
                    ></macro-nutrient-bar>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col cols="6" v-for="pageId in sceneCount" :key="pageId" class="my-1" v-if="showScore[pageId-1]">
              <b-card>
                Case{{ pageId }}
                <b-row>
                  <b-col cols="3">
                    <div style="font-size: 1vw">Recommend</div>
                  </b-col>
                  <b-col cols="9">
                    <macro-nutrient-bar
                      :chart-values="pfcBalanceStandard"
                    ></macro-nutrient-bar>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="3">
                    <div style="font-size: 1vw">Current</div>
                  </b-col>
                  <b-col cols="9">
                    <macro-nutrient-bar
                      v-if="pfcBalanceCurrent[pageId-1]"
                      :chart-values="pfcBalanceCurrent[pageId-1]"
                    ></macro-nutrient-bar>
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
import {updatePfc} from "../plugins/helper";

export default {
  components: {
    nutritionBar2,
    macroNutrientBar
  },
  computed: {
    averagePfcBalance() {
      const supply = this.averageNutritionSupplyGetter
      const demand = this.averageNutritionDemandGetter
      return [
        {val: Math.round(supply.Pr * 4), color: 'green', label: '%'},
        {val: Math.round(supply.Fat * 9), color: 'yellow', label: '%'},
        {val: Math.round(supply.Carbohydrate * 4), color: 'red', label: '%'},
        {
          val: Math.round(demand.En
            - supply.Carbohydrate * 4 - supply.Pr * 4 - supply.Fat * 9),
          color: 'silver',
          label: '$',
        },
      ]
    },
    diversityStatusFiltered() {
      return this.diversityStatus.filter((val, index) => {
        return this.showScore[index]
      })
    },
    /**
     * noteの選択状態に応じてリスト上のセルの値を変化
     * @returns {unknown[]}
     */
    cellColor() {
      return this.showScore.map((item) => {
        if (item) {
          return "info"
        } else {
          return 'light'
        }
      })
    },
    /**
     * それぞれのCaseを表示するかどうかの判定フラグ
     * @returns {unknown[]}
     */
    showScore() {
      let vm = this
      return this.myApp.menuCases.map((val) => {
        if (vm.selectedNote === '') {
          return true
        } else {
          return val.note === vm.selectedNote
        }
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
        const myNote = this.myApp.menuCases[index - 1].note
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
    myApp: function () {
      return this.$store.state.fire.myApp
    },
    sceneCount: function () {
      return this.$store.state.fire.myApp.sceneCount
    },
    /**
     * FCTからfood Groupを抽出
     * @returns {*}
     */
    foodGroup() {
      return this.myApp.dataSet.fct.reduce((accumulator, dat) => {
        if (accumulator.indexOf(dat.Group) < 0) {
          accumulator.push(dat.Group)
        }
        return accumulator
      }, [])
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
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      return this.myApp.menuCases.map((foodsTemp, index) => {
        let res = {}
        let colorVariant = {}
        res['case'] = 'Case' + (index + 1)
        colorVariant['case'] = 'primary'
        vm.foodGroup.forEach((foodItem) => {
          res[foodItem] = ''
          colorVariant[foodItem] = 'danger'
        })
        foodsTemp.menu.forEach((dat1) => {
          if (vm.foodGroup.indexOf(dat1.Group) >= 0) {
            colorVariant[dat1.Group] = 'info'
          }
        })
        res['_cellVariants'] = colorVariant
        return res
      })
    },
    /**
     * myApp.menuCases.targetの値を集計してnutritionDemandWatcherに代入するための関数
     * @returns {*[]} 栄養素必要量の合計値
     */
    nutritionDemandGetter() {
      const vm = this
      return vm.myApp.menuCases.map((dat) => {
        return dat.target.reduce((accumulator, item, index) => {
          const dri = vm.myApp.dataSet.dri[index]
          const count = item.count
          accumulator.En += Number(count) * Number(dri.En)
          accumulator.Pr += Number(count) * Number(dri.Pr)
          accumulator.Va += Number(count) * Number(dri.Va)
          accumulator.Fe += Number(count) * Number(dri.Fe)
          accumulator.Wt += Number(count) * Number(dri.Wt)
          return accumulator
        }, {
          'En': 0,
          'Pr': 0,
          'Va': 0,
          'Fe': 0,
          'Wt': 0,
        })
      })
    },
    /**
     * myApp.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter() {
      const vm = this
      return vm.myApp.menuCases.map((datArray) => {
        if (datArray.menu.length > 0) {
          return datArray.menu.reduce((accumulator, item) => {
            accumulator.En += Number(item.En) * Number(item.Wt) / 100
            accumulator.Pr += Number(item.Pr) * Number(item.Wt) / 100
            accumulator.Va += Number(item.Va) * Number(item.Wt) / 100
            accumulator.Fe += Number(item.Fe) * Number(item.Wt) / 100
            accumulator.Carbohydrate += Number(item.Carbohydrate) * Number(item.Wt) / 100
            accumulator.Fat += Number(item.Fat) * Number(item.Wt) / 100
            accumulator.Wt += Number(item.Wt)
            return accumulator
          }, {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          })
        } else {
          return {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          }
        }
      })
    },
    /**
     * myApp.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数
     * ただしfood_grp_idがStapleの場合、PrとFeを無視する
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter2() {
      const vm = this
      return vm.myApp.menuCases.map((datArray) => {
        if (datArray.menu.length > 0) {
          return datArray.menu.reduce((accumulator, item) => {
            let myPr = item.Pr ? item.Pr : 0
            let myFe = item.Fe ? item.Fe : 0
            let myFat = item.Fat ? item.Fat : 0

            // 食品群がstapleであった場合、Pr、Fe の値を無視
            if (Number(item.food_grp_id) === 1) {
              myPr = 0
              myFe = 0
              myFat = 0
            }

            accumulator.En += Number(item.En ? item.En : 0) * Number(item.Wt) / 100
            accumulator.Pr += Number(myPr) * Number(item.Wt) / 100
            accumulator.Va += Number(item.Va ? item.Va : 0) * Number(item.Wt) / 100
            accumulator.Fe += Number(myFe) * Number(item.Wt) / 100
            accumulator.Carbohydrate += Number(item.Carbohydrate ? item.Carbohydrate : 0) * Number(item.Wt) / 100
            accumulator.Fat += Number(myFat) * Number(item.Wt) / 100
            accumulator.Wt += Number(item.Wt)
            return accumulator
          }, {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          })
        } else {
          return {
            'En': 0,
            'Pr': 0,
            'Va': 0,
            'Fe': 0,
            'Wt': 0,
            'Carbohydrate': 0,
            'Fat': 0
          }
        }
      })
    },
    /**
     * nutritionSupplyの平均値
     * @returns {{Pr: number, Fat: number, En: number, Carbohydrate: number, Va: number, Wt: number, Fe: number}}
     */
    averageNutritionSupplyGetter() {
      let count = 0
      const supplySum = this.nutritionSupplyGetter2.reduce((accumulator, item) => {
        if (item.Wt > 0) {
          count += 1
          accumulator.En += Number(item.En)
          accumulator.Pr += Number(item.Pr)
          accumulator.Va += Number(item.Va)
          accumulator.Fe += Number(item.Fe)
          accumulator.Carbohydrate += Number(item.Carbohydrate)
          accumulator.Fat += Number(item.Fat)
          accumulator.Wt += Number(item.Wt)
        }
        return accumulator
      }, {
        'En': 0,
        'Pr': 0,
        'Va': 0,
        'Fe': 0,
        'Wt': 0,
        'Carbohydrate': 0,
        'Fat': 0
      })
      return {
        'En': supplySum.En / count,
        'Pr': supplySum.Pr / count,
        'Va': supplySum.Va / count,
        'Fe': supplySum.Fe / count,
        'Wt': supplySum.Wt / count,
        'Carbohydrate': supplySum.Carbohydrate / count,
        'Fat': supplySum.Fat / count,
      }
    },
    /**
     * nutritionDemandGetterの平均値
     * @returns {{Pr: number, En: number, Va: number, Wt: number, Fe: number}}
     */
    averageNutritionDemandGetter() {
      let count = 0
      const demandSum = this.nutritionDemandGetter.reduce((accumulator, item) => {
        if (item.En > 0) {
          count += 1
          accumulator.En += Number(item.En ? item.En : 0)
          accumulator.Pr += Number(item.Pr ? item.Pr : 0)
          accumulator.Va += Number(item.Va ? item.Va : 0)
          accumulator.Fe += Number(item.Fe ? item.Fe : 0)
          accumulator.Wt += Number(item.Wt ? item.Wt : 0)
        }
        return accumulator
      }, {
        'En': 0,
        'Pr': 0,
        'Va': 0,
        'Fe': 0,
        'Wt': 0,
      })
      return {
        'En': demandSum.En / count,
        'Pr': demandSum.Pr / count,
        'Va': demandSum.Va / count,
        'Fe': demandSum.Fe / count,
        'Wt': demandSum.Wt / count,
      }
    },
    averageRatingGetter() {
      const supply = this.averageNutritionSupplyGetter
      const demand = this.averageNutritionDemandGetter
      return {
        En: demand.En ?
          Math.round(100 * supply.En * this.driRange / demand.En) / 10 : 0,
        Pr: demand.Pr ?
          Math.round(100 * supply.Pr * this.driRange / demand.Pr) / 10 : 0,
        Va: demand.Va ?
          Math.round(100 * supply.Va * this.driRange / demand.Va) / 10 : 0,
        Fe: demand.Fe ?
          Math.round(100 * supply.Fe * this.driRange / demand.Fe) / 10 : 0
      }
    },

    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter() {
      const res = []
      for (let i = 0; i < this.sceneCount; i++) {
        const supply = this.nutritionSupplyGetter2[i]
        const demand = this.nutritionDemandGetter[i]
        res.push({
          En: demand.En ?
            Math.round(100 * supply.En * this.driRange / demand.En) / 10 : 0,
          Pr: demand.Pr ?
            Math.round(100 * supply.Pr * this.driRange / demand.Pr) / 10 : 0,
          Va: demand.Va ?
            Math.round(100 * supply.Va * this.driRange / demand.Va) / 10 : 0,
          Fe: demand.Fe ?
            Math.round(100 * supply.Fe * this.driRange / demand.Fe) / 10 : 0
        })
      }
      return res
    },
    /**
     *
     * @returns {[{val: number, color: string},{val: number, color: string},{val: number, color: string}][]}
     */
    pfcBalanceCurrent() {
      return updatePfc(this.nutritionSupplyGetter2, this.nutritionDemandGetter)
    }
  },
  data() {
    return {
      /**
       * リストから選択されたnoteの値
       */
      selectedNote: '',
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
       * ratingを計算するにあたって、同一メニューを一日3回食べると仮定した場合の評価、
       *     (recepiTableの値×3)、または1回分が一日の栄養素に与える影響の評価を
       *     切り替える
       * @returns {number}
       */
      driRange: 1,
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
  methods: {
    /**
     * Caseのリストをクリックした際に含まれるnoteを代入
     * @param val
     */
    clickCaseName(val) {
      this.selectedNote = this.myApp.menuCases[val - 1].note
      console.log(this.selectedNote)
    },
  }
}
</script>
