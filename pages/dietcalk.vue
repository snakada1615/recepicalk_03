<template>
  <b-container >
    <b-row>
      <b-col lg="6">
        <dri-select-all
          :targetSwitch.sync="singleTarget"
          :max="max"
          :driPopulations="myAppWatcher.menuCases[pageId].target"
          :driItems="myAppWatcher.dataSet.dri"
          @update:target = "updateTarget"
          @changeNutrition="onNutritionChanged($event, pageId)"
        ></dri-select-all>
      </b-col>
      <b-col lg="6">
        <fct-table
          :items="myAppWatcher.dataSet.fct"
        ></fct-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        recepi
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll"
import FctTable from "@/components/organisms/FctTable"
import recepiTable from "@/components/organisms/recepiTable"

export default {
  components: {
    driSelectAll,
    FctTable,
    recepiTable
  },
  data() {
    return {
      myAppWatcher: '',
      singleTarget: true,
      fields: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
      max: 10000,
      pageId: 0,
      /**
       * 初回読み込み時のチェック用フラグ
       */
      firstLoadFlag:true,
    }
  },
  created(){
    this.myAppWatcher = JSON.parse(JSON.stringify(this.$store.state.fire.myApp))
  },
  watch:{
    myAppWatcher:{
      deep: true,
      handler(val){
        if (this.firstLoadFlag){
          // 初回ロード時はmyAppを更新しない
          this.firstLoadFlag = false
        } else {
          this.$store.dispatch('fire/updateMyApp', val)
        }
      }
    }
  },
  methods: {
    test(){
      //this.$store.dispatch('fire/initAll')
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
