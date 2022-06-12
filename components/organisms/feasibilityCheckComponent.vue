<template>
  <b-container class="px-0" style="max-width: 540px;">
    <!--   ページ情報とページの切り替え   -->
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility assessment result
        <b-form-select v-model="pageIdComputed" :options="pageOptions"></b-form-select>
        <div class="d-flex flex-row">
          <b-form-input
            v-model="pageMemo[pageIdComputed]"
            placeholder="memo for this page"
            :state="noteInputState"
            @input="updatePageMemo(pageMemo[pageIdComputed])"
            class="my-1">
          </b-form-input>
        </div>
      </b-col>
    </b-row>

    <!--  作物の選択パネル -->
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

        <!--   スコアの総括票     -->
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
            <b-col cols="6">{{ qaScore[pageIdComputed][qaScore[pageIdComputed].length - 1].value }} /
              {{ 10 * qaList.length }}
            </b-col>
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

    <!--  ここから質問項目のはじまり  -->
    <b-row class="mt-2">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility questions
      </b-col>
    </b-row>
    <b-row>
      <b-col class="px-0 mx-0">

        <!--
　        qaListの項目に沿って質問と回答一案（ドロップダウン）を表示
  　      項目のインデックスが0の時だけNutritionBarを表示
           -->
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
          <!--    質問番号が0の場合に以下の項目を表示      -->
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
            <b-row align-h="end" class="mt-2">
              <b-col cols="6">
                <b-input-group size="sm" prepend="intake" append="g per day">
                  <b-form-input
                    v-model="portionSize"
                    type="number"
                    class="text-right"
                    @update="onPortionSizeChanged"
                  ></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>
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
      :show-modal.sync="showFct"
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

/**
 * @desc 3つのコンポーネントを組み合わせて特定の品目のfeasibility scoreを算出する
 * 1. FctTableModal - 作物を選択した場合、これに応じた栄養素供給量を返す
 * 2. driSelectSingle - 対象グループを選択した場合、これに応じた栄養素必要量を返す
 * 3. nutritionBar - 上記2つから、栄養素の銃速度をバーチャートで示す
 *
 */
