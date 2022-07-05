<template>
  <b-container>
    <b-card>
      <b-input-group
        prepend="category"
        class="my-1"
      >
        <b-form-select
          v-model="QACopy.categoryText"
          :options="optionsCategory"
          @input="updateValue($event, 1 )"
          :state="stateCategory"
        ></b-form-select>
      </b-input-group>

      <b-input-group
        prepend="question"
        class="mt-1 mb-0"
      >
        <b-form-input
          v-model="QACopy.questionText"
          @input="updateValue($event, 2 )"
          :state="stateQuestion"
        ></b-form-input>
      </b-input-group>
      <div
        class="text-danger text-muted small text-right"
        v-if="!stateQuestion"
      >question should be longer than three letters</div>

      <b-input-group prepend="answer 1" class="mt-1 mb-0">
        <b-form-input
          v-model="QACopy.answerList[1].text"
          @input="updateValue($event, 3 )"
          :state="stateAnswer1"
        ></b-form-input>
        <template #append>
          <b-form-select
            v-model="QACopy.answerList[1].value"
            :options="optionsPoint"
            @input="updateValue($event, 7 )"
            :state="stateScore1"
          ></b-form-select>
        </template>
      </b-input-group>
      <div
        class="text-danger text-muted small text-right"
        v-if="!stateAnswer1"
      >answer should be longer than three letters</div>

      <b-input-group prepend="answer 2" class="mt-1 mb-0">
        <b-form-input
          v-model="QACopy.answerList[2].text"
          @input="updateValue($event, 4 )"
          :state="stateAnswer2"
        ></b-form-input>
        <template #append>
          <b-form-select
            v-model="QACopy.answerList[2].value"
            :options="optionsPoint"
            @input="updateValue($event, 8 )"
            :state="stateScore2"
          ></b-form-select>
        </template>
      </b-input-group>
      <div
        class="text-danger text-muted small text-right"
        v-if="!stateAnswer2"
      >answer should be longer than three letters</div>

      <b-input-group prepend="answer 3" class="mt-1 mb-0">
        <b-form-input
          v-model="QACopy.answerList[3].text"
          @input="updateValue($event, 5 )"
          :state="stateAnswer3"
        ></b-form-input>
        <template #append>
          <b-form-select
            v-model="QACopy.answerList[3].value"
            :options="optionsPoint"
            @input="updateValue($event, 9 )"
            :state="stateScore3"
          ></b-form-select>
        </template>
      </b-input-group>
      <div
        class="text-danger text-muted small text-right"
        v-if="!stateAnswer3"
      >answer should be longer than three letters</div>

      <b-input-group prepend="answer 4" class="mt-1 mb-0">
        <b-form-input
          v-model="QACopy.answerList[4].text"
          @input="updateValue($event, 6 )"
          :state="stateAnswer4"
        ></b-form-input>
        <template #append>
          <b-form-select
            v-model="QACopy.answerList[4].value"
            :options="optionsPoint"
            @input="updateValue($event, 10 )"
            :state="stateScore4"
          ></b-form-select>
        </template>
      </b-input-group>
      <div
        class="text-danger text-muted small text-right"
        v-if="!stateAnswer4"
      >answer should be longer than three letters</div>
      <div
        class="text-danger text-muted small text-right"
        v-if="!(stateScore1 && stateScore2 && stateScore3 && stateScore4)"
      >
        Please assign different score to each questions. Data
        will not be properly recorded, otherwise.
      </div>

    </b-card>
  </b-container>
</template>

