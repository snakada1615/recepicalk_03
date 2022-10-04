<template>
  <b-container>
    <b-form-file
      v-model="newImage"
      @input="compressUpload"
      accept="image/*"
      ref="file-input"
      capture
      class="mb-2"
      size="sm"
    />
  </b-container>
</template>

<script>
import {storage} from "~/plugins/firebasePlugin";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {makeToast} from "~/plugins/helper";
import Compressor from 'compressorjs';

export default {
  data() {
    return {
      newImage: null,
      maxSize: 1000000, // 10MB
      validationError: ''
    }
  },
  methods: {
    compressUpload(image) {
      const vm = this
      console.log("original size: " + image.size);

      new Compressor(image, {
        quality: 0.6,
        maxWidth: 400,
        maxHeight: 200,
        success(result) {
          console.log("compressed size", result.size);

          const storageRef = ref(storage, result.name)
          // 画像をStorageにアップロード
          uploadBytes(storageRef, result).then(() => {
            console.log('upload picture success')
            // アップロードした画像のURLを取得
            getDownloadURL(storageRef).then((url) => {
              vm.$emit("get-link", url)
              console.log('upload-link acquired')
            })
          }).catch((error) => {
            console.log(error)
            makeToast(vm, 'picture upload fail')
          })

        },
        error(err) {
          console.log(err.message);
          throw err
        },
      });
    },
  }
}
</script>

