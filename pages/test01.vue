<template>
  <b-container>
    <donut-chart
      :my-data="myData"
      :styles="myStyles" />
    <b-button @click="enlarge">here</b-button>
  </b-container>
</template>

<script>
import donutChart from "../components/atoms/donutChart.vue"

export default {
  components: {
    donutChart
  },
  data(){
    return{
      height:500,
      myData: {
        labels: ['teens','twenties', 'thirties', 'forties', 'fifties', 'sixties'],
        datasets: [
          {
            label: 'Dataset',
            data: [10, 50, 8, 15, 24, 30],
            backgroundColor: ['blue', 'green', 'purple', 'yellow', 'pink', 'skyblue', 'gray']
          }
        ]
      },

    }
  },
  methods: {
    enlarge(){
      this.height += 10
    }
  },
  computed:{
    myStyles(){
      return{
        height: `${this.height}px`,
        position:'relative'
      }
    }
  }
}
</script>
