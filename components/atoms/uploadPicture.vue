<template>
  <b-container>
    <b-form-file
      v-model="newImage"
      @change="upload"
      @get-link="getLink"
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
      getLink: ''
    }
  },
  methods: {
    upload(p) {
      const vm = this
      const file = p.target.files[0]
      const storageRef = ref(storage, file.name)
      // 画像をStorageにアップロード
      uploadBytes(storageRef, file).then(() => {
        console.log('upload success')
        // アップロードした画像のURLを取得
        getDownloadURL(storageRef).then((url) => {
          console.log(url)
          vm.$emit("getLink", url)
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

