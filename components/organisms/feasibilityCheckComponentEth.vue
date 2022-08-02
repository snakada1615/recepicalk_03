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
            <b-col class="text-info">{{ currentCrop }}</b-col>
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
            <div class="font-weight-bold">
              Target commodity: <span
              class="text-danger">{{ currentCrop }}</span>
            </div>
            <div class="font-weight-bold">
              Target nutrient: <span
              class="text-danger">{{ keyNutrient }}</span>
            </div>
            <div class="font-weight-bold">
              Daily Target:
              <span class="text-danger">
                {{
                  setDigit(myFamilyWatcher.feasibilityCases[pageIdComputed].selectedCrop[0].Wt, 2)
                }}
              </span>
            </div>
            <div class="font-weight-bold mb-2">
              Annual Target:
              <span class="text-danger">
                {{
                  setDigit(myFamilyWatcher.feasibilityCases[pageIdComputed].selectedCrop[0].Wt * 365, 2)
                }}
              </span>
            </div>
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
                <b-input-group
                  prepend="sufficiency rate"
                  append="%"
                  size="sm">
                  <b-form-input
                    v-model="share"
                    type="number"
                    size="sm"
                    @update="updateShare"
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
import driSelectMulti from "@/components/molecules/driSelectMulti";
import {getNutritionDemand, getNutritionSupply} from "@/plugins/helper";
import {validateMyFamily} from "../../plugins/helper";

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
    driSelectMulti
  },
  methods: {
    /**
     * 栄養必要量、栄養供給量から必要な作物位の生産量を計算する
     * @param nutrientsDemand
     * @param nutrientsSupply
     * @param keyNutrient
     * @param share
     * @returns {number|number}
     */
    setQuantity(nutrientsDemand, nutrientsSupply, keyNutrient, share) {
      const rep1 = nutrientsDemand[keyNutrient] ? nutrientsDemand[keyNutrient] : 0
      const rep2 = nutrientsSupply ? nutrientsSupply[keyNutrient] : 0
      return rep2 ? Math.round((rep1 * 100 / rep2) * share / 100) : 0
    },
    /**
     * 数字の桁数を３桁に自動調整し、単位を追記して返す
     * @param val
     * @param unitKey
     * @returns {string}
     */
    setDigit(val, unitKey) {
      let res
      const units = [
        {1: ' KC', 2: ' MC', 3: ' GC'},   // for dietary energy
        {1: ' g', 2: ' kg', 3: ' t'},    // for protein
        {1: ' µg', 2: ' mg', 3: ' g'},    // for vit-A
        {1: ' mg', 2: ' g', 3: ' kt'},    // for iron
      ]
      const item = Number(val)
      switch (true) {
        case (item < 1000):
          res = String(Math.round(item)) + units[unitKey - 1]["1"]
          break;
        case (item >= 1000 && item < 1000000):
          res = String(Math.round(item / 1000)) + units[unitKey - 1]["2"]
          break;
        case (item >= 1000000):
          res = String(Math.round(item / 1000000)) + units[unitKey - 1]["3"]
          break;
        default:
          console.log('parameter not valid:setDigit')
          res = ''
          break;
      }
      return res
    },
    /**
     * ansListをmyFamilyから読み込んでwatch
     * @returns {any[]}
     */
    updateAnsList() {
      return this.myFamilyWatcher.feasibilityCases.map(function (item) {
        return JSON.parse(JSON.stringify(item.ansList))
      })
    },
    /**
     * targetCropをmyFamilyから読み込んでwatch
     * @returns {any[]}
     */
    updateTargetCrop(myFamily) {
      return myFamily.feasibilityCases.map(function (item) {
        return JSON.parse(JSON.stringify(item.selectedCrop))
      })
    },
    /**
     * targetGroupをmyFamilyから読み込んでwatch
     * @returns {any[]}
     */
    updateTargetGroup(member, maxPage) {
      const res = JSON.parse(JSON.stringify(member))
      return [...Array(maxPage)].map(() => res)
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
     * ansListをmyFamilyから読み込んでscoreに変換
     * @returns {*[]}
     */
    updateScore() {
      let res = []
      const vm = this
      vm.myFamily.feasibilityCases.forEach(function (val) {
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
      //作業用のmyFamilyコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].note = newVal
      //更新されたmyFamilyをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * shareの更新をmyFamilyに組み込んでemitで通知
     * @param val
     */
    onshareChanged(val) {
      //作業用のmyFamilyコピー作成w
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたfeasibilityCasesを入れ替える
      console.log(dat.feasibilityCases[this.pageIdComputed])
      dat.feasibilityCases[this.pageIdComputed].selectedCrop[0].Wt = val
      //更新されたmyFamilyをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * 栄養素充足目標（share）の更新：
     * @param newVal
     */
    updateShare(newVal) {
      console.log('updateNutrientTarget')
      //作業用のmyFamilyコピー作成w
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))

      //nutrientTargetを更新して入れ替える
      const nutrientTarget = dat.keyNutrient
      const vm = this
      const Wt = vm.setQuantity(
        vm.nutritionDemand[vm.pageIdComputed],
        vm.myAppWatcher.prodTargetCases[vm.pageIdComputed].prodTarget[0],
        nutrientTarget,
        newVal
      )

      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].share = newVal
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt = Wt
      dat.prodTargetCases[vm.pageIdComputed].prodTarget[0].Wt365 = Wt * 365

      //更新されたmyAppをemit
      this.$emit('update:myApp', dat)
    },
    /**
     * cropの選択の変更をmyFamilyに組み込んでemitで通知
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
      res.Wt = this.share

      //作業用のmyFamilyコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      dat.feasibilityCases[this.pageIdComputed].selectedCrop[0] = res
      //更新されたmmyFamilyをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * Ansの更新をmyFamilyに組み込んでemitで通知
     * @param dat
     */
    onAnsChanged(dat) {
      //作業用のmyFamilyコピー作成
      let res = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      //更新されたmenuを入れ替える
      res.feasibilityCases[this.pageIdComputed].ansList.splice(dat.id - 1, 1, dat.val)
      //更新されたmyFamilyをemit
      this.$emit('update:myFamily', res)
    },
    /**
     * fctダイアログのトリガー
     */
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
  watch: {
    myFamily: {
      deep: true,
      immediate: true,
      handler(newVal) {
        const vm = this
        vm.myFamilyWatcher = JSON.parse(JSON.stringify(newVal))
        vm.ansListWatcher = vm.updateAnsList()
        vm.ansId = vm.updateAnsId()
        vm.items = JSON.parse(JSON.stringify(vm.myFct))
        vm.itemsDRI = JSON.parse(JSON.stringify(vm.myDri))
        vm.targetCrop = vm.updateTargetCrop(vm.myFamilyWatcher)
        vm.targetGroup = vm.updateTargetGroup(vm.myFamilyWatcher.member, vm.maxPage)
        vm.nutritionDemand = vm.updateNutritionDemand(vm.targetGroup, vm.itemsDRI)
        vm.nutritionSum = vm.updateNutritionSupply(vm.targetCrop)
        vm.cropName = vm.targetCrop.map(function (item) {
          return item.length > 0 ? item[0].Name : ''
        })
        vm.nutritionRatingSet = vm.nutritionDemand.map(function (demand, index) {
          return vm.updateNutritionRating(demand, vm.nutritionSum[index])
        })
        vm.qaScore = vm.updateScore()
        this.pageMemo = vm.myFamily.feasibilityCases.map((item2) => {
          return item2.note
        })
      }
    }
  },
  created() {
    //表示用にmyFamily.questionsの構造を変形
    const vm = this
    let res = JSON.parse(JSON.stringify(vm.qaListDataFrame))
    vm.myQuestions.forEach((item) => {
      const index = res.findIndex(item2 => item2.categoryText === item.categoryText)
      if (index >= 0) {
        const itemsQATemp = {
          id: item.id,
          questionText: item.questionText,
          answerList: JSON.parse(JSON.stringify(
            item.answerList
          ))
        }
        res[index].itemsQA.push(itemsQATemp)
      }
    })
    vm.qaList = res

    //各種変数の初期化
    vm.myFamilyWatcher = JSON.parse(JSON.stringify(vm.myFamily))
    vm.ansListWatcher = vm.updateAnsList()
    vm.ansId = vm.updateAnsId()
    vm.items = JSON.parse(JSON.stringify(vm.myFct))
    vm.itemsDRI = JSON.parse(JSON.stringify(vm.myDri))
    vm.targetCrop = vm.updateTargetCrop(vm.myFamilyWatcher)
    vm.targetGroup = vm.updateTargetGroup(vm.myFamilyWatcher.member, vm.maxPage)
    vm.nutritionDemand = vm.updateNutritionDemand(vm.targetGroup, vm.itemsDRI)
    vm.nutritionSum = vm.updateNutritionSupply(vm.targetCrop)
    vm.cropName = vm.targetCrop.map(function (item) {
      return item.length > 0 ? item[0].Name : ''
    })
    vm.nutritionRatingSet = vm.nutritionDemand.map(function (demand, index) {
      return vm.updateNutritionRating(demand, vm.nutritionSum[index])
    })
    vm.qaScore = vm.updateScore()
    this.pageMemo = vm.myFamilyWatcher.feasibilityCases.map((item2) => {
      return item2.note
    })
  },
  computed: {
    currentCrop(){
      return this.cropName[this.pageIdComputed]
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
        res.push({value: i, text: 'page:' + i + ': ' + this.pageMemo[i]})
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
       * myFamilyから読み込んでこのページで利用。更新された時にemitを返す
       */
      myFamilyWatcher: {},
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
       * 選択された栄養素の充足率（share)
       */
      share: 100,
      /**
       * qaListのデータ構造
       */
      qaListDataFrame: [
        {
          categoryID: 1,
          categoryText: 'Nutrient balance',
          itemsQA: []
        },
        {
          categoryID: 2,
          categoryText: 'Socioeconomic feasibility',
          itemsQA: []
        },
        {
          categoryID: 3,
          categoryText: 'Technical feasibility',
          itemsQA: []
        },
        {
          categoryID: 4,
          categoryText: 'Investment',
          itemsQA: []
        },
        {
          categoryID: 5,
          categoryText: 'Stability',
          itemsQA: []
        },
        {
          categoryID: 6,
          categoryText: 'Market opportunity',
          itemsQA: []
        },
      ],
      /**
       * 質問と回答一覧
       */
      qaList: []
    }
  },
  props: {
    /**
     * データ本体。myFamilyWatcherで読み込んでページ内で利用
     */
    myFamily: {
      type: Object,
      validator: function (value) {
        return validateMyFamily(value)
      },
      required: true,
    },
    myDri: {
      type: Array,
      required: true
    },
    myFct: {
      type: Array,
      required: true
    },
    myQuestions: {
      type: Array,
      required: true
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
    /**
     * 現在の家族名
     */
    currentFamily: {
      type: String,
      required: true
    },
    keyNutrient: {
      type: String,
      required: true
    }
  }
}
</script>
