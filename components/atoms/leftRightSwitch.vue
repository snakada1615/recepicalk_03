<template>
  <b-form inline>
    <span v-if="labelLeft"><slot name="labelLeft">{{ labelLeft }}</slot></span>
    <b-form-checkbox
      switch
      class="mr-0 ml-1"
      :name="name"
      :checked="checked"
      @input="$emit('input', $event)"
    />
    <span v-if="labelRight" class="mx-0 px-0">
      <slot name="labelRight">{{ labelRight }}</slot>
    </span>
    <slot></slot>
  </b-form>
</template>

<script>
/**
 * this component adds label on both side of bootstrap-switch component
 */

export default {
  props: {
    /**
     * true if selected right
     */
    checked: {type: Array},
    /**
     * label for left switch
     */
    labelLeft: {type: String},
    /**
     * label for right switch
     */
    labelRight: {type: String},
    /**
     * name of the component
     */
    name: {type: String, require: true}
  },
}
</script>
