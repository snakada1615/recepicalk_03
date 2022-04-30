<template>
  <b-container>
    <b-row class="my-2">
      <b-col>
        <b-card bg-variant="light">
          PAGE:{{ pageIdComputed }}
          <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
          <div class="text-warning">page: {{ pageIdComputed }}</div>
          <div>{{ nutritionSupplyWatcher[pageIdComputed] }}</div>
          <div>--------------------------------------------</div>
          <div>{{ nutritionDemandWatcher[pageIdComputed] }}</div>
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
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/molecules/FctTable"
import recepiTable from "@/components/molecules/recepiTable"
import foodModal from "@/components/molecules/foodModal"
import nutritionBar from "@/components/molecules/nutritionBar"
import {isEmpty, isObjectDeepEqual} from "~/plugins/helper";

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
    updateTarget(val) {
      const vm = this
      //作業用のmyAppコピー作成
      const dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //menuCaseの更新
      const myMenuCase = dat.menuCases.map(function (dat, index) {
        let dat2 = JSON.parse(JSON.stringify(dat))
        if (index === vm.pageId) {
          dat2 = JSON.parse(JSON.stringify(val))
        }
        return dat2
      })
      //更新されたmenuCaseを組み込む
      dat.menuCases = JSON.parse(JSON.stringify(myMenuCase))
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
      //this.myAppWatcher.menuCases[this.pageId].target = JSON.parse(JSON.stringify(val))
    },
    save() {
      this.$store.dispatch('fire/saveAppdata')
    }
  }
}
</script>
