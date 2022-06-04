<template>
  <b-container>
    <!--  csvを読み込んでfireStoreに登録  -->
    <b-card
      header="Load data from CSV and import to firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <csv-import :show-data="false" @getCsv="dataCsv=$event" class="my-1"></csv-import>
      <div class="d-flex flex-row align-items-center">
        <div>collection</div>
        <b-select v-model="collection1" :options="collectionList" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div>document</div>
        <b-input v-model="dbName1" placeholder="Enter doc name" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div>index_Col</div>
        <b-input v-model="keyCol" placeholder="Enter key column" class="my-1 mx-1"/>
      </div>
      <b-button
        @click="insertData(collection1, dbName1, dataJson)"
        class="my-1"
        :disabled="!importOk"
      >import to firebase
      </b-button>
    </b-card>
    <b-card v-if="dataJson" bg-variant="light">
      <json-viewer
        :value="dataJson"
      />
      <div>{{ 'データはPortionUnitに適合して' + (portionValidate ? 'います' : 'いません') }}</div>
      <div v-if="!portionValidate">足りない要素は、コンソールを確認してください</div>
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/molecules/csvImport";
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, setDoc, collection, getDocs} from "firebase/firestore";
import JsonViewer from 'vue-json-viewer'
import {validatePortionUnit} from "@/plugins/helper";

export default {
  components: {
    csvImport,
    JsonViewer,
  },
  data() {
    return {
      /**
       * アプリで利用するデータベースのcollection一覧（form-selectで利用）
       */
      collectionList: [
        {value: 'dataset', text: 'dataset'},
        {value: 'users', text: 'user data'},
      ],
      /**
       * collectionの下に登録されたdocumentの一覧
       */
      myList: [],
      /**
       * csvファイルから読み込んだデータ本体
       */
      dataCsv: '',
      /**
       * コレクション名(csv登録用)
       */
      collection1: '',
      /**
       * ドキュメント名(csv登録用)
       */
      dbName1: '',
      /**
       * キーフィールドの指定
       */
      keyCol: '',
    }
  },
  computed: {
    /**
     * dataCsvをJsonに変換
     * @returns {{}}
     */
    dataJson: function () {
      if (this.dataCsv.length === 0) {
        return
      }
      const res = {}
      this.dataCsv.forEach((val) => {
        const myKey = val[this.keyCol]
        if (myKey !== "") {
          res[myKey] = val
        }
      })
      return res
    },
    /**
     * 読み込んだCSVがPortionUnitの構造に必要なフィールドを含んでいるか検証
     * @returns {boolean}
     */
    portionValidate: function () {
      return validatePortionUnit(this.dataCsv[0])
    },
    /**
     * csvをfirebaseに読み込めるかどうかのフラグ
     */
    importOk: function () {
      return this.portionValidate && this.collection1 && this.dbName1 && this.keyCol
    },
  },
  methods: {
    /**
     * fctを別のファイルに切り替えて初期化
     * @param portionUnitName
     * @returns {Promise<void>}
     */
    async setNewPortionUnit(portionUnitName) {
      if (this.$store.state.fire.hasDocumentChanged) {
        alert('please save your work before updating portion unit')
        return
      }
      await this.$store.dispatch('fire/updateFctId', portionUnitName)
      await this.$router.push('/')
    },
    /**
     * dataJsonをfirebaseに登録
     * @returns {Promise<void>}
     */
    async insertData(myCollection, myDoc, myDat) {
      if (this.dbName === '' || this.dataCsv.length === 0) {
        return
      }
      const ref = doc(firestoreDb, myCollection, myDoc)
      await setDoc(ref,
        myDat
      ).catch(error => {
        throw error
      }).then(() => {
        console.log("import complete: " + this.dbName)
      })
    },
    /**
     * 指定するコレクションに含まれるドキュメントの一覧を抽出
     * @param myCollection
     * @returns {Promise<void>}
     */
    async getFileList(myCollection) {
      const querySnapshot = await getDocs(collection(firestoreDb, myCollection));
      this.myList.length = 0
      querySnapshot.forEach((doc) => {
        this.myList.push(doc.id)
      });
    }
  }
}
</script>
