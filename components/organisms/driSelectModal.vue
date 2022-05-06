<template>
  <b-modal
    v-model="showModalComputed"
    :id="myName"
    :title="myModalHeader"
    :static="true"
    @ok="clickOk"
    hide-header
  >
    <dri-select-all
      :targetSwitch.sync="targetSwitch"
      :max="max"
      :driPopulations="driPopulations"
      :driItems="driItems"
      @update:target="$emit('update:target', $event)"
      @changeNutritionValue="$emit('changeNutritionValue', $event)"
    ></dri-select-all>
  </b-modal>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll.vue"

export default {
  components: {
    driSelectAll
  },
  props: {
    /**
     * モーダルの表示用トリガー
     */
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    myName: {
      type: String,
      required: true,
    },
    myModalHeader: {
      type: String,
      required: true,
    },
    driItems: {
      type: Array,
      required: true,
    },
    driPopulations: {
      type: Array,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    targetSwitch: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    showModalComputed: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      }
    }
  },
  data() {
    return {
      selectedItem: '',
    }
  },
  methods: {
    clickOk() {
      console.log('done')
    },
  }
}

</script>
