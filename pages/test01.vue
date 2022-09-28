<template>
  <b-container>
    <pass-check-dialogue
      :password="myPass"
      modal-name="myBoxName"
      :show-modal.sync="myTrigger"
      text-description="you need password to enter this page"
      @correctInput="correctInput"
      @wrongInput="wrongInput"
    />
    <b-button variant="success" @click="myTrigger = !myTrigger" size="sm">show</b-button>
  </b-container>
</template>
<script>
import passCheckDialogue from "../components/atoms/passCheckDialogue";

export default {
  layout: 'defaultEth',
  components: {
    passCheckDialogue,
  },
  data() {
    return {
      myPass: '123456',
      myTrigger: false,
    }
  },
  methods: {
    correctInput(){
      console.log('correct input')
    },
    wrongInput(){
      console.log('wrong input')
    },
  }
}
</script>
