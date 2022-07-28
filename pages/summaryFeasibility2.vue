<template>
  <b-container>
    <b-row>
      <b-col cols="12" lg="6" class="my-1">
        <b-card title="Comparison of Feasibility assessment">
          <b-card>
            Note for each case
            <div v-for="pageId in sceneCount" :key="pageId" v-if="myApp" class="border bg-light">
              Case {{pageId}}: {{myApp.feasibilityCases[pageId-1].note}}
            </div>
          </b-card>
          <b-form-select v-model="selectedCaseId" :options="noteList" v-if="myApp"></b-form-select>
        </b-card>
      </b-col>
      <b-col cols="12" lg="6" class="my-1" v-for="pageId in sceneCount" :key="pageId" v-if="myApp" >
        <div v-if="selectedCase.includes(pageId-1)">
          <!--   スコアの総括票     -->
          <b-card
            style="min-width: 530px;"
            header-bg-variant="success"
            bg-variant="light"
            border-variant="success"
            class="mx-1 px-0 my-2">
            <template #header>
              <div class="font-weight-bolder text-white">
                {{myApp.feasibilityCases[pageId-1].note}}:
                {{ cropName[pageId-1] || 'not selected'}}
              </div>
            </template>
            <b-row>
              <b-col class="text-center">Crop name:</b-col>
              <b-col class="text-info text-center">{{ cropName[pageId-1] }}</b-col>
            </b-row>
            <b-row>
              <b-col cols="6" class="text-center">total score:</b-col>
              <b-col cols="6">{{ qaScore[pageId-1][qaScore[pageId-1].length - 1].value }} /
                {{ 10 * qaList.length }}
              </b-col>
            </b-row>
            <b-row v-for="(qa, index) in qaScore[pageId-1]" :key="index">
              <b-col>
                <nutrition-bar2
                  v-if="qa.id > 0"
                  :colWidthFirst="3"
                  :colwidthSecond="0"
                  :colwidthThird="0"
                  :colwidthFourth="2"
                  :show-max-number="false"
                  :max="10"
                  :nutritionTarget="0"
                  :cropName="qa.text"
                  :rating="qa.value || 0"
                  :label="qa.text"
                ></nutrition-bar2>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import nutritionBar2 from "@/components/molecules/nutritionBar2";

export default {
  components: {
    nutritionBar2
  },
  computed: {
    /**
     * 同一グループのidリスト
     * @returns {*[]}
     */
    selectedCase(){
      if (this.selectedCaseId === -1){
        return []
      }
      const selectedItem = this.noteList.find((dat)=>dat.value === this.selectedCaseId).key
      return this.noteList.filter((val)=>{
        return val.key === selectedItem
      }).map((val2)=>{
        return val2.value
      })
    },
    /**
     * 表示するfeasibilityCaseを選択するためのリスト
     * @returns {*[]}
     */
    noteList(){
      let res = []
      for (let index =1; index<= this.sceneCount; index++ ){
        const myNote = this.myApp.feasibilityCases[index-1].note
        if (myNote){
          res.push({
            'text': 'Case' + index + ':' + myNote,
            'value': index-1,
            'key': myNote
          })
        }
      }
      return res
    },
    myApp: function () {
      return this.$store.state.fire.myApp
    },
    sceneCount: function () {
      return this.$store.state.fire.myApp.sceneCount
    },
    /**
     * ansListをmyAppから読み込んでscoreに変換
     * @returns {*[]}
     */
    qaScore() {
      let res = []
      const vm = this
      vm.myApp.feasibilityCases.forEach(function (val) {
        res.push(vm.summarizeQA(vm.ansId, val.ansList))
      })
      return res
    },
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
     * QAのカテゴリとIDをセットにしてArrayに追加（カテゴリ事の集計に用いる）
     * @returns {*[]}
     */
    ansId() {
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
     * selectedCropをmyAppから読み込んで返す
     * @returns {any[]}
     */
    cropName() {
      return this.myApp.feasibilityCases.map(function (item) {
        return item.selectedCrop.length > 0 ?  item.selectedCrop[0].Name : ''
      })
    },
  },
  data() {
    return {
      /**
       * 選択されたfeasibilityCase
       */
      selectedCaseId:-1,
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
              questionText: 'Is there need for specific infrastructure (irrigation / post harvest, etc.)?',
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
  methods: {
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
  }
}
</script>
