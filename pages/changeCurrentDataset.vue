<template>
  <b-container>
    <div v-for="(item, index) in myDataSet" :key="index">
      <b-card
        :header="item.text"
        header-bg-variant="success"
        header-text-variant="light"
        bg-variant="gray-200"
        class="my-2"
      >
        <div >
          current dataset: <span class="text-danger font-weight-bold">{{originalDocName[index]}}</span>
        </div>
        <select-db-from-fire
          :component-name="'collapse-' + index"
          :doc-name.sync="item.docName"
          :db-key="item.key"
          :db-filter="item.filter"
          :db-list="docListOriginal"
          :show-button-get-list="false"
          @selected="setMyDoc(index, $event)"
        />
      </b-card>
    </div>
  </b-container>
</template>
<script>
import selectDbFromFire from "../components/organisms/selectDbFromFire";
import {getFileList} from "../plugins/firebasePlugin";
import {makeToast} from "../plugins/helper";

export default {
  layout: 'defaultEth',
  components: {
    selectDbFromFire
  },
  async asyncData() {
    const queryResult = await getFileList('dataset')
    return {
      docListOriginal: queryResult
    }
  },
  created() {
    this.myDataSet[0].docName = this.$store.state.fire.myApp.dataSet.fctId
    this.myDataSet[1].docName = this.$store.state.fire.myApp.dataSet.driId
    this.myDataSet[2].docName = this.$store.state.fire.myApp.dataSet.portionUnitId
    this.myDataSet[3].docName = this.$store.state.fire.myApp.dataSet.questionsId
    this.myDataSet[4].docName = this.$store.state.fire.myApp.dataSet.cropCalendarId
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.fctId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.driId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.portionUnitId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.questionsId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.cropCalendarId)
  },
  data() {
    return {
      currentCalendarName: '',
      originalDocName: [],
      myDataSet: [
        {
          key: 'FCT_id',
          filter: 'fct_',
          docName: '',
          command1: 'fire/updateFctId',
          command2: 'fire/fetchFctFromFire',
          text: 'food composition table'
        },
        {
          key: 'id',
          filter: 'dri_',
          docName: '',
          command1: 'fire/updateDriId',
          command2: 'fire/fetchDriFromFire',
          text: 'nutrition requirement'
        },
        {
          key: 'id',
          filter: 'portion_',
          docName: '',
          command1: 'fire/updatePortionUnitId',
          command2: 'fire/fetchPortionUnitFromFire',
          text: 'food weight measurement unit'
        },
        {
          key: 'id',
          filter: 'question_',
          docName: '',
          command1: 'fire/updateQuestionsId',
          command2: 'fire/fetchQuestionsFromFire',
          text: 'question for feasiblity assessment'
        },
        {
          key: 'FCT_id',
          filter: 'cropCalendar',
          docName: '',
          command1: 'fire/updateCropCalendarId',
          command2: 'fire/fetchCropCalendarFromFire',
          text: 'crop calendar'
        },
      ]
    }
  },
  methods: {
    async setMyDoc(index, doc) {
      await this.$store.dispatch(this.myDataSet[index].command1, doc)
      await this.$store.dispatch(this.myDataSet[index].command2)
      await this.$store.dispatch('fire/fireSaveAppdata')
      makeToast(
        this,
        'dataset is set to ' + this.myDataSet[index].docName,
        {variant: 'info'}
      )
    },
    async fireSaveCalendar() {
      this.busy3 = true
      await this.$store.dispatch('fire/updateCropCalendar', this.currentCalendar)
      await this.$store.dispatch('fire/fireSaveAppdata')
      this.busy3 = false
      makeToast(
        this,
        'crop calendar is set to ' + this.$store.state.fire.myApp.dataSet.cropCalendarId,
        {variant: 'info'}
      )
    },
  },
}
</script>
