<template>
  <b-container>
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
      myApp:{},
      pageId:2
    }
  },
  created() {
    /**
     * 初回ロード時にstoreからmyAppを読み込む
     * @type {any}
     */
    this.myApp = JSON.parse(JSON.stringify(this.$store.state.fire.myApp))
  },
  methods: {
    updateMyApp(val){
      this.$store.dispatch('fire/updateMyApp', val)
    },
  }
}
</script>
