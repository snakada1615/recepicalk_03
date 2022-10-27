<template>
  <b-container>
    <upload-picture
      @get-link="getLink"
    />
  </b-container>
</template>

<script>
import uploadPicture from '../components/atoms/uploadPicture'

export default {
  components: {
    uploadPicture
  },
  layout: 'defaultEth',
  data () {
    return {
      newImage: []
    }
  },
  methods: {
    getLink (val) {
      console.log(val)
    }
  }
}
</script>
