<template>
  <b-container>
    <h4 class="text-primary">
      1. Check area to apply
    </h4>
    <b-card
      header="area to apply datasets below"
      header-bg-variant="warning-6"
      header-text-variant="light"
      bg-variant="gray-200"
      class="my-2"
    >
      <b-row class="my-1">
        <b-col cols="3">
          country
        </b-col>
        <b-col cols="9">
          <country-names :key1.sync="userScope.country" />
        </b-col>
        <region-select
          v-if="userScope.country === 'Ethiopia'"
          :key3.sync="userScope.subnational3"
          :key2.sync="userScope.subnational2"
          :key1.sync="userScope.subnational1"
        />
      </b-row>
      <b-row align-v="center">
        <b-col>
          <div class="font-weight-light text-danger">
            <ul>
              <li>
                <p class="my-0">
                  please select area of users to change dataset.
                </p>
              </li>
              <li>
                <p class="my-0">
                  If you do not set area, only your app will be affected
                </p>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-card>

    <hr>
    <h4 class="text-primary">
      2. Select datasets to change
    </h4>
    <div v-for="(item, index) in myDataSet" :key="index">
      <b-card
        :header="item.text"
        header-bg-variant="success"
        header-text-variant="light"
        bg-variant="gray-100"
        class="my-2"
      >
        <div>
          current dataset: <span class="text-danger font-weight-bold">{{ originalDocName[index] }}</span>
        </div>
        <div class="mb-2">
          replace to:
          <span v-if="item.docName !== originalDocName[index]" class="text-primary font-weight-bold">
            {{ item.docName }}
          </span>
        </div>
        <select-db-from-fire
          :component-name="'collapse-' + index"
          :doc-name.sync="item.docName"
          :db-key="item.key"
          :db-filter="item.filter"
          :db-list="docListOriginal"
          :show-button-get-list="false"
          :show-button-select="false"
        />
      </b-card>
    </div>
    <hr>
    <h4 class="text-primary">
      3. Save your selection
    </h4>
    <b-button variant="primary" @click="setMyDoc">
      save all
    </b-button>
  </b-container>
</template>
<script>
import selectDbFromFire from '../components/organisms/selectDbFromFire'
import countryNames from '../components/atoms/countryNames'
import regionSelect from '../components/atoms/regionSelect'
import { getFileList } from '~/plugins/firebasePlugin'
import { array2JSON, isObjectDeepEqual } from '~/plugins/helper'

