<template>
  <b-container>
    <b-card v-if="regionObj" bg-variant="light">
      <b-row>
        <b-col cols="2">
          <div>{{label1}}</div>
        </b-col>
        <b-col cols="10">
          <b-form-select
            v-if="regionObj"
            :value="key1Temp"
            :options="regions1"
            @change="$emit('update:key1', $event)"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <div>{{label2}}</div>
        </b-col>
        <b-col cols="10">
          <b-form-select
            v-if="regionObj"
            :value="key2Temp"
            :options="regions2"
            @change="$emit('update:key2', $event)"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <div>{{label3}}</div>
        </b-col>
        <b-col cols="10">
          <b-form-select
            v-if="regionObj"
            :value="key3Temp"
            :options="regions3"
            @change="$emit('update:key3', $event)"
          />
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  props: {
    /**
     * region情報を記載したcsvファイル
     */
    fileName: {
      type: String,
      required: true,
      default: '../dbs/eth_region.csv'
    },
    /**
     * 選択された地域1
     */
    key1: {
      type: String,
      required: true,
      default: ''
    },
    /**
     * 選択された地域2
     */
    key2: {
      type: String,
      required: true,
      default: ''
    },
    /**
     * 選択された地域3
     */
    key3: {
      type: String,
      required: true,
      default: ''
    },
    /**
     * region1のラベル
     */
    label1: {
      type: String,
      default: 'Region'
    },
    /**
     * region2のラベル
     */
    label2: {
      type: String,
      default: 'Woreda'
    },
    /**
     * region3のラベル
     */
    label3: {
      type: String,
      default: 'Kebere'
    },
  },
  data() {
    return {
      /**
       * csvファイルから読み込んだデータ本体
       */
      dataCsv: '',
    }
  },
  computed: {
    regionObj: function () {
      if (this.dataCsv.length === 0) {
        return
      }
      return this.dataCsv.reduce((accum, item) => {
        const index1 = Object.keys(accum).indexOf(item.region1)
        if (index1 === -1) {
          accum[item.region1] = {[item.region2]: new Array(item.region3)}
        } else {
          const index2 = Object.keys(accum[item.region1]).indexOf(item.region2)
          if (index2 === -1) {
            accum[item.region1][item.region2] = new Array(item.region3)
          } else {
            accum[item.region1][item.region2].push(item.region3)
          }
        }
        return accum
      }, [])
    },
    regions1: function () {
      const res = Object.keys(this.regionObj)
      return res ? res : []
    },
    regions2: function () {
      if (!this.key1Temp) {
        return []
      }
      this.$emit('update:key2', '')
      this.$emit('update:key3', '')
      const res = Object.keys(this.regionObj[this.key1Temp])
      return res ? res : []
    },
    regions3: function () {
      if (!this.key1Temp) {
        return []
      }
      if (!this.key2Temp) {
        return []
      }
      this.$emit('update:key3', '')
      const res = this.regionObj[this.key1Temp][this.key2Temp]
      return res ? res : []
    },
    key1Temp: function () {
      return this.key1
    },
    key2Temp: function () {
      return this.key2
    },
    key3Temp: function () {
      return this.key3
    },
  },
  async fetch() {
    //axiosでファイル内容を取得
    async function getAxios(val) {
      const res = await axios.get(val, {baseURL: window.location.origin})
      return res.data
    }

    await getAxios(this.fileName).then(async (val) => {
      const array = val.split(/\r\n|\n/);
      const header = array[0].split(",");
      const body = array.slice(1).map((arr) => arr.split(","));

      this.dataCsv = body.map((b) => {
        let result = {};
        header.forEach((head, index) => {
          result[[head]] = b[index];
        });
        return result;
      });
    })
  },
  methods: {}
}
</script>
