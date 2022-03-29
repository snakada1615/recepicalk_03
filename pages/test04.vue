<template>
  <b-container>
    <b-row>
      <b-col cols="3">
        <b-form-group label="Radios using options" v-slot="{ ariaDescribedby }">
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
        <div>Selected: <strong>{{ selected }}</strong></div>
        <div v-if="link1">ここfirst</div>
        <div v-if="link2">
          <markdown-it-vue class="md-body" :content="content[0]" />
        </div>
        <div v-if="link3">
          <markdown-it-vue class="md-body" :content="content[1]" />
        </div>
        <div v-if="link4">ここ4</div>
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
        { text: 'Toggle this custom radio', value: 1 },
        { text: 'Or toggle this other custom radio', value: 2 },
        { text: 'This one is Disabled', value: 3 },
        { text: 'This is the 4th radio', value: 4 }
      ],
      content:[],
      myMarkDown:[
        '../docs/driSelectAll.md',
        '../docs/driSelectMulti.md'
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
    }
  },
  mounted() {
    this.$axios
      .get(this.myMarkDown[0])
      .then((response) => (this.content[0] = response.data));
    this.$axios
      .get(this.myMarkDown[1])
      .then((response) => (this.content[1] = response.data));
  },
  methods: {
  }
}
</script>