export default {
  components: {
    selectDbFromFire,
    countryNames,
    regionSelect
  },
  layout: 'default',
  // Use a function to dynamically set the layout.
  // layout () {
  //   // The context parameter allows you to access the store and other useful properties.
  //   // Assuming you have the user status stored in Vuex state:
  //   let layoutName = 'defaultEth' // Default layout
  //
  //   // Determine layout based on user status.
  //   if (this.userScope.country !== 'Ethiopia') {
  //     // Set layout for logged-in users.
  //     layoutName = 'default'
  //   }
  //   return layoutName // Return the layout name based on the condition.
  // },
  async asyncData () {
    const queryResult = await getFileList('dataset')
    return {
      docListOriginal: queryResult
    }
  },
  data () {
    return {
      originalForcedUpdateInfo: [],
      originalDocName: [],
      myDataSet: [
        {
          key: 'FCT_id',
          filter: 'fct_',
          docName: '',
          command1: 'fire/updateFctId',
          command2: 'fire/fetchFctFromFire',
          text: 'food composition table'
        },
        {
          key: 'id',
          filter: 'dri_',
          docName: '',
          command1: 'fire/updateDriId',
          command2: 'fire/fetchDriFromFire',
          text: 'nutrition requirement'
        },
        {
          key: 'id',
          filter: 'portion_',
          docName: '',
          command1: 'fire/updatePortionUnitId',
          command2: 'fire/fetchPortionUnitFromFire',
          text: 'food weight measurement unit'
        },
        {
          key: 'id',
          filter: 'question_',
          docName: '',
          command1: 'fire/updateQuestionsId',
          command2: 'fire/fetchQuestionsFromFire',
          text: 'question for feasibility assessment'
        },
        {
          key: 'FCT_id',
          filter: 'cropCalendar',
          docName: '',
          command1: 'fire/updateCropCalendarId',
          command2: 'fire/fetchCropCalendarFromFire',
          text: 'crop calendar'
        }
      ],
      /**
       * userを絞り込むためのデータ
       */
      userScope: {
        country: '',
        subnational1: '',
        subnational2: '',
        subnational3: ''
      },
      /**
       * modal表示フラグ
       */
      showModal: false,
      /**
       * 更新するdocumentのID
       */
      docIndex: 0,
      myForcedUpdateInfo: {
        searchReg: {
          country: '',
          subnational1: '',
          subnational2: '',
          subnational3: ''
        },
        setData: {
          fctId: '',
          driId: '',
          portionUnitId: '',
          questionsId: '',
          cropCalendarId: ''
        }
      }
    }
  },
  async created () {
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.fctId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.driId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.portionUnitId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.questionsId)
    this.originalDocName.push(this.$store.state.fire.myApp.dataSet.cropCalendarId)
    this.originalForcedUpdateInfo = await this.$store.dispatch('fire/fetchForcedUpdateInfoFromFire').catch((err) => {
      console.log(err)
      return []
    })
  },
  methods: {
    async setMyDoc () {
      const vm = this
      // 更新されたdocNameをstoreに記録 → このdocNameをもとにfireBaseからfetchしてデータ → storeへ
      await Promise.all(vm.myDataSet.map(async (item) => {
        if (item.docName) {
          await vm.$store.dispatch(item.command1, item.docName)
          await vm.$store.dispatch(item.command2)
        }
      })
      )

      // setDataの更新
      vm.myForcedUpdateInfo.setData.fctId = vm.myDataSet[0].docName
      vm.myForcedUpdateInfo.setData.driId = vm.myDataSet[1].docName
      vm.myForcedUpdateInfo.setData.portionUnitId = vm.myDataSet[2].docName
      vm.myForcedUpdateInfo.setData.questionsId = vm.myDataSet[3].docName
      vm.myForcedUpdateInfo.setData.cropCalendarId = vm.myDataSet[4].docName

      // searchRegの更新
      vm.myForcedUpdateInfo.searchReg.country = vm.userScope.country
      vm.myForcedUpdateInfo.searchReg.subnational1 = vm.userScope.subnational1
      vm.myForcedUpdateInfo.searchReg.subnational2 = vm.userScope.subnational2
      vm.myForcedUpdateInfo.searchReg.subnational3 = vm.userScope.subnational3

      // 重複したscope設定（myForcedUpdateInfo.searchReg）を回避するため、同一のsearchRegの場合は上書きする
      let myFlag = true
      if (!vm.originalForcedUpdateInfo) {
        alert('no modification have been made')
        return
      }
      vm.originalForcedUpdateInfo = vm.originalForcedUpdateInfo.map((item) => {
        if (isObjectDeepEqual(item.searchReg, vm.myForcedUpdateInfo.searchReg)) {
          myFlag = false
          // 更新日の情報も追加して情報を更新
          return {
            date: Date.now(),
            searchReg: vm.myForcedUpdateInfo.searchReg,
            setData: vm.myForcedUpdateInfo.setData
          }
        } else {
          return item
        }
      })
      if (myFlag) {
        vm.originalForcedUpdateInfo.push(vm.myForcedUpdateInfo)
      }

      await vm.$store.dispatch('fire/fireSaveForceUpdateInfo', array2JSON(vm.originalForcedUpdateInfo))
      await vm.$store.dispatch('fire/fireSaveAppdata')

      console.log('setMyDoc: data have been successfully updated')
      alert('data have been successfully updated')
    }
  }
}
</script>
