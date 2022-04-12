<template>
  <b-container >
    <b-row>
      <b-col lg="6">
        <dri-select-all
          :targetSwitch.sync="myAppWatcher.menuCases[pageId].isTargetSingle"
          :max="max"
          :driPopulations="myAppWatcher.menuCases[pageId].target"
          :driItems="myAppWatcher.dataSet.dri"
          @update:target = "updateTarget"
          @changeNutritionValue="onDriChanged($event, pageId)"
        ></dri-select-all>
      </b-col>
      <b-col lg="6">
        <fct-table
          :items="myAppWatcher.dataSet.fct"
          @fctClick="onFctClick"
        ></fct-table>
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
        <nutrition-bar :label="nutritionLabel[0]" :max-rating="maxRating" :rating="rating.En"/>
        <nutrition-bar :label="nutritionLabel[1]" :max-rating="maxRating" :rating="rating.Pr"/>
        <nutrition-bar :label="nutritionLabel[2]" :max-rating="maxRating" :rating="rating.Va"/>
        <nutrition-bar :label="nutritionLabel[3]" :max-rating="maxRating" :rating="rating.Fe"/>
      </b-col>
    </b-row>
    <food-modal
      :max-weight = 500
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
       * stateから読み込んでこのページで利用。更新された時にstateに戻す
       */
      myAppWatcher: '',
      /**
       * ターゲット選定モードの初期値（singleモード）
       */
      singleTarget: true,
      fields: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
      /**
       * ターゲットの1グループあたり設定人数の最大値
       */
      max: 10000,
      /**
       * 複数インスタンスを作成する場合のindex
       */
      pageId: 0,
      /**
       * 初回読み込み時のチェック用フラグ
       */
      firstLoadFlag:true,
      /**
       * 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty
       */
      items_modal:[],
      /**
       * 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty
       */
      value_model:0,
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
      nutritionSum:{},
      /**
       * driテーブルから計算される栄養必要量の合計値
       */
      totalDri: {},
    }
  },
  computed:{
    rating(){
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
    driRange: function () {
      let res = 3
      if (this.driSwitch) {
        res = 1
      }
      return res
    },
  },
  created(){
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.myAppWatcher = JSON.parse(JSON.stringify(this.$store.state.fire.myApp))
  },
  watch:{
    myAppWatcher:{
      deep: true,
      handler(val){
        if (this.firstLoadFlag){
          // 初回ロード時はstore経由でのmyApp更新を行わない
          this.firstLoadFlag = false
        } else {
          this.$store.dispatch('fire/updateMyApp', val)
        }
      }
    }
  },
  methods: {
    test(val){
      this.myAppWatcher.menuCases[0].menu.push(val)
      //this.$store.dispatch('fire/initAll')
    },
    onDriChanged(val){
      this.totalDri = val
    },
    onNutritionSumChanged(val){
      this.nutritionSum = val
    },
    onFoodModalOk(val){
      let duplicated = false
      const res = this.myAppWatcher.menuCases[0].menu.map(function(item){
        if (Number(item.id) === Number(val.id)){
          item.Wt = val.Wt
          duplicated = true
        }
        return item
      })
      if (duplicated){
        this.myAppWatcher.menuCases[0].menu = res
      } else {
        this.myAppWatcher.menuCases[0].menu.push(val)
      }
    },
    onFctClick(val){
      let res = this.myAppWatcher.menuCases[0].menu.filter(function(dat){
        return Number(dat.id) === Number(val.id)
      })
      if (!res.length) {res[0] = val}
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
    updateTarget(val){
      this.myAppWatcher.menuCases[this.pageId].target = val
    },
    save(){
      this.$store.dispatch('fire/saveAppdata')
    }
  }
}
</script>
