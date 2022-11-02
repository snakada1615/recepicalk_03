<template>
  <b-container>
    <b-navbar type="dark" variant="info" class="mb-2" sticky>
      <b-navbar-brand to="/startPageEth">
        <b-icon icon="BIconHouseFill" />
        <span class="small"> Nutrients App</span>
      </b-navbar-brand>
      <img src="/img/eth_flag.png" alt="Eth">

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" :small="true">
        <div class="d-flex align-items-center">
          <b-icon
            v-if="$store.state.fire.myApp.isUpdateAvailable"
            icon="exclamation-circle"
            font-scale="2"
            class="text-white ml-1 pointer"
            animation="fade"
            @click="confirmUpdate"
          />
        </div>
        <b-nav-item-dropdown ref="rootMenu" text="Menu" class="text-white" right>
          <b-dropdown-item to="/startPageEth">
            top
          </b-dropdown-item>
          <b-dropdown-item to="/ethFamilyAssessment">
            family assessment
          </b-dropdown-item>
          <b-dropdown-item to="/ethCommunityAssessment">
            community assessment
          </b-dropdown-item>
          <b-dropdown-divider />

          <!-- メニューグループ1 導入 -->
          <b-dropdown id="subMenu-0" size="sm" text="other function" class="m-md-2" variant="light">
            <b-dropdown-item to="/whatsNfa">
              what's NFA
            </b-dropdown-item>
            <b-dropdown-item to="/login">
              login
            </b-dropdown-item>
            <b-dropdown-item to="/userReg">
              new user
            </b-dropdown-item>
            <b-dropdown-item to="/userEdit">
              edit user
            </b-dropdown-item>
            <b-dropdown-item to="/setCalendarEth">
              crop calendar
            </b-dropdown-item>
            <b-dropdown-item to="/setPortionUnit">
              set portion size
            </b-dropdown-item>
            <b-dropdown-item to="/foodGroupInfo">
              about FoodGroup
            </b-dropdown-item>
            <b-dropdown-item to="/editFct">
              edit FCT
            </b-dropdown-item>
            <b-dropdown-item to="/changeCurrentDataset">
              change dataset
            </b-dropdown-item>
            <b-dropdown-item @click="downloadMyApp">
              download user data
            </b-dropdown-item>
            <b-dropdown-item @click="resetData">
              initialize user data
            </b-dropdown-item>
          </b-dropdown>
        </b-nav-item-dropdown>
        <div />

        <!--  ここからuser情報の表示  -->
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-icon icon="person-circle" class="text-white" />
          </template>
          <b-dropdown-item
            v-for="item in uerInfoFiltered"
            :key="Object.values(item)[0]"
            to="/"
            class="small"
          >
            <div class="d-flex justify-content-around">
              <div class="text-info">
                {{ Object.keys(item)[0] }}:
              </div>
              <div>{{ Object.values(item)[0] }}</div>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!-- saveボタンの表示 -->
      <b-button
        :disabled="!hasDocumentChanged"
        pill
        :class="{'border-white':true, 'btn-primary': !hasDocumentChanged, 'btn-warning': hasDocumentChanged, 'mx-2':true}"
        size="sm"
        style="font-size: 13px"
        @click="fireSaveAppdata"
      >
        save
      </b-button>

      <b-nav-text v-if="$nuxt.isOnline" class="text-light small">
        <b-icon icon="reception4" />
      </b-nav-text>
      <div v-if="$nuxt.isOffline" class="text-light small">
        <b-icon icon="reception0" />
      </div>
    </b-navbar>
    <input-box
      modal-name="loadingBox"
      title="data downloading..."
      label=""
      :hide-footer="true"
      :show-spinner="true"
    />
  </b-container>
</template>
<script>

import { makeToast } from '@/plugins/helper'
import inputBox from '@/components/atoms/inputBox'

