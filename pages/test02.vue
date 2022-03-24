<template>
  <b-container bg-variant="light" border-variant="primary">
    <nutrition-bar
      cropName="Iron"
      :iconNum=3
      :max="10"
      :nutritionTarget="test"
      :rating="rate"
      :showDri="ifShow"
      :show-reset="ifReset"
    ></nutrition-bar>
    <b-form-input vtrue-model.number="test" type="number" placeholder="nutritionTarget"></b-form-input>
    <p>rating:{{rate}}</p>
  </b-container>
</template>
<script>
  import nutritionBar from "../components/organisms/nutritionBar";
  import {setDigit} from "@/plugins/helper"

  export default {
    components:{
      nutritionBar
    },
    data(){
      return{
        test:90,
        ifShow: true,
        ifReset: true
      }
    },
    computed: {
      rate:function(){
        return (this.test/100)*10
      }
    }
  }
</script>
