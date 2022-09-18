<template>
  <b-container>
    <div>
      <b-card
        header="get fileList from firebase"
        header-bg-variant="success"
        header-text-variant="light"
        class="my-2"
      >
        <b-form-checkbox v-model="addNewCalendarFlag" switch @change="onChangeSwitch">
          add new calendar
        </b-form-checkbox>
        <b-input-group class="mt-3" v-if="!addNewCalendarFlag">
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
        <b-input-group v-else class="mt-3" prepend="cropCalendar_">
          <template #append>
            <b-button
              variant="gray-200"
              :disabled="!stateNewCalendarName"
              @click="onNameRegister(newCalendarName)"
            >initialize
            </b-button>
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
                :disabled="!stateNewCalendarName || (currentCalendar.length === 0)"
                @click="fireSaveCalendar"
              >add this calendar
              </b-button>
            </b-overlay>
          </template>
          <b-form-input
            v-model="newName"
            :state="stateNewCalendarName"
          ></b-form-input>
        </b-input-group>
        <b-input-group
          v-if="currentCalendar.length"
          class="mb-1 mt-3"
          prepend="filter"
        >
          <b-form-input
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Type to Search"
          ></b-form-input>
        </b-input-group>
        <b-table
          v-if="currentCalendar.length"
          striped
          sticky-header
          :items="currentCalendar"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
        >
          <!-- A custom formatted footer cell for field '1-12' -->
          <template #cell(1)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(2)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(3)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(4)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(5)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(6)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(7)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(8)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(9)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(10)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(11)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
          <template #cell(12)="data">
            <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="onCalendarClick(data)">
              <b-badge :variant="setBadgeColor(data.value)" class="px-0 py-0">
                <b-icon
                  v-if="data.value === '0'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '1'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
                <b-icon
                  v-if="data.value === '2'"
                  class="rounded"
                  icon="check"
                  variant="light"
                />
              </b-badge>
            </b-button>
          </template>
        </b-table>
      </b-card>
    </div>
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
    newCalendarName() {
      return 'cropCalendar_' + this.newName
    },
    myListFiltered() {
      return this.myList.filter((item) => item.indexOf('cropCalendar') >= 0)
    },
    stateNewCalendarName() {
      return this.newName.length > 4 && !this.myListFiltered.includes(this.newCalendarName)
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
    async onNameRegister(docName) {
      await this.$store.dispatch('fire/updateCropCalendarId', docName)
      this.currentCalendar = this.newCropCalendar()
    },
    setBadgeColor(val) {
      switch (val) {
        case '1':
          return 'info';
        case '2':
          return 'danger';
        default:
          return 'light';
      }
    },
    setIcon(val) {
      switch (val) {
        case '1':
          return 'info';
        case '2':
          return 'danger';
        default:
          return 'warning';
      }
    },
    /**
     * 特定行の×ボタンをクリックした場合に、インクリメント
     * @param data
     */
    onCalendarClick(data) {
      let res = Number(this.currentCalendar[data.index][data.field.key])
      res += 1
      if (res > 2) {
        res = 0
      }
      this.currentCalendar[data.index][data.field.key] = String(res)
      //console.log(this.currentCalendar[data.index][data.field.key])
    },
    /**
     * currentCalendarをJsonに変換
     * @returns {{}}
     */
    calendar2JSON(myCalendar) {
      if (myCalendar.length === 0) {
        return {}
      }
      let res = {}
      myCalendar.forEach((item) => {
        res[item.FCT_id] = item
      })
      return res
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
