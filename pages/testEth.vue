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
              :max-page=10
              :disabled-option="[1,2,3,4,5,6,7,8,9]"
              @update:myFamily="updateMyFamily"
            />
          </b-card>
        </b-tab>

        <b-tab title="priority commodity" :disabled="!myFamily">
          <b-card no-body>
            <b-form-group
              label="Select key nutrient for your target family/HH"
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
            no-body
            class="my-2"
          >
            test
          </b-card>
        </b-tab>

        <b-tab title="improved option" :disabled="!myFamily">
          <b-card no-body>
            <diet-calk-comp-eth
              v-if="myFamily.name"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-portion="myApp.dataSet.portionUnit"
              :page-id.sync="pageId2"
              :max-page=10
              :disabled-option="[0]"
              @update:myFamily="updateMyFamily"
            />
          </b-card>
        </b-tab>
        <b-tab title="crop feasibility" :disabled="familyList.length === 0">
          <div class=" mb-2">
            identified nutrient gap:
            <span
              class="text-danger font-weight-bold"
            >
              {{selectedNutrient}}
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
              :max-page=10
              :current-family="familyName"
              :key-nutrient="selectedNutrient"
              @update:myFamily="updateMyFamily"
              @update:pageMemo="updatePageMemo"
            />
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>
<script>
import driSelectMulti from "../components/molecules/driSelectMulti";
import dietCalkCompEth from "../components/organisms/dietCalkCompEth";
import feasibilityCheckComponentEth from "../components/organisms/feasibilityCheckComponentEth";

export default {
  components: {
    driSelectMulti,
    dietCalkCompEth,
    feasibilityCheckComponentEth
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
      /**
       * workFlowの何ページ目まで読み込めるかのフラグ
       */
      workFlowStatus: 0,
      keyNutrients: [
        'Energy',
        'Protein',
        'Vitamin A',
        'Iron'
      ],
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
    updateMyFamily(val) {
      let res = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.familyCases))
      res = res.map((item) => {
        let res2 = item
        if (item.name === val.name) {
          res2 = val
        }
        return res2
      })
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
