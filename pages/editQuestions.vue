<template>
  <b-container>
    <div>select question</div>
    <b-form-select
      v-model="qaId"
      :options="qaOption"
      class="mb-2"
    ></b-form-select>

    <div>edit question</div>
    <feasibility-qa-editor
      v-if="qaList"
      :qa=qaList[qaId]
      @update:Qa="updateQa"
    ></feasibility-qa-editor>
  </b-container>
</template>

<script>
import feasibilityQaEditor from "@/components/atoms/feasibilityQAEditor.vue"

export default {
  components: {
    feasibilityQaEditor
  },
  computed: {
    qaList(){
      return this.$store.state.fire.myApp.dataSet.questions
    },
    qaOption() {
      if (!this.qaList) {return {}}
      return this.qaList.map((item, index) => {
        return {
          text: item.questionText,
          value: index
        }
      })
    }
  },
  methods: {
    updateQa(val) {
      let dat = JSON.parse(JSON.stringify(this.qaList))
      dat[this.qaId] = JSON.parse(JSON.stringify(val))
      this.$store.dispatch('fire/updateQuestions', dat)
      this.$store.dispatch('fire/setHasDocumentChanged', true)
    },
  },
  data() {
    return {
      /**
       * 現在選択中のQAのID
       */
      qaId: 0,
    }
  },
}
</script>
