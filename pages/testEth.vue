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
            <diet-calk-comp-eth2 v-if="myFamily.name"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-portion="myApp.dataSet.portionUnit"
              :page-id=0
              :max-page=10
              :disabled-option="[1,2,3,4,5,6,7,8,9]"
              @update:myFamily="updateMyApp"
              @update:pageMemo="updatePageMemo"
            />
          </b-card>
        </b-tab>
        <b-tab title="improved option" :disabled="!myFamily">
          <b-card no-body>
            <diet-calk-comp-eth2 v-if="myFamily.name"
              :my-family="myFamily"
              :my-dri="myApp.dataSet.dri"
              :my-fct="myApp.dataSet.fct"
              :my-portion="myApp.dataSet.portionUnit"
              :page-id.sync="pageId"
              :max-page=10
              :disabled-option="[0]"
              @update:myFamily="updateMyApp"
              @update:pageMemo="updatePageMemo"
            />
          </b-card>
        </b-tab>
        <b-tab title="crop feasibility" :disabled="familyList.length === 0">
          <b-row>
            <!--
                        <feasibility-check-component-eth
                          :my-app="$store.state.fire.myApp"
                          :page-id.sync="pageId"
                          :max-page=10
                          :current-family = "familyName"
                          @update:myApp="updateMyApp"
                          @update:pageMemo="updatePageMemo"
                        />
            -->
          </b-row>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>
<script>
import driSelectMulti from "../components/molecules/driSelectMulti";
import dietCalkCompEth2 from "../components/organisms/dietCalkCompEth2";
import feasibilityCheckComponentEth from "../components/organisms/feasibilityCheckComponentEth";

export default {
  components: {
    driSelectMulti,
    dietCalkCompEth2,
    feasibilityCheckComponentEth
  },
  data() {
    return {
      showDriSelect: false,
      isTargetSingle: false,
      maxPopulation: 10000,
      newTarget: [],
      newFamilyName: '',
      pageId: 0,
      /**
       * workFlowの何ページ目まで読み込めるかのフラグ
       */
      workFlowStatus: 0,
    }
  },
  computed: {
    myApp: function () {
      return this.$store.state.fire.myApp
    },
    myFamily(){
      let res = this.myApp.familyCases.find((item)=> item.name === this.familyName)
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
    updateMyApp(val) {
      this.$store.dispatch('fire/updateMyApp', val)
    },
    updatePageMemo(val) {
      this.$store.dispatch('fire/updateMyApp', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    updateFamily(name, member) {
      this.$store.dispatch('fire/updateFamilyCase', {name: name, member: member})
    },
    updateNewFamily(val) {
      this.newTarget = JSON.parse(JSON.stringify(val))
    },
    addNewFamily(name, member) {
      console.log(name)
      this.$store.dispatch('fire/addNewFamily', {
        'name': name,
        'member': member,
      })
      //現在の家族名の更新
      this.$store.dispatch('fire/updateCurrentFamilyName', name)
      console.log(this.$store.state.fire.myApp)

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