<script>
export default {
  props: {
    qa: {
      type: Object,
      required: true
    }
  },
  created() {
    this.QACopy = JSON.parse(JSON.stringify(this.qa))
    console.log('created')
  },
  watch: {
    qa: {
      deep: true,
      handler(val) {
        this.QACopy = JSON.parse(JSON.stringify(val))
        this.firstLoading = true
      },
    }
  },
  computed: {
    stateAll(){
      const vm = this
      return (vm.stateCategory && vm.stateQuestion && vm.stateAnswer1 && vm.stateAnswer2
        && vm.stateAnswer3 && vm.stateAnswer4 && vm.stateScore1 && vm.stateScore2
        && vm.stateScore3 && vm.stateScore4
      )
    },
    stateCategory(){
      let res = false
      if (this.optionsCategory.findIndex(x => x.text === this.QACopy.categoryText) >= 0){
        res = true
      }
      return res
    },
    stateQuestion() {
      let res = false
      if (this.QACopy.questionText.length > 3){
        res = true
      }
      return res
    },
    stateAnswer1() {
      let res = false
      if (this.QACopy.answerList[1].text.length > 3){
        res = true
      }
      return res
    },
    stateAnswer2() {
      let res = false
      if (this.QACopy.answerList[2].text.length > 3){
        res = true
      }
      return res
    },
    stateAnswer3() {
      let res = false
      if (this.QACopy.answerList[3].text.length > 3){
        res = true
      }
      return res
    },
    stateAnswer4() {
      let res = false
      if (this.QACopy.answerList[4].text.length > 3){
        res = true
      }
      return res
    },
    stateScore1() {
      let res = true
      const vm = this
      const find = vm.QACopy.answerList.filter(x => x.value === vm.QACopy.answerList[1].value)
      if (find.length > 1) {
        res = false
      }
      return res
    },
    stateScore2() {
      let res = true
      const vm = this
      const find = vm.QACopy.answerList.filter(x => x.value === vm.QACopy.answerList[2].value)
      if (find.length > 1) {
        res = false
      }
      return res
    },
    stateScore3() {
      let res = true
      const vm = this
      const find = vm.QACopy.answerList.filter(x => x.value === vm.QACopy.answerList[3].value)
      if (find.length > 1) {
        res = false
      }
      return res
    },
    stateScore4() {
      let res = true
      const vm = this
      const find = vm.QACopy.answerList.filter(x => x.value === vm.QACopy.answerList[4].value)
      if (find.length > 1) {
        res = false
      }
      return res
    },
  },
  methods: {
    updateValue(val, key) {
      if (!this.stateAll){
        console.log('some of input content is invalid')
        return
      }
      if (this.firstLoading) {
        this.firstLoading = false
        return
      }
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.QACopy))
      //更新された値を入れ替える
      switch (key) {
        case 1:
          dat.categoryText = val
          break;
        case 2:
          dat.questionText = val
          break;
        case 3:
          dat.answerList[1].text = val
          break;
        case 4:
          dat.answerList[2].text = val
          break;
        case 5:
          dat.answerList[3].text = val
          break;
        case 6:
          dat.answerList[4].text = val
          break;
        case 7:
          dat.answerList[1].value = val
          break;
        case 8:
          dat.answerList[2].value = val
          break;
        case 9:
          dat.answerList[3].value = val
          break;
        case 10:
          dat.answerList[4].value = val
          break;
        default:
          throw 'parameter key is not valid'
      }
      //更新されたmyAppをemit
      this.$emit('update:Qa', dat)
    },
  },
  data() {
    return {
      firstLoading: false,
      QACopy: {},
      optionsCategory: [
        {value: 'Nutrient balance', text: 'Nutrient balance'},
        {value: 'Socioeconomic feasibility', text: 'Socioeconomic feasibility'},
        {value: 'Technical feasibility', text: 'Technical feasibility'},
        {value: 'Investment', text: 'Investment'},
        {value: 'Stability', text: 'Stability'},
        {value: 'Market opportunity', text: 'Market opportunity'},
      ],
      optionsPoint: [
        {value: 0, text: 0},
        {value: 1, text: 1},
        {value: 2, text: 2},
        {value: 3, text: 3},
      ],
      selected1: '',
      selected2: '',
      selected3: '',
      selected4: '',
    }
  }
}
</script>
