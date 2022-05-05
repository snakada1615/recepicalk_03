<template>
  <b-container class="px-0" style="max-width: 540px;">
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility assessment result
        <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
        <div class="d-flex flex-row">
          <b-form-input
            v-model="pageMemo[pageIdComputed]"
            placeholder="memo for this page"
            class="my-1"></b-form-input>
          <b-button
            @click="updatePageMemo(pageMemo[pageIdComputed])"
            size="sm"
            class="mx-1 my-1">update
          </b-button>
        </div>
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
            <b-col class="text-info">{{ cropName[pageIdComputed] }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="6" class="text-center">total score:</b-col>
            <b-col cols="6">{{ qaScore[pageIdComputed][qaScore[pageIdComputed].length - 1].value }} / 50</b-col>
          </b-row>
          <b-row v-for="(qa, index) in qaScore[pageIdComputed]" :key="index">
            <nutrition-bar
              v-if="qa.id > 0"
              :colWidthFirst=6
              :colwidthSecond="0"
              :show-max-number="false"
              :max="10"
              :nutritionTarget="0"
              :cropName="qa.text"
              :rating="qa.value"
              :label="qa.text"
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
              :target="targetGroup[pageIdComputed]"
              @update:target="onTargetGroupChanged"
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
                :value="ansListWatcher[pageIdComputed][qa.id-1]"
                :options="qa.answerList"
                size="sm"
                :state="ansListWatcher[pageIdComputed][qa.id-1] !== -99"
                @change="onAnsChanged({'id':qa.id, 'val':$event})"
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
    /**
     * ansListをmyAppから読み込んでwatch
     * @returns {any[]}
     */
    updateAnsList() {
      return this.myApp.feasibilityCases.map(function (item) {
        return JSON.parse(JSON.stringify(item.ansList))
      })
    },
    /**
     * targetCropをmyAppから読み込んでwatch
     * @returns {any[]}
     */
    updateTargetCrop() {
      return this.myApp.feasibilityCases.map(function (item) {
        return JSON.parse(JSON.stringify(item.selectedCrop))
      })
    },
    /**
     * targetGroupをmyAppから読み込んでwatch
     * @returns {any[]}
     */
    updateTargetGroup() {
      return this.myApp.feasibilityCases.map(function (item) {
        return JSON.parse(JSON.stringify(item.target))
      })
    },
    /**
     * targetGroupの更新に伴い栄養摂取目標を更新
     * @param val
     */
    updateNutrition(val) {
      this.nutritionDemand = JSON.parse(JSON.stringify(val.total))
      //this.$emit('changeNutritionValue', this.nutritionDemand)
      //this.$emit('changeNutrition', res)
    },
    /**
     * ansListをmyAppから読み込んでscoreに変換
     * @returns {*[]}
     */
    updateScore() {
      let res = []
      const vm = this
      vm.myApp.feasibilityCases.forEach(function (val) {
        res.push(vm.summarizeQA(vm.ansId, val.ansList))
      })
      return res
    },
    /**
     * QAのカテゴリとIDをセットにしてArrayに追加（カテゴリ事の集計に用いる）
     * @returns {*[]}
     */
    updateAnsId() {
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
    updateNutritionSupply(crops) {
      return crops.map((cropList) => {
        return getNutritionSupply(cropList)
      })
    },
    /**
     * targetグループから栄養摂取目標を計算
     * @param targetGroup
     * @param dri
     * @returns {*}
     */
    updateNutritionDemand(targetGroup, dri) {
      return targetGroup.map(function (target) {
        return getNutritionDemand(target, dri)
      })
    },
    /**
     * 栄養摂取目標と栄養供給量から栄養スコアを計算
     * @param nutritionDemand
     * @param nutritionSupply
     */
    updateNutritionRating(nutritionDemand, nutritionSupply) {
      return [
        {
          name: 'Energy',
          target: nutritionDemand.En ? Number(nutritionDemand.En) : 0,
          supply: nutritionSupply.En ? nutritionSupply.En : 0,
          rating: nutritionDemand.En ?
            Math.round(nutritionSupply.En / nutritionDemand.En * 10) : 0
        },
        {
          name: 'Protein',
          target: nutritionDemand.Pr ? Number(nutritionDemand.Pr) : 0,
          supply: nutritionSupply.Pr ? nutritionSupply.Pr : 0,
          rating: nutritionDemand.Pr ?
            Math.round(nutritionSupply.Pr / nutritionDemand.Pr * 10) : 0
        },
        {
          name: 'VitA',
          target: nutritionDemand.Va ? Number(nutritionDemand.Va) : 0,
          supply: nutritionSupply.Va ? nutritionSupply.Va : 0,
          rating: nutritionDemand.Va ?
            Math.round(nutritionSupply.Va / nutritionDemand.Va * 10) : 0
        },
        {
          name: 'Fe',
          target: nutritionDemand.Fe ? Number(nutritionDemand.Fe) : 0,
          supply: nutritionSupply.Fe ? nutritionSupply.Fe : 0,
          rating: nutritionDemand.Fe ?
            Math.round(nutritionSupply.Fe / nutritionDemand.Fe * 10) : 0
        },
      ]
    },
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatePageMemo(newVal) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].note = newVal
      //更新されたmyAppをemit
      this.$emit('update:pageMemo', dat)
    },
    /**
     * targetGroupの更新をmyAppに組み込んでemitで通知
     * @param val
     */
    onTargetGroupChanged(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].target = val
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * cropの選択の変更をmyAppに組み込んでemitで通知
     * @param value
     */
    onItemSelected(value) {
      let res = {}
      res.Name = value.Name || 0
      res.id = value.id || 0
      res.En = Number(value.En) || 0
      res.Pr = Number(value.Pr) || 0
      res.Va = Number(value.Va) || 0
      res.Fe = Number(value.Fe) || 0
      res.Wt = 100

      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].selectedCrop[0] = res
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * Ansの更新をmyAppに組み込んでemitで通知
     * @param dat
     */
    onAnsChanged(dat) {
      //作業用のmyAppコピー作成
      let res = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたmenuを入れ替える
      res.feasibilityCases[this.pageIdComputed].ansList.splice(dat.id - 1, 1, dat.val)
      //更新されたmyAppをemit
      this.$emit('update:myApp', res)
    },
    showDialogue() {
      this.$bvModal.show('modalTest')
    },
    /**
     * カテゴリ毎のスコアを集計して戻す
     * @param keys カテゴリとQA_idのペア
     * @param dat ansList[pageId]
     * @returns {any[]}
     */
    summarizeQA(keys, dat) {
      const vm = this
      let res = Array(this.qaCategoryCount).fill(0);
      let res2 = []
      //カテゴリ毎の集計
      keys.forEach(function (key) {
        res[key.categoryID - 1] += (dat[key.itemID - 1] > 0 ? dat[key.itemID - 1] : 0)
      })
      //集計結果と合わせてカテゴリ情報をObjectにまとめる
      res2 = res.map(function (item, index) {
        const qaCategory = vm.qaList[index]
        return {
          id: qaCategory.categoryID,
          text: qaCategory.categoryText,
          value: Math.round(10 * item / (3 * qaCategory.itemsQA.length))
        }
      })
      // 合計値をobjectに加える
      const sumTemp = res2.reduce((p, x) => p + x.value, 0)
      res2.push({
        id: 0,
        text: 'total score',
        value: sumTemp
      })
      return res2
    },
  },
  created() {
  },
  watch: {
    myApp: {
      deep: true,
      immediate: true,
      handler() {
        const vm = this
        this.myAppWatcher = JSON.parse(JSON.stringify(this.myApp))
        this.ansListWatcher = this.updateAnsList()
        this.ansId = this.updateAnsId()
        this.items = JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
        this.itemsDRI = JSON.parse(JSON.stringify(this.myApp.dataSet.dri))
        this.targetCrop = this.updateTargetCrop()
        this.targetGroup = this.updateTargetGroup()
        this.nutritionDemand = this.updateNutritionDemand(this.targetGroup, this.itemsDRI)
        this.nutritionSum = this.updateNutritionSupply(this.targetCrop)
        this.cropName = this.targetCrop.map(function (item) {
          return item.length > 0 ? item[0].Name : ''
        })
        this.nutritionRatingSet = vm.nutritionDemand.map(function (demand, index) {
          return vm.updateNutritionRating(demand, vm.nutritionSum[index])
        })
        this.qaScore = this.updateScore()
        this.pageMemo = this.myApp.feasibilityCases.map(function (item) {
          return item.note
        })
      }
    }
  },
  computed: {
    /**
     * QAリストのカテゴリ数
     * @returns {*}
     */
    qaCategoryCount: function () {
      if (this.ansId.length === 0) {
        return 0
      }
      return this.ansId.reduce((a, b) => a.categoryID < b.categoryID ? a.categoryID : b.categoryID)
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
      nutritionDemand: [],
      /**
       * 栄養供給量
       */
      nutritionSum: [],
      /**
       * 栄養素の充足率
       */
      nutritionRatingSet: [],
      /**
       * ページメモ
       */
      pageMemo: '',
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
