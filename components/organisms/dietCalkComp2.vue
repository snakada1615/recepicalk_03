<template>
  <b-container>
    <b-row class="my-2">
      <b-col>
        <b-card bg-variant="light">
          <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
          <div class="text-warning">page: {{ pageIdComputed }}</div>
          <div>supply: {{ nutritionSupplyWatcher[pageIdComputed] }}</div>
          <div>--------------------------------------------</div>
          <div>demand: {{ nutritionDemandWatcher[pageIdComputed] }}</div>
          <b-form-checkbox
            switch
            v-model="driSwitch"
          >evaluate [daily consumption] /[single meal]
          </b-form-checkbox>
          <b-row>
            <b-col cols="2" class="d-flex justify-content-center">Target</b-col>
            <b-col cols="2" class="d-flex justify-content-center">Supply</b-col>
            <b-col class="d-flex justify-content-right">sufficiency rate</b-col>
          </b-row>
          <nutrition-bar
            :col-width-first=2
            :col-width-second=2
            :label="nutritionLabel[0]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed].En"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed].En"
          />
          <nutrition-bar
            :col-width-first=2
            :col-width-second=2
            :label="nutritionLabel[1]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed].Pr"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed].Pr"
          />
          <nutrition-bar
            :col-width-first=2
            :col-width-second=2
            :label="nutritionLabel[2]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed].Va"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed].Pr"
          />
          <nutrition-bar
            :col-width-first=2
            :col-width-second=2
            :label="nutritionLabel[3]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed].Fe"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed].Fe"
          />
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button @click="showDriSelect = !showDriSelect">set target</b-button>
        <b-button>set menu</b-button>
      </b-col>
    </b-row>
    <b-row v-if="showDriSelect">
      <b-col>
        <dri-select-all
          v-show="showDriSelect "
          :targetSwitch.sync="myAppWatcher.menuCases[pageIdComputed].isTargetSingle"
          :max="maxPopulation"
          :driPopulations="myAppWatcher.menuCases[pageIdComputed].target"
          :driItems="myAppWatcher.dataSet.dri"
          @update:target="updateDemand"
        ></dri-select-all>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card
          bg-variant="light"
        >
          <recepi-table
            :items.sync="myAppWatcher.menuCases[pageIdComputed].menu"
            @update:items="updateSupply"
            @totalChanged="onNutritionSumChanged"
          ></recepi-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/molecules/FctTable"
import recepiTable from "@/components/molecules/recepiTable"
import foodModal from "@/components/molecules/foodModal"
import nutritionBar from "@/components/molecules/nutritionBar"

export default {
  components: {
    driSelectAll,
    FctTable,
    recepiTable,
    foodModal,
    nutritionBar
  },
  data() {
    return {
      /**
       * 使用する全変数のobject
       * myAppから読み込んでこのページで利用。更新された時にemitを返す
       */
      myAppWatcher: {},
      /**
       * menuテーブルから計算される栄養供給量の合計値
       * menuCases[].menuから読み込んでこのページで利用。参照専用
       */
      nutritionSupplyWatcher: [],
      /**
       * menuテーブルから計算される栄養供給目標の合計値
       * nutritionDemandから読み込んでこのページで利用。参照専用
       */
      nutritionDemandWatcher: {},
      /**
       * nutritionBar用のレーティング
       * nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算
       */
      rating: [],
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
      /**
       * nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定
       */
      driSwitch: true,
      /**
       * driSelectAll表示用のフラグ
       */
      showDriSelect: false,
      /**
       * ターゲットの1グループあたり設定人数の最大値
       */
      maxPopulation: 10000,
    }
  },
  props: {
    /**
     * データ本体。myAppWatcherで読み込んでページ内で利用
     */
    myApp: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    /**
     * 複数インスタンスを作成する場合のindex
     */
    pageId: {
      type: Number,
      default: 0,
      required: true
    },
    /**
     * 作成するページ数
     */
    maxPage: {
      type: Number,
      default: 0,
      required: true
    }
  },
  computed: {
    /**
     * ratingを計算するにあたって、同一メニューを一日3回食べると仮定した場合の評価、
     *     (recepiTableの値×3)、または1回分が一日の栄養素に与える影響の評価を
     *     切り替える
     * @returns {number}
     */
    driRange: function () {
      let res = 3
      if (this.driSwitch) {
        res = 1
      }
      return res
    },
    pageIdComputed: {
      get: function () {
        return this.pageId
      },
      set: function (newVal) {
        if (this.pageId !== newVal) this.$emit('update:pageId', newVal)
      }
    },
    pageOptions() {
      let res = []
      for (let i = 0; i < this.maxPage; i++) {
        res.push({value: i, text: 'page:' + i})
      }
      return res
    },
  },
  watch: {
    myApp: {
      deep: true,
      handler(newVal) {
        this.myAppWatcher = JSON.parse(JSON.stringify(newVal))
        this.nutritionDemandWatcher = JSON.parse(JSON.stringify(this.nutritionDemandGetter()))
        this.nutritionSupplyWatcher = JSON.parse(JSON.stringify(this.nutritionSupplyGetter()))
        this.rating = JSON.parse(JSON.stringify(this.ratingGetter()))
      }
    },
  },
  created() {
    this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
    this.nutritionDemandWatcher = JSON.parse(JSON.stringify(this.nutritionDemandGetter()))
    this.nutritionSupplyWatcher = JSON.parse(JSON.stringify(this.nutritionSupplyGetter()))
    this.rating = JSON.parse(JSON.stringify(this.ratingGetter()))
  },
  methods: {
    nutritionDemandGetter() {
      const vm = this
      return vm.myApp.menuCases.map((dat) => {
        return dat.target.reduce((accumulator, item, index) => {
          const dri = vm.myApp.dataSet.dri[index]
          const count = item.count
          accumulator.En = (accumulator.En || 0) + Number(count) * Number(dri.En)
          accumulator.Pr = (accumulator.Pr || 0) + Number(count) * Number(dri.Pr)
          accumulator.Va = (accumulator.Va || 0) + Number(count) * Number(dri.Va)
          accumulator.Fe = (accumulator.Fe || 0) + Number(count) * Number(dri.Fe)
          accumulator.Wt = (accumulator.Wt || 0) + Number(count) * Number(dri.Wt)
          return accumulator
        }, {})
      })
    },
    nutritionSupplyGetter() {
      const vm = this
      return vm.myApp.menuCases.map((datArray) => {
        if (datArray.menu.length > 0) {
          return datArray.menu.reduce((accumulator, item) => {
            accumulator.En = (accumulator.En || 0) + Number(item.En)
            accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr)
            accumulator.Va = (accumulator.Va || 0) + Number(item.Va)
            accumulator.Fe = (accumulator.Fe || 0) + Number(item.Fe)
            accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt)
            return accumulator
          }, {})
        } else {
          return {'En': 0, 'Pr': 0, 'Va': 0, 'Fe': 0, 'Wt': 0}
        }
      })
    },
    ratingGetter() {
      const res = []
      for (let i = 0; i < this.maxPage; i++) {
        const supply = this.nutritionSupplyWatcher[i]
        const demand = this.nutritionDemandWatcher[i]
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
    updateDemand(val) {
      const vm = this
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myAppWatcher))
      //更新されたtargetを入れ替える
      dat.menuCases[vm.pageIdComputed].target = JSON.parse(JSON.stringify(val))
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    onNutritionSumChanged(){
      console.log('ba----')
    },
    updateSupply(val){
      const vm = this
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[vm.pageIdComputed].menu = JSON.parse(JSON.stringify(val))
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
  }
}
</script>
