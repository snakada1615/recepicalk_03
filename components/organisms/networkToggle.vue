<template>
  <b-container>
    <b-form-checkbox
      v-model="checked"
      name="check-button"
      @change="toggleNetwork"
      switch>
      Switch network <b>(status: {{ checked }})</b>
    </b-form-checkbox>
  </b-container>
</template>
<script>

import {firestoreDb} from "~/plugins/firebasePlugin";

export default {
  data() {
    return {
      checked: false
    }
  },
  methods: {
    toggleNetwork() {
      if(this.checked){
        this.disableNetwork()
      } else {
        this.enableNetwork()
      }
    },
    enableNetwork() {
      firestore.enableNetwork().then(function() {
        // eslint-disable-next-line no-console
        this.checked = true
        console.log("Network enaabled");
      });
    },
    disableNetwork() {
      firestoreDb.disableNetwork().then(function() {
        // eslint-disable-next-line no-console
        this.checked = false
        console.log("Network disabled");
      });
    },
  }
}
</script>
