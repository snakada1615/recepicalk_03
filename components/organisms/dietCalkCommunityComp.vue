<template>
  <b-container>
    <b-row class="my-2">
      <b-col cols="12" lg="6">
        <div class="font-weight-bold">Estimate Annual Supply Target of NDF</div>
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
              @update="updatePageMemo"
              class="my-1">
            </b-form-input>
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
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Target Group</div>
          </template>
          <b-table
            :fields="fieldDRI"
            :items="updateTablePop(myAppWatcher.dataSet.dri, myAppWatcher.prodTargetCases[pageIdComputed].target)"
          >
          </b-table>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6">
        <b-card
          header-bg-variant="success"
          border-variant="success"
          bg-variant="light"
          class="my-2">
          <template #header>
            <div class="font-weight-bold">Target Commodity</div>
          </template>
          <div class="font-weight-bold" v-if="myAppWatcher.prodTargetCases[pageIdComputed].prodTarget.length">
            Target commodity: <span
            class="text-danger">{{ myAppWatcher.prodTargetCases[pageIdComputed].prodTarget[0].Name }}</span>
          </div>
          <div class="font-weight-bold" v-if="myAppWatcher.prodTargetCases[pageIdComputed].prodTarget.length">
            Daily Target:
            <span v-if="nutrientTarget" class="text-danger">
                {{
                setDigit(myAppWatcher.prodTargetCases[pageIdComputed].prodTarget[0].Wt, 2)
              }}
              </span>
          </div>
          <div class="font-weight-bold mb-2" v-if="myAppWatcher.prodTargetCases[pageIdComputed].prodTarget.length">
            Annual Target:
            <span v-if="nutrientTarget" class="text-danger">
                {{
                setDigit(myAppWatcher.prodTargetCases[pageIdComputed].prodTarget[0].Wt365, 2)
              }}
              </span>
          </div>
          <b-row class="my-2">
            <b-col class="font-weight-bold mx-0">
              <b-input-group prepend="target nutrient" size="sm">
                <b-form-select
                  :disabled="!nutritionDemandWatcher[pageIdComputed].En"
                  class="font-weight-bold"
                  v-model="nutrientTarget"
                  :options="Object.keys(rating[pageIdComputed])"
                  @change="updateNutrientTarget"
                >
                </b-form-select>
              </b-input-group>
            </b-col>
            <b-col>
              <b-input-group
                prepend="sufficiency rate"
                append="%"
                size="sm">
                <b-form-input
                  :disabled="myAppWatcher.prodTargetCases[pageIdComputed].prodTarget.length === 0"
                  v-model="targetSufficicncy"
                  type="number"
                  size="sm"
                  @update="updateShare"
                ></b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <recepi-table
            :items.sync="myAppWatcher.prodTargetCases[pageIdComputed].prodTarget"
            @itemDeleted="deleteSupply"
          ></recepi-table>
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
    </b-row>
    <FctTableModal
      my-name="fctModal"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="myAppWatcher.dataSet.fct"
      @modalOk="onFctClick"
    ></FctTableModal>
    <dri-select-modal
      my-modal-header="nutrition target"
      my-name="driModal"
      :show-modal.sync="showDriSelect"
      :targetSwitch.sync="myAppWatcher.prodTargetCases[pageIdComputed].isTargetSingle"
      :max="maxPopulation"
      :driPopulations="myAppWatcher.prodTargetCases[pageIdComputed].target"
      :driItems="myAppWatcher.dataSet.dri"
      @update:target="updateDemand"
    />
  </b-container>
</template>

<script>
import FctTableModal from "@/components/organisms/FctTableModal.vue";
import driSelectModal from "@/components/organisms/driSelectModal";
import recepiTable from "@/components/molecules/recepiTable"
import nutritionBar from "@/components/molecules/nutritionBar"
import {validateMyApp} from "@/plugins/helper";

/**
 * @desc 4つのコンポーネントを組み合わせて必要な作物の量を計算する
 * 1. driSelectModa\
 *    対象グループの選択→栄養必要量の決定
 * 2. FctTableModal\
 *    利用する品目の選択→栄養供給量の決定
 * 3. recepiTable\
 *    選択された品目一覧を示す
 * 4. nutritionBar\
 *    栄養素の充足状況をバーチャートで示す
 *
 */

