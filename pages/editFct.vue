<template>
  <b-container >
    <b-row>
      <fct-table-editor
        :items = fctData
        @changeFct="updateFct"
      ></fct-table-editor>
    </b-row>
  </b-container>
</template>

<script>
import fctTableEditor from "@/components/molecules/FctTableEditor";


export default{
  components: {
    fctTableEditor
  },
  data() {
    return {
      fctData:[],
    }
  },
  async fetch() {
    this.fctData = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.fct))
  },
  methods: {
    updateFct(val){
      //FCTの更新をstoreに指示
      this.$store.dispatch('fire/updateFct',val)
      //myAppの変更時は、常に setHasDocumentChanged=true をセット
      this.$store.dispatch('fire/setHasDocumentChanged', true)
    }
  }
}
</script>
