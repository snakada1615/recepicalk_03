<template>
  <b-container>
    <b-form-file
      v-model="newImage"
      @change="upload"
      accept=".jpg, .png, .gif"
      ref="file-input"
      class="mb-2"
      size="sm"
    />
  </b-container>
</template>

<script>
import {storage} from "~/plugins/firebasePlugin";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {makeToast} from "~/plugins/helper";

export default {
  data() {
    return {
      newImage: [],
      maxSize: 1000000, // 10MB
      validationError: ''
    }
  },
  methods: {
    validation(file) {
      // 1. アップロードされるファイルが画像であること
      if (!(file.type.includes('image'))) {
        this.validationError = 'only picture file can be uploaded'
        return true
      }

      // 2. 画像のサイズが10MB未満であること
      if (!(parseInt(file.size) < this.maxSize)) {
        this.validationError = 'file size should be smaller than ' + (this.maxSize / 1000000) + ' MB'
        return true
      }
      return false
    },
    upload(p) {
      const vm = this
      const file = p.target.files[0]
      const storageRef = ref(storage, file.name)

      if (vm.validation(file)) {
        alert(this.validationError)
        return
      }
      // 画像をStorageにアップロード
      uploadBytes(storageRef, file).then(() => {
        console.log('upload success')
        // アップロードした画像のURLを取得
        getDownloadURL(storageRef).then((url) => {
          console.log(url)
          vm.$emit("get-link", url)
          makeToast(vm, 'upload picture success!')
        })
      }).catch((error) => {
        console.log(error)
        makeToast(vm, 'upload fail')
      })
    }
  }
}
</script>

