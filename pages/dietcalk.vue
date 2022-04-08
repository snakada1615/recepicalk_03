<template>
  <b-container >
    <b-row>
      <b-col lg="6">
        <b-button @click="save" variant="warning">save</b-button>
        <b-card bg-variant="info">
          {{myAppWatcher.menuCases[0].target}}
        </b-card>
        <b-card bg-variant="warning">
          {{myAppWatcher.dataSet.dri}}
        </b-card>
        <dri-select-all
          v-if="true"
          :targetSwitch.sync="singleTarget"
          :max="max"
          :driPopulations="myAppWatcher.menuCases[0].target"
          :driItems="myAppWatcher.dataSet.dri"
          style="max-width: 540px"></dri-select-all>
      </b-col>
      <b-col lg="6">
        <fct-table
          v-if="myAppWatcher.dataSet !== null"
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
import {mapGetters} from 'vuex'

export default {
  components: {
    driSelectAll,
    FctTable,
    recepiTable
  },
  data() {
    return {
      myAppWatcher: this.$store.state.fire.myApp,
      singleTarget: true,
      nutrition: [],
      fields: [
        {key: 'Item', sortable: false},
        {key: 'Value', sortable: false},
      ],
      nutritionTarget: [{id: 1, count: 1}],
      max: 10000
    }
  },
  computed:{
    /**
     * アプリで使う全変数myAppを読み込み
     */
    ...mapGetters({
      myAppTemp:'fire/myAppGetter'
    }),
    /**
     * mapGettersにはget/setを組み込めないため、間に変数を追加 => myAppTemp
     */
    myAppComputed:{
      get(){
        return JSON.parse(JSON.stringify(this.myAppTemp))
      },
      set(val){
        console.log(val)
        console.log(this.myAppTemp)
        this.$store.dispatch('fire/updateMyApp', val)
      }
    }
  },
  watch:{
    myAppWatcher:{
      deep: true,
      handler(val){
        this.$store.dispatch('fire/updateMyApp', val)
      }
    }
  },
  methods: {
    test(){
      //this.$store.dispatch('fire/initAll')
    },
    save(){
      this.$store.dispatch('fire/saveAppdata')
    }
  }
}
</script>
