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
            <div class="font-weight-bold">Case information</div>
          </template>
          <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
          <div class="d-flex flex-row">
            <b-form-input
              v-model="pageMemo[pageIdComputed]"
              placeholder="note for this family"
              :state="noteInputState"
              @update="updatePageMemo(pageMemo[pageIdComputed])"
              class="my-1">
            </b-form-input>
          </div>
          <b-button
            @click="showFct = !showFct"
            variant="info"
          >add crop
          </b-button>
        </b-card>
      </b-col>
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
                'bg-warning': !diversityStatus[pageIdComputed][index][grp],
                'bg-success': diversityStatus[pageIdComputed][index][grp]
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
            :rating="rating[pageIdComputed][nutritionLabel[index-1]]"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed][nutritionLabel[index-1]]"
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
            <b-col cols="6">Recommended</b-col>
            <b-col cols="6">Current</b-col>
          </b-row>
          <b-button @click="enlargeChart">push</b-button>
          <b-row>
            <b-col cols="6">
              <pie-chart
                v-if="pfcStandard"
                :chart-data="pfcStandard"
                :height="chartHeight"
              />
            </b-col>
            <b-col cols="6">
              <pie-chart
                v-if="pfcBalanceCurrent[pageIdComputed]"
                :chart-data="pfcBalanceCurrent[pageIdComputed]"
                :height="chartHeight * pfcScale[pageIdComputed]"
              />
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
            :items="currentMenu"
            @itemDeleted="notifiRecepiEdit"
            @rowClick="notifiRecepiEdit"
          ></recepi-table>
        </b-card>
      </b-col>
    </b-row>
    <fctTableModal2
      my-name="fctModal2"
      :show-modal.sync="showFct"
      :items="myFct"
      :menu-cases.sync="currentMenu"
      :portion-units="myPortion"
      @update:menuCases="updateSupply($event, pageIdComputed)"
    ></fctTableModal2>
  </b-container>
</template>

