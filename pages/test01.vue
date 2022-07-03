<template>
  <b-container>
    <b-button variant="success" @click="save2fire('dataset', 'questions01', qaList3)">push me</b-button>
    <div>select question</div>
    <b-form-select
      v-model="qaId"
      :options="qaOption"
      class="mb-2"
    ></b-form-select>

    <div>edit question</div>
    <feasibility-qa-editor
      v-if="qaList2"
      :qa=qaList2[qaId]
    ></feasibility-qa-editor>
  </b-container>
</template>

<script>
import feasibilityQaEditor from "@/components/atoms/feasibilityQAEditor.vue"
import {doc, setDoc} from "firebase/firestore";
import {firestoreDb} from "@/plugins/firebasePlugin";

export default {
  components: {
    feasibilityQaEditor
  },
  async created() {
    if (!this.$store.state.fire.myApp.dataSet.questionsId){
      alert('questions are not initialized. data will be loaded from original copy')
      await this.$store.dispatch('fire/updateQuestionsId', 'questions01')
      await this.$store.dispatch('fire/initQuestions')
      alert(this.$store.state.fire.myApp.dataSet.questionsId)
      await this.$store.dispatch('fire/fireSaveAppdata')
      //location.reload()
      this.$router.push('/test01')
    }
  },
  computed: {
    qaList3(){
      const vm = this
      let res = {}
      vm.$store.state.fire.myApp.dataSet.questions.forEach((item, index)=>{
        res[index] = item
      })
      return res
    },
    qaList2(){
      return this.$store.state.fire.myApp.dataSet.questions
    },
    qaOption() {
      if (!this.qaList2) {return {}}
      return this.qaList2.map((item, index) => {
        return {
          text: item.questionText,
          value: index
        }
      })
    }
  },
  methods: {
    save2fire(path, docName, content){
      const ref = doc(firestoreDb, path, docName)
      setDoc(ref, content).catch((err) => {
        throw new Error('Error in fireSaveAppdata:' + err)
      })
    }
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
