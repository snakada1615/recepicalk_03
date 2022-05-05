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
              <b-row v-for="(nut, index) in nutritionRatingSet[pageIdComputed]" :key="index">
                <nutrition-bar
                  :label="nut.name"
                  :maxRatingAbsolute="nut.supply"
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
import {getNutritionDemand, getNutritionSupply, validateMyApp} from "@/plugins/helper";

export default {
  components: {
    FctTableModal,
    nutritionBar,
    driSelectSingle,
  },
  methods: {
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
      console.log(value)
      res.Name = value.Name || 0
      res.id = value.id || 0
      res.En = Number(value.En) || 0
      res.Pr = Number(value.Pr) || 0
      res.Va = Number(value.Va) || 0
      res.Fe = Number(value.Fe) || 0
      res.Wt = 100
      console.log(res)

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
      //this.$emit('changeNutritionValue', this.nutritionTarget)
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

    /**
     * 選択された作物から栄養供給量を計算
     * @param crops
     * @returns {*}
     */
    updataNutritionSupply(crops){
      return crops.map((cropList)=>{
        return getNutritionSupply(cropList)
      })
    },
    /**
     * targetグループから栄養摂取目標を計算
     * @param targetGroup
     * @param dri
     * @returns {*}
     */
    updateNutritionTarget(targetGroup, dri){
      return targetGroup.map(function (target) {
        return getNutritionDemand(target, dri)
      })
    },
    /**
     * 栄養摂取目標と栄養供給量から栄養スコアを計算
     * @param nutritionTarget
     * @param nutritionSupply
     */
    updateNutritionRating(nutritionTarget, nutritionSupply){
      return [
        {
          name: 'Energy',
          target: nutritionTarget.En ? Number(nutritionTarget.En) : 0,
          supply: nutritionSupply.En ? nutritionSupply.En : 0,
          rating: nutritionTarget.En ?
            Math.round(nutritionSupply.En / nutritionTarget.En * 10) : 0
        },
        {
          name: 'Protein',
          target: nutritionTarget.Pr ? Number(nutritionTarget.Pr) : 0,
          supply: nutritionSupply.Pr ? nutritionSupply.Pr : 0,
          rating: nutritionTarget.Pr ?
            Math.round(nutritionSupply.Pr / nutritionTarget.Pr * 10) : 0
        },
        {
          name: 'VitA',
          target: nutritionTarget.Va ? Number(nutritionTarget.Va) : 0,
          supply: nutritionSupply.Va ? nutritionSupply.Va : 0,
          rating: nutritionTarget.Va ?
            Math.round(nutritionSupply.Va / nutritionTarget.Va * 10) : 0
        },
        {
          name: 'Fe',
          target: nutritionTarget.Fe ? Number(nutritionTarget.Fe) : 0,
          supply: nutritionSupply.Fe ? nutritionSupply.Fe : 0,
          rating: nutritionTarget.Fe ?
            Math.round(nutritionSupply.Fe / nutritionTarget.Fe * 10) : 0
        },
      ]
    },
  },
  created() {
    this.ansId = this.updateAnsId()
  },
  watch: {
    myApp: {
      deep: true,
      immediate: true,
      handler() {
        const vm = this
        this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
        this.ansListWatcher = this.ansListGetter()
        this.items = JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
        this.itemsDRI = JSON.parse(JSON.stringify(this.myApp.dataSet.dri))
        this.targetCrop = this.targetCropGetter()
        this.targetGroup = this.targetGroupGetter()
        this.nutritionTarget = this.updateNutritionTarget(this.targetGroup, this.itemsDRI)
        this.nutritionSum = this.updataNutritionSupply(this.targetCrop)
        this.cropName = this.targetCrop.map(function (item) {
          return item.length > 0 ? item[0].Name : ''
        })
        this.nutritionRatingSet = vm.nutritionTarget.map(function (demand, index) {
          return vm.updateNutritionRating(demand, vm.nutritionSum[index])
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
      /**
       * 質問への回答のカテゴリごとの合計
       */
      qaScore: [],
      /**
       * 質問への回答一覧
       */
      ansListWatcher: [],
      /**
       * 対象グループ
       */
      targetGroup: [],
      /**
       * 選択された作物
       */
      targetCrop: [],
      /**
       * 選択された作物名
       */
      cropName: [],
      /**
       * fctの一覧
       */
      items: [],
      /**
       * driの一覧
       */
      itemsDRI: [],
      /**
       * 栄養摂取目標
       */
      nutritionTarget: [],
      /**
       * 栄養供給量
       */
      nutritionSum: [],
      /**
       * 栄養素の充足率
       */
      nutritionRatingSet: [],
      /**
       * 質問と回答一覧
       */
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
