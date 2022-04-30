<template>
  <b-container>
    <b-card no-body>
      <diet-calk-comp2
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
import dietCalkComp2 from "~/components/organisms/dietCalkComp2";

export default {
  components: {
    dietCalkComp2,
  },
  data: function () {
    return {
      myApp: {},
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
    this.myApp = JSON.parse(JSON.stringify(this.$store.state.fire.myApp))
    this.sceneCount = Number(this.$store.state.fire.myApp.sceneCount)
    this.myCount = Array.from(Array(this.sceneCount).keys())
    this.target = this.$store.getters['fire/nutritionDemandGetter']
    console.log('created------------------------')
    console.log(this.myApp)
    console.log(this.myApp.menuCases[2])
  },
  methods: {
    changeTab() {
      console.log('tabChange:' + this.pageId)
    },
    updateMyApp(val) {
      console.log('dietcalk:updateMyApp')
      console.log(val)
      this.$store.dispatch('fire/updateMyApp', val)
    },
    formatter(val) {
      return Number(val)
    }
  }
}
</script>
