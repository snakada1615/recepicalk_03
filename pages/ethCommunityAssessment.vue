<template>
  <b-container>
    <b-card
      :header="'Community Assessment: ' + communityName"
      header-text-variant="white"
      header-bg-variant="success-5"
    >
      <b-tabs pills card>
        <b-tab v-if="statePage1" title="set community">
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-form-checkbox v-model="addNewCommunityFlag" switch>
                add new community
              </b-form-checkbox>
            </b-col>
          </b-row>

          <b-row v-if="addNewCommunityFlag" class="justify-content-center">
            <b-col cols="12" lg="8">
              <b-input-group
                size="sm"
                prepend="community name"
                class="mt-2 mb-0"
              >
                <b-form-input
                  v-model="newCommunityName"
                  :state="stateCommunityName"
                />
                <template #append>
                  <b-button
                    :disabled="!(stateCommunityName && familySize)"
                    :class="{'btn-info':(stateCommunityName && familySize)}"
                    @click="addNewCommunity(newCommunityName, newTarget)"
                  >
                    add new community
                  </b-button>
                </template>
              </b-input-group>
              <div class="small text-muted mb-2">
                <span>You have to give unique community name. </span>
                <span>Community name should be longer than 4 letters</span>
              </div>
              <hr>
              <dri-select-multi
                :dri-items="dri"
                :target="newTarget"
                :max="maxPopulation"
                class="multi"
                @update:target="updateNewCommunity"
              />
            </b-col>
          </b-row>

          <b-row v-if="!addNewCommunityFlag" class="justify-content-center border-primary">
            <b-col cols="12" lg="8">
              <b-input-group size="sm" class="mb-2">
                <template #prepend>
                  <b-input-group-text>
                    select community
                  </b-input-group-text>
                </template>
                <b-form-select
                  v-model="communityName"
                  :options="communityList"
                  @change="changeFamily"
                />
                <template #append>
                  <b-button
                    @click="removeCommunity(communityName)"
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
                @update:target="updateFamily(communityName, $event)"
              />
            </b-col>
          </b-row>
        </b-tab>

        <b-tab v-if="statePage2" title="sample diet pattern">
          <b-card no-body>
            <diet-calk-comp-eth
              v-if="myCommunity.name"
              :my-family="myCommunity"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-portion="myApp.dataSet.portionUnit"
              :page-id.sync="pageId1"
              :max-page="maxPage"
              :use-common-target="false"
              @update:myFamily="updateDietOrFeasibility($event, 1)"
            />
          </b-card>
        </b-tab>

        <b-tab v-if="statePage3" title="summary of sample families">
          <summary-diet-eth
            v-if="Object.keys(summaryAverage).length"
            :my-app="summaryAverage"
            :is-common-target-group="false"
            :is-average-included="true"
          />
        </b-tab>

        <b-tab v-if="statePage4" title="priority commodity">
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
          v-if="statePage5"
          title="feasibility check"
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
            <span class="text-danger font-weight-bold">
              {{ monthValueText }}
            </span>
          </div>

          <!--   ページ情報とページの切り替え   -->
          <b-row class="d-flex justify-content-center">
            <b-card border-variant="light" style="width: 590px;">
              <b-row class="mt-2">
                <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
                  Feasibility assessment result
                  <b-form-select v-model="selectedFeasibilityCase" :options="feasibilityCaseByMonth" />
                  <div class="d-flex flex-row">
                    <b-form-input
                      v-model="feasibilityPageMemo"
                      placeholder="memo for this page"
                      :state="stateMemoInput"
                      class="my-1"
                    />
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </b-row>

          <b-row>
            <feasibility-check-minimal-eth
              :feasibility-case.sync="feasibilityCase"
              :nutrient="selectedNutrient"
              :target-group="member"
              :my-questions="myApp.dataSet.questions"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :no-header="true"
            />
          </b-row>
        </b-tab>

        <b-tab
          v-if="statePage6"
          title="crop feasibility assessment summary"
        >
          <b-row>
            <b-col
              cols="12"
              lg="6"
              class="my-1"
            >
              <!-- まず注目する栄養素と選択した月を表示  -->
              <div class=" mb-2 ml-3">
                identified nutrient gap:
                <span class="text-danger font-weight-bold">
                  {{ selectedNutrient }}
                </span>
              </div>

              <div class=" mb-2 ml-3">
                selected month:
                <span class="text-danger font-weight-bold">
                  {{ monthValueText }}
                </span>
              </div>

              <!--  ここで優先作物を決定する -->
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
              v-for="(crop, index0) in selectedCropListFiltered"
              :key="index0"
              cols="12"
              lg="6"
              class="my-1"
            >
              <!--   スコアの総括票     -->
              <b-card
                header-bg-variant="success"
                bg-variant="light"
                border-variant="success"
                class="mx-1 px-0 my-2"
              >
                <template #header>
                  <div class="font-weight-bolder text-white">
                    {{ crop.text || 'not selected' }}:
                    {{ myCommunity.feasibilityCases[index0].note }}
                  </div>
                </template>
                <b-row>
                  <b-col cols="6">
                    Crop name:
                  </b-col>
                  <b-col cols="6" class="text-info">
                    {{ crop.text }}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="6">
                    total score:
                  </b-col>
                  <b-col cols="6">
                    {{ qaScore[index0][qaScore[index0].length - 1].value }} /
                    {{ 10 * qaList.length }}
                  </b-col>
                </b-row>
                <b-row v-for="(qa, index1) in qaScore[index0]" :key="index1">
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
          v-if="statePage7"
          title="overall result"
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
          />
        </b-tab>
      </b-tabs>
    </b-card>

    <fct-table-modal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="fctFilterByMonth"
      @modalOk="onCropSelected($event, addCropId)"
    />
  </b-container>
