<template>
  <b-container>
    <div>test</div>
    <summary-diet-eth
      :my-app="myApp2"
    />
  </b-container>
</template>

<script>
import summaryDietEth from "../components/organisms/summaryDietEth";

export default{
  components: {
    summaryDietEth
  },
  computed: {
    myApp(){
      return this.$store.state.fire.myApp
    },
    myApp2(){
      return {
        menuCases: [
          this.$store.state.fire.myApp.menuCases[0],
          this.$store.state.fire.myApp.menuCases[1],
        ],
        fct: this.$store.state.fire.myApp.dataSet.fct,
        dri: this.$store.state.fire.myApp.dataSet.dri,
      }
    }
  },
}
</script>
