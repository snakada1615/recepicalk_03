<template>
  <b-container>
    <b-button>fire</b-button>
    <!--   現在firestoreに含まれるドキュメントを抽出     -->
    <b-card
      header="Load data from firebase"
      header-bg-variant="success"
      header-text-variant="light"
      class="my-2"
    >
      <div class="d-flex flex-row align-items-center">
        <div>collection</div>
        <b-select v-model="collection2" :options="collectionList" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div>document</div>
        <b-input v-model="dbName2" placeholder="Enter doc name" class="my-1 mx-1"/>
      </div>
      <div class="d-flex flex-row align-items-center">
        <b-button @click="getData(collection2, dbName2)" class="my-1 mx-1">load from firebase</b-button>
      </div>
    </b-card>
    <b-card v-if="dataFire" bg-variant="light">
      <json-viewer
        :value="dataFire"
      />
    </b-card>
    <b-form-select
      v-model="selectedFoodGroup"
      :options="foodGroupList"
    />
    <b-card
      bg-variant="light"
      :title="allCrops[selectedFoodGroup].groupName">
      {{ allCrops[selectedFoodGroup].groupDescription }}
      <b-row>
        <b-col cols="12" md="6" lg="4" v-for="index in selectedFoodList.length" :key="index">
          <b-card
            :title="selectedFoodList[index-1].name"
            style="max-width: 20rem;"
            bg-variant="success"
            class="my-1"
          >
            <b-img
              fluid
              thumbnail
              center
              style="max-height: 10rem;"
              alt="Image missing"
              :src="selectedFoodList[index-1].picture"
            />
            <b-card-text>
              {{ selectedFoodList[index - 1].description }}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc} from "firebase/firestore";
import JsonViewer from 'vue-json-viewer'

export default {
  components:{
    JsonViewer
  },
  methods: {
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
       * コレクション名(firebaseからの読み込み用)
       */
      collection2: '',
      /**
       * ドキュメント名(firebaseからの読み込み用)
       */
      dbName2: '',
      /**
       * firebaseから読み込んだデータ本体
       */
      dataFire: '',
      my_split:[],
      allCrops: [
        {
          groupName: 'Staples',
          groupDescription: 'food group description here...',
          foodList: [
            {
              'name': 'barley',
              description: 'description here......',
              picture: '/img/crops/barley.png'
            },
            {
              'name': 'broad bean',
              description: 'description here......',
              picture: '/img/crops/broad_bean.png'
            },
            {
              'name': 'cassava',
              description: 'description here......',
              picture: '/img/crops/cassava.png'
            },
            {
              'name': 'enset',
              description: 'description here......',
              picture: '/img/crops/enset.png'
            },
            {
              'name': 'lentil brown',
              description: 'description here......',
              picture: '/img/crops/lentil_brown.png'
            },
            {
              'name': 'lentil green',
              description: 'description here......',
              picture: '/img/crops/lentil_green.png'
            },
            {
              'name': 'lentil red',
              description: 'description here......',
              picture: '/img/crops/lentil_red.png'
            },
            {
              'name': 'maize',
              description: 'description here......',
              picture: '/img/crops/maize.png'
            },
            {
              'name': 'soybean',
              description: 'description here......',
              picture: '/img/crops/soybean.png'
            },
            {
              'name': 'sorghum',
              description: 'description here......',
              picture: '/img/crops/sorghum.png'
            },
            {
              'name': 'teff',
              description: 'description here......',
              picture: '/img/crops/teffgrain.jpeg'
            }
          ]
        }
      ],
      selectedFoodGroup: 0
    }
  },
  computed: {
    selectedFoodList() {
      return this.allCrops[this.selectedFoodGroup].foodList
    },
    foodGroupList() {
     return this.allCrops.map((item, index)=>{
       return {
         value: index,
         text: item.groupName
       }
     })
    }
  },
  created() {
    console.log('halo')
    //const input_line = '"2C95699FFC68","201 S BOULEVARDRICHMOND, VA 23220","8299600062754882","2018-09-23", happy hour'
    const input_line = '3111,3,111,Legumes and their products,"Bambara groundnut, dried ",,1,380,8.4,20.1,5.9,58.9,3.7,3.1,65,3.3,199,275,1190,29,3.38,0.89,2,0,20,0,,0.38,0.12,1.9,,,0,,Legumes and nuts '

    this.my_split = input_line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    console.log(this.my_split)
  }
}
</script>