</template>
<script>
import driSelectMulti from '../components/molecules/driSelectMulti'
import dietCalkCompEth from '../components/organisms/dietCalkCompEth'
import fctTableModal from '../components/organisms/FctTableModal'
import nutritionBar2 from '../components/molecules/nutritionBar2'
import summaryDietEth from '../components/organisms/summaryDietEth'
import {
  getAverageNutritionDemand, getAverageNutritionSupply,
  getNutritionDemand,
  getNutritionSupply,
  getProductionTarget, getRating, summarizeQA
} from '@/plugins/helper'
import priorityCommodity from '@/components/organisms/priorityCommodity'
import feasibilityCheckMinimalEth from '@/components/organisms/feasibilityCheckMinimalEth'

export default {
  components: {
    driSelectMulti,
    dietCalkCompEth,
    fctTableModal,
    nutritionBar2,
    summaryDietEth,
    priorityCommodity,
    feasibilityCheckMinimalEth
  },
  layout: 'defaultEth',
  data () {
    return {
      selectedFeasibilityCase: 0,
      showDriSelect: false,
      isTargetSingle: false,
      maxPopulation: 10000,
      newTarget: [],
      newCommunityName: '',
      pageId1: 0,
      pageId2: 1,
      pageId3: 0,
      addCropId: 0,
      maxPage: 10,
      /**
       * Communityの新規追加or選択
       */
      addNewCommunityFlag: false,
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
      /**
       * 選択された月
       */
      monthValue: -1,
      communityName: '',
      keyNutrients: [
        { text: 'Energy', value: 'En' },
        { text: 'Protein', value: 'Pr' },
        { text: 'Vitamin A', value: 'Va' },
        { text: 'Iron', value: 'Fe' }
      ],
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
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
    statePage1: {
      get () {
        return true
      }
    },
    statePage2: {
      get () {
        return (this.stateCommunity && this.statePage1)
      }
    },
    statePage3: {
      get () {
        return (this.statePage2 && this.menuCasesFiltered.length)
      }
    },
    statePage4: {
      get () {
        return (this.statePage2 && this.statePriority)
      }
    },
    statePage5: {
      get () {
        return this.statePage4 && (this.selectedCropList && this.communityList.length &&
          this.myCommunity.keyNutrient && this.myCommunity.currentMonth)
      }
    },
    statePage6: {
      get () {
        return (this.statePage5 && this.stateFeasibilityCheck)
      }
    },
    statePage7: {
      get () {
        return (this.statePage6 && this.myCommunity.keyCommodity)
      }
    },
    /**
     * 月毎のfeasibilityCaseの選択肢一覧
     */
    feasibilityCaseByMonth: {
      get () {
        const vm = this
        return vm.myCommunity.feasibilityCases.filter(
          item => item.month === vm.myCommunity.currentMonth
        ).map((item2) => {
          return {
            value: item2.index,
            text: item2.selectedCrop.Name || '--------------------',
            disabled: !Object.keys(item2.selectedCrop).length
          }
        })
      }
    },
    /**
     * 選択されたfeasibilityCase
     */
    feasibilityCase: {
      get () {
        const vm = this
        return vm.myCommunity.feasibilityCases.find(
          item => (item.month === vm.myCommunity.currentMonth) && (item.index === vm.selectedFeasibilityCase)
        )
      },
      set (val) {
        this.onFeasibilityCaseChange(val)
      }
    },
    /**
     * noteの記入状態
     * @returns {boolean}
     */
    stateMemoInput () {
      return (this.feasibilityPageMemo.length > 3)
    },
    /**
     * feasibilityPageMemoの取得と更新
     */
    feasibilityPageMemo: {
      get () {
        return this.feasibilityCase ? this.feasibilityCase.note : ''
      },
      set (val) {
        // 作業用のmyFamilyコピー作成
        const dat = JSON.parse(JSON.stringify(this.feasibilityCase))
        // 更新されたmenuを入れ替える
        dat.note = val

        // 更新されたmyFamilyをemit
        this.onFeasibilityCaseChange(dat)
      }
    },
    /**
     * 対象となるcommunityの構成
     */
    member: {
      get () {
        return this.myCommunity.member
      }
    },
    selectedMonth: {
      get () {
        return this.myCommunity.currentMonth || 1
      },
      set (val) {
        const vm = this
        const res = JSON.parse(JSON.stringify(vm.myCommunity))
        res.currentMonth = val
        vm.updateMyCommunity(res)
      }
    },
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
      if (!this.myApp.communityCases || !Array.isArray(this.myApp.communityCases)) {
        return []
      }
      const communityCasesTemp = this.myApp.communityCases.find(item => item.name === this.communityName)
      if (!communityCasesTemp) {
        return []
      } else {
        return communityCasesTemp.feasibilityCases.map((item2) => {
          return {
            month: item2.month,
            index: item2.index,
            selectedCrop: item2.selectedCrop
          }
        })
      }
    },
    menuUpdated () {
      const vm = this
      if (!vm.myCommunity.feasibilityCases) {
        console.log('dataset is broken in feasibilityCases: null')
        return []
      }
      if (vm.myCommunity.feasibilityCases.length === 0) {
        console.log('dataset is broken in feasibilityCases: length is 0')
        return []
      }
      const res = JSON.parse(JSON.stringify(vm.myCommunity.menuCases[0].menu))
      const addedCommodity = vm.myCommunity.feasibilityCases.find((item) => {
        if (item.selectedCrop.Name !== '') {
          return item.selectedCrop.Name === vm.selectedCommodity
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
    /**
     * menuCasesの中から値の含まれるものを抽出
     * @returns {T[]}
     */
    menuCasesFiltered () {
      if (!Object.keys(this.myCommunity).length) {
        return []
      }
      return JSON.parse(JSON.stringify(this.myCommunity.menuCases.filter(item => item.menu.length > 0)))
    },
    /**
     * サンプル家族のメニュー配列（作物リスト）×食事パターン から、栄養供給量の平均値を算出
     * @returns {{}|{Pr: number, Fat: number, En: number, Carbohydrate: number, Va: number, Wt: number, Fe: number}[]}
     */
    averageSupply () {
      const vm = this
      if (vm.menuCasesFiltered.length === 0) {
        return {}
      }
      const menu = vm.menuCasesFiltered.map((item) => {
        return item.menu
      })
      const supplyList = menu.map((item) => {
        return getNutritionSupply(item, 1)
      })

      // ターゲットの栄養供給量を合計する(noAverage = 1)
      return [
        getAverageNutritionSupply(supplyList, 1)
      ]
    },
    /**
     * サンプル家族の栄養需要の平均値
     * @returns {{}|{Pr: number, En: number, Va: number, Wt: number, Fe: number}[]}
     */
    averageSampleDemand () {
      const vm = this
      if (vm.menuCasesFiltered.length === 0) {
        return {}
      }
      // ターゲットを特定
      const member = vm.menuCasesFiltered.map((item) => {
        return item.target
      })
      // ターゲットに応じた栄養要求量を算出
      const demandList = member.map((item) => {
        return getNutritionDemand(item, vm.dri)
      })

      // ターゲットの栄養要求量を合計する(noAverage = 1)
      return [
        getAverageNutritionDemand(demandList, 1)
      ]
    },
    /**
     * サンプル家族の栄養需要をコミュニティ全体に外挿するための係数
     * @returns {*[]}
     */
    averageRating () {
      return getRating(this.averageSupply, this.averageSampleDemand, 1)
    },
    /**
     *
     * @returns {{Pr: number, Fat: number, En: number, Carbohydrate: number, Va: number, Wt: number, Fe: number}}
     */
    currentCommunitySupply () {
      const communityDemand = getNutritionDemand(this.myCommunity.member, this.dri)
      // const myFactor = (communityDemand.En * this.averageRating[0].En / 10) / this.averageSupply[0].En
      // Wt（重量）だけは平均値でなく、100gを返す
      return {
        En: this.averageRating[0].En * communityDemand.En / 10,
        Pr: this.averageRating[0].Pr * communityDemand.Pr / 10,
        Va: this.averageRating[0].Va * communityDemand.Va / 10,
        Fe: this.averageRating[0].Fe * communityDemand.Fe / 10,
        Wt: 100,
        Carbohydrate: this.averageRating[0].Carbohydrate * communityDemand.Carbohydrate / 10,
        Fat: this.averageRating[0].Fat * communityDemand.Fat / 10
      }
    },
    /**
     * 平均値を含めたsummaryResult用の配列
     * @returns {{fct: (function(): any), menuCases: {note: string, menu: *}[], member: *[], dri: (function(): any)}|{}}
     */
    summaryAverage () {
      const vm = this
      if (vm.menuCasesFiltered.length === 0) {
        return {}
      }
      // 生産目標を計算
      const member = vm.menuCasesFiltered.map((item) => {
        return item.target
      })
      const menuCase = vm.menuCasesFiltered.map((item) => {
        return { menu: item.menu, note: item.note }
      })

      const communitySupply = { menu: [vm.currentCommunitySupply], note: 'average' }
      const communityDemand = vm.myCommunity.member

      const overallSupply = []
      overallSupply.push(communitySupply, ...menuCase)
      const overallDemand = []
      overallDemand.push(communityDemand, ...member)

      return {
        menuCases: overallSupply.map((item) => {
          return {
            note: item.note,
            menu: item.menu
          }
        }),
        member: overallDemand,
        fct: vm.fct,
        dri: vm.dri
      }
    },
    updatedMenu () {
      const vm = this
      if (!vm.myCommunity.feasibilityCases) {
        console.log('dataset is broken in feasibilityCases: null')
        return []
      }
      if (vm.myCommunity.feasibilityCases.length === 0) {
        console.log('dataset is broken in feasibilityCases: length is 0')
        return []
      }
      const res = JSON.parse(JSON.stringify(vm.averageSupply))
      const feasibilityCaseTemp = JSON.parse(JSON.stringify(vm.myCommunity.feasibilityCases.find(
        item => (item.index === vm.selectedCommodityId) && (item.month === vm.selectedMonth)
      )))
      // 追加品目が存在する場合にはこれを追加、存在しない場合はもともとのmenuを返す
      if (feasibilityCaseTemp && Object.keys(feasibilityCaseTemp.selectedCrop).length > 0) {
        feasibilityCaseTemp.selectedCrop.menuName = 'new'
        feasibilityCaseTemp.selectedCrop.Wt = feasibilityCaseTemp.prodTarget.Wt
        res.push(feasibilityCaseTemp.selectedCrop)
      }
      return res
    },
    summaryResult () {
      const vm = this
      return {
        menuCases: [
          {
            note: 'current average',
            menu: vm.averageSupply
          },
          {
            note: 'improved',
            menu: vm.updatedMenu
          }
        ],
        member: vm.myCommunity.member,
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
      vm.myCommunity.feasibilityCases.filter(item => item.month === vm.selectedMonth).forEach(function (val) {
        res.push(summarizeQA(vm.ansId, val.ansList, vm.qaList))
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
    stateCommunity () {
      const vm = this
      if (!vm.communityName) {
        return false
      }
      return (vm.communityName.length > 3)
    },
    statePriority () {
      const vm = this
      let res = false
      if (vm.myCommunity) {
        if (vm.myCommunity.menuCases) {
          if (vm.myCommunity.menuCases.length > 0) {
            if (vm.myCommunity.menuCases[0].menu.length > 0) {
              res = true
            }
          }
        }
      }
      return res
    },
    /**
     * feasibilityCheckが終了したかどうかを示す
     * @returns {boolean}
     */
    stateFeasibilityCheck () {
      let res = false
      if (this.myCommunity.feasibilityCases) {
        this.myCommunity.feasibilityCases.forEach((item) => {
          if (item.selectedCrop.Name) {
            res = true
          }
        })
      }
      return res
    },
    selectedNutrient: {
      get () {
        if (!this.myApp.communityCases || !Array.isArray(this.myApp.communityCases)) {
          return ''
        }
        return this.myCommunity.keyNutrient
      },
      set (val) {
        const vm = this
        const res = JSON.parse(JSON.stringify(vm.myCommunity))
        res.keyNutrient = val
        this.updateDietOrFeasibility(res, 2)
      }
    },
    selectedCommodityId: {
      get () {
        return this.myCommunity.keyCommodity
      },
      set (val) {
        const vm = this
        const res = JSON.parse(JSON.stringify(vm.myCommunity))
        res.keyCommodity = val
        vm.updateDietOrFeasibility(res, 3)
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
    myCommunity () {
      const vm = this
      const res = vm.myApp.communityCases.find(item => item.name === vm.myApp.currentCommunity)
      return res || {}
    },
    selectedCropList () {
      if (!this.myCommunity.feasibilityCases) {
        return []
      }
      return this.myCommunity.feasibilityCases.map((item) => {
        return item.selectedCrop ? item.selectedCrop.Name : ''
      })
    },
    selectedCropListFiltered () {
      const vm = this
      if (!vm.feasibilityCaseByMonth) {
        return []
      } else {
        return vm.feasibilityCaseByMonth.filter(item => item.text !== '--------------------')
      }
      /*
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
*/
    },
    currentTarget () {
      const temp = this.myApp.communityCases
      if (!temp) {
        return []
      }
      let res = []
      temp.forEach((item) => {
        if (item.name === this.communityName) {
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
      if (this.monthValue === -1) {
        return JSON.parse(JSON.stringify(this.myApp.dataSet.fct))
      }
      const myFilter = this.myApp.dataSet.cropCalendar.filter(item =>
        (item[this.monthValue] === '1') || (item[this.monthValue] === '2'))
      const filteredId = myFilter.map((item) => {
        return item.FCT_id
      })
      return this.myApp.dataSet.fct.filter(item => filteredId.includes(item.id))
    },
    stateCommunityName () {
      return this.newCommunityName.length > 4 && !this.communityList.includes(this.newCommunityName)
    },
    familySize () {
      return this.newTarget.reduce((accum, curr) => {
        accum += curr.count
        return accum
      }, 0)
    },
    communityList () {
      const temp = this.myApp.communityCases
      if (!temp) {
        return []
      }
      return temp.map((val) => {
        return val.name
      })
    }
  },
  created () {
    this.communityName = this.myApp.currentCommunity
  },
  methods: {
    /**
     * feasibilityCaseの更新
     * @param val
     */
    onFeasibilityCaseChange (val) {
      const vm = this
      const dat = JSON.parse(JSON.stringify(vm.myCommunity))
      dat.feasibilityCases = dat.feasibilityCases.map((item) => {
        if ((item.month === vm.myCommunity.currentMonth) && (item.index === vm.selectedFeasibilityCase)) {
          return val
        } else {
          return item
        }
      })
      let communityCaseTemp = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.communityCases))
      communityCaseTemp = communityCaseTemp.map((item) => {
        if (item.name === dat.name) {
          return dat
        } else {
          return item
        }
      })
      this.$store.dispatch('fire/updateCommunityCases', communityCaseTemp)
      this.$store.dispatch('fire/setHasDocumentChanged', true)
    },
    /**
     * cropの選択の変更をmyCommunityに組み込んでemitで通知
     * @param value
     * @param index
     */
    async onCropSelected (value, index) {
      const res = {}
      res.Name = value.Name || 0
      res.id = value.id || 0
      res.En = Number(value.En) || 0
      res.Pr = Number(value.Pr) || 0
      res.Va = Number(value.Va) || 0
      res.Fe = Number(value.Fe) || 0
      // 暫定的に100gにセット
      res.Wt = 100

      // 作業用のmyCommunityコピー作成
      const dat = JSON.parse(JSON.stringify(this.myCommunity))

      // selectedCropを更新
      dat.feasibilityCases[index - 1].selectedCrop[0] = res

      // 生産目標を計算
      const demand = getNutritionDemand(dat.member, this.dri)
      const supply = getNutritionSupply(dat.feasibilityCases[index - 1].selectedCrop)
      const Wt = getProductionTarget(demand, supply, dat.keyNutrient, 100)

      // prodTargetを更新
      dat.feasibilityCases[index - 1].prodTarget.share = 100
      dat.feasibilityCases[index - 1].prodTarget.Wt = Wt
      dat.feasibilityCases[index - 1].prodTarget.Wt365 = Wt * 365

      // selectedCrop[0]を更新
      dat.feasibilityCases[index - 1].selectedCrop[0].Wt = Wt

      // myCommunityを更新
      await this.updateDietOrFeasibility(dat, 4)
    },
    /**
     * fctダイアログのトリガー
     */
    showFctDialogue (index) {
      if (this.fctFilterByMonth.length === 0) {
        alert('there is no available crop for this month')
        return
      }
      this.addCropId = index
      this.showFct = !this.showFct
    },
    /**
     * cropの選択した値をもとにデータ更新
     * @param value
     * @returns {Promise<void>}
     */
    onChangeCrop (value) {
      const vm = this
      // 作業用のmyCommunityコピー作成
      const dat = vm.myCommunity.feasibilityCases.map((item) => {
        if ((item.month === value.month) && (item.index === value.index)) {
          item.selectedCrop = value.selectedCrop

          // 生産目標を計算
          const demand = getNutritionDemand(vm.myCommunity.member, this.dri)
          const supply = getNutritionSupply([value.selectedCrop])
          const Wt = getProductionTarget(demand, supply, vm.myCommunity.keyNutrient, 100)

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
      this.updateMyCommunity(dat)
    },
    updateMyCommunity (val) {
      let res = JSON.parse(JSON.stringify(this.myApp.communityCases))
      res = res.map((item) => {
        let res2 = item
        if (item.name === val.name) {
          res2 = val
        }
        return res2
      })
      this.$store.dispatch('fire/updateCommunityCases', res)
    },
    /**
     * dietCalkおよびfeasibilityCheckでの更新を反映させる
     * @param val
     * @param flag
     */
    async updateDietOrFeasibility (val, flag) {
      const vm = this
      let dat = JSON.parse(JSON.stringify(vm.myApp.communityCases))
      dat = dat.map((item) => {
        if (item.name === val.name) {
          if (flag === 1) {
            item.menuCases = val.menuCases
          } else if (flag === 2) {
            item.keyNutrient = val.keyNutrient
          } else if (flag === 3) {
            item.keyCommodity = val.keyCommodity
          } else if (flag === 4) {
            item.feasibilityCases = val.feasibilityCases
          } else {
            item.feasibilityCases = val.feasibilityCases
          }
        }
        return item
      })
      await this.$store.dispatch('fire/updateCommunityCases', dat)
    },
    updatePageMemo (val) {
      this.$store.dispatch('fire/updateCommunityCase', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    updateFamily (name, member) {
      this.$store.dispatch('fire/updateFamilyCase', { name, member })
    },
    updateNewCommunity (val) {
      this.newTarget = JSON.parse(JSON.stringify(val))
    },
    /**
     * コミュニティの新規追加
     * @param name
     * @param member
     * @returns {Promise<void>}
     */
    async addNewCommunity (name, member) {
      await this.$store.dispatch('fire/addNewCommunity', {
        name,
        member
      })

      this.communityName = name
      // 現在の家族名の更新
      await this.$store.dispatch('fire/updateCurrentCommunityName', name)

      // 変数のクリア
      this.newCommunityName = ''
      this.newTarget = []

      // 画面を新規追加から選択画面へ移す
      this.addNewCommunityFlag = false
    },
    /**
     * 家族の削除
     * @param val
     */
    async removeCommunity (val) {
      if (this.communityList.length === 1) {
        alert('you cannot delete last item')
        return
      }
      await this.$store.dispatch('fire/removeCommunity', val)
      const newVal = this.communityList[0]
      await this.$store.dispatch('fire/updateCurrentFamilyName', newVal)
    },
    async changeFamily (val) {
      await this.$store.dispatch('fire/updateCurrentFamilyName', val)
    }
  }
}
</script>
