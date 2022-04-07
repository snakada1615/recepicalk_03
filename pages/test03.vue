<template>
  <b-container>
    <div>
      <markdown-it-vue class="md-body" :content="content" />
    </div>
    <form>
      <input type="file" @change="readfile" />
    </form>
    <markdown-it-vue class="md-body" :content="data" />
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
      data:'',
      content: '# your markdown content',
    }
  },
  methods: {
    readfile: function(e) {
      const vm = this
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = function() {
        vm.data = reader.result
      }
      reader.readAsText( file )
    }
  }
}
</script>
