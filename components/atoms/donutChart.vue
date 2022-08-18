<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  name: 'chart',
  data () {
    return {
      data: {
        labels: ['teens','twenties', 'thirties', 'forties', 'fifties', 'sixties'],
        datasets: [
          {
            label: 'Dataset',
            data: [20, 10, 30, 10, 60, 30],
            backgroundColor: ['blue', 'green', 'purple', 'yellow', 'pink', 'skyblue', 'gray']
          }
        ]
      },
      options: {
        responsive: false,
//        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.myData, this.options)
  }
}
</script>
