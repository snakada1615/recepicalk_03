<template>
  <b-container>
    <b-row>
      <b-col>
        <div class=" mb-2 ml-3">
          identified nutrient gap:
          <span class="text-danger font-weight-bold">
            {{ myFamily.keyNutrient }}
          </span>
        </div>
        <div class=" mb-2 ml-3">
          selected month:
          <span class="text-danger font-weight-bold">
            {{ myFamily.currentMonth }}
          </span>
        </div>
      </b-col>
    </b-row>
    <!--   ページ情報とページの切り替え   -->
    <b-card class="px-5" border-variant="light">
      <b-row class="mt-2">
        <b-col class="mx-0 mb-0 py-2 bg-dark rounded text-light font-weight-bold">
          Feasibility assessment result
          <b-form-select v-model="selectedFiesibilityCase" :options="feasibilityCaseByMonth" />
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

    <feasibility-check-minimal-eth
      :feasibility-case.sync="feasibilityCase"
      :nutrient="nutrient"
      :target-group="member"
      current-family="baka"
      :my-questions="question"
      :my-dri="dri"
      :my-fct="fct"
      :no-header="true"
    />
  </b-container>
</template>
<script>
import feasibilityCheckMinimalEth from '@/components/organisms/feasibilityCheckMinimalEth'

export default {
  components: {
    feasibilityCheckMinimalEth
  },
  data () {
    return {
      cropList: [],
      selectedNutrient: '',
      selectedFiesibilityCase: 0
    }
  },
  computed: {
    /**
     * noteの記入状態
     * @returns {boolean}
     */
    stateMemoInput () {
      return (this.feasibilityPageMemo.length > 3)
    },
    myFamily () {
      const vm = this
      const app = vm.$store.state.fire.myApp
      const res = app.familyCases.find(item => item.name === app.currentFamily)
      return res || []
    },
    feasibilityCaseByMonth: {
      get () {
        const vm = this
        return vm.myFamily.feasibilityCases.filter(item => item.month === vm.myFamily.currentMonth).map((item2) => {
          return {
            value: item2.index,
            text: item2.selectedCrop.Name || '--------------------',
            disabled: !Object.keys(item2.selectedCrop).length
          }
        })
      }
    },
    feasibilityCase: {
      get () {
        const vm = this
        return vm.myFamily.feasibilityCases.find(
          item => (item.month === vm.myFamily.currentMonth) && (item.index === vm.selectedFiesibilityCase)
        )
      },
      set (val) {
        this.onFeasibilityCaseChange(val)
      }
    },
    feasibilityPageMemo: {
      get () {
        return this.feasibilityCase.note
      },
      set (val) {
        this.updatefeasibilityPageMemo(val)
      }
    },
    myDataSet: {
      get () {
        return this.$store.state.fire.myApp.dataSet
      }
    },
    fct () {
      return JSON.parse(JSON.stringify(this.myDataSet.fct))
    },
    dri () {
      return JSON.parse(JSON.stringify(this.myDataSet.dri))
    },
    nutrient () {
      return this.myFamily.keyNutrient || ''
    },
    question () {
      return JSON.parse(JSON.stringify(this.myDataSet.questions))
    },
    cropCalendar () {
      return JSON.parse(JSON.stringify(this.myDataSet.cropCalendar))
    },
    member: {
      get () {
        return this.myFamily.member
      }
    }
  },
  created () {
    const arr = []
    for (let mon = 1; mon < 13; mon++) {
      for (let i = 0; i < 10; i++) {
        const selectedCrop = {}
        const month = mon
        const note = ''
        const index = i
        const ansList = [-99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99, -99]
        const prodTarget = { share: 100, Wt: 0, Wt365: 0 }
        arr.push({ selectedCrop, note, ansList, prodTarget, month, index })
      }
    }
    this.cropList = arr.map((item) => {
      return {
        month: item.month,
        index: item.index,
        selectedCrop: item.selectedCrop
      }
    })
  },
  methods: {
    onFeasibilityCaseChange (val) {
      const vm = this
      const dat = JSON.parse(JSON.stringify(this.myFamily))
      dat.feasibilityCases = dat.feasibilityCases.map((item) => {
        if ((item.month === vm.myFamily.currentMonth) && (item.index === vm.selectedFiesibilityCase)) {
          return val
        } else {
          return item
        }
      })
      let familyCaseTemp = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.familyCases))
      familyCaseTemp = familyCaseTemp.map((item) => {
        if (item.name === dat.name) {
          return dat
        } else {
          return item
        }
      })
      this.$store.dispatch('fire/updateFamilyCases', familyCaseTemp)
      this.$store.dispatch('fire/setHasDocumentChanged', true)
    },
    /**
     * ページメモの更新：
     * @param newVal
     */
    updatefeasibilityPageMemo (newVal) {
      // 作業用のmyFamilyコピー作成
      const dat = JSON.parse(JSON.stringify(this.feasibilityCase))
      // 更新されたmenuを入れ替える
      dat.note = newVal
      // 更新されたmyFamilyをemit
      this.onFeasibilityCaseChange(dat)
    }
  }
}
</script>
