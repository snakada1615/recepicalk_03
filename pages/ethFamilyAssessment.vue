<template>
  <b-container>
    <b-card
      :header="'Family Assessment: ' + familyName"
      header-text-variant="white"
      header-bg-variant="success-5"
    >
      <b-tabs card>
        <b-tab title="set family">
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-form-checkbox v-model="addNewFamilyFlag" switch>
                add new family
              </b-form-checkbox>
            </b-col>
          </b-row>

          <b-row v-if="addNewFamilyFlag" class="justify-content-center">
            <b-col cols="12" lg="8">
              <b-input-group
                size="sm"
                prepend="family name"
                class="mt-2 mb-0"
              >
                <b-form-input
                  v-model="newFamilyName"
                  :state="stateFamilyName"
                />
                <template #append>
                  <b-button
                    :disabled="!(stateFamilyName && familySize) "
                    :class="{'btn-info':(stateFamilyName && familySize)}"
                    @click="addNewFamily(newFamilyName, newTarget)"
                  >
                    add new family
                  </b-button>
                </template>
              </b-input-group>
              <div class="small text-muted mb-2">
                <span>You have to give unique family name. </span>
                <span>Family name should be longer than 4 letters</span>
              </div>
              <hr>
              {{ myApp.currentFamily }}
              <dri-select-multi
                :dri-items="dri"
                :target="newTarget"
                :max="maxPopulation"
                class="multi"
                @update:target="updateNewFamily"
              />
            </b-col>
          </b-row>
          <b-row v-if="!addNewFamilyFlag" class="justify-content-center border-primary">
            <b-col cols="12" lg="8">
              <b-input-group size="sm" class="mb-2">
                <template #prepend>
                  <b-input-group-text>
                    select family
                  </b-input-group-text>
                </template>
                <b-form-select
                  v-model="familyName"
                  :options="familyList"
                  @change="changeFamily"
                />
                <template #append>
                  <b-button
                    @click="removeFamily(familyName)"
                  >
                    <b-icon icon="trash" />
                  </b-button>
                </template>
              </b-input-group>
              <dri-select-multi
                :dri-items="dri"
                :target="currentTarget"
                :max="maxPopulation"
                class="multi"
                @update:target="updateFamily(familyName, $event)"
              />
            </b-col>
          </b-row>
        </b-tab>

        <b-tab title="current diet" :disabled="!stateDiet">
          <b-card no-body>
            <diet-calk-comp-eth
              v-if="myFamily.name"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-portion="myApp.dataSet.portionUnit"
              :page-id="pageId1"
              :max-page="maxPage"
              :disabled-option="[1,2,3,4,5,6,7,8,9]"
              :hide-case-info="true"
              @update:myFamily="updateMyFamily"
              @update:pageMemo="updatePageMemo"
            />
          </b-card>
        </b-tab>

        <b-tab title="priority commodity" :disabled="!statePriority">
          <priority-commodity
            :crop-list="priorityCropList"
            :crop-calendar="myApp.dataSet.cropCalendar"
            :fct="myApp.dataSet.fct"
            :selected-nutrient.sync="selectedNutrient"
            :selected-month.sync="selectedMonth"
            @changeCrop="onChangeCrop"
          />
        </b-tab>

        <b-tab
          title="crop feasibility"
          :disabled="!selectedCropList || familyList.length === 0 || !myFamily.keyNutrient"
        >
          <div class=" mb-2 ml-3">
            identified nutrient gap:
            <span
              class="text-danger font-weight-bold"
            >
              {{ selectedNutrient }}
            </span>
          </div>
          <div class=" mb-2 ml-3">
            selected month:
            <span
              class="text-danger font-weight-bold"
            >
              {{ monthValueText }}
            </span>
          </div>
          <b-row>
            <feasibility-check-component-eth
              v-if="myFamily.name && selectedNutrient && (selectedMonth !== -1)"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-questions="myApp.dataSet.questions"
              :page-id.sync="pageId3"
              :max-page="maxPage"
              :current-family="familyName"
              @update:myFamily="updateMyFamily"
            />
          </b-row>
        </b-tab>

        <b-tab
          title="crop feasibility assessment summary"
          :disabled="!stateFeasibilityCheck"
        >
          <b-row>
            <b-col
              cols="12"
              lg="6"
              class="my-1"
            >
              <div class=" mb-2 ml-3">
                identified nutrient gap:
                <span class="text-danger font-weight-bold">
                  {{ selectedNutrient }}
                </span>
              </div>
              <b-card
                style="min-width: 530px;"
                header-bg-variant="success"
                bg-variant="light"
                border-variant="success"
                class="mx-1 px-0 my-2"
              >
                <template #header>
                  <div>Select nutrient dense food for your target family/HH</div>
                </template>
                <b-form-group
                  v-if="selectedCropList.length !== 0"
                  class="ml-2"
                >
                  <b-form-radio-group
                    v-model="selectedCommodityId"
                    :options="selectedCropListFiltered"
                    button-variant="outline-primary"
                    buttons
                    stacked
                    class="ml-4"
                  />
                </b-form-group>
              </b-card>
            </b-col>
          </b-row>
          <div class=" mt-2 mb-0 ml-3">
            result of crop feasibility assessment:
          </div>
          <b-row>
            <b-col
              v-for="pageId in maxPage"
              v-if="selectedCropList[pageId - 1]"
              :key="pageId"
              cols="12"
              lg="6"
              class="my-1"
            >
              <!--   スコアの総括票     -->
              <b-card
                style="min-width: 530px;"
                header-bg-variant="success"
                bg-variant="light"
                border-variant="success"
                class="mx-1 px-0 my-2"
              >
                <template #header>
                  <div class="font-weight-bolder text-white">
                    {{ myFamily.feasibilityCases[pageId - 1].note }}:
                    {{ selectedCropList[pageId - 1] || 'not selected' }}
                  </div>
                </template>
                <b-row>
                  <b-col cols="6">
                    Crop name:
                  </b-col>
                  <b-col cols="6" class="text-info">
                    {{ selectedCropList[pageId - 1] }}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="6">
                    total score:
                  </b-col>
                  <b-col cols="6">
                    {{ qaScore[pageId - 1][qaScore[pageId - 1].length - 1].value }} /
                    {{ 10 * qaList.length }}
                  </b-col>
                </b-row>
                <b-row v-for="(qa, index) in qaScore[pageId-1]" :key="index">
                  <b-col>
                    <nutrition-bar2
                      v-if="qa.id > 0"
                      :col-width-first="3"
                      :colwidth-second="0"
                      :colwidth-third="0"
                      :colwidth-fourth="2"
                      :show-max-number="false"
                      :max="10"
                      :nutrition-target="0"
                      :crop-name="qa.text"
                      :rating="qa.value || 0"
                      :label="qa.text"
                    />
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab
          title="overall result"
          :disabled="!stateFeasibilityCheck"
        >
          <div class=" mb-0 ml-3">
            identified nutrient gap:
            <span class="text-danger font-weight-bold">
              {{ selectedNutrient }}
            </span>
          </div>
          <div class=" mb-2 ml-3">
            identified nutrient dense food:
            <span
              v-if="(selectedCropListFiltered.length > 0) && selectedCropListFiltered[selectedCommodityId]"
              class="text-danger font-weight-bold"
            >
              {{ selectedCropListFiltered[selectedCommodityId].text }}
            </span>
          </div>
          <summary-diet-eth
            v-if="Object.keys(summaryResult).length"
            :my-app="summaryResult"
            :is-common-target-group="true"
          />
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>
<script>
import driSelectMulti from '../components/molecules/driSelectMulti'
import dietCalkCompEth from '../components/organisms/dietCalkCompEth'
import feasibilityCheckComponentEth from '../components/organisms/feasibilityCheckComponentEth'
import nutritionBar2 from '../components/molecules/nutritionBar2'
import summaryDietEth from '../components/organisms/summaryDietEth'
import { getNutritionDemand, getNutritionSupply, getProductionTarget } from '@/plugins/helper'
import priorityCommodity from '@/components/organisms/priorityCommodity'

