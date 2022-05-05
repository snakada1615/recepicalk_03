<template>
  <b-container>
    <b-card no-body>
      <diet-calk-comp
        :my-app="myApp"
        :page-id.sync="pageId"
        :max-page=10
        @update:myApp="updateMyApp"
        @update:pageMemo="updatePageMemo"
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
      myCount: [],
    }
  },
  created() {
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.myCount = Array.from(Array(this.sceneCount).keys())
  },
  computed: {
    myApp:function(){
      return this.$store.state.fire.myApp
    },
    sceneCount:function(){
      return this.$store.state.fire.myApp.sceneCount
    },
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
    },
    updatePageMemo(val) {
      this.$store.dispatch('fire/updateMyApp', val)
      this.$store.dispatch('fire/fireSaveAppdata')
    },
  }
}
</script>
