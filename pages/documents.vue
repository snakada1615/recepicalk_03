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
          <div>vuedoc.md components/organisms/*.vue --output static/docs/</div>
        </b-card>
        <div v-if="link1">
          <markdown-it-vue class="md-body" :content="content[0]" />
        </div>
        <div v-if="link2">
          <markdown-it-vue class="md-body" :content="content[1]" />
        </div>
        <div v-if="link3">
          <markdown-it-vue class="md-body" :content="content[2]" />
        </div>
        <div v-if="link4">
          <markdown-it-vue class="md-body" :content="content[3]" />
        </div>
        <div v-if="link5">
          <markdown-it-vue class="md-body" :content="content[4]" />
        </div>
        <div v-if="link6">
          <markdown-it-vue class="md-body" :content="content[5]" />
        </div>
        <div v-if="link7">
          <markdown-it-vue class="md-body" :content="content[6]" />
        </div>
        <div v-if="link8">
          <markdown-it-vue class="md-body" :content="content[7]" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'


export default {
  components: {
    MarkdownItVue
  },
  data() {
    return {
      selected: 'first',
      options: [
        { text: 'driSelectAll', value: 1 },
        { text: 'driSelectMulti', value: 2 },
        { text: 'driSelectSingle', value: 3 },
        { text: 'fctTable', value: 4 },
        { text: 'fctTableModal', value: 5 },
        { text: 'foodModal', value: 6 },
        { text: 'nutritionBar', value: 7 },
        { text: 'recepiTable', value: 8 }
      ],
      content:[],
      myMarkDown:[
        '../docs/driSelectAll.md',
        '../docs/driSelectMulti.md',
        '../docs/driSelectSingle.md',
        '../docs/fctTable.md',
        '../docs/fctTableModal.md',
        '../docs/foodModal.md',
        '../docs/nutritionBar.md',
        '../docs/recepiTable.md'
      ],
    }
  },
  computed:{
    link1:function () {
      return this.selected === 1
    },
    link2:function () {
      return this.selected === 2
    },
    link3:function () {
      return this.selected === 3
    },
    link4:function () {
      return this.selected === 4
    },
    link5:function () {
      return this.selected === 5
    },
    link6:function () {
      return this.selected === 6
    },
    link7:function () {
      return this.selected === 7
    },
    link8:function () {
      return this.selected === 8
    }
  },
  async mounted() {
    for (let i = 0; i < this.myMarkDown.length; i++){
      this.content[i] = await this.getAxios(this.myMarkDown[i])
    }
  },
  methods: {
    async getAxios(val){
      const res = await this.$axios.get(val)
      return res.data
    }
  }
}
</script>
