<template>
  <b-container>
    <!--   現在firestoreに含まれるドキュメントを抽出     -->
    <b-card
      header="check existing dataset on server and replace with current data"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <div class="d-flex flex-row align-items-center">
        <div class="mr-2">your current dataset: </div>
        <div class="text-danger">{{$store.state.fire.myApp.dataSet.fctId}}</div>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div class="mr-2">list</div>
        <b-select v-model="dbName" :options="fctList" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <b-button @click="getData('dataset', dbName)" class="my-1 mx-1">load dataset</b-button>
        <b-button
          @click="setNewFct(dbName)"
          class="my-1 mx-1"
          :disabled="!dataFire"
        >use this FCT
        </b-button>
      </div>
    </b-card>

    <b-card v-if="dataFire" bg-variant="light">
      <json-viewer
        :value="dataFire"
      />
    </b-card>
  </b-container>
</template>

<script>
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc, collection, getDocs} from "firebase/firestore";
import JsonViewer from 'vue-json-viewer'

export default {
  components: {
    JsonViewer,
  },
  async asyncData() {
    const querySnapshot = await getDocs(collection(firestoreDb, 'dataset'));
    let data = []
    querySnapshot.forEach((doc) => {
      if (doc.id.indexOf('fct_') === 0){
        data.push(doc.id)
      }
    });
    return {
      fctList: data
    }
  },
  data() {
    return {
      /**
       * ドキュメント名(firebaseからの読み込み用)
       */
      dbName: '',
      /**
       * firebaseから読み込んだデータ本体
       */
      dataFire: '',
    }
  },
  methods: {
    /**
     * fctを別のファイルに切り替えて初期化
     * @param fctName
     * @returns {Promise<void>}
     */
    async setNewFct(fctName) {
      const res = window.confirm('this will change dataset you use. is it ok?')
      if (res) {
        //fctNameをstoreに保存
        await this.$store.dispatch('fire/updateFctId', fctName)
        //fctNameに基づいてfctを初期化（firestoreからfetch → storeに保存）
        await this.$store.dispatch('fire/fetchFctFromFire')
        //更新された内容をfirestoreに戻す
        await this.$store.dispatch('fire/fireSaveAppdata')
        await this.$router.push('/')
      }
    },
    /**
     * collection, dbNameで指定したドキュメントをfirebaseから読み込み
     * @returns {Promise<void>}
     */
    async getData(myCollection, myDoc) {
      const ref = await doc(firestoreDb, myCollection, myDoc)
      await getDoc(ref).then((doc) => {
        if (doc.exists()) {
          this.dataFire = doc.data()

        } else {
          alert('id does not match')
        }
      })
    },
  }
}
</script>
