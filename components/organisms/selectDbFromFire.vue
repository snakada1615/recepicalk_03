<template>
  <b-container>
    <b-input-group v-if="showDbFilter" prepend="select data type">
      <b-form-select
        v-model="myDbFilter"
        :options="filterList"
      ></b-form-select>
    </b-input-group>

    <b-input-group :class="topMargin1" v-if="showButtonGetList">
      <b-input-group-prepend>
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
            @click="getDocList(myCollectionName)"
          >get list
          </b-button>
        </b-overlay>
      </b-input-group-prepend>

      <b-form-select
        v-model="myDocName"
        :options="myListFiltered"
      ></b-form-select>

      <b-input-group-append>
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
            @click="loadMyDoc(myDocName)"
          >load
          </b-button>
        </b-overlay>

        <b-button
          v-if="showButtonSelect"
          variant="info"
          :disabled="!myDocName"
          @click="docSelected(myDocName)"
        >select dataset
        </b-button>
      </b-input-group-append>

    </b-input-group>

    <b-input-group :class="topMargin1" v-else>
      <b-input-group-prepend>
        <b-input-group-text>select</b-input-group-text>
      </b-input-group-prepend>

      <b-form-select
        v-model="myDocName"
        :options="myListFiltered"
      ></b-form-select>

      <b-input-group-append>
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
            @click="loadMyDoc(myDocName)"
          >load
          </b-button>
        </b-overlay>

        <b-button
          v-if="showButtonSelect"
          variant="info"
          :disabled="!myDocName"
          @click="docSelected(myDocName)"
        >select dataset
        </b-button>

        <div>
          <B-button v-b-toggle="componentName" size="sm" variant="light">
            <b-icon icon="caret-down-square"/>
          </B-button>
        </div>

      </b-input-group-append>

    </b-input-group>

    <b-input-group v-if="showDbKey" prepend="JSON key" class="mt-2">
      <b-form-input v-model="myDbKey"/>
    </b-input-group>

    <b-collapse :id="componentName" class="mt-2">
      <b-card class="mt-2">
        <json-viewer
          :value="doc2Json"
        />
      </b-card>
    </b-collapse>

  </b-container>
</template>

<script>
import {fireGetDoc, getFileList} from "../../plugins/firebasePlugin";
import JsonViewer from 'vue-json-viewer'

export default {
  name: "selectDbFromFire",
  components: {
    JsonViewer
  },
  props: {
    // required----------------------------------------
    /**
     * 選択するdocument名
     */
    docName: {
      type: String,
      required: true
    },

    /**
     * コンポーネントの名称（collapseを利用するため必要）
     */
    componentName:{
      type: String,
      required: true
    },
    // optional----------------------------------------
    /**
     * documentを絞り込むためのフィルタ
     */
    dbFilter: {
      type: String,
      default: ''
    },
    /**
     * doc一覧をオプションとして指定する場合
     */
    showButtonGetList: {
      type: Boolean,
      default: true
    },
    /**
     * dbFilterの選択用リストボックの表示フラグ
     */
    showDbFilter: {
      type: Boolean,
      default: false,
    },
    /**
     * JSONのkeyフィールド指定
     */
    dbKey: {
      type: String,
      default: ''
    },
    /**
     * dbKeyの表示用フラグ
     */
    showDbKey: {
      type: Boolean,
      default: false,
    },
    /**
     * documentリスト一覧
     */
    dbList: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * collection名を指定
     */
    collectionName: {
      type: String,
      default: 'dataset'
    },
    showButtonSelect:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      busy: false,
      busy2: false,
      myDoc: '',
      myList: [],
      filterList: ['fct', 'dri', 'cropCalendar'],
    }
  },
  computed: {
    topMargin1(){
      if (this.showDbFilter){
        return 'mt-3'
      } else {
        return 'mt-0'
      }

    },
    myDocName: {
      get() {
        return this.docName
      },
      set(val) {
        this.$emit('update:docName', val)
      }
    },
    myDbFilter: {
      get() {
        return this.dbFilter
      },
      set(val) {
        this.$emit('update:dbFilter', val)
      }
    },
    myDbKey: {
      get() {
        return this.dbKey
      },
      set(val) {
        this.$emit('update:dbKey', val)
      }
    },
    myCollectionName: {
      get() {
        return this.collectionName
      },
      set(val) {
        this.$emit('update:collectionName', val)
      }
    },
    myListFiltered() {
      if (this.myDbFilter.length > 0) {
        return this.myList.filter((item) => item.indexOf(this.myDbFilter) >= 0)
      } else {
        return JSON.parse(JSON.stringify(this.myList))
      }
    },
    /**
     * myDocをJsonに変換
     * @returns {{}}
     */
    doc2Json() {
      const res = {}
      if (this.myDoc.length !== 0) {
        this.myDoc.forEach((val) => {
          const myKey = val[this.myDbKey]
          if (myKey !== '') {
            res[myKey] = val
          }
        })
      }
      return res
    },
  },
  created() {
    this.myList = this.dbList
  },
  methods: {
    async getDocList(myCollection) {
      this.busy = true
      const queryResult = await getFileList(myCollection)
      this.busy = false
      this.myList.length = 0
      this.myList = queryResult
    },
    docSelected(docName) {
      this.$emit('selected', docName)
    },
    async loadMyDoc(docName) {
      this.busy2 = true
      const res = await fireGetDoc(this.myCollectionName, docName)
      this.busy2 = false
      this.myDoc = Object.values(res)
    },
  }
}
</script>
