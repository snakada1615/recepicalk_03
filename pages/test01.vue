<template>
  <b-container>
    <page-changer
      :tab-text-set="myTitles"
      :tab-index.sync="tabIndex"
      :page-count=6
    />
    <b-container
      clsass="myTab"
      v-if="tabOptions[0]"
    >
      cont1
    </b-container>
    <b-container
      clsass="myTab"
      v-if="tabOptions[1]"
    >
      cont2
    </b-container>
    <b-container
      clsass="myTab"
      v-if="tabOptions[2]"
    >
      cont3
    </b-container>
    <b-container
      clsass="myTab"
      v-if="tabOptions[3]"
    >
      cont4
    </b-container>
    <b-container
      clsass="myTab"
      v-if="tabOptions[4]"
    >
      cont5
    </b-container>
    <b-container
      clsass="myTab"
      v-if="tabOptions[5]"
    >
      cont6
    </b-container>
  </b-container>
</template>
<script>
import pageChanger from "../components/atoms/pageChanger";

export default {
  components: {
    pageChanger
  },
  data() {
    return {
      tabIndex: 0,
      tabCount: 6,
      myTitles: [
        'options 1',
        'options 2',
        'options 3',
        'options 4',
        'options 5',
        'options 6',
      ]
    }
  },
  computed: {
    tabOptions() {
      const vm = this
      return Array.apply(false, Array(6)).map((item, index) => {
        return (index === vm.tabIndex);
      });
    }
  },
  methods: {},
}
</script>