<script>
import pieChart from "../atoms/pieChart";
import driSelectModal from "@/components/organisms/driSelectModal";
import recepiTable from "@/components/molecules/recepiTable"
import nutritionBar2 from "@/components/molecules/nutritionBar2"
import macroNutrientBar from "@/components/molecules/macroNutrientBar";
import fctTableModal2 from "@/components/organisms/FctTableModal2";
import {
  getNutritionSupplyList, validateMyFamily,
  getNutritionDemandList, updatePfc
} from "../../plugins/helper";

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
    fctTableModal2,
    pieChart
  },
  data() {
    return {
      pfcBalanceCurrent: [],
      chartHeight: window.innerHeight / 2,
      currentMenu: [],
      /**
       * 使用する全変数のobject
       * myFamilyから読み込んでこのページで利用。更新された時にemitを返す
       */
      myFamilyWatcher: {},
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
       * ターゲットの1グループあたり設定人数の最大値
       */
      maxPopulation: 10000,
      /**
       * nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定
       */
      driSwitch: true,
      /**
       * 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty
       */
      items_modal: [],
      /**
       * 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty
       */
      value_model: 0,
      /**
       * 当該作物がどのメニュに含まれるかを示す変数
       */
      menuName_modal: '',
      /**
       * driSelectAll表示用のフラグ
       */
      showDriSelect: false,
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * modal表示用のフラグ
       */
      showModal: false,
      /**
       * 各ページの捕捉情報
       */
      pageMemo: [],
      /**
       * PFCバランスの推奨値
       */
      pfcStandard: {
        labels: ['protein', 'fat', 'carbo.'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['green', 'yellow', 'red'],
            data: [35, 10, 55],
          }
        ]
      },
    }
  },
  props: {
    myFamily: {
      type: Object,
      required: true,
      validator: function (value) {
        return validateMyFamily(value)
      },
    },
    myDri: {
      type: Array,
      required: true
    },
    myFct: {
      type: Array,
      required: true
    },
    myPortion: {
      type: Array,
      required: true
    },
    /**
     * 複数インスタンスを作成する場合のindex
     */
    pageId: {
      type: Number,
      required: true
    },
    /**
     * 作成するページ数
     */
    maxPage: {
      type: Number,
      required: true
    },
    /**
     * 最初のページを表示しないためのフラグ
     */
    disabledOption: {
      type: Array,
      default: []
    },
  },
  computed: {
    pfcScale() {
      const vm = this
      return vm.rating.map((item) => {
        let res = item.En
        if (res < 0.5) {
          res = 0.5
        }
        if (res > 1.5) {
          res = 1.5
        }
        return res
      })
    },
    myChartStyles() {
      return {
        height: `${this.chartHeight}%`,
        position: 'relative'
      }
    },
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
    /**
     * 現在のページ番号
     */
    pageIdComputed: {
      get: function () {
        return this.pageId
      },
      set: function (newVal) {
        if (this.pageId !== newVal) this.$emit('update:pageId', newVal)
      }
    },
    /**
     * 全ページ数
     * @returns {*[]}
     */
    pageOptions() {
      let res = []
      for (let i = 0; i < this.maxPage; i++) {
        res.push({
          value: i,
          text: 'page' + i + ': ' + this.pageMemo[i],
          disabled: this.disabledOption.includes(i)
        })
      }
      return res
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
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      if (vm.myFamilyWatcher.menuCases !== []) {
        return vm.myFamilyWatcher.menuCases.map((foodsTemp) => {
          let res = vm.foodGroup.map((groupTemp) => {
            return {[groupTemp]: false}
          })
          foodsTemp.menu.forEach((dat1) => {
            const indexTemp = vm.foodGroup.indexOf(dat1.Group)
            if (indexTemp >= 0) {
              res[indexTemp][dat1.Group] = true
            }
          })
          return res
        })
      } else {
        return res
      }
    },
    /**
     * noteの記入状態
     * @returns {boolean}
     */
    noteInputState() {
      if (this.pageMemo.length === 0) {
        return false
      }
      return (this.pageMemo[this.pageIdComputed].length > 3)
    }
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
        const memberSet = JSON.parse(JSON.stringify(vm.myFamilyWatcher.member))
        const memberSetList = [...Array(vm.maxPage)].map(() => memberSet)
        vm.nutritionDemandWatcher = JSON.parse(JSON.stringify(getNutritionDemandList(
          memberSetList,
          vm.myDri
        )))
        vm.nutritionSupplyWatcher = JSON.parse(JSON.stringify(getNutritionSupplyList(
          vm.myFamily.menuCases, vm.maxPage)))
        vm.rating = JSON.parse(JSON.stringify(vm.ratingGetter(
          vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)))
        vm.pageMemo = vm.myFamily.menuCases.map((item2) => {
          return item2.note
        })
        vm.currentMenu = JSON.parse(JSON.stringify(vm.myFamilyWatcher.menuCases[this.pageIdComputed].menu))
        vm.pfcBalanceCurrent = JSON.parse(JSON.stringify(
          updatePfc(vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)
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
    const memberSet = JSON.parse(JSON.stringify(vm.myFamilyWatcher.member))
    const memberSetList = [...Array(vm.maxPage)].map(() => memberSet)
    vm.nutritionDemandWatcher = JSON.parse(JSON.stringify(getNutritionDemandList(
      memberSetList,
      vm.myDri
    )))
    vm.nutritionSupplyWatcher = JSON.parse(JSON.stringify(getNutritionSupplyList(
      vm.myFamily.menuCases, vm.maxPage)))
    vm.rating = JSON.parse(JSON.stringify(vm.ratingGetter(
      vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)))
    vm.pageMemo = vm.myFamily.menuCases.map((item2) => {
      return item2.note
    })
    vm.currentMenu = JSON.parse(JSON.stringify(vm.myFamilyWatcher.menuCases[this.pageIdComputed].menu))
    vm.pfcBalanceCurrent = JSON.parse(JSON.stringify(
      updatePfc(vm.nutritionSupplyWatcher, vm.nutritionDemandWatcher)
    ))
  },
  methods: {
    enlargeChart() {
      this.chartHeight += 10
      console.log(this.chartHeight)
    },
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatePageMemo(newVal) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[this.pageIdComputed].note = newVal
      //更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
    ratingGetter(supplyCases, demandCases) {
      const res = []
      for (let i = 0; i < this.maxPage; i++) {
        const supply = supplyCases[i]
        const demand = demandCases[i]
        /*
                const supply = this.nutritionSupplyWatcher[i]
                const demand = this.nutritionDemandWatcher[i]
        */
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
    /** ユーザーによりmenuCasesが変更された際に、myApp全体を更新してemit
     * @param val
     * @param index
     */
    updateSupply(val, index) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[index].menu = val
      //更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit
     * @param val 更新されたグループ構成
     */
    updateDemand(val) {
      const vm = this
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myFamilyWatcher))
      //更新されたtargetを入れ替える
      dat.member = JSON.parse(JSON.stringify(val))
      //更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    }
    ,
    /**
     * ユーザーによりrecepiTableがクリックされた際に、行の内容を組み込んでfoodModalを開く
     * @param val
     */
    onRecepiClicked(val) {
      this.items_modal.length = 0
      this.items_modal.push({
        'id': val.id,
        'Name': val.Name,
        'Group': val.Group,
        'En': val.En,
        'Pr': val.Pr,
        'Va': val.Va,
        'Fe': val.Fe,
      })
      this.menuName_modal = val.menuName
      this.value_model = val.Wt
      this.showModal = true
    }
    ,
    /**
     * ユーザーによりfctTableがクリックされた時に行の内容を組み込んでfoodModalを開く
     * @param val
     */
    onFctClick(val) {
      this.items_modal.length = 0
      this.items_modal.push({
        'id': val.id,
        'Name': val.Name,
        'Group': val.Group,
        'En': val.En,
        'Pr': val.Pr,
        'Va': val.Va,
        'Fe': val.Fe,
        'Carbohydrate': val.Carbohydrate,
        'Fat': val.Fat,
      })
      this.value_model = 0
      this.showModal = true
    }
    ,
    /**
     * menuが変更・追加された際に、栄養素供給量合計を再計算してemit
     * 新規なら追加、変更なら更新
     * @param val 更新されたmenu
     */
    addSupply(val) {
      const vm = this
      //menuを更新する
      let existing = false
      let newMenu = []
      newMenu = vm.myFamilyWatcher.menuCases[vm.pageIdComputed].menu.map((item) => {
        if (item.id === val.id && item.menuName === val.menuName) {
          existing = true
          return JSON.parse(JSON.stringify(val))
        } else {
          return item
        }
      })
      if (!existing) {
        newMenu.push(val)
      }
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[vm.pageIdComputed].menu = newMenu
      //更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    }
    ,
    /**
     * menuが削除された際に、栄養素供給量合計を再計算してemit
     * @param val 更新されたmenu
     */
    deleteSupply(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[this.pageIdComputed].menu = val
      //更新されたmyAppをemit
      this.$emit('update:myFamily', dat)
    }
    ,
    //fctとdriの表示調整
    toggleFctDri() {
      console.log('test')
    },
    notifiRecepiEdit() {
      alert('you can edit diet record by clicking [add crop] button')
    }
  }
}
</script>
