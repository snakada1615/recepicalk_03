<template>
  <b-container>
    <b-navbar type="dark" variant="info" class="mb-2" :sticky=true>
      <b-navbar-brand to="/"><b-icon icon="BIconHouseFill"/><span class="small"> Nutrients App</span></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" :small=true >
        <b-nav-item-dropdown text="Menu" right>
          <b-dropdown-item to="/">top</b-dropdown-item>
          <b-dropdown-item to="/logintest">login</b-dropdown-item>
          <b-dropdown-item to="/test01">test01</b-dropdown-item>
          <b-dropdown-item to="/test02">test02</b-dropdown-item>
          <b-dropdown-item to="/test03">test03</b-dropdown-item>
          <b-dropdown-item to="/test04">test04</b-dropdown-item>
          <b-dropdown-item to="/dietcalk">dietCalk</b-dropdown-item>
          <b-dropdown-item to="/firetest/dbtest">firestore</b-dropdown-item>
          <b-dropdown-item to="/documents">documents</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item to="#" class="small">user: {{$store.state.fire.myApp.user.name}}</b-dropdown-item>
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
    fireSaveAppdata(){
      this.$store.dispatch('fire/fireSaveAppdata')
    },
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
