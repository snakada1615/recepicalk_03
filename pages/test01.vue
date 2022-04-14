<template>
  <b-container>
    <b-form-select
      v-model="myText"
      :options="options"
      @change="onChange"
      @input="onInput"
    ></b-form-select>
    <div>{{myText}}</div>
    <b-button
      @click="insertMe"
    >insert</b-button>
  </b-container>
</template>

<script>
export default {
  data(){
    return {
      myText: 3,
      options: ['hage', 'chibi', 'debu', 'manuke']
    }
  },
  methods: {
    onChange: function () {console.log('onChange triggered')},
    onInput: function () {console.log('onInput triggered')},
    insertMe(){
      this.myText = 2
    }
  }
}
</script>
