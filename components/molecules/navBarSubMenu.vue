<template>
  <b-container>
    <b-navbar type="dark" variant="info" class="mb-2" sticky>
      <b-navbar-brand to="/">
        <b-icon icon="BIconHouseFill"/>
        <span class="small"> Nutrients App</span></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" :small=true>
        <b-nav-item-dropdown text="Menu" right ref="rootMenu">
          <b-dropdown-item to="/">top</b-dropdown-item>

          <!-- メニューグループ1　導入 -->
          <b-dropdown size="sm" id="subMenu-0" text="Introduction" class="m-md-2" variant="outline-danger">
            <b-dropdown-item to="/whatsNfa">what's NFA</b-dropdown-item>
            <b-dropdown-item to="/login">login/register</b-dropdown-item>
            <b-dropdown-item to="/userinfo">user info</b-dropdown-item>
            <b-dropdown-item to="/foodGroupInfo">about FoodGroup</b-dropdown-item>
          </b-dropdown>

          <!-- メニューグループ2　食事評価 -->
          <b-dropdown size="sm" id="subMenu-1" text="Diet Assessment" class="m-md-2" variant="outline-danger">
            <b-dropdown-item
              to="/dietcalk"
              :disabled="!isLoggedIn"
            >dietCalk
            </b-dropdown-item>
            <b-dropdown-item to="/summaryDiet">diet Summary</b-dropdown-item>
          </b-dropdown>

          <!-- メニューグループ3　品目特定 -->
          <b-dropdown size="sm" id="subMenu-2" text="Identify Commodity" class="m-md-2" variant="outline-danger">
            <b-dropdown-item
              to="/feasibilityCheck"
              :disabled="!isLoggedIn"
            >crop feasibility
            </b-dropdown-item>
            <b-dropdown-item to="/summaryfeasibility">feasibility Summary</b-dropdown-item>
          </b-dropdown>

          <!-- メニューグループ4　その他 -->
          <b-dropdown size="sm" id="subMenu-3" text="Other function" class="m-md-2" variant="outline-danger">
            <b-dropdown-item to="/editFct">edit current FCT</b-dropdown-item>
            <b-dropdown-item to="/firetest/importFct">replace FCT</b-dropdown-item>
            <b-dropdown-item-button
              @click="resetData"
              :disabled="!isLoggedIn"
            >reset Data
            </b-dropdown-item-button>
          </b-dropdown>

        </b-nav-item-dropdown>
        <div></div>

        <!--  ここからuser情報の表示  -->
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item
            to="/"
            class="small"
            v-for="item in userInfo"
            :key="Object.values(item)[0]"
            v-if="Object.values(item)[0] !== ''"
          >
            <div class="d-flex justify-content-around">
              <div class="text-info">{{ Object.keys(item)[0] }}:</div>
              <div>{{ Object.values(item)[0] }}</div>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!--　saveボタンの表示　-->
      <b-button
        :disabled="!hasDocumentChanged"
        @click="fireSaveAppdata"
        pill
        :class="{'border-white':true, 'btn-primary': !hasDocumentChanged, 'btn-warning': hasDocumentChanged, 'mx-2':true}"
        size="sm"
        style="font-size: 13px"
      >save
      </b-button>

      <b-nav-text v-if="$nuxt.isOnline" class="text-light small">
        <b-icon icon="reception4"/>
      </b-nav-text>
      <div v-if="$nuxt.isOffline" class="text-light small">
        <b-icon icon="reception0"/>
      </div>
    </b-navbar>
  </b-container>
</template>
<script>

export default {
  methods: {
    /**
     * ページの遷移前にユーザーに確認し、
     * @param event
     * @returns {string}
     */
    beforeUnloadListener(event) {
      event.preventDefault();
      return event.returnValue = "Are you sure you want to exit before saving your data?";
    },
    /**
     * myAppをfireStoreに保存
     */
    fireSaveAppdata() {
      this.$store.dispatch('fire/fireSaveAppdata')
    },
    async resetData() {
      const user = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.user))
      await this.$store.dispatch('fire/fireResetAppdata', user).catch((err) => {
        throw err
      })
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
    hasDocumentChanged() {
      return this.$store.state.fire.hasDocumentChanged
    },
    /**
     * ログイン状態のフラグ
     * @returns {boolean}
     */
    isLoggedIn() {
      return this.$store.state.fire.isLoggedIn
    },
    userInfo() {
      return Object.entries(this.$store.state.fire.myApp.user).filter(([key]) => {
        return (
          ['displayName', 'country',
            'subnational1', 'subnational2',
            'subnational3',
            'organization', 'title'].indexOf(key) >= 0)
      }).map(([key, value]) => {
        let res = {}
        let myKey = key
        if (key === 'displayName') myKey = 'ID'
        res[myKey] = value
        return res
      })
    },
  },
  watch: {
    /**
     * データが更新された場合（hasDocumentChanged）のみ、beforeunloadを追加
     * @param {boolean} value
     */
    hasDocumentChanged(value) {
      if (value) {
        addEventListener("beforeunload", this.beforeUnloadListener, {capture: true});
      } else {
        removeEventListener("beforeunload", this.beforeUnloadListener, {capture: true});
      }
    },
    $route(){
      //ページ移動前にメニューを折りたたむ
      this.$refs.rootMenu.hide();
    }
  },
  data() {
    return {
      /**
       * ドロップダウンメニューの開閉動作を抑制するためのフラグ
       */
      isSubMenuVisible: false,
    }
  },
  mounted: function () {
    // メニューアイテムをクリックした際、idに'subMenu-'が含まれていればサブメニューを開く
    this.$root.$on('bv::dropdown::show', bvEvent => {
      if (bvEvent.componentId.indexOf('subMenu-') >= 0) {
        this.isSubMenuVisible = true;
      }
    })
    this.$root.$on('bv::dropdown::hide', bvEvent => {
      if (bvEvent.componentId.indexOf('subMenu-') >= 0) {
        this.isSubMenuVisible = false;
      }
      if (this.isSubMenuVisible) {
        bvEvent.preventDefault()
      }
    })
  }
}
</script>
