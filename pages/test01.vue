<template>
  <b-container>
    <b-card
      header="get fileList from firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <b-input-group prepend="select data type">
        <b-form-select
          v-model="dbFilter"
          :options="dbList"
        ></b-form-select>
      </b-input-group>
      <b-input-group class="mt-3">
        <template #prepend>
          <b-overlay
            :show="busy"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button
              :disabled="dbFilter.length === 0"
              variant="info"
              @click="getFileList('dataset')"
            >get list
            </b-button>
          </b-overlay>
        </template>
        <template #append>
          <b-overlay
            :show="busy2"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button
              variant="gray-200"
              @click="loadCalendar(currentCalendarName)"
            >load
            </b-button>
          </b-overlay>

          <!-- なぜか以下の行を入れないとoerlayが効かない  -->
          <a hidden>{{ busy2 }}</a>
          <b-overlay
            :show="busy3"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button
              variant="info"
              :disabled="!currentCalendarName"
              @click="fireSaveCalendar"
            >use this calendar
            </b-button>
          </b-overlay>
        </template>
        <b-form-select
          v-model="currentCalendarName"
          :options="myListFiltered"
        ></b-form-select>
      </b-input-group>
      <b-input-group prepend="JSON key" class="mt-2">
        <b-form-input v-model="dbKey"/>
      </b-input-group>
    </b-card>
    <b-card>
      <json-viewer
        :value="calendar2JSON"
      />
    </b-card>
  </b-container>
</template>
<script>
import JsonViewer from 'vue-json-viewer'
import {fireGetDoc, getFileList} from "../plugins/firebasePlugin";
import {makeToast} from "../plugins/helper";

export default {
  layout: 'defaultEth',
  components: {
    JsonViewer,
  },
  data() {
    return {
      dbFilter: '',
      dbList: ['cropCalendar', 'fct', 'dri', 'portionUnit'],
      dbKey: '',
      myList: [],
      /**
       * コレクション名(firebaseからの読み込み用)
       */
      collection3: '',
      collectionList: [
        {value: 'dataset', text: 'dataset'},
        {value: 'users', text: 'user data'},
      ],
      busy: false,
      busy2: false,
      busy3: false,
      addNewCalendarFlag: false,
      currentCalendarName: '',
      currentCalendar: [],
      /**
       * フィルターの内容
       */
      filter: null,
      /**
       * フィルター適用のスイッチ
       */
      filterOn: ['crop name'],
      /**
       * `calendar新規作成時の名前
       */
      newName: '',
      /**
       * テーブルに表示するfieldの定義
       */
      fields: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'crop name', sortable: true, thStyle: {width: "200px"}},
        {key: '1', sortable: false, thStyle: {width: "10px"}},
        {key: '2', sortable: false, thStyle: {width: "10px"}},
        {key: '3', sortable: false, thStyle: {width: "10px"}},
        {key: '4', sortable: false, thStyle: {width: "10px"}},
        {key: '5', sortable: false, thStyle: {width: "10px"}},
        {key: '6', sortable: false, thStyle: {width: "10px"}},
        {key: '7', sortable: false, thStyle: {width: "10px"}},
        {key: '8', sortable: false, thStyle: {width: "10px"}},
        {key: '9', sortable: false, thStyle: {width: "10px"}},
        {key: '10', sortable: false, thStyle: {width: "10px"}},
        {key: '11', sortable: false, thStyle: {width: "10px"}},
        {key: '12', sortable: false, thStyle: {width: "10px"}},
      ],
    }
  },
  computed: {
    myListFiltered() {
      return this.myList.filter((item) => item.indexOf(this.dbFilter) >= 0)
    },
    /**
     * currentCalendarをJsonに変換
     * @returns {{}}
     */
    calendar2JSON() {
      const res = {}
      if (this.currentCalendar.length !== 0) {
        this.currentCalendar.forEach((val) => {
          const myKey = val[this.dbKey]
          if (myKey !== '') {
            res[myKey] = val
          }
        })
      }
      return res
    },
  },
  methods: {
    async getFileList(myCollection) {
      this.busy = true
      const queryResult = await getFileList(myCollection)
      this.busy = false
      this.myList.length = 0
      this.myList = queryResult
    },
    async loadCalendar(docName) {
      this.busy2 = true
      const res = await fireGetDoc('dataset', docName)
      await this.$store.dispatch('fire/updateCropCalendarId', docName)
      this.busy2 = false
      this.currentCalendar = Object.values(res)
    },
    async fireSaveCalendar() {
      this.busy3 = true
      await this.$store.dispatch('fire/updateCropCalendar', this.currentCalendar)
      await this.$store.dispatch(
        'fire/fireSaveCropCalendar',
        {
          data: this.calendar2JSON(this.currentCalendar),
          docName: this.$store.state.fire.myApp.dataSet.cropCalendarId
        }
      )
      await this.$store.dispatch('fire/fireSaveAppdata')
      this.busy3 = false
      makeToast(
        this,
        'crop calendar is set to ' + this.$store.state.fire.myApp.dataSet.cropCalendarId,
        {variant: 'info'}
      )
    },
    onChangeSwitch() {
      this.currentCalendar.splice(0)
    },
    newCropCalendar() {
      return this.$store.state.fire.myApp.dataSet.fct.map((item, index) => {
        return {
          FCT_id: item.id,
          'crop name': item.Name,
          id: index,
          '1': '0',
          '2': '0',
          '3': '0',
          '4': '0',
          '5': '0',
          '6': '0',
          '7': '0',
          '8': '0',
          '9': '0',
          '10': '0',
          '11': '0',
          '12': '0'
        }
      })
    }
  },
}
</script>
