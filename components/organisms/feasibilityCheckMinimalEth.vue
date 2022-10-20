<template>
  <b-container class="px-0" style="max-width: 540px;">
    <b-row v-if="!noHeader" class="mt-0">
      <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
        Feasibility score
      </b-col>
    </b-row>
    <!--   スコアの総括票     -->
    <b-card
      style="min-width: 530px;"
      header-bg-variant="success"
      bg-variant="light"
      border-variant="success"
      class="mx-1 px-0 mb-2 mt-0"
    >
      <template #header>
        <div>Feasibility score</div>
      </template>
      <b-row>
        <b-col class="text-center">
          Crop name:
        </b-col>
        <b-col class="text-info">
          {{ currentCrop }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6" class="text-center">
          total score:
        </b-col>
        <b-col cols="6">
          {{ qaScore[qaScore.length - 1].value }} /
          {{ 10 * qaList.length }}
        </b-col>
      </b-row>
      <b-row v-for="(qa, index) in qaScore" :key="index">
        <nutrition-bar
          v-if="qa.id > 0"
          :col-width-first="6"
          :colwidth-second="0"
          :show-max-number="false"
          :max="10"
          :nutrition-target="0"
          :crop-name="qa.text"
          :rating="qa.value"
          :label="qa.text"
        />
      </b-row>
    </b-card>

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
          class="mx-1 px-0 my-2"
        >
          <template #header>
            <div>{{ qaGroup.categoryText }}</div>
          </template>

          <!--    質問番号が0の場合に以下の項目を表示      -->
          <div v-show="index===0" class="mb-2">
            <div class="font-weight-bold">
              Target commodity: <span
                class="text-danger"
              >{{ currentCrop }}</span>
            </div>
            <div class="font-weight-bold">
              Target nutrient: <span
                class="text-danger"
              >{{ nutrient }}</span>
            </div>
            <div class="font-weight-bold">
              Daily Target:
              <span class="text-danger">
                {{ setDigit(productionTarget.Wt, 2) }}
              </span>
            </div>
            <div class="font-weight-bold mb-2">
              Annual Target:
              <span class="text-danger">
                {{ setDigit(productionTarget.Wt365, 2) }}
              </span>
            </div>
            <hr>
            currentCrop:{{ currentCrop }}
            <b-card class="px-0 mx-0">
              <b-row class="mt-0 bg-success mb-3">
                <b-col cols="3" class="text-center mr-2 font-weight-bold">
                  Nutrition
                </b-col>
                <b-col cols="3" class="font-weight-bold">
                  Target
                </b-col>
                <b-col cols="3" class="font-weight-bold">
                  Sufficiency
                </b-col>
              </b-row>
              <b-row v-for="(nut, index2) in nutritionRatingSet" :key="index2">
                <nutrition-bar
                  v-if="nut.nameId === nutrient"
                  :label="nut.name"
                  :max-rating-absolute="nut.supply"
                  :nutrition-target="nut.target"
                  :rating="nut.rating"
                />
              </b-row>
            </b-card>
            <b-row align-h="end" class="mt-2">
              <b-col cols="6">
                <b-input-group
                  prepend="set sufficiency rate"
                  append="%"
                  size="sm"
                >
                  <b-form-input
                    v-model="share"
                    :disabled="!currentCrop"
                    type="number"
                    size="sm"
                  />
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
                :value="ansListWatcher[qa.id-1]"
                :options="qa.answerList"
                size="sm"
                :state="ansListWatcher[qa.id-1] !== -99"
                @change="onAnsChanged({'id':qa.id, 'val':$event})"
              />
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import nutritionBar from '@/components/molecules/nutritionBar'
import {
  getNutritionDemand,
  getNutritionSupply,
  getProductionTarget
} from '@/plugins/helper'

/**
 * @desc 3つのコンポーネントを組み合わせて特定の品目のfeasibility scoreを算出する
 * 1. FctTableModal - 作物を選択した場合、これに応じた栄養素供給量を返す
 * 2. driSelectSingle - 対象グループを選択した場合、これに応じた栄養素必要量を返す
 * 3. nutritionBar - 上記2つから、栄養素の銃速度をバーチャートで示す
 *
 */
export default {
  components: {
    nutritionBar
  },
  props: {
    noHeader: {
      type: Boolean,
      default: false
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
     * 現在の家族名
     */
    currentFamily: {
      type: String,
      required: true
    },
    /**
     * monthの指定をした場合は挙動を変える
     */
    month: {
      type: Number,
      default: 999
    },
    nutrient: {
      type: String,
      required: true
    },
    feasibilityCase: {
      type: Object,
      required: true
    },
    targetGroup: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      /**
       * (カテゴリ、質問ID)の一蘭
       * @returns {*[]}
       */
      ansId: [],
      /**
       * fctの一覧
       */
      itemsFct: [],
      /**
       * driの一覧
       */
      itemsDRI: [],
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
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
        }
      ],
      /**
       * 質問と回答一覧
       */
      qaList: []
    }
  },
  computed: {
    /**
     * 質問への回答一覧
     */
    ansListWatcher: {
      get () {
        return JSON.parse(JSON.stringify(this.feasibilityCase.ansList))
      }
    },
    /**
     * 栄養供給量
     */
    nutritionSupply: {
      get () {
        return getNutritionSupply(this.targetCrop, 1)
      }
    },
    /**
     * 栄養摂取目標
     */
    nutritionDemand: {
      get () {
        return getNutritionDemand(this.targetGroup, this.itemsDRI)
      }
    },
    /**
     * 選択された作物
     */
    targetCrop: {
      get () {
        return [this.feasibilityCase.selectedCrop]
      }
    },
    /**
     * ページメモ
     */
    pageMemo: {
      get () {
        return this.feasibilityCase.note
      }
    },
    /**
     * 質問への回答のカテゴリごとの合計
     */
    qaScore: {
      get () {
        return this.summarizeQA(this.ansId, this.feasibilityCase.ansList)
      }
    },
    /**
     * 栄養素の充足率
     */
    nutritionRatingSet: {
      get () {
        return this.updateNutritionRating(
          this.nutritionDemand,
          this.nutrientSupplyPer100g,
          this.productionTarget.Wt
        )
      }
    },
    /**
     * 生産量目標Wt
     */
    productionTarget: {
      get () {
        return this.updateProductionTarget(
          this.share,
          this.nutritionDemand,
          this.nutrientSupplyPer100g,
          this.nutrient
        )
      }
    },
    /**
     * 現在のターゲット品目名
     */
    currentCrop: {
      get () {
        return this.feasibilityCase.selectedCrop.Name
      }
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
        if (this.pageId !== newVal) {
          this.$emit('update:pageId', newVal)
        }
      }
    },
    /**
     * noteの記入状態
     * @returns {boolean}
     */
    noteInputState () {
      return (this.pageMemo.length > 3)
    },
    nutrientSupplyPer100g () {
      const currentWt = this.nutritionSupply.Wt
      const res = {}
      Object.entries(this.nutritionSupply).forEach(([key, value]) => {
        res[key] = value * (100 / currentWt)
      })
      return res
    },
    /**
     * 選択された栄養素の充足率（share)
     */
    share: {
      get () {
        return this.feasibilityCase.prodTarget.share
      },
      set (val) {
        this.updateShare(val)
      }
    }
  },
  created () {
    // 表示用にmyFamily.questionsの構造を変形
    const vm = this
    const res = JSON.parse(JSON.stringify(vm.qaListDataFrame))
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

    // 各種変数の初期化
    vm.ansId = vm.updateAnsId()
    vm.itemsFct = JSON.parse(JSON.stringify(vm.myFct))
    vm.itemsDRI = JSON.parse(JSON.stringify(vm.myDri))
  },
  methods: {
    /**
     * 数字の桁数を３桁に自動調整し、単位を追記して返す
     * @param val
     * @param unitKey
     * @returns {string}
     */
    setDigit (val, unitKey) {
      let res
      const units = [
        { 1: ' KC', 2: ' MC', 3: ' GC' }, // for dietary energy
        { 1: ' g', 2: ' kg', 3: ' t' }, // for protein
        { 1: ' µg', 2: ' mg', 3: ' g' }, // for vit-A
        { 1: ' mg', 2: ' g', 3: ' kt' } // for iron
      ]
      const item = Number(val)
      switch (true) {
        case (item < 1000):
          res = String(Math.round(item)) + units[unitKey - 1]['1']
          break
        case (item >= 1000 && item < 1000000):
          res = String(Math.round(item / 1000)) + units[unitKey - 1]['2']
          break
        case (item >= 1000000):
          res = String(Math.round(item / 1000000)) + units[unitKey - 1]['3']
          break
        default:
          console.log('parameter not valid:setDigit')
          res = ''
          break
      }
      return res
    },
    /**
     * targetCropをmyFamilyから読み込んでwatch
     * monthが設定されている場合はこれを用いてfiltering
     * @returns {any[]}
     */
    updateTargetCrop () {
      return this.feasibilityCase.map(function (item) {
        const dat = JSON.parse(JSON.stringify(item.selectedCrop))
        return { menu: dat }
      })
    },
    /**
     * targetGroupをmyFamilyから読み込んでwatch
     * @returns {any[]}
     */
    updateTargetGroup (member, maxPage) {
      const res = JSON.parse(JSON.stringify(member))
      return [...Array(maxPage)].map(() => res)
    },
    /**
     * ansListをmyFamilyから読み込んでscoreに変換
     * @returns {*[]}
     */
    updateScore () {
      const vm = this
      return vm.summarizeQA(vm.ansId, vm.feasibilityCase.ansList)
    },
    /**
     * QAのカテゴリとIDをセットにしてArrayに追加（カテゴリ事の集計に用いる）
     * @returns {*[]}
     */
    updateAnsId () {
      const vm = this
      const res = []
      vm.qaList.forEach(function (category) {
        category.itemsQA.forEach(function (item) {
          res.push({
            categoryID: category.categoryID,
            itemID: item.id
          })
        })
      })
      return res
    },
    /**
     * 栄養摂取目標と栄養供給量から栄養スコアを計算
     * @param nutritionDemand
     * @param nutritionSupply
     * @param weight
     * @returns {[{name: string, rating: (number|number), nameId: string, supply: (number|number), target: (number|number)},{name: string, rating: (number|number), nameId: string, supply: (number|number), target: (number|number)},{name: string, rating: (number|number), nameId: string, supply: (number|number), target: (number|number)},{name: string, rating: (number|number), nameId: string, supply: (number|number), target: (number|number)}]}
     */
    updateNutritionRating (nutritionDemand, nutritionSupply, weight) {
      return [
        {
          name: 'Energy',
          nameId: 'En',
          target: nutritionDemand.En ? Number(nutritionDemand.En) : 0,
          supply: nutritionSupply.En ? Number(nutritionSupply.En * weight / 100) : 0,
          rating: nutritionDemand.En
            ? Math.round((nutritionSupply.En * weight / 100) / nutritionDemand.En * 10)
            : 0
        },
        {
          name: 'Protein',
          nameId: 'Pr',
          target: nutritionDemand.Pr ? Number(nutritionDemand.Pr) : 0,
          supply: nutritionSupply.Pr ? Number(nutritionSupply.Pr * weight / 100) : 0,
          rating: nutritionDemand.Pr
            ? Math.round((nutritionSupply.Pr * weight / 100) / nutritionDemand.Pr * 10)
            : 0
        },
        {
          name: 'VitA',
          nameId: 'Va',
          target: nutritionDemand.Va ? Number(nutritionDemand.Va) : 0,
          supply: nutritionSupply.Va ? Number(nutritionSupply.Va * weight / 100) : 0,
          rating: nutritionDemand.Va
            ? Math.round((nutritionSupply.Va * weight / 100) / nutritionDemand.Va * 10)
            : 0
        },
        {
          name: 'Fe',
          nameId: 'Fe',
          target: nutritionDemand.Fe ? Number(nutritionDemand.Fe) : 0,
          supply: nutritionSupply.Fe ? Number(nutritionSupply.Fe * weight / 100) : 0,
          rating: nutritionDemand.Fe
            ? Math.round((nutritionSupply.Fe * weight / 100) / nutritionDemand.Fe * 10)
            : 0
        }
      ]
    },
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatePageMemo (newVal) {
      // 作業用のmyFamilyコピー作成
      const dat = JSON.parse(JSON.stringify(this.myFamilyWatcher))
      // 更新されたmenuを入れ替える
      dat.feasibilityCases.note = newVal
      // 更新されたmyFamilyをemit
      this.$emit('update:myFamily', dat)
    },
    /**
     * demand, supply, share, indexからターゲット生産量を計算して返す
     * @param share
     * @param demand
     * @param supply
     * @param target
     * @returns {{share: number, Wt365: number, Wt: number}|{share, Wt365: number, Wt: *}}
     */
    updateProductionTarget (share, demand, supply, target) {
      // 作物が未選択の場合、初期値を返す
      if (!target) {
        return {
          share: 100,
          Wt: 0,
          Wt365: 0
        }
      }

      // nutrientTargetを更新して入れ替える
      const Wt = getProductionTarget(
        demand,
        supply,
        target,
        share
      )
      return {
        share,
        Wt,
        Wt365: Wt * 365
      }
    },
    /**
     * shareの更新をmyFamilyに組み込んでemitで通知
     * 栄養素充足目標（share）の更新：
     * @param newVal
     */
    updateShare (newVal) {
      const vm = this
      // 作業用のmyFamilyコピー作成w
      const dat = JSON.parse(JSON.stringify(vm.feasibilityCase))

      // 作物が未選択の場合、何もしない
      if (dat.selectedCrop.length === 0) {
        return
      }

      // 生産目標の更新
      const res = vm.updateProductionTarget(
        newVal,
        vm.nutritionDemand,
        vm.nutrientSupplyPer100g,
        vm.nutrient
      )

      // prodTargetの更新
      dat.prodTarget = JSON.parse(JSON.stringify(res))

      // 更新されたmyAppをemit
      this.$emit('update:feasibilityCase', dat)
    },
    /**
     * Ansの更新をmyFamilyに組み込んでemitで通知
     * @param dat
     */
    onAnsChanged (dat) {
      // 作業用のmyFamilyコピー作成
      const res = JSON.parse(JSON.stringify(this.feasibilityCase))
      // 更新されたmenuを入れ替える
      res.ansList.splice(dat.id - 1, 1, dat.val)
      // 更新されたmyFamilyをemit
      this.$emit('update:feasibilityCase', res)
    },
    /**
     * fctダイアログのトリガー
     */
    showDialogue () {
      this.showFct = !this.showFct
    },
    /**
     * カテゴリ毎のスコアを集計して戻す
     * @param keys カテゴリとQA_idのペア
     * @param dat ansList[pageId]
     * @returns {any[]}
     */
    summarizeQA (keys, dat) {
      const vm = this
      const res = Array(this.qaCategoryCount).fill(0)
      let res2 = []
      // カテゴリ毎の集計
      keys.forEach(function (key) {
        res[key.categoryID - 1] += (dat[key.itemID - 1] > 0 ? dat[key.itemID - 1] : 0)
      })
      // 集計結果と合わせてカテゴリ情報をObjectにまとめる
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
    }
  }
}
</script>
