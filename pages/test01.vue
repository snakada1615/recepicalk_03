<template>
  <b-container>
    <feasibility-check-minimal-eth
      :feasibility-case.sync="feasibilityCase"
      :nutrient="nutrient"
      :target-group="member"
      current-family="baka"
      :my-questions="question"
      :my-dri="dri"
      :my-fct="fct"
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
      selectedMonth: 4
    }
  },
  computed: {
    myFamily () {
      const vm = this
      const app = vm.$store.state.fire.myApp
      const res = app.familyCases.find(item => item.name === app.currentFamily)
      return res || []
    },
    feasibilityCase: {
      get () {
        const vm = this
        return vm.myFamily.feasibilityCases.find(item => (item.month === vm.myFamily.currentMonth) && (item.index === 3))
      },
      set (val) {
        this.onFeasibilityCaseChange(val)
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
      const dat = JSON.parse(JSON.stringify(this.myFamily))
      dat.feasibilityCases = dat.feasibilityCases.map((item) => {
        if ((item.month === 2) && (item.index === 3)) {
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
    }
  }
}
</script>
