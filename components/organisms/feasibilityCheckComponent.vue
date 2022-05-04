<template>
  <b-container class="px-0" style="max-width: 540px;">
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility assessment result
        <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mx-0">
        <b-card
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>Selected crop</div>
          </template>
          <b-row>
            <b-col cols="2">
              Name:
            </b-col>
            <b-col
              cols="7" class="border"
              :class="{'border-dark':targetCrop[pageIdComputed].Name, 'border-danger':!targetCrop[pageIdComputed].Name}">
              <div class="font-weight-bold text-info">{{ targetCrop[pageIdComputed].Name }}</div>
            </b-col>
            <b-col cols="3">
              <b-button @click="showDialogue" size="sm" variant="info">select crop</b-button>
            </b-col>
          </b-row>
        </b-card>

        <b-card
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>Feasibility score</div>
          </template>
          <b-row>
            <b-col class="text-center">Crop name:</b-col>
            <b-col class="text-info">{{ targetCrop[pageIdComputed].Name }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="6" class="text-center">total score:</b-col>
            <b-col cols="6">{{ qaScore[qaScore.length - 1].value }} / 50</b-col>
          </b-row>
          <b-row v-for="(qa, index) in qaScore" :key="index">
            <nutrition-bar
              v-if="qa.id > 0"
              :colWidthFirst=6
              :colwidthSecond="0"
              :cropName="qa.text"
              :max="10"
              :nutritionTarget="0"
              :rating="qa.value"
            ></nutrition-bar>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility questions
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mx-0">
        <b-card
          v-for="(qaGroup, index) in qaList"
          :key="index"
          style="min-width: 530px;"
          header-bg-variant="success"
          bg-variant="light"
          border-variant="success"
          class="mx-1 px-0 my-2">
          <template #header>
            <div>{{ qaGroup.categoryText }}</div>
          </template>
          <div v-show="index===0" class="mb-2">
            <dri-select-single
              :driItems="itemsDRI"
              :target="targetCrop[pageIdComputed]"
              @changeNutritionGroup="updateSelection"
              @changeNutritionValue="updateNutrition"
            >
            </dri-select-single>
            <b-card class="px-0 mx-0">
              <b-row class="mt-0 bg-success mb-3">
                <b-col cols="3" class="text-center mr-2 font-weight-bold">Nutrition</b-col>
                <b-col cols="3" class="font-weight-bold">Balance</b-col>
              </b-row>
              <b-row v-for="(nut, index) in nutritionRatingSet" :key="index">
                <nutrition-bar
                  :cropName="nut.name"
                  :max="10"
                  :nutritionTarget="nut.target"
                  :rating="nut.rating"
                ></nutrition-bar>
              </b-row>
            </b-card>
          </div>
          <ul class="pl-2 my-0">
            <li
              v-for="(qa, index2) in qaGroup.itemsQA"
              :key="index2"
              :class="{'mt-3':index2!==0}"
            >
              {{ qa.questionText }}
              <b-form-select
                v-model="ansListWatcher[pageIdComputed][qa.id-1]"
                :options="qa.answerList"
                size="sm"
                :state="ansListWatcher[pageIdComputed][qa.id-1] !== -99"
                @change="$emit('ansListChange','ansListWatcher[pageIdComputed]')"
              >
              </b-form-select>
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
    <FctTableModal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :items="items"
      @modalOk="onItemSelected"
    ></FctTableModal>
  </b-container>
</template>
<script>
import FctTableModal from "@/components/organisms/FctTableModal.vue";
import nutritionBar from "@/components/molecules/nutritionBar";
import driSelectSingle from "@/components/molecules/driSelectSingle";
import {validateMyApp} from "@/plugins/helper";

export default {
  components: {
    FctTableModal,
    nutritionBar,
    driSelectSingle,
  },
  methods: {
    nutritionRatingGetter(){
      return this.myAppWatcher
    },
    ansListGetter() {
      return this.myAppWatcher.feasibilityCases.map(function (item) {
        return item.ansList
      })
    },
    targetCropGetter() {
      return this.myAppWatcher.feasibilityCases.map(function (item) {
        return item.selectedItem
      })
    },
    onTargetChanged(value, pageId) {
      console.log('onTargetChanged')
      if (pageId !== this.pageId || !value.length) {
        return
      }
      if (this.nutritionTarget) {
        this.nutritionTarget = [...value]
      }
    },
    onItemSelected(value) {
      this.$emit('update:selectedItem', value)
      //this.selectedItem = value
      this.nutritionSum.En = value.En || 0
      this.nutritionSum.Pr = value.Pr || 0
      this.nutritionSum.Va = value.Va || 0
      this.nutritionSum.Fe = value.Fe || 0
      this.nutritionSum.Wt = value.Wt || 0
    },
    showDialogue() {
      this.$bvModal.show('modalTest')
    },
    updateSelection(val) {
      //this.nutritionTarget = JSON.parse(JSON.stringify(val))
      this.$emit('changeTarget', val)
    },
    updateNutrition(val) {
      this.nutritionTarget = JSON.parse(JSON.stringify(val.total))
      this.$emit('changeNutritionValue', this.nutritionTarget)
      //this.$emit('changeNutrition', res)
    },
  },
  created() {
    this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
    this.ansListWatcher = JSON.parse(JSON.stringify(this.ansListGetter()))
    this.targetCrop = JSON.parse(JSON.stringify(this.targetCropGetter()))
    console.log(this.targetCrop)
    this.items = JSON.parse(JSON.stringify(
      this.myAppWatcher.dataSet.fct.map(function (val) {
        return val.doc
      })
    ))
    this.itemsDRI = JSON.parse(JSON.stringify(this.myAppWatcher.dataSet.dri))
  },
  computed: {
    qaScore: function () {
      let sum = []
      let vm = this
      vm.qaList.forEach(function (categories) {
        let sumTemp = 0
        categories.itemsQA.forEach(function (question) {
          if (vm.ansListWatcher[vm.pageIdComputed][question.id - 1] > 0) {
            sumTemp += vm.ansListWatcher[vm.pageIdComputed][question.id - 1]
          }
        })
        sum.push({
          id: categories.categoryID,
          text: categories.categoryText,
          value: Math.round(10 * sumTemp / (3 * categories.itemsQA.length))
        })
      })
      // add total score
      const sumTemp = sum.reduce((p, x) => p + x.value, 0)
      sum.push({
        id: 0,
        text: 'total score',
        value: sumTemp
      })
      return sum
    },
    nutritionRatingSet: function () {
      return [
        {
          name: 'Energy',
          target: this.nutritionTarget[1] ? Number(this.nutritionTarget[1].Value) : 0,
          rating: this.nutritionTarget[1] ?
            Math.round(this.nutritionSum.En / this.nutritionTarget[1].Value * 10) : 0
        },
        {
          name: 'Protein',
          target: this.nutritionTarget[2] ? Number(this.nutritionTarget[2].Value) : 0,
          rating: this.nutritionTarget[2] ?
            Math.round(this.nutritionSum.Pr / this.nutritionTarget[2].Value * 10) : 0
        },
        {
          name: 'VitA',
          target: this.nutritionTarget[3] ? Number(this.nutritionTarget[3].Value) : 0,
          rating: this.nutritionTarget[3] ?
            Math.round(this.nutritionSum.Va / this.nutritionTarget[3].Value * 10) : 0
        },
        {
          name: 'Fe',
          target: this.nutritionTarget[4] ? Number(this.nutritionTarget[4].Value) : 0,
          rating: this.nutritionTarget[4] ?
            Math.round(this.nutritionSum.Fe / this.nutritionTarget[4].Value * 10) : 0
        },
      ]
    },
    /**
     * 現在のページ番号
     */
    pageIdComputed: {
      get: function () {
        return this.pageId
      },
      set: function (newVal) {
        if (this.pageId !== newVal) this.$emit('update:pageId', newVal)
      }
    },
    /**
     * 全ページ数
     * @returns {*[]}
     */
    pageOptions() {
      let res = []
      for (let i = 0; i < this.maxPage; i++) {
        res.push({value: i, text: 'page:' + i})
      }
      return res
    },
  },
  data() {
    return {
      /**
       * 使用する全変数のobject
       * myAppから読み込んでこのページで利用。更新された時にemitを返す
       */
      myAppWatcher: {},
      ansListWatcher: [],
      targetCrop:[],
      items: [],
      itemsDRI: [],
      nutritionTarget: {
        En: 10,
        Pr: 10,
        Va: 10,
        Fe: 10,
      },
      nutritionSum: {
        En: 10,
        Pr: 10,
        Va: 10,
        Fe: 10,
        Wt: 10,
      },
      qaList: [
        {
          categoryID: 1, categoryText: 'Nutrient balance',
          itemsQA: [
            {
              id: 1,
              questionText: 'Is required amount for nutrition target feasible?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes'},
                {value: 2, text: 'maybe yes'},
                {value: 1, text: 'maybe no'},
                {value: 0, text: 'no'},
              ]
            },
          ]
        },
        {
          categoryID: 2,
          categoryText: 'Socioeconomic feasibility',
          itemsQA: [
            {
              id: 2,
              questionText: 'Is there any social barrier to consume this commodity in general?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
            {
              id: 3,
              questionText: 'Is there any social barrier to consume this commodity for women?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
            {
              id: 4,
              questionText: 'Is there any social barrier to consume this commodity for child?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
            {
              id: 5,
              questionText: 'Is this commodity affordable in the market for ordinary population?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
          ]
        },
        {
          categoryID: 3,
          categoryText: 'Technical feasibility',
          itemsQA: [
            {
              id: 6,
              questionText: 'do target beneficiary have enough skill to grow this commodity?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes'},
                {value: 2, text: 'maybe yes'},
                {value: 1, text: 'maybe no'},
                {value: 0, text: 'no'},
              ]
            },
            {
              id: 7,
              questionText: 'Does this commodity imply incremental workload for women?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
            {
              id: 8,
              questionText: 'Is technical service available for this commodity?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes / there is no need for it since beneficiaries already have enough skill'},
                {value: 2, text: 'maybe yes'},
                {value: 1, text: 'maybe no'},
                {value: 0, text: 'no'},
              ]
            },
          ]
        },
        {
          categoryID: 4,
          categoryText: 'Investment',
          itemsQA: [
            {
              id: 9,
              questionText: 'Is there need for specific infrastructure (irrigation / postharvest, etc.)?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
            {
              id: 10,
              questionText: 'Is production input (fertilizer, seed, feed) become financial burden for small farmer?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no'},
                {value: 2, text: 'maybe no'},
                {value: 1, text: 'maybe yes'},
                {value: 0, text: 'yes'},
              ]
            },
          ]
        },
        {
          categoryID: 5,
          categoryText: 'Stability',
          itemsQA: [
            {
              id: 11,
              questionText: 'How many month can you harvest this commodity in a year?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: '10-12 mon'},
                {value: 2, text: '7-9 mon'},
                {value: 1, text: '4-6 mon'},
                {value: 0, text: '0-3 mon'},
              ]
            },
            {
              id: 12,
              questionText: 'Are there any feasible storage method available for this commodity?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes'},
                {value: 2, text: 'maybe yes'},
                {value: 1, text: 'maybe no'},
                {value: 0, text: 'no'},
              ]
            },
          ]
        },
      ]
    }
  },
  props: {
    /**
     * データ本体。myAppWatcherで読み込んでページ内で利用
     */
    myApp: {
      type: Object,
      validator: function (value) {
        return validateMyApp(value)
      },
      required: true,
    },
    pageId: {
      type: Number,
      default: 1
    },
    /**
     * 作成するページ数
     */
    maxPage: {
      type: Number,
      required: true
    },
  },
}
</script>
