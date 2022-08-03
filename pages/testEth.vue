<template>
  <b-container>
    <b-card :header="'current family: ' + familyName">
      <b-tabs card>
        <b-tab title="add family">
          <b-row class="justify-content-center">
            <b-col cols="8">
              <b-input-group
                size="sm"
                prepend="family name"
                class="mt-2 mb-0"
              >
                <b-form-input
                  v-model="newFamilyName"
                  :state="stateFamilyName"
                ></b-form-input>
                <template #append>
                  <b-button
                    :disabled="!stateFamilyName"
                    :class="{'btn-info':stateFamilyName}"
                    @click="addNewFamily(newFamilyName, newTarget)"
                  >add new family
                  </b-button>
                </template>
              </b-input-group>
              <div class="small text-muted mb-2">you have to give unique family name</div>
              <hr>
              <dri-select-multi
                :driItems="dri"
                :target="newTarget"
                :max="maxPopulation"
                @update:target="updateNewFamily"
                class="multi"
              ></dri-select-multi>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="select family" :disabled="familyList.length === 0">
          <b-row class="justify-content-center border-primary">
            <b-col cols="8">
              <b-input-group size="sm" class="mb-2">
                <template #prepend>
                  <b-input-group-text>
                    select family
                  </b-input-group-text>
                </template>
                <b-form-select
                  v-model="familyName"
                  :options="familyList"
                ></b-form-select>
                <template #append>
                  <b-button
                    @click="removeFamily(familyName)"
                  >
                    <b-icon icon="trash"/>
                  </b-button>
                </template>
              </b-input-group>
              <dri-select-multi
                :driItems="dri"
                :target="currentTarget"
                :max="maxPopulation"
                @update:target="updateFamily(familyName, $event)"
                class="multi"
              ></dri-select-multi>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="current diet" :disabled="!myFamily">
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
              @update:myFamily="updateMyFamily"
            />
          </b-card>
        </b-tab>

        <b-tab title="priority commodity" :disabled="!myFamily || (myFamily.menuCases[0].menu.length === 0)">
          <b-card
            style="min-width: 530px;"
            header-bg-variant="success"
            bg-variant="light"
            border-variant="success"
            class="mx-1 px-0 my-2">
            <template #header>
              <div>Select key nutrient for your target family/HH</div>
            </template>
            <b-form-group
              v-if="myFamily.name"
              class="ml-2"
            >
              <b-form-radio-group
                v-model="selectedNutrient"
                :options="keyNutrients"
                button-variant="outline-primary"
                buttons
                stacked
                class="ml-4"
              ></b-form-radio-group>
            </b-form-group>
          </b-card>
          <b-card
            style="min-width: 530px;"
            header-bg-variant="success"
            bg-variant="light"
            border-variant="success"
            class="mx-1 px-0 my-2">
            <template #header>
              <div>Selected Commodities</div>
            </template>

            <b-list-group>
              <b-list-group-item
                v-for="pageId in maxPage" :key="pageId" v-if="selectedCropList"
              >
                <div class="d-flex justify-content-between">
                  <span>Case {{ pageId }}: {{ selectedCropList[pageId - 1] }}</span>
                  <span>
                    <b-button
                      size="sm"
                      variant="info"
                      @click="showFctDialogue(pageId)"
                    >select</b-button>
                  </span>
                </div>

              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-tab>
        <b-tab title="crop feasibility" :disabled="familyList.length === 0 || !myFamily.keyNutrient">
          <div class=" mb-2">
            identified nutrient gap:
            <span
              class="text-danger font-weight-bold"
            >
              {{selectedNutrient}}
            </span>
          </div>
          <div class=" mb-2">
            selected commodity:
            <span
              class="text-danger font-weight-bold"
            >
              {{selectedCropList[pageId3]}}
            </span>
          </div>
          <b-row>
            <feasibility-check-component-eth
              v-if="myFamily.name && selectedNutrient"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-questions="myApp.dataSet.questions"
              :page-id.sync="pageId3"
              :max-page="maxPage"
              :current-family="familyName"
              :key-nutrient="selectedNutrient"
              @update:myFamily="updateMyFamily"
              @update:pageMemo="updatePageMemo"
            />
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>

    <fct-table-modal
      my-name="modalTest"
      my-modal-header="Food Composition Table"
      :show-modal.sync="showFct"
      :items="fct"
      @modalOk="onCropSelected($event, addCropId)"
    />
  </b-container>
</template>
<script>
import driSelectMulti from "../components/molecules/driSelectMulti";
import dietCalkCompEth from "../components/organisms/dietCalkCompEth";
import feasibilityCheckComponentEth from "../components/organisms/feasibilityCheckComponentEth";
import fctTableModal from "../components/organisms/FctTableModal";
import {getNutritionDemand, getNutritionSupply, getProductionTarget} from "../plugins/helper";

