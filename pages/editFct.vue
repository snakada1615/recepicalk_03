<template>
  <b-container>
    {{ $store.state.fire.myApp.dataSet.fctId }}
    <b-row>
      <fct-table-editor
        :items.sync="fctData"
      />
      <b-button
        @click="updateFct(fctData)"
      >
        update
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
import fctTableEditor from '@/components/molecules/FctTableEditor'
import { fireGetDocRemoteOnly } from '@/plugins/firebasePlugin'

export default {
  components: {
    fctTableEditor
  },
  data () {
    return {
      fctData: []
    }
  },
  fetch () {
    this.fctData = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.fct))
    console.log(this.fctData)
  },
  methods: {
    async updateFct (val) {
      // FCTの更新をstoreに指示
      await this.$store.dispatch('fire/updateFct', val)
      // myAppの変更時は、常に setHasDocumentChanged=true をセット
      await this.$store.dispatch('fire/setHasDocumentChanged', true)

      // foreStoreを更新
      const originalData = await fireGetDocRemoteOnly('dataset', this.$store.state.fire.myApp.dataSet.fctId)
      val.forEach((item) => {
        // 既存のデータを更新する場合
        if (originalData[item.id]) {
          originalData[item.id].Carbohydrate = item.Carbohydrate
          originalData[item.id].Energy = item.En
          originalData[item.id].FE = item.Fe
          originalData[item.id].Fat = item.Fat
          originalData[item.id].Protein = item.Pr
          originalData[item.id].VITA_RAE = item.Va
          originalData[item.id].Food_name = item.Name
          originalData[item.id].food_group_unicef = item.Group
          originalData[item.id].food_grp_id = item.food_grp_id
        } else {
          // 新規項目を追加する場合
          originalData[item.id] = {
            Carbohydrate: 0,
            Energy: item.En,
            FE: item.Fe,
            Fat: 0,
            Protein: item.Pr,
            VITA_RAE: item.Va,
            Food_name: item.Name,
            food_group_unicef: item.Group,
            food_grp_id: item.food_grp_id,
            FCT_id: item.id
          }
        }
      })

      await this.$store.dispatch('fire/fireUpdateOriginalFct', originalData)
    }
  }
}
</script>