export default {
  components: {
    inputBox
  },
  data () {
    return {
      /**
       * ドロップダウンメニューの開閉動作を抑制するためのフラグ
       */
      isSubMenuVisible: false,
      showOverLay: false
    }
  },
  computed: {
    /**
     * データ更新の有無($store.state.fire.hasDocumentChanged)を確認
     * @returns {boolean}
     */
    hasDocumentChanged () {
      return this.$store.state.fire.hasDocumentChanged
    },
    /**
     * ログイン状態のフラグ
     * @returns {boolean}
     */
    isLoggedIn () {
      return this.$store.state.fire.isLoggedIn
    },
    userInfo () {
      return Object.entries(this.$store.state.fire.myApp.user).filter(([key]) => {
        return (
          ['displayName', 'country',
            'subnational1', 'subnational2',
            'subnational3', 'organization', 'title'].includes(key))
      }).map(([key, value]) => {
        const res = {}
        let myKey = key
        if (key === 'displayName') { myKey = 'ID' }
        res[myKey] = value
        return res
      })
    },
    uerInfoFiltered: {
      get () {
        return this.userInfo.filter(item => Object.values(item)[0] !== '')
      }
    }
  },
  watch: {
    /**
     * データが更新された場合（hasDocumentChanged）のみ、beforeunloadを追加
     * @param {boolean} value
     */
    hasDocumentChanged (value) {
      if (value) {
        addEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
      } else {
        removeEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
      }
    },
    $route () {
      // ページ移動前にメニューを折りたたむ
      this.$refs.rootMenu.hide()
    }
  },
  beforeDestroy () {
    // 破棄される前にイベントリスナーから削除
    removeEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
  },
  mounted: function () {
    // メニューアイテムをクリックした際、idに'subMenu-'が含まれていればサブメニューを開く
    this.$root.$on('bv::dropdown::show', (bvEvent) => {
      if (bvEvent.componentId.includes('subMenu-')) {
        this.isSubMenuVisible = true
      }
    })
    this.$root.$on('bv::dropdown::hide', (bvEvent) => {
      if (bvEvent.componentId.includes('subMenu-')) {
        this.isSubMenuVisible = false
      }
      if (this.isSubMenuVisible) {
        bvEvent.preventDefault()
      }
    })
  },
  methods: {
    confirmUpdate () {
      const msg = 'You have update version of the App. Would you like to download now?'
      const result = confirm(msg)
      if (result) {
        this.$store.dispatch('fire/checkUpdate', true)
      }
    },
    /**
     * ページの遷移前にユーザーに確認し、
     * @param event
     * @returns {string}
     */
    beforeUnloadListener (event) {
      event.preventDefault()
      const msg = 'Are you sure you want to exit before saving your data?'
      event.returnValue = msg
      return msg
    },
    /**
     * myAppをfireStoreに保存
     */
    async fireSaveAppdata () {
      await this.$store.dispatch('fire/fireSaveAppdata')
      makeToast(this, 'data saved!')
    },
    async resetData () {
      const user = JSON.parse(JSON.stringify(this.$store.state.fire.myApp.user))
      await this.$store.dispatch('fire/fireResetAppdata', user).catch((err) => {
        throw err
      })
      this.$router.push('/')
    },
    async downloadMyApp () {
      const res = window.confirm('You need to have internet connection and it may take a little time. Do you proceed?')
      if (res) {
        this.$bvModal.show('loadingBox')
        const res2 = await this.$store.dispatch('fire/loadMyStoreFromServer',
          this.$store.state.fire.myApp.user.uid).catch(() => {
          alert('internet connection may not be strong enough, please try again later')
        })
        if (res2) {
          // 更新日をアップデートする: , updateInfo, originalInfo, date
          // await this.$store.dispatch('updateDateOfLatestUpdate', Date.now())
          console.log('downloadMyApp success')
          makeToast(this, 'data successfully downloaded')
        } else {
          console.error('downloadMyApp fail')
          alert('data cannot be found, please start from user registration')
        }
        this.$bvModal.hide('loadingBox')
      }
    }
  }
}
</script>
