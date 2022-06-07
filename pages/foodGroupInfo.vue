<template>
  <b-container>
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
import {doc, setDoc} from "firebase/firestore";
import {fireGetDoc, firestoreDb} from "@/plugins/firebasePlugin";

export default {
  data() {
    return {
      allCrops: [],
      selectedFoodGroup: 0,
    }
  },
  /**
   * 表示用の食品データを最初に読み込む
   * @returns {Promise<{allCrops: unknown[]}>}
   */
  async asyncData() {
    const res = await fireGetDoc('dataset', 'foodDictionary_eth')
    return {
      allCrops: Object.entries(res).map((val) => {
        return val[1]
      })
    }
  },
  computed: {
    selectedFoodList() {
      return this.allCrops[this.selectedFoodGroup].foodList
    },
    foodGroupList() {
      console.log(this.allCrops)
      return Object.entries(this.allCrops).map((val, index) => {
        return {
          value: index,
          text: val[1].groupName
        }
      })
    },
  },
  methods: {
    /**
     * dataJsonをfirebaseに登録
     * @returns {Promise<void>}
     */
    async insertData(myCollection, myDoc, myDat) {
      let res = {}
      Object.entries(myDat).forEach((val) => {
        res[val[1].groupName] = val[1]
      })
      console.log(res)
      const ref = doc(firestoreDb, myCollection, myDoc)
      await setDoc(ref,
        res
      ).catch(error => {
        throw error
      }).then(() => {
        console.log("import complete: " + this.dbName)
      })
    },
    setData() {
      this.insertData('dataset', 'foodDictionary_eth', this.allCrops)
    },
  }
}
</script>
