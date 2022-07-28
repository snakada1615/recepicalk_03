<template>
  <b-container>
    <b-button
      @click="showDriSelect=!showDriSelect"
    >add
    </b-button>
    <dri-select-modal
      my-modal-header="nutrition target"
      my-name="driModal"
      :show-modal.sync="showDriSelect"
      :targetSwitch="isTargetSingle"
      :max="maxPopulation"
      :driPopulations="target"
      :driItems="dri"
      @driSelectOk="modalOk"
      @update:target="updateDemand"
    />
  </b-container>
</template>
<script>
import driSelectModal from "../components/organisms/driSelectModal";

export default {
  components: {
    driSelectModal,
  },
  data() {
    return {
      showDriSelect: false,
      isTargetSingle: false,
      maxPopulation: 10000,
      target: [],
    }
  },
  computed: {
    dri() {
      return JSON.parse(JSON.stringify(this.$store.state.fire.myApp.dataSet.dri))
    }
  },
  methods: {
    updateDemand(val) {
      this.target = JSON.parse(JSON.stringify(val))
    },
    modalOk(){
      console.log(this.target)
      this.$store.dispatch('fire/updateFamilyCases', this.target)
    }
  }
}
</script>
