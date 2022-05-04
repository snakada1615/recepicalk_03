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
              :class="{'border-dark':cropName[pageIdComputed], 'border-danger':!cropName[pageIdComputed]}">
              <div class="font-weight-bold text-info">{{ cropName[pageIdComputed] }}</div>
            </b-col>
            <b-col cols="3">
              <b-button @click="showDialogue" size="sm" variant="info">select crop</b-button>
            </b-col>
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
              :target="targetGroup[pageIdComputed]"
              @update:target="updateSelection"
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
import feasibilityCheckComponent from "@/components/organisms/feasibilityCheckComponent";

export default {
  components: {
    FctTableModal,
    nutritionBar,
    driSelectSingle,
  },
  methods: {
    nutritionRatingGetter() {
      return this.myAppWatcher
    },
    ansListGetter() {
      return this.myApp.feasibilityCases.map(function (item) {
        return item.ansList
      })
    },
    targetCropGetter() {
      return this.myApp.feasibilityCases.map(function (item) {
        return item.selectedCrop
      })
    },
    targetGroupGetter() {
      return this.myApp.feasibilityCases.map(function (item) {
        return item.target
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
      let res = {}
      res.Name = value.Name || 0
      res.id = value.id || 0
      res.En = value.En || 0
      res.Pr = value.Pr || 0
      res.Va = value.Va || 0
      res.Fe = value.Fe || 0
      res.Wt = 100

      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].selectedCrop[0] = res
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    showDialogue() {
      this.$bvModal.show('modalTest')
    },
    updateSelection(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].target = val
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    updateNutrition(val) {
      this.nutritionTarget = JSON.parse(JSON.stringify(val.total))
      this.$emit('changeNutritionValue', this.nutritionTarget)
      //this.$emit('changeNutrition', res)
    },
    summarizeQA(keys, dat) {
      let res = Array(this.qaCategoryCount).fill(0);
      keys.forEach(function (key) {
        res[key.categoryID - 1] += (dat[key.itemID - 1] > 0 ? dat[key.itemID - 1] : 0)
      })
      return res
    },
    updateScore(){
      let res = []
      const vm = this
      vm.myApp.feasibilityCases.forEach(function (val){
        res.push(vm.summarizeQA(vm.ansId, val.ansList))
      })
      return res
    },
    updateAnsId(){
      const vm = this
      let res = []
      vm.qaList.forEach(function (category) {
        category.itemsQA.forEach(function (item) {
          res.push({
            'categoryID': category.categoryID,
            'itemID': item.id
          })
        })
      })
      return res
    },
  },
  created() {
    this.ansId = this.updateAnsId()
    this.items = JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
    this.itemsDRI = JSON.parse(JSON.stringify(this.myApp.dataSet.dri))
  },
  watch: {
    myApp: {
      deep: true,
      immediate: true,
      handler(val) {
        this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
        this.ansListWatcher = this.ansListGetter()
        this.targetCrop = this.targetCropGetter()
        this.targetGroup = this.targetGroupGetter()
        this.cropName = this.targetCrop.map(function (item) {
          return item.length > 0 ? item[0].Name : ''
        })
        this.qaScore = this.updateScore()
      }
    }
  },
  computed: {
    /**
     * QAリストのカテゴリ数
     * @returns {*}
     */
    qaCategoryCount: function () {
      console.log(this.ansId)
      if (this.ansId.length === 0){ return 0 }
      return this.ansId.reduce((a, b) => a.categoryID < b.categoryID ? a.categoryID : b.categoryID)
    },
/*
    qaScore: function () {
      let sum = []
      let vm = this
      let res = []
      vm.myAppWatcher.feasibilityCases.map(function (item) {
        item.ansList.map(function (item) {
          res.push({'categoryID': category.categoryID, 'itemID': item.id})

        })
      })
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
*/
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
      /**
       * (カテゴリ、質問ID)の一蘭
       * @returns {*[]}
       */
      ansId: [],
      qaScore: [],
      ansListWatcher: [],
      targetGroup: [],
      targetCrop: [],
      cropName: [],
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
          categoryID: 1,
          categoryText: 'Nutrient balance',
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
