<template>
  <b-container>
    <b-row class="my-2">
      <b-col cols="12" lg="6">
        <b-card bg-variant="light" class="my-2">
          <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
          <div class="d-flex flex-row">
            <b-form-input
              v-model="pageMemo[pageIdComputed]"
              placeholder="note for this family"
              class="my-1"></b-form-input>
            <b-button
              @click="updatePageMemo(pageMemo[pageIdComputed])"
              size="sm"
              class="mx-1 my-1">update
            </b-button>
          </div>
          <b-button
            @click="showDriSelect = !showDriSelect"
            variant="info"
          >set family
          </b-button>
          <b-button
            @click="showFct = !showFct"
            variant="info"
          >add crop
          </b-button>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card title="dietary diversity" class="my-2">
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
        <b-card title="Key Nutrients Sufficiency" class="my-2">
          <b-row>
            <b-col cols="2" class="d-flex justify-content-center">Target</b-col>
            <b-col cols="2" class="d-flex justify-content-center">Supply</b-col>
            <b-col class="d-flex justify-content-right">sufficiency rate</b-col>
          </b-row>
          <nutrition-bar
            v-for="index in 4" :key="index"
            :col-width-first=2
            :col-width-second=2
            :label="nutritionLabel[index-1]"
            :max-rating="maxRating"
            :rating="rating[pageIdComputed][nutritionLabel[index-1]]"
            :maxRatingAbsolute="nutritionSupplyWatcher[pageIdComputed][nutritionLabel[index-1]]"
          />
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card title="PFC Balance" class="my-2">
          <b-row>
            <b-col cols="4">
              <div>PFC recommend</div>
            </b-col>
            <b-col cols="7">
              <macro-nutrient-bar
                :chart-values="pfcBalanceStandard"
              ></macro-nutrient-bar>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <div>Current PFC</div>
            </b-col>
            <b-col cols="7">
              <macro-nutrient-bar
                :chart-values="pfcBalanceCurrent[pageIdComputed]"
              ></macro-nutrient-bar>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card bg-variant="light" title="Record of Diet" class="my-2">
          <recepi-table
            :items.sync="myAppWatcher.menuCases[pageIdComputed].menu"
            @itemDeleted="deleteSupply"
            @rowClick="onRecepiClicked"
            @totalChanged="updatePfc"
          ></recepi-table>
        </b-card>
      </b-col>
    </b-row>
    <FctTableModal
      my-name="fctModal"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="myAppWatcher.dataSet.fct"
      @modalOk="onFctClick"
    ></FctTableModal>
    <food-modal
      :show-modal.sync="showModal"
      :max-weight=500
      my-name="myFoodModal"
      :items="items_modal"
      :value.sync="value_model"
      :menu-name.sync="menuName_modal"
      :portion-units="myAppWatcher.dataSet.portionUnit"
      @modalOk="addSupply"
    />
    <dri-select-modal
      my-modal-header="nutrition target"
      my-name="driModal"
      :show-modal.sync="showDriSelect"
      :targetSwitch.sync="myAppWatcher.menuCases[pageIdComputed].isTargetSingle"
      :max="maxPopulation"
      :driPopulations="myAppWatcher.menuCases[pageIdComputed].target"
      :driItems="myAppWatcher.dataSet.dri"
      @update:target="updateDemand"
    />
  </b-container>
</template>