export default {
  components: {
    FctTableModal,
    recepiTable,
    nutritionBar,
    driSelectModal,
  },
  data() {
    return {
      /**
       * 栄養素充足率のターゲット
       */
      targetSufficicncy: 100,
      /**
       /**
       * リストボックスで選択された重要な栄養素
       */
      nutrientTarget: '',
      /**
       * 使用する全変数のobject
       * myAppから読み込んでこのページで利用。更新された時にemitを返す
       */
      myAppWatcher: {},
      /**
       * prodTargetテーブルから計算される栄養供給量の合計値
       * prodTargetCases[].prodTargetから読み込んでこのページで利用。参照専用
       */
      nutritionSupplyWatcher: [],
      /**
       * prodTargetテーブルから計算される栄養供給目標の合計値
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
      maxPopulation: 1000000,
      /**
       * driSelectAll表示用のフラグ
       */
      showDriSelect: false,
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * 各ページの捕捉情報
       */
      pageMemo: '',
      /**
       * ターゲットグループの表示用のフィールド定義
       */
      fieldDRI: [
        {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Name', sortable: false},
        {key: 'number', sortable: false},
      ],
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
     * driTableをStoreから抽出したもの
     * @returns {[]}
     */
    driItem: function () {
      return this.myApp.dataSet.dri
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
     * noteの記入状態
     * @returns {boolean}
     */
    noteInputState() {
      return (this.pageMemo[this.pageIdComputed].length > 3)
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
        this.pageMemo = this.myAppWatcher.prodTargetCases.map(function (item) {
          return item.note
        })
        this.targetSufficicncy = this.initShare(this.myAppWatcher.prodTargetCases)
        this.nutrientTarget = this.initTarget(this.myAppWatcher.prodTargetCases)
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
    this.pageMemo = this.myAppWatcher.prodTargetCases.map(function (item) {
      return item.note
    })
    this.targetSufficicncy = this.initShare(this.myAppWatcher.prodTargetCases)
    this.nutrientTarget = this.initTarget(this.myAppWatcher.prodTargetCases)
  },
  methods: {
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatePageMemo(newVal) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたprodTargetを入れ替える
      dat.prodTargetCases[this.pageIdComputed].note = newVal
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * 栄養目標（nutrientTarget）の更新：
     * @param newVal
     */
    updateNutrientTarget(newVal) {
      console.log('updateNutrientTarget')
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))

      //nutrientTargetを更新して入れ替える
      const share = dat.prodTargetCases[this.pageIdComputed].prodTarget[0].share
      const vm = this
      const Wt = vm.setQuantity(
        vm.nutritionDemandWatcher[vm.pageIdComputed],
        vm.myAppWatcher.prodTargetCases[vm.pageIdComputed].prodTarget[0],
        newVal,
        share
      )

      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].nutrientTarget = newVal
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt = Wt
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt365 = Wt * 365

      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * 充足率shareを取得(値が初期化されていない場合があるので)
     * @param val
     * @returns {number}
     */
    initShare(val){
      let res = 100
      if (val.length > 0){
        if (val[0].prodTarget.length > 0){
          res = val[0].prodTarget[0].share
        }
      }
      return res
    },
    /**
     *
     * @param val
     * @returns {string}
     */
    initTarget(val){
      let res = 'Pr'
      if (val.length > 0){
        if (val[0].prodTarget.length > 0){
          res = val[0].prodTarget[0].nutrientTarget
        }
      }
      return res
    },
    /**
     * 栄養素充足目標（share）の更新：
     * @param newVal
     */
    updateShare(newVal) {
      console.log('updateNutrientTarget')
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))

      //nutrientTargetを更新して入れ替える
      const nutrientTarget = dat.prodTargetCases[this.pageIdComputed].prodTarget[0].nutrientTarget
      const vm = this
      const Wt = vm.setQuantity(
        vm.nutritionDemandWatcher[vm.pageIdComputed],
        vm.myAppWatcher.prodTargetCases[vm.pageIdComputed].prodTarget[0],
        nutrientTarget,
        newVal
      )

      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].share = newVal
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt = Wt
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt365 = Wt * 365

      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * myApp.prodTargetCases.targetの値を集計してnutritionDemandWatcherに代入するための関数
     * @returns {*[]} 栄養素必要量の合計値
     */
    nutritionDemandGetter() {
      const vm = this
      return vm.myApp.prodTargetCases.map((dat) => {
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
     * myApp.prodTargetCases.prodTargetの値を集計してnutritionSupplyWatcherに代入するための関数
     * @returns {*[]} 栄養素供給量の合計値
     */
    nutritionSupplyGetter() {
      const vm = this
      return vm.myApp.prodTargetCases.map((datArray) => {
        if (datArray.prodTarget.length > 0) {
          return datArray.prodTarget.reduce((accumulator, item) => {
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
            Math.round(100 * supply.En / demand.En) / 10 : 0,
          Pr: demand.Pr ?
            Math.round(100 * supply.Pr / demand.Pr) / 10 : 0,
          Va: demand.Va ?
            Math.round(100 * supply.Va / demand.Va) / 10 : 0,
          Fe: demand.Fe ?
            Math.round(100 * supply.Fe / demand.Fe) / 10 : 0
        })
      }
      return res
    },
    /**
     * 栄養必要量、栄養供給量から必要な作物位の生産量を計算する
     * @param nutrientsDemand
     * @param nutrientsSupply
     * @param keyNutrient
     * @param share
     * @returns {number|number}
     */
    setQuantity(nutrientsDemand, nutrientsSupply, keyNutrient, share) {
      const rep1 = nutrientsDemand[keyNutrient] ? nutrientsDemand[keyNutrient] : 0
      const rep2 = nutrientsSupply ? nutrientsSupply[keyNutrient] : 0
      return rep2 ? Math.round((rep1 * 100 / rep2) * share / 100) : 0
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
      dat.prodTargetCases[vm.pageIdComputed].target = JSON.parse(JSON.stringify(val))
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * ユーザーによりfctTableがクリックされた時に行の内容を組み込んで
     *     newProdTargetを更新してemit
     * @param val
     */
    onFctClick(val) {
      const vm = this
      let newProdTarget = []
      const nut = 'Pr'
      const share = 100
      //shareとnutからWtを決定
      const Wt = vm.setQuantity(
        vm.nutritionDemandWatcher[vm.pageIdComputed],
        vm.myAppWatcher.prodTargetCases[vm.pageIdComputed].prodTarget[0],
        nut,
        share
      )

      newProdTarget.push({
        'id': val.id,
        'Name': val.Name,
        'Group': val.Group,
        'En': val.En,
        'Pr': val.Pr,
        'Va': val.Va,
        'Fe': val.Fe,
        'Carbohydrate': val.Carbohydrate,
        'Fat': val.Fat,
        // 当該作物が目標とする栄養素の種類
        'nutrientTarget': nut,
        // 当該作物が必要栄養量の何％を満たすか表す
        'share': share,
        'menuName': 'target',
        //1日に必要な生産・消費目標
        'Wt': Wt,
        //1年間に必要な生産・消費目標
        'Wt365': Wt * 365,
      })
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(vm.myAppWatcher))
      //更新されたprodTargetを入れ替える
      dat.prodTargetCases[vm.pageIdComputed].prodTarget = newProdTarget
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * prodTargetが削除された際に、栄養素供給量合計を再計算してemit
     * @param val 更新されたprodTarget
     */
    deleteSupply(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたprodTargetを入れ替える
      dat.prodTargetCases[this.pageIdComputed].prodTarget = val
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * DRIの一覧表（年齢別・性別）に各グループの人数を追加して戻す
     * @param driValue DRIの一覧表
     * @param targetValue 各グループの対象人数のリスト
     * @returns {*} DRIの一覧表×対象人数
     */
    updateTablePop(driValue, targetValue) {
      return driValue.map(function (driItem) {
        const res = targetValue.filter(
          item => Number(item.id) === Number(driItem.id)
        )
        driItem.number = res.length ? res[0].count : 0
        return driItem
      }).filter((item) => {
        return Number(item.number) > 0
      })
    },
    /**
     * 数字の桁数を３桁に自動調整し、単位を追記して返す
     * @param val
     * @param unitKey
     * @returns {string}
     */
    setDigit(val, unitKey) {
      let res
      const units = [
        {1: ' KC', 2: ' MC', 3: ' GC'},   // for dietary energy
        {1: ' g', 2: ' kg', 3: ' t'},    // for protein
        {1: ' µg', 2: ' mg', 3: ' g'},    // for vit-A
        {1: ' mg', 2: ' g', 3: ' kt'},    // for iron
      ]
      const item = Number(val)
      switch (true) {
        case (item < 1000):
          res = String(Math.round(item)) + units[unitKey - 1]["1"]
          break;
        case (item >= 1000 && item < 1000000):
          res = String(Math.round(item / 1000)) + units[unitKey - 1]["2"]
          break;
        case (item >= 1000000):
          res = String(Math.round(item / 1000000)) + units[unitKey - 1]["3"]
          break;
        default:
          console.log('parameter not valid:setDigit')
          res = ''
          break;
      }
      return res
    },
    //fctとdriの表示調整
    toggleFctDri() {
      console.log('test')
    },
  }
}
</script>
