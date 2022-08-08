<template>
  <b-container>
    {{myFamilyResult}}
    <b-row v-if="false">
      <b-col cols="12" lg="6" class="my-1">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
        >
          ...
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
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import nutritionBar2 from "@/components/molecules/nutritionBar2";
import macroNutrientBar from "@/components/molecules/macroNutrientBar";
import {getNutritionDemand, getNutritionSupply} from "../../plugins/helper";

export default {
  components: {
    nutritionBar2,
    macroNutrientBar
  },
  computed: {
    diversityStatusFiltered() {
      return this.diversityStatus.filter((val, index) => {
        return this.showScore[index]
      })
    },
    /**
     * それぞれのmenuCaseを表示するかどうかの判定フラグ
     * @returns {unknown[]}
     */
    showScore() {
      let vm = this
      return vm.myApp.menuCases.map((val, index) => {
        console.log(val.menu)
        if (val.menu.length === 0 ) {
          return false
        } else {
          return val.menu[0].Name === vm.myApp.keyCommodity || index === 0;
        }
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
      return this.myFamilyCase
    },
    sceneCount: function () {
      return this.mySceneCount
    },
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
      //作業用のmyFamilyコピー作成
      const dat = JSON.parse(JSON.stringify(vm.myFamily))
      const res = getNutritionDemand(dat.member, vm.myDri)
      return [...Array(count)].map(() => res);

    },
    /**
     * myApp.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter() {
      const vm = this
      return vm.myFamily.menuCases.map((datArray) => {
        if (datArray.menu.length > 0) {
          return getNutritionSupply(datArray.menu)
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
          return getNutritionSupply(datArray.menu, 1)
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
      return this.nutritionSupplyGetter2.map((dat, index) => {
        return [
          {val: Math.round(dat.Pr * 4), color: 'green', label: '%'},
          {val: Math.round(dat.Fat * 9), color: 'yellow', label: '%'},
          {val: Math.round(dat.Carbohydrate * 4), color: 'red', label: '%'},
          {
            val: Math.round(this.nutritionDemandGetter[index].En
              - dat.Carbohydrate * 4 - dat.Pr * 4 - dat.Fat * 9),
            color: 'silver',
            label: '$',
          },
        ]
      })
    },
    myFamilyResult(){
      let res = []
      const dat = JSON.parse(JSON.stringify(this.myFamilyCase))
      if (!dat.menuCases) {
        return
      }
      res.push(dat.menuCases[0])

      const dat2 = dat.feasibilityCases.find((item)=>{
        if (item.selectedCrop.length > 0 && dat.keyCommodity) {
          console.log(item.selectedCrop[0].Name)
          console.log(dat.keyCommodity)
          return item.selectedCrop[0].Name === dat.keyCommodity
        }
        return false
      })

      if (dat2){
        if (dat2.length > 0){
          res.push(dat2[0].selectedCrop)
        }
      }
      return res
    },
  },
  data() {
    return {
      /**
       * リストから選択されたnoteの値
       */
      selectedNote: '',
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
  props: {
    myFamilyCase: {
      type: Object,
      required: true,
    },
    myDri: {
      type: Array,
      required: true,
    },
    myFct: {
      type: Array,
      required: true,
    },
    mySceneCount: {
      type: Number,
      required: true,
    },
  },
  methods: {

  }
}
</script>
