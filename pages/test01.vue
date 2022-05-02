<template>
  <b-container>
    <b-card>
      {{testApp}}
      <div>validation:{{
          myValidator
        }}</div>
    </b-card>
  </b-container>
</template>

<script>
import dietCalkComp from "@/components/organisms/dietCalkComp";
import {validateMyApp} from "@/plugins/helper";

export default {
  components: {
    dietCalkComp,
  },
  data: function () {
    return {
      pageId: 2,
      sceneCount: 0,
      myCount: [],
      target: {},
      testApp:{
        user:{
          title:'',
          email:'',
          uid:'',
          country:'',
          displayName:'',
          organization:'',
          phoneNumber:'',
          subnational1:'',
          subnational2:'',
          subnational3:'',
        },
        dataSet:{
          dri:[],
          fct:[],
          driId:[],
          fctId:[]
        },
        feasibilityCases:[],
        menuCases:[],
        saveDate:'',
        sceneCount:'',
        scene:'',
      },
      myValidator: true
    }
  },
  created() {
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.myValidator = validateMyApp(this.testApp)
  },
  computed: {
    myApp:function(){
      return this.$store.state.fire.myApp
    }
  },
  methods: {
    changeTab() {
      console.log('tabChange:' + this.pageId)
    },
    updateMyApp(val) {
      this.$store.dispatch('fire/updateMyApp', val)
    },
    formatter(val) {
      return Number(val)
    }
  }
}
</script>
