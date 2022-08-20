<template>
  <b-container>
    <b-button @click="enlarge">here</b-button>
    {{myStyles}}
    <pie-chart
      ref="pie1"
      :chart-data="pfcStandard"
      :options="options"
      :styles="myStyles"
    />
  </b-container>
</template>

<script>
import pieChart from "../components/atoms/pieChart";

export default {
  components: {
    pieChart
  },
  data(){
    return{
      options: {
        maintainAspectRatio: false,
        responsive: true,
      },
      scale: 1,
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
      /**
       * PFCバランスの推奨値
       */
      pfcStandard: {
        labels: ['protein', 'fat', 'carbo.'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: ['green', 'yellow', 'red'],
            data: [35, 10, 55],
          }
        ]
      },
    }
  },
  methods: {
    enlarge(){
      this.scale += 0.1
    }
  },
  computed:{
    myStyles() {
      return {
        height: `${this.chartBaseHeight}px`,
        position: 'relative',
      }
    },
    chartBaseHeight(){
      return window.innerHeight * this.scale / 5
    },
    chartBaseWidth(){
      return window.innerHeight  * this.scale / 3
    },
  }
}
</script>
