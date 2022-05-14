<template>
  <b-container>
    <b-navbar type="dark" variant="info" class="mb-2" sticky>
      <b-navbar-brand to="/"><b-icon icon="BIconHouseFill"/><span class="small"> Nutrients App</span></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" :small=true >
        <b-nav-item-dropdown text="Menu" right>
          <b-dropdown-item to="/">top</b-dropdown-item>
          <b-dropdown-item to="/login">login</b-dropdown-item>
          <b-dropdown-item to="/test01">test01</b-dropdown-item>
          <b-dropdown-item to="/test02">test02</b-dropdown-item>
          <b-dropdown-item to="/test03">test03</b-dropdown-item>
          <b-dropdown-item to="/test04">test04</b-dropdown-item>
          <b-dropdown-item to="/dietcalk">dietCalk</b-dropdown-item>
          <b-dropdown-item to="/feasibilityCheck">crop feasibility</b-dropdown-item>
          <b-dropdown-item to="/documents">documents</b-dropdown-item>
          <b-dropdown-item-button
            @click="resetData"
            :disabled="!isLoggedIn"
          >reset Data</b-dropdown-item-button>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item
            to="/"
            class="small"
            v-for="item in userInfo"
          >
            <div class="d-flex justify-content-around">
              <div class="text-info">{{ Object.keys(item)[0] }}:</div>
              <div>{{Object.values(item)[0]}}</div>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-button
        :disabled="!hasDocumentChanged"
        @click="fireSaveAppdata"
        pill
        :class="{'border-white':true, 'btn-primary': !hasDocumentChanged, 'btn-warning': hasDocumentChanged, 'mx-2':true}"
        size="sm"
        style="font-size: 13px"
      >save</b-button>
      <b-nav-text v-if="$nuxt.isOnline" class="text-light small"><b-icon icon="reception4"/></b-nav-text>
      <div v-if="$nuxt.isOffline" class="text-light small"><b-icon icon="reception0"/></div>
    </b-navbar>
  </b-container>
</template>
<script>

export default{
  methods:{
    /**
     * ページの遷移前にユーザーに確認し、
     * @param event
     * @returns {string}
     */
    beforeUnloadListener(event){
      event.preventDefault();
      return event.returnValue = "Are you sure you want to exit before saving your data?";
    },
    /**
     * myAppをfireStoreに保存
     */
    fireSaveAppdata(){
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    async resetData(){
      const user = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.user))
      await this.$store.dispatch('fire/fireResetAppdata', user).catch((err) => {throw err})
      this.$router.push('/')
    }
  },
  beforeDestroy() {
    // 破棄される前にイベントリスナーから削除
    removeEventListener("beforeunload", this.beforeUnloadListener, {capture: true});
  },
  computed: {
    /**
     * データ更新の有無($store.state.fire.hasDocumentChanged)を確認
     * @returns {boolean}
     */
    hasDocumentChanged(){
      return this.$store.state.fire.hasDocumentChanged
    },
    /**
     * ログイン状態のフラグ
     * @returns {boolean}
     */
    isLoggedIn(){
      return this.$store.state.fire.isLoggedIn
    },
    userInfo(){
      return Object.entries(this.$store.state.fire.myApp.user).filter(([key, value])=>{
        return (
          ['displayName', 'country',
          'subnational1', 'subnational2',
          'subnational3',
          'organization', 'title'].indexOf(key) >=0 )
      }).map(([key,value])=>{
        let res = {}
        let myKey = key
        if (key  === 'displayName') myKey = 'ID'
        res[myKey] = value
        console.log(res)
        return res
      })
    },
  },
  watch:{
    /**
     * データが更新された場合（hasDocumentChanged）のみ、beforeunloadを追加
     * @param {boolean} value
     */
    hasDocumentChanged(value){
      if (value) {
        addEventListener("beforeunload", this.beforeUnloadListener, {capture: true});
      } else {
        removeEventListener("beforeunload", this.beforeUnloadListener, {capture: true});
      }
    },
  }
}
</script>
