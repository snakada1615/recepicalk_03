<template>
  <b-container>
    <b-card
      header="Load data from firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <div class="d-flex flex-row align-items-center">
        <div>collection</div>
        <b-input v-model="collection2" placeholder="Enter collection name" class="my-1 mx-1"/></div>
      <div class="d-flex flex-row align-items-center">
        <div>document</div>
        <b-input v-model="dbName2" placeholder="Enter doc name" class="my-1 mx-1"/></div>
      <b-button @click="getData(collection2, dbName2)" class="my-1">load</b-button>
    </b-card>
    <b-card
      header="Load data from CSV and import to firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <div class="d-flex flex-row align-items-center">
        <div>collection</div>
        <b-input v-model="collection1" placeholder="Enter collection name" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div>document</div>
        <b-input v-model="dbName1" placeholder="Enter doc name" class="my-1 mx-1"/></div>
      <div class="d-flex flex-row align-items-center">
        <div>index_Col</div>
        <b-input v-model="keyCol" placeholder="Enter key column" class="my-1 mx-1"/></div>
      <csv-import :show-data="false" @getCsv="dataCsv=$event" class="my-1"></csv-import>
      <b-button @click="insertData(collection1, dbName1, dataJson)" class="my-1">import to firebase</b-button>
    </b-card>
    <b-card v-if="dataJson">
      <json-viewer
        :value="dataJson"
      />
    </b-card>
    <b-card>
      {{dataJson}}
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/molecules/csvImport";
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc, setDoc} from "firebase/firestore";
import JsonViewer from 'vue-json-viewer'

export default {
  components: {
    csvImport,
    JsonViewer,
  },
  data() {
    return {
      /**
       * csvファイルから読み込んだデータ本体
       */
      dataCsv:'',
      /**
       * コレクション名(csv登録用)
       */
      collection1:'',
      /**
       * ドキュメント名(csv登録用)
       */
      dbName1:'',
      /**
       * コレクション名(firebaseからの読み込み用)
       */
      collection2:'',
      /**
       * ドキュメント名(firebaseからの読み込み用)
       */
      dbName2:'',
      /**
       * キーフィールドの指定
       */
      keyCol:'',
      /**
       * firebaseから読み込んだデータ本体
       */
      dataFire:'',
    }
  },
  computed:{
    /**
     * dataCsvをJsonに変換
     * @returns {{}}
     */
    dataJson:function () {
      if (this.dataCsv.length === 0) { return }
      const res = {}
      this.dataCsv.forEach((val)=>{
        const myKey = val[this.keyCol]
        if (myKey !== ""){
          res[myKey] = val
        }
      })
      return res
    }
  },
  methods: {
    /**
     * dataJsonをfirebaseに登録
     * @returns {Promise<void>}
     */
    async insertData(myCollection, myDoc, myDat){
      if (this.dbName === '' || this.dataCsv.length === 0){ return }
      const ref = doc(firestoreDb, myCollection, myDoc)
      await setDoc(ref,
        myDat
      ).catch(error => {
        throw error
      }).then(()=>{
        console.log("import complete: "+this.dbName)
      })
    },
    /**
     * collection, dbNameで指定したドキュメントをfirebaseから読み込み
     * @returns {Promise<void>}
     */
    async getData(myCollection, myDoc){
      const ref = await doc(firestoreDb, myCollection, myDoc)
      await getDoc(ref).then((doc) => {
        if (doc.exists()) {
          this.dataFire = doc.data()
        } else {
          alert('id does not match')
        }
      })
    }
  }
}
</script>