export default {
  components: {
    driSelectMulti,
    dietCalkCompEth,
    feasibilityCheckComponentEth,
    nutritionBar2,
    summaryDietEth,
    priorityCommodity
  },
  layout: 'defaultEth',
  data () {
    return {
      showDriSelect: false,
      isTargetSingle: false,
      maxPopulation: 10000,
      newTarget: [],
      newFamilyName: '',
      pageId1: 0,
      pageId2: 1,
      pageId3: 0,
      addCropId: 0,
      maxPage: 10,
      /**
       * 家族の新規追加or選択
       */
      addNewFamilyFlag: false,
      /**
       * workFlowの何ページ目まで読み込めるかのフラグ
       */
      workFlowStatus: 0,
      /**
       * monthの選択肢
       */
      monthOptions: [
        { value: -1, text: 'Any month' },
        { value: 1, text: 'Jan' },
        { value: 2, text: 'Feb' },
        { value: 3, text: 'Mar' },
        { value: 4, text: 'Apr' },
        { value: 5, text: 'May' },
        { value: 6, text: 'Jun' },
        { value: 7, text: 'Jul' },
        { value: 8, text: 'Aug' },
        { value: 9, text: 'Sep' },
        { value: 10, text: 'Oct' },
        { value: 11, text: 'Nov' },
        { value: 12, text: 'Dec' }
      ],
      familyName: '',
      keyNutrients: [
        { text: 'Energy', value: 'En' },
        { text: 'Protein', value: 'Pr' },
        { text: 'Vitamin A', value: 'Va' },
        { text: 'Iron', value: 'Fe' }
      ],
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'yes' },
                { value: 2, text: 'maybe yes' },
                { value: 1, text: 'maybe no' },
                { value: 0, text: 'no' }
              ]
            }
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            },
            {
              id: 3,
              questionText: 'Is there any social barrier to consume this commodity for women?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            },
            {
              id: 4,
              questionText: 'Is there any social barrier to consume this commodity for child?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            },
            {
              id: 5,
              questionText: 'Is this commodity affordable in the market for ordinary population?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            }
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'yes' },
                { value: 2, text: 'maybe yes' },
                { value: 1, text: 'maybe no' },
                { value: 0, text: 'no' }
              ]
            },
            {
              id: 7,
              questionText: 'Does this commodity imply incremental workload for women?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            },
            {
              id: 8,
              questionText: 'Is technical service available for this commodity?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'yes / there is no need for it since beneficiaries already have enough skill' },
                { value: 2, text: 'maybe yes' },
                { value: 1, text: 'maybe no' },
                { value: 0, text: 'no' }
              ]
            }
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            },
            {
              id: 10,
              questionText: 'Is production input (fertilizer, seed, feed) become financial burden for small farmer?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'no' },
                { value: 2, text: 'maybe no' },
                { value: 1, text: 'maybe yes' },
                { value: 0, text: 'yes' }
              ]
            }
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: '10-12 mon' },
                { value: 2, text: '7-9 mon' },
                { value: 1, text: '4-6 mon' },
                { value: 0, text: '0-3 mon' }
              ]
            },
            {
              id: 12,
              questionText: 'Are there any feasible storage method available for this commodity?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'yes' },
                { value: 2, text: 'maybe yes' },
                { value: 1, text: 'maybe no' },
                { value: 0, text: 'no' }
              ]
            }
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
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'yes, it is quite common' },
                { value: 2, text: 'yes, but limited period or limited seller' },
                { value: 1, text: 'Not here, but I saw it in a big market' },
                { value: 0, text: 'i have never seen this in the market' }
              ]
            },
            {
              id: 14,
              questionText: 'When you sell your products, how it is delivered?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'There is a trader/middleman (going to big city)' },
                { value: 2, text: 'There is a trader/middleman (going to local market)' },
                { value: 1, text: 'I bring products to the market' },
                { value: 0, text: 'I cannot bring products to the market' }
              ]
            },
            {
              id: 15,
              questionText: 'How is your experience marketing your products?',
              answerList: [
                { value: -99, text: 'please select', disabled: true },
                { value: 3, text: 'I usually sell staples and other cash crop' },
                { value: 2, text: 'I usually sell mostly staples' },
                { value: 1, text: 'I sell staples when there are surplus' },
                { value: 0, text: 'I do not sell my products' }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    /**
     * 現在選択された月をtext表示
     */
    monthValueText: {
      get () {
        const vm = this
        return vm.monthOptions.find(item => item.value === vm.selectedMonth).text
      }
    },
    priorityCropList () {
      return this.myApp.familyCases.find(item => item.name === this.familyName).feasibilityCases.map((item2) => {
        return {
          month: item2.month,
          index: item2.index,
          selectedCrop: item2.selectedCrop
        }
      })
    },
    menuUpdated () {
      const vm = this
      if (!vm.myFamily.feasibilityCases) {
        console.log('dataset is broken in feasibilityCases: null')
        return []
      }
      if (vm.myFamily.feasibilityCases.length === 0) {
        console.log('dataset is broken in feasibilityCases: length is 0')
        return []
      }
      const res = JSON.parse(JSON.stringify(vm.myFamily.menuCases[0].menu))
      const addedCommodity = vm.myFamily.feasibilityCases.find((item) => {
        if (item.selectedCrop.length > 0) {
          return item.selectedCrop[0].Name === vm.selectedCommodity
        } else {
          return false
        }
      })
      // 追加品目が存在する場合にはこれを追加、存在しない場合はもともとのmenuを返す
      if (addedCommodity && addedCommodity.selectedCrop.length > 0) {
        res.push(addedCommodity.selectedCrop[0])
      }
      return res
    },
    summaryResult () {
      const vm = this
      if (!vm.myFamily.menuCases) {
        return {}
      }
      return {
        menuCases: [
          {
            note: 'current diet',
            menu: vm.myFamily.menuCases[0].menu
          },
          {
            note: 'improved',
            menu: vm.menuUpdated
          }
        ],
        member: vm.myFamily.member,
        fct: vm.fct,
        dri: vm.dri
      }
    },
    /**
     * ansListをmyAppから読み込んでscoreに変換
     * @returns {*[]}
     */
    qaScore () {
      const res = []
      const vm = this
      vm.myFamily.feasibilityCases.forEach(function (val) {
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
    ansId () {
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
    stateDiet () {
      const vm = this
      if (!vm.familyName) {
        return false
      }
      return (vm.familyName.length > 3)
    },
    statePriority () {
      const vm = this
      let res = false
      if (vm.myFamily) {
        if (vm.myFamily.menuCases) {
          if (vm.myFamily.menuCases.length > 0) {
            if (vm.myFamily.menuCases[0].menu.length > 0) {
              res = true
            }
          }
        }
      }
      return res
    },
    stateFeasibilityCheck () {
      let res = false
      if (this.myFamily.feasibilityCases) {
        this.myFamily.feasibilityCases.forEach((item) => {
          if (item.selectedCrop.length > 0) {
            res = true
          }
        })
      }
      if (this.familyList.length === 0) {
        res = false
      }
      if (!this.myFamily.keyNutrient) {
        res = false
      }
      return res
    },
    selectedNutrient: {
      get () {
        return this.myFamily.keyNutrient
      },
      set (val) {
        const vm = this
        const res = JSON.parse(JSON.stringify(vm.myFamily))
        res.keyNutrient = val
        vm.updateMyFamily(res)
      }
    },
    selectedMonth: {
      get () {
        return this.myFamily.currentMonth
      },
      set (val) {
        const vm = this
        const res = JSON.parse(JSON.stringify(vm.myFamily))
        res.currentMonth = val
        vm.updateMyFamily(res)
      }
    },
    selectedCommodityId: {
      get () {
        return this.myFamily.keyCommodity
      },
      set (val) {
        const vm = this
        console.log(val)
        const res = JSON.parse(JSON.stringify(vm.myFamily))
        res.keyCommodity = val
        vm.updateMyFamily(res)
      }
    },
    selectedCommodity () {
      const vm = this
      if (vm.selectedCropListFiltered.length === 0) {
        return ''
      }
      if (!vm.selectedCropListFiltered[vm.selectedCommodityId]) {
        return ''
      }
      return vm.selectedCropListFiltered[vm.selectedCommodityId].text
    },
    myApp: function () {
      return JSON.parse(JSON.stringify(
        this.$store.state.fire.myApp
      ))
    },
    myFamily () {
      const vm = this
      const res = vm.myApp.familyCases.find(item => item.name === vm.myApp.currentFamily)
      return res || []
    },
    selectedCropList () {
      if (!this.myFamily.feasibilityCases) {
        return []
      }
      return this.myFamily.feasibilityCases.map((item) => {
        return item.selectedCrop[0] ? item.selectedCrop[0].Name : ''
      })
    },
    selectedCropListFiltered () {
      const vm = this
      if (!vm.selectedCropList) {
        return
      }
      return vm.selectedCropList.map((item, index) => {
        return {
          text: item,
          value: index
        }
      }).filter(item => item.text !== '')
    },
    currentTarget () {
      const temp = this.myApp.familyCases
      if (!temp) {
        return []
      }
      let res = []
      temp.forEach((item) => {
        if (item.name === this.familyName) {
          res = item.member
        }
      })
      return res
    },
    dri () {
      return JSON.parse(JSON.stringify(this.myApp.dataSet.dri))
    },
    fct () {
      return JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
    },
    fctFilterByMonth () {
      if (this.selectedMonth === -1) {
        return JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
      }
      const myFilter = this.myApp.dataSet.cropCalendar.filter(item =>
        (item[this.selectedMonth] === '1') || (item[this.selectedMonth] === '2'))
      const filteredId = myFilter.map((item) => {
        return item.FCT_id
      })
      return this.myApp.dataSet.fct.filter(item => filteredId.includes(item.id))
    },
    stateFamilyName () {
      return this.newFamilyName.length > 4 && !this.familyList.includes(this.newFamilyName)
    },
    familySize () {
      return this.newTarget.reduce((accum, curr) => {
        accum += curr.count
        return accum
      }, 0)
    },
    familyList () {
      const temp = this.myApp.familyCases
      if (!temp) {
        return []
      }
      return temp.map((val) => {
        return val.name
      })
    }
  },
  created () {
    this.familyName = this.myApp.currentFamily
  },
  methods: {
    /**
     * cropの選択した値をもとにデータ更新
     * @param value
     * @returns {Promise<void>}
     */
    async onChangeCrop (value) {
      console.log(value)
      const vm = this
      // 作業用のmyFamilyコピー作成
      const dat = vm.myFamily.feasibilityCases.map((item) => {
        if ((item.month === value.month) && (item.index === value.index)) {
          item.selectedCrop = value.selectedCrop

          // 生産目標を計算
          const demand = getNutritionDemand(vm.myFamily.member, this.dri)
          const supply = getNutritionSupply([value.selectedCrop])
          const Wt = getProductionTarget(demand, supply, vm.myFamily.keyNutrient, 100)

          // prodTargetを更新
          item.prodTarget.share = 100
          item.prodTarget.Wt = Wt
          item.prodTarget.Wt365 = Wt * 365

          // selectedCrop[0]を更新
          item.selectedCrop.Wt = Wt
        }
        return item
      })
      // myFamilyを更新
      await this.updateMyFamily(dat)
    },
    updateMyFamily (val) {
      let res = JSON.parse(JSON.stringify(this.myApp.familyCases))
      res = res.map((item) => {
        let res2 = item
        if (item.name === val.name) {
          res2 = val
        }
        return res2
      })
      this.$store.dispatch('fire/updateMyFamily', res)
    },
    updatePageMemo (val) {
      this.$store.dispatch('fire/updateMyFamily', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    updateFamily (name, member) {
      this.$store.dispatch('fire/updateFamilyCase', { name, member })
    },
    updateNewFamily (val) {
      this.newTarget = JSON.parse(JSON.stringify(val))
    },
    async addNewFamily (name, member) {
      await this.$store.dispatch('fire/addNewFamily', {
        name,
        member
      })

      this.familyName = name
      // 現在の家族名の更新
      await this.$store.dispatch('fire/updateCurrentFamilyName', name)

      // 変数のクリア
      this.newFamilyName = ''
      this.newTarget = []
    },
    removeFamily (val) {
      if (this.familyList.length === 1) {
        alert('you cannot delete last item')
        return
      }
      this.$store.dispatch('fire/removeFamily', val)
      const newVal = this.familyList[0]
      this.$store.dispatch('fire/updateCurrentFamilyName', newVal)
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
    },
    changeFamily (val) {
      this.$store.dispatch('fire/updateCurrentFamilyName', val)
    }
  }
}
</script>
