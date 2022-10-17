<template>
  <b-container>
    nutrient: {{ selectedNutrient }}
    month: {{ selectedMonth }}
    <priority-commodity
      :crop-list="cropList"
      :crop-calendar="cropCalendar"
      :fct="fct"
      :selected-nutrient.sync="selectedNutrient"
      :selected-month.sync="selectedMonth"
    />
  </b-container>
</template>
<script>
import priorityCommodity from '@/components/organisms/priorityCommodity'

export default {
  components: {
    priorityCommodity
  },
  data () {
    return {
      cropList: [],
      selectedNutrient: '',
      selectedMonth: 4
    }
  },
  computed: {
    fct () {
      return JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.fct))
    },
    cropCalendar () {
      return JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.cropCalendar))
    }
  },
  created () {
    const arr = []
    for (let mon = 1; mon < 13; mon++) {
      for (let i = 0; i < 10; i++) {
        const selectedCrop = []
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
  }
}
</script>
