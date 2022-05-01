<template>
  <b-container>
    <b-card no-body>
      <diet-calk-comp
        :my-app="myApp"
        :page-id.sync="pageId"
        :target-nutrition="target"
        :max-page=10
        @update:myApp="updateMyApp"
      />
    </b-card>
  </b-container>
</template>

<script>
import dietCalkComp from "@/components/organisms/dietCalkComp";

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
    }
  },
  created() {
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.sceneCount = Number(this.$store.state.fire.myApp.sceneCount)
    this.myCount = Array.from(Array(this.sceneCount).keys())
    this.target = this.$store.getters['fire/nutritionDemandGetter']
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
