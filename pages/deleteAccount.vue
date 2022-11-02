<template>
  <b-container>
    <b-form-input v-model="filter" />
    <div>selected: {{ deleteName }}</div>
    <b-button
      :disabled="!deleteKey"
      @click="deleteAccount"
    >
      delete
    </b-button>
    <b-table
      striped
      responsive
      :items="myList"
      :fields="fields"
      :filter="filter"
      :selectable="true"
      select-mode="single"
      @row-selected="onRowSelected"
    />
  </b-container>
</template>
<script>

import { getFileList, removeUserByName } from '@/plugins/firebasePlugin'

export default {
  async asyncData () {
    console.log('tes1')
    const myList = await getFileList('users', 2)
    console.log('tes2')
    return {
      myList
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'name',
          sortable: true
        }
      ],
      filter: null,
      deleteKey: '',
      deleteName: ''
    }
  },
  methods: {
    onRowSelected (item) {
      if (item) {
        this.deleteKey = item[0].id
        this.deleteName = item[0].name
      }
    },
    deleteAccount () {
      const res = window.confirm('are you sure to delete account:' + this.deleteName)
      if (res) {
        removeUserByName(this.deleteName)
      }
    }
  }
}
</script>