<script>
import FctTableModal from "@/components/organisms/FctTableModal.vue";
import driSelectModal from "@/components/organisms/driSelectModal";
import foodModal from "@/components/molecules/foodModal"
import recepiTable from "@/components/molecules/recepiTable"
import nutritionBar from "@/components/molecules/nutritionBar"
import macroNutrientBar from "@/components/molecules/macroNutrientBar";
import {validateMyApp} from "@/plugins/helper";

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
    FctTableModal,
    recepiTable,
    foodModal,
    nutritionBar,
    driSelectModal,
    macroNutrientBar
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
      pageMemo: '',
      /**
       * PFCバランスの推奨値
       */
      pfcBalanceStandard: [
        {val: 55, color: 'red'},
        {val: 35, color: 'green'},
        {val: 10, color: 'yellow'},
      ],
      /**
       * PFCバランスの現状
       */
      pfcBalanceCurrent: [
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
        [
          {val: 55, color: 'red'},
          {val: 35, color: 'green'},
          {val: 10, color: 'yellow'},
        ],
      ]
    }
  },
  props: {
    /**
     * データ本体。myAppWatcherで読み込んでページ内で利用
     */
    myApp: {
      type: Object,
      validator: function (value) {
        return validateMyApp(value)
      },
      required: true,
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
        res.push({value: i, text: 'page:' + i})
      }
      return res
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
    /**
     * menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定
     * @returns {*[]}
     */
    diversityStatus() {
      const vm = this
      return this.myApp.menuCases.map((foodsTemp) => {
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
    },
  },
  watch: {
    /**
     * myApp Property(オブジェクト)の変更を検知してコンポーネントに反映させる
     */
    myApp: {
      deep: true,
      handler(newVal) {
        this.myAppWatcher = JSON.parse(JSON.stringify(newVal))
        this.nutritionDemandWatcher = JSON.parse(JSON.stringify(this.nutritionDemandGetter()))
        this.nutritionSupplyWatcher = JSON.parse(JSON.stringify(this.nutritionSupplyGetter()))
        this.rating = JSON.parse(JSON.stringify(this.ratingGetter()))
        this.pageMemo = this.myAppWatcher.menuCases.map(function (item) {
          return item.note
        })
      }
    },
  },
  /**
   * 初期値の代入
   */
  created() {
    this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
    this.nutritionDemandWatcher = JSON.parse(JSON.stringify(this.nutritionDemandGetter()))
    this.nutritionSupplyWatcher = JSON.parse(JSON.stringify(this.nutritionSupplyGetter()))
    this.rating = JSON.parse(JSON.stringify(this.ratingGetter()))
    this.pageMemo = this.myAppWatcher.menuCases.map(function (item) {
      return item.note
    })
  },
  methods: {
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatePageMemo(newVal) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[this.pageIdComputed].note = newVal
      //更新されたmyAppをemit
      this.$emit('update:pageMemo', dat)
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
          accumulator.En = (accumulator.En || 0) + Number(count) * Number(dri.En)
          accumulator.Pr = (accumulator.Pr || 0) + Number(count) * Number(dri.Pr)
          accumulator.Va = (accumulator.Va || 0) + Number(count) * Number(dri.Va)
          accumulator.Fe = (accumulator.Fe || 0) + Number(count) * Number(dri.Fe)
          accumulator.Wt = (accumulator.Wt || 0) + Number(count) * Number(dri.Wt)
          return accumulator
        }, {})
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
            accumulator.En += Number(item.En)
            accumulator.Pr += Number(item.Pr)
            accumulator.Va += Number(item.Va)
            accumulator.Fe += Number(item.Fe)
            accumulator.Wt += Number(item.Wt)
            accumulator.Carbohydrate += Number(item.Carbohydrate)
            accumulator.Fat += Number(item.Fat)
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
     * nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出
     * @returns {*[]} 栄養素ごとの充足率
     */
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
    /**
     * ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit
     * @param val 更新されたグループ構成
     */
    updateDemand(val) {
      const vm = this
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myAppWatcher))
      //更新されたtargetを入れ替える
      dat.menuCases[vm.pageIdComputed].target = JSON.parse(JSON.stringify(val))
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
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
    },
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
    },
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
      newMenu = vm.myAppWatcher.menuCases[vm.pageIdComputed].menu.map((item) => {
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
      let dat = JSON.parse(JSON.stringify(vm.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[vm.pageIdComputed].menu = newMenu
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * menuが削除された際に、栄養素供給量合計を再計算してemit
     * @param val 更新されたmenu
     */
    deleteSupply(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.menuCases[this.pageIdComputed].menu = val
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    //fctとdriの表示調整
    toggleFctDri() {
      console.log('test')
    },
    /**
     * recepiTableが更新される旅に、pfcBalanceCurrent
     *    の値を更新
     *    conversion factor
     *    -Carbohydrate: 4Kcal/gram
     *    -Protein: 4Kcal/gram
     *    -Fat: 9Kcal/gram
     */
    updatePfc() {
      this.pfcBalanceCurrent = this.nutritionSupplyWatcher.map((dat) => {
        return [
          {val: Math.round(dat.Carbohydrate * 4), color: 'red'},
          {val: Math.round(dat.Pr * 4), color: 'green'},
          {val: Math.round(dat.Fat * 9), color: 'yellow'},
        ]
      })
    }
  }
}
</script>
