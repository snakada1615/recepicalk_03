<template>
  <b-container>
    <b-card>
      <b-input-group
        prepend="category"
        class="my-1"
      >
        <b-form-select v-model="QACopy.categoryText" :options="optionsCategory"></b-form-select>
      </b-input-group>

      <b-input-group
        prepend="question"
        class="my-1"
      >
        <b-form-input v-model="QACopy.questionText"></b-form-input>
      </b-input-group>

      <b-input-group prepend="answer 1" class="my-1">
        <b-form-input v-model="QACopy.answerList[1].text"></b-form-input>
        <template #append>
          <b-form-select v-model="QACopy.answerList[1].value" :options="optionsPoint"></b-form-select>
        </template>
      </b-input-group>

      <b-input-group prepend="answer 2" class="my-1">
        <b-form-input v-model="QACopy.answerList[2].text"></b-form-input>
        <template #append>
          <b-form-select v-model="QACopy.answerList[2].value" :options="optionsPoint"></b-form-select>
        </template>
      </b-input-group>

      <b-input-group prepend="answer 3" class="my-1">
        <b-form-input v-model="QACopy.answerList[3].text"></b-form-input>
        <template #append>
          <b-form-select v-model="QACopy.answerList[3].value" :options="optionsPoint"></b-form-select>
        </template>
      </b-input-group>

      <b-input-group prepend="answer 4" class="my-1">
        <b-form-input v-model="QACopy.answerList[4].text"></b-form-input>
        <template #append>
          <b-form-select v-model="QACopy.answerList[4].value" :options="optionsPoint"></b-form-select>
        </template>
      </b-input-group>


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
  computed: {
  },
  created() {
    this.QACopy = JSON.parse(JSON.stringify(this.qa))
  },
  watch: {
    qa: {
      deep: true,
      handler(val){
        this.QACopy = JSON.parse(JSON.stringify(val))
      },
    }
  },
  data() {
    return {
      QACopy:{},
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
