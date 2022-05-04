<template>
  <b-container>
    <b-card>
      <div>{{ datObjComputed }}</div>
      <div>{{ 'computed triggered:' + countComputed }}</div>
    </b-card>
  </b-container>
</template>

<script>

export default {
  props: {
    myDat: {
      type: Object
    },
  },
  computed: {
    /**
     * datObj全体のcomputed
     * @returns {any}
     */
    datObjComputed: function () {
      this.countComputed += 1
      // dat: dummy to trigger computed
      const dat1 = this.myDat.child.firstChild
      const dat2 = this.myDat.parent2
      return this.myDat
    },
  },
  data() {
    return {
      /**
       * Computedが反応した回数
       */
      countComputed: 0
    }
  },
}

</script>
