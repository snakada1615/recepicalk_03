<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="success">
          <div class="text-warning">page: {{pageId}}</div>
          <b-form-checkbox
            switch
            v-model="driSwitch"
          >evaluate [daily consumption] /[single meal]</b-form-checkbox>
          <nutrition-bar :label="nutritionLabel[0]" :max-rating="maxRating" :rating="rating.En"/>
          <nutrition-bar :label="nutritionLabel[1]" :max-rating="maxRating" :rating="rating.Pr"/>
          <nutrition-bar :label="nutritionLabel[2]" :max-rating="maxRating" :rating="rating.Va"/>
          <nutrition-bar :label="nutritionLabel[3]" :max-rating="maxRating" :rating="rating.Fe"/>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <recepi-table
          :items.sync="myAppWatcher.menuCases[pageId].menu"
          @totalChanged="onNutritionSumChanged"
        ></recepi-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          pill
          variant="success"
          :pressed.sync = "showFct"
        >add food
        </b-button>
        <b-button
          pill
          variant="warning"
          :pressed.sync = "showDri"
        >change target
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="6">
        <dri-select-all
          v-show="showDri"
          :targetSwitch.sync="myAppWatcher.menuCases[pageId].isTargetSingle"
          :max="max"
          :driPopulations="myAppWatcher.menuCases[pageId].target"
          :driItems="myAppWatcher.dataSet.dri"
          @update:target="updateTarget"
          @changeNutritionValue="onDriChanged($event, pageId)"
        ></dri-select-all>
      </b-col>
      <b-col lg="6">
        <fct-table
          v-show="showFct"
          :items="myAppWatcher.dataSet.fct"
          @fctClick="onFctClick"
        ></fct-table>
      </b-col>
    </b-row>
    <food-modal
      :max-weight=500
      my-name="myFoodModal"
      :items="items_modal"
      v-model="value_model"
      @modalOk="onFoodModalOk"
    />
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/molecules/FctTable"
import recepiTable from "@/components/molecules/recepiTable"
import foodModal from "@/components/molecules/foodModal"
import nutritionBar from "@/components/molecules/nutritionBar"
import {isObjectDeepEqual} from "~/plugins/helper";

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
      myAppWatcher: {
        type: Object,
        required: true,
        default: {}
      },
      /**
       * ターゲットの1グループあたり設定人数の最大値
       */
      max: 10000,
      /**
       * 初回読み込み時のチェック用フラグ
       */
      firstLoadFlag: true,
      /**
       * 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty
       */
      items_modal: [],
      /**
       * 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty
       */
      value_model: 0,
      /**
       * nutritionBar用のproperty：ratingの最大値
       */
      maxRating: 10,
      /**
       * nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定
       */
      driSwitch: true,
      /**
       * nutritionBar用のproperty：栄養素表示用のlabel
       */
      nutritionLabel: ['En', 'Pr', 'Va', 'Fe'],
      /**
       * menuテーブルから計算される栄養供給量の合計値
       */
      nutritionSum: {},
      /**
       * driテーブルから計算される栄養必要量の合計値
       */
      totalDri: {},
      /**
       * FctTable表示用のフラグ
       */
      showFct: false,
      /**
       * driSelectAll表示用のフラグ
       */
      showDri: false,
    }
  },
  computed: {
    /**
     * ネストしたオブジェクトの場合、watchするとnewValue=oldValueとなってしまうため、
     *     computed valueをwatchする
     *     （https://qiita.com/HorikawaTokiya/items/6c500f8e62bfcba3ca70）
     * @returns {any}
     */
    myAppWatcherMonitor() {
      return JSON.parse(JSON.stringify(this.myAppWatcher))
    },
    /**
     * totalDri または nutritionSum が変化した際に、更新された値に基づいて栄養素ごとのratingを計算
     * @returns {{}|{Pr: (number|number), En: (number|number), Va: (number|number), Fe: (number|number)}}
     */
    rating() {
      if (!this.totalDri) {
        return {}
      }
      let En = this.totalDri.En ?
        Math.round(100 * this.nutritionSum.En * this.driRange / this.totalDri.En) / 10 : 0
      let Pr = this.totalDri.Pr ?
        Math.round(100 * this.nutritionSum.Pr * this.driRange / this.totalDri.Pr) / 10 : 0
      let Va = this.totalDri.Va ?
        Math.round(100 * this.nutritionSum.Va * this.driRange / this.totalDri.Va) / 10 : 0
      let Fe = this.totalDri.Fe ?
        Math.round(100 * this.nutritionSum.Fe * this.driRange / this.totalDri.Fe) / 10 : 0
      return {
        En: En,
        Pr: Pr,
        Va: Va,
        Fe: Fe,
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
      console.log('driRange:changed')
      if (this.driSwitch) {
        res = 1
      }
      return res
    },
  },
  props: {
    /**
     * データ本体。myAppWatcherで読み込んでページ内で利用
     */
    myApp:{
      type: Object,
      default: [],
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
  },
  created() {
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.myAppWatcher = JSON.parse(JSON.stringify(this.$store.state.fire.myApp))
  },
  watch: {
    myAppWatcherMonitor: {
      deep: true,
      handler(newVal, oldVal) {
        //myAppWatcherが同じ値で上書きされる場合があるため、newVal/oldValが同じ値かどうか確認
        const isChanged = !isObjectDeepEqual(newVal, oldVal)
        if (this.firstLoadFlag || !isChanged) {
          // 初回ロード時はstore経由でのmyApp更新を行わない
          this.firstLoadFlag = false
        } else {
          this.$emit('update:myApp', newVal)
        }
      }
    }
  },
  methods: {
    test(val) {
      this.myAppWatcher.menuCases[this.pageId].menu.push(val)
      //this.$store.dispatch('fire/initAll')
    },
    onDriChanged(val) {
      this.totalDri = val
    },
    onNutritionSumChanged(val) {
      this.nutritionSum = val
    },
    onFoodModalOk(val) {
      let duplicated = false
      const res = this.myAppWatcher.menuCases[this.pageId].menu.map(function (item) {
        if (Number(item.id) === Number(val.id)) {
          item.Wt = val.Wt
          duplicated = true
        }
        return item
      })
      if (duplicated) {
        this.myAppWatcher.menuCases[this.pageId].menu = res
      } else {
        this.myAppWatcher.menuCases[this.pageId].menu.push(val)
      }
    },
    onFctClick(val) {
      let res = this.myAppWatcher.menuCases[this.pageId].menu.filter(function (dat) {
        return Number(dat.id) === Number(val.id)
      })
      if (!res.length) {
        res[0] = val
      }
      this.items_modal.length = 0
      this.items_modal.push({
        'id': res[0].id,
        'Name': res[0].Name,
        'Group': res[0].Group,
        'En': res[0].En,
        'Pr': res[0].Pr,
        'Va': res[0].Va,
        'Fe': res[0].Fe,
      })
      this.value_model = res[0].Wt
      this.$bvModal.show('myFoodModal')
    },
    updateTarget(val) {
      this.myAppWatcher.menuCases[this.pageId].target = val
    },
    save() {
      this.$store.dispatch('fire/saveAppdata')
    }
  }
}
</script>
