<template>
  <b-container>
    <b-card
      header="Load data from firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <b-input v-model="collection" placeholder="Enter collection name" class="my-1"/>
      <b-input v-model="dbName" placeholder="Enter doc name" class="my-1"/>
      <b-input v-model="keyCol" placeholder="Enter key column" class="my-1"/>
      <b-button @click="getData" class="my-1">load</b-button>
    </b-card>
    <b-card
      header="Load data from CSV and import to firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <csv-import :show-data="false" @getCsv="dataCsv=$event" class="my-1"></csv-import>
      <b-button @click="insertData" class="my-1">import to firebase</b-button>
    </b-card>
    <b-card>
      {{dataJson}}
    </b-card>
    <b-card>
      {{dataFire}}
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/molecules/csvImport";
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default {
  components: {
    csvImport
  },
  data() {
    return {
      /**
       * csvファイルから読み込んだデータ本体
       */
      dataCsv:'',
      /**
       * コレクション名
       */
      collection:'',
      /**
       * ドキュメント名
       */
      dbName:'',
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
    async insertData(){
      if (this.dbName === '' || this.dataCsv.length === 0){ return }
      const vm = this
      const ref = doc(firestoreDb, vm.collection, vm.dbName)
      await setDoc(ref,
        vm.dataJson
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
    async getData(){
      const ref = await doc(firestoreDb, this.collection, this.dbName)
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