export default {
  components: {
    driSelectMulti,
    dietCalkCompEth,
    feasibilityCheckComponentEth,
    fctTableModal
  },
  data() {
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
       * workFlowの何ページ目まで読み込めるかのフラグ
       */
      workFlowStatus: 0,
      keyNutrients: [
        {text: 'Energy', value: 'En'},
        {text: 'Protein', value: 'Pr'},
        {text: 'Vitamin A', value: 'Va'},
        {text: 'Iron', value: 'Fe'}
      ],
      /**
       * fctTableModal表示用のフラグ
       */
      showFct: false,
    }
  },
  computed: {
    selectedNutrient:{
      get(){
        return this.myFamily.keyNutrient
      },
      set(val){
        const vm = this
        let res = JSON.parse(JSON.stringify(vm.myFamily))
        res.keyNutrient = val
        vm.updateMyFamily(res)
      }
    },
    myApp: function () {
      return this.$store.state.fire.myApp
    },
    myFamily() {
      let res = this.myApp.familyCases.find((item) => item.name === this.familyName)
      return res ? res : {}
    },
    selectedCropList(){
      return this.myFamily.feasibilityCases.map((item)=> {
        return item.selectedCrop[0] ? item.selectedCrop[0].Name: ''
      })
    },
    familyName: {
      get() {
        return this.$store.state.fire.myApp.currentFamily ? this.$store.state.fire.myApp.currentFamily : ''
      },
      set(newVal) {
        this.$store.dispatch('fire/updateCurrentFamilyName', newVal)
      }
    },
    currentTarget() {
      const temp = this.$store.state.fire.myApp.familyCases
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
    dri() {
      return JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.dri))
    },
    fct() {
      return JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.fct))
    },
    stateFamilyName() {
      const familySize = this.newTarget.reduce((accum, curr) => {
        accum += curr.count
        return accum
      }, 0)
      return this.newFamilyName.length > 4 && !this.familyList.includes(this.newFamilyName) &&
        familySize > 0
    },
    familyList() {
      const temp = this.$store.state.fire.myApp.familyCases
      if (!temp) {
        return []
      }
      return temp.map((val) => {
        return val.name
      })
    },
  },
  methods: {
    /**
     * cropの選択の変更をmyFamilyに組み込んでemitで通知
     * @param value
     * @param index
     */
    async onCropSelected(value, index) {
      let res = {}
      res.Name = value.Name || 0
      res.id = value.id || 0
      res.En = Number(value.En) || 0
      res.Pr = Number(value.Pr) || 0
      res.Va = Number(value.Va) || 0
      res.Fe = Number(value.Fe) || 0
      //暫定的に100gにセット
      res.Wt = 100

      //作業用のmyFamilyコピー作成
      let dat = JSON.parse(JSON.stringify(this.myFamily))

      //selectedCropを更新
      dat.feasibilityCases[index-1].selectedCrop[0] = res

      //生産目標を計算
      const demand = getNutritionDemand(dat.member, this.dri)
      const supply = getNutritionSupply(dat.feasibilityCases[index-1].selectedCrop)
      const Wt = getProductionTarget(demand, supply, dat.keyNutrient, 100)

      //prodTargetを更新
      dat.feasibilityCases[index-1].prodTarget.share = 100
      dat.feasibilityCases[index-1].prodTarget.Wt = Wt
      dat.feasibilityCases[index-1].prodTarget.Wt365 = Wt * 365

      //selectedCrop[0]を更新
      dat.feasibilityCases[index-1].selectedCrop[0].Wt = Wt

      //myFamilyを更新
      await this.updateMyFamily(dat)
    },
    /**
     * fctダイアログのトリガー
     */
    showFctDialogue(index) {
      this.addCropId = index
      this.showFct = !this.showFct
    },
    updateMyFamily(val) {
      console.log(val)
      let res = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.familyCases))
      res = res.map((item) => {
        let res2 = item
        if (item.name === val.name) {
          res2 = val
        }
        return res2
      })
      console.log(res)
      this.$store.dispatch('fire/updateMyFamily', res)
    },
    updatePageMemo(val) {
      this.$store.dispatch('fire/updateMyFamily', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    updateFamily(name, member) {
      this.$store.dispatch('fire/updateFamilyCase', {name: name, member: member})
    },
    updateNewFamily(val) {
      this.newTarget = JSON.parse(JSON.stringify(val))
    },
    addNewFamily(name, member) {
      this.$store.dispatch('fire/addNewFamily', {
        'name': name,
        'member': member,
      })
      //現在の家族名の更新
      this.$store.dispatch('fire/updateCurrentFamilyName', name)

      //変数のクリア
      this.newFamilyName = ''
      this.newTarget = []
    },
    removeFamily(val) {
      if (this.familyList.length === 1) {
        alert('you cannot delete last item')
        return
      }
      this.$store.dispatch('fire/removeFamily', val)
      const newVal = this.familyList[0]
      this.$store.dispatch('fire/updateCurrentFamilyName', newVal)
    },
  }
}
</script>
