<template>
  <b-container>
    <markdown-it-vue class="md-body" :content="db" />
    <img src="/favicon.ico" alt="image"/>
  </b-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'

export default {
  components: {
    MarkdownItVue
  },
  data () {
    return {
      db:'/driSelectAll.md',
    }
  },
}
</script>
