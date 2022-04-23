// parent component
<template>
  <b-modal v-model="show" static>
    <template v-slot:modal-header>
      Header Title
    </template>
    Modal Content
  </b-modal>
</template>
<script>
export default {
  props: {
    show:{
      type: Boolean,
      default: false
    }
  }
}
</script>
