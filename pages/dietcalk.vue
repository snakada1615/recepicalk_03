<template>
  <b-container>
    <b-card no-body>
      <b-tabs card v-model="pageId" @change="changeTab">
        <b-tab
          v-for="item in myCount"
          :key="'Case-' + item"
          :title="String(item + 1)"
        >tab content {{ item + 1}}
        </b-tab>
      </b-tabs>
    </b-card>
    <diet-calk-comp
      :my-app="myApp"
      :page-id="pageId"
      @update:myApp="updateMyApp"
    />
  </b-container>
</template>

<script>
import dietCalkComp from "~/components/organisms/dietCalkComp";

export default {
  components: {
    dietCalkComp,
  },
  data: function () {
    return {
      myApp: {},
      pageId: 2,
      sceneCount: 0,
      myCount: [],
      str_prev:'',
      str_now:'',
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
  },
  methods: {
    changeTab(){
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
