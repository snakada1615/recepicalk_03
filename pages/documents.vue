<template>
  <b-container>
    <b-row>
      <b-col cols="3" class="bg-info text-white" >
        <b-form-group label="Select component name" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="radio-group-1"
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col cols="9">
        <b-card bg-variant="light" class="mb-2">
          <div>データ更新は以下のコマンド：</div>
          <div>vuedoc.md components/*/*.vue --output static/docs/</div>
          <div>find *.md > filelist.txt　（docs.command参照）</div>
        </b-card>
        <div v-for="index in content.length">
          <div v-if="selected === index-1">
            <markdown-it-vue class="md-body" :content="content[index-1]" />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import axios from 'axios'


export default {
  components: {
    MarkdownItVue
  },
  data() {
    return {
      selected: 0,
    }
  },
  async asyncData() {
    let myMarkDownTemp = []
    let optionsTemp = []
    let contentsTemp = []
    async function getAxios(val){
      const res = await axios.get(val, { baseURL: window.location.origin })
      return res.data
    }
    await getAxios('../docs/filelist.txt').then(async (val)=>{
      myMarkDownTemp.length = 0
      optionsTemp.length = 0
      val.split(/\r\n|\n/).forEach((item, index)=>{
        if (item){
          myMarkDownTemp.push('../docs/' + item)
          optionsTemp.push({
            'text': item,
            'value': index
          })
        }
      })
      for (let i = 0; i < myMarkDownTemp.length; i++){
        contentsTemp[i] = await getAxios(myMarkDownTemp[i])
      }
    })
    return {
      myMarkDown: myMarkDownTemp,
      options: optionsTemp,
      content: contentsTemp,
    }
  },
  methods: {
  }
}
</script>