export default {
  components: {
    FctTableModal,
    nutritionBar,
    driSelectSingle,
  },
  methods: {
    onNoteChange(val) {
      console.log(val)
    },
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
          supply: nutritionSupply.En ? Number(nutritionSupply.En * nutritionSupply.Wt / 100) : 0,
          rating: nutritionDemand.En ?
            Math.round((nutritionSupply.En * nutritionSupply.Wt / 100) / nutritionDemand.En * 10) : 0
        },
        {
          name: 'Protein',
          target: nutritionDemand.Pr ? Number(nutritionDemand.Pr) : 0,
          supply: nutritionSupply.Pr ? Number(nutritionSupply.Pr * nutritionSupply.Wt / 100) : 0,
          rating: nutritionDemand.Pr ?
            Math.round((nutritionSupply.Pr * nutritionSupply.Wt / 100) / nutritionDemand.Pr * 10) : 0
        },
        {
          name: 'VitA',
          target: nutritionDemand.Va ? Number(nutritionDemand.Va) : 0,
          supply: nutritionSupply.Va ? Number(nutritionSupply.Va * nutritionSupply.Wt / 100) : 0,
          rating: nutritionDemand.Va ?
            Math.round((nutritionSupply.Va * nutritionSupply.Wt / 100) / nutritionDemand.Va * 10) : 0
        },
        {
          name: 'Fe',
          target: nutritionDemand.Fe ? Number(nutritionDemand.Fe) : 0,
          supply: nutritionSupply.Fe ? Number(nutritionSupply.Fe * nutritionSupply.Wt / 100) : 0,
          rating: nutritionDemand.Fe ?
            Math.round((nutritionSupply.Fe * nutritionSupply.Wt / 100) / nutritionDemand.Fe * 10) : 0
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
      this.$emit('update:myApp', dat)
    },
    /**
     * targetGroupの更新をmyAppに組み込んでemitで通知
     * @param val
     */
    onTargetGroupChanged(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたfeasibilityCasesを入れ替える
      dat.feasibilityCases[this.pageIdComputed].target = val
      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * portionSizeの更新をmyAppに組み込んでemitで通知
     * @param val
     */
    onPortionSizeChanged(val) {
      //作業用のmyAppコピー作成
      let dat = JSON.parse(JSON.stringify(this.myAppWatcher))
      //更新されたfeasibilityCasesを入れ替える
      dat.feasibilityCases[this.pageIdComputed].selectedCrop[0].Wt = val
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
      res.Wt = this.portionSize

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
      this.showFct = !this.showFct
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
    /**
     * noteの記入状態
     * @returns {boolean}
     */
    noteInputState() {
      return (this.pageMemo[this.pageIdComputed].length > 3)
    }
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
       * fctTableModal表示用のフラグ
       */
      showFct: false,
      /**
       * 選択された食品の重量（portion size)
       */
      portionSize: 100,
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
                {value: 3, text: 'It can cover >50% daily requirement'},
                {value: 2, text: 'It can cover >30% daily requirement'},
                {value: 1, text: 'It can cover <30% daily requirement'},
                {value: 0, text: 'It can cover <10% daily requirement'},
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
              questionText: 'Is there any restriction to consume this commodity?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'not at all'},
                {value: 2, text: 'yes for limited occasion, or limited person'},
                {value: 1, text: 'yes, frequently'},
                {value: 0, text: 'this food is not recommended to consume'},
              ]
            },
            {
              id: 3,
              questionText: 'does people like to consume this commodity?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes, most people like it'},
                {value: 2, text: 'yes, but some people does not like it'},
                {value: 1, text: 'some people like it'},
                {value: 0, text: 'no one eat it'},
              ]
            },
            {
              id: 4,
              questionText: 'Is this food equally shared among HH member?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'Yes always'},
                {value: 2, text: 'serving size is not equal, sometimes'},
                {value: 1, text: 'serving size is not equal, usually'},
                {value: 0, text: 'some HH member cannot eat'},
              ]
            },
            {
              id: 5,
              questionText: 'Is this commodity affordable in the market for this community?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes for everyone'},
                {value: 2, text: 'yes for most family'},
                {value: 1, text: 'yes for wealthy family'},
                {value: 0, text: 'this is too expensive'},
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
                {value: 3, text: 'yes, people have good experience for this commodity'},
                {value: 2, text: 'people have technical difficulty only sometimes'},
                {value: 1, text: 'there are technical challenges to grow this'},
                {value: 0, text: 'people have no experience for this commodity'},
              ]
            },
            {
              id: 7,
              questionText: 'Does this commodity imply incremental workload for women?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no extra burden expected'},
                {value: 2, text: 'additional light daily work required'},
                {value: 1, text: 'additional work required, seasonally'},
                {value: 0, text: 'additional intensive daily work required'},
              ]
            },
            {
              id: 8,
              questionText: 'Is technical service available for this commodity, if needed?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes / there is no need for it since beneficiaries already have enough skill'},
                {value: 2, text: 'available upon request'},
                {value: 1, text: 'available once/twice in a season'},
                {value: 0, text: 'not available'},
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
              questionText: 'Is there need for specific infrastructure (irrigation / post harvest, etc.)?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'no investment required for infrastructure'},
                {value: 2, text: 'not essential, but infrastructure can enhance productivity/profitability'},
                {value: 1, text: 'small investment on infrastructure required (e.g. hand-made fence, small cage)'},
                {
                  value: 0,
                  text: 'certain investment on infrastructure required (e.g. irrigation, processing equipment)'
                },
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
                {value: 3, text: 'Conventional storage/processing method works well'},
                {value: 2, text: 'Conventional method is available, but needs improvement'},
                {value: 1, text: 'Storage/processing method is available, but investment required'},
                {value: 0, text: 'no technology is available yet'},
              ]
            },
          ]
        },
        {
          categoryID: 6,
          categoryText: 'Market opportunity',
          itemsQA: [
            {
              id: 13,
              questionText: 'Do you find this commodity at local market?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'yes, it is quite common'},
                {value: 2, text: 'yes, but limited period or limited seller'},
                {value: 1, text: 'Not here, but I saw it in a big market'},
                {value: 0, text: 'i have never seen this in the market'},
              ]
            },
            {
              id: 14,
              questionText: 'When you sell your products, how it is delivered?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'There is a trader/middleman (going to big city)'},
                {value: 2, text: 'There is a trader/middleman (going to local market)'},
                {value: 1, text: 'I bring products to the market'},
                {value: 0, text: 'I cannot bring products to the market'},
              ]
            },
            {
              id: 15,
              questionText: 'How is your experience marketing your products?',
              answerList: [
                {value: -99, text: 'please select', disabled: true},
                {value: 3, text: 'I usually sell staples and other cash crop'},
                {value: 2, text: 'I usually sell mostly staples'},
                {value: 1, text: 'I sell staples when there are surplus'},
                {value: 0, text: 'I do not sell my products'},
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
    /**
     * 現在のページ番号
     */
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
  }
}
</script>
