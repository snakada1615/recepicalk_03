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
        <b-select v-model="collection2" :options="collectionList" class="my-1 mx-1"/></div>
      <div class="d-flex flex-row align-items-center">
        <div>document</div>
        <b-input v-model="dbName2" placeholder="Enter doc name" class="my-1 mx-1"/></div>
      <b-button @click="getData(collection2, dbName2)" class="my-1">load from firebase</b-button>
    </b-card>
    <b-card v-if="dataFire" bg-variant="light">
      <json-viewer
        :value="dataFire"
      />
    </b-card>
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
        <b-input v-model="dbName1" placeholder="Enter doc name" class="my-1 mx-1"/></div>
      <div class="d-flex flex-row align-items-center">
        <div>index_Col</div>
        <b-input v-model="keyCol" placeholder="Enter key column" class="my-1 mx-1"/></div>
      <b-button @click="insertData(collection1, dbName1, dataJson)" class="my-1">import to firebase</b-button>
    </b-card>
    <b-card>
      {{dataCsv}}
    </b-card>
    <b-card v-if="dataJson2" bg-variant="light">
      <json-viewer
        :value="dataJson2"
      />
    </b-card>
    <b-card
      header="get fileList from firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <div class="d-flex flex-row align-items-center">
        <div>collection</div>
        <b-select v-model="collection3" :options="collectionList" class="my-1 mx-1"/></div>
      <b-button @click="getFileList(collection3)">file list</b-button>
      <div><span v-html="myListHtml"></span></div>
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/molecules/csvImport";
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc, setDoc, collection, getDocs} from "firebase/firestore";
import JsonViewer from 'vue-json-viewer'

export default {
  components: {
    csvImport,
    JsonViewer,
  },
  data() {
    return {
      collectionList:[
        {value:'dataset', text: 'dataset'},
        {value:'users', text: 'user data'},
      ],
      myList:[],
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
      /**
       * コレクション名(firebaseからの読み込み用)
       */
      collection3:'',
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
    },
    dataJson2:function () {
      if (this.dataCsv.length === 0) { return }
      let parent = {}
      let child = {}
      let grandChild = {}
/*
      this.dataCsv.reduce((acc, rowItem)=>({
        ...acc, ['parent1']: rowItem[]
      }), {})
*/
      this.dataCsv.forEach((rowItem)=>{
        const key1 = rowItem[0]
        const key2 = rowItem[1]
        grandChild['name'] = rowItem[2]
        child[key2] = Object.assign({}, child[key2], rowItem)
        parent[key1] = Object.assign({}, parent[key1], child[key2])
        //res = Object.assign({}, res, {'rowItem[0]': { 'rowItem[1]' : 'rowItem[3]'}})
      })
      return parent
    },
    myListHtml: function(){
      let res = ''
      this.myList.forEach(function(item){
        res += '<div>' + item + '<div>'
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
      console.log('here')
      const ref = await doc(firestoreDb, myCollection, myDoc)
      await getDoc(ref).then((doc) => {
        if (doc.exists()) {
          this.dataFire = doc.data()

        } else {
          alert('id does not match')
        }
      })
    },
    async getFileList(myCollection){
      const querySnapshot = await getDocs(collection(firestoreDb, myCollection));
      this.myList.length = 0
      querySnapshot.forEach((doc) => {
        this.myList.push(doc.id)
      });
    }
  }
}
</script>
