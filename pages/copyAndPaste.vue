<template>
  <b-container>
    <b-card>
      <div class="font-weight-bold text-danger">copy data to another Tab</div>
      <b-input-group
        class="my-1"
        prepend="copy from"
      >
        <b-form-select
          v-model="fromIndex"
          :options="listItems"
        />
      </b-input-group>
      <b-input-group
        class="my-1"
        prepend="copy to"
      >
        <b-form-select
          v-model="toIndex"
          :options="listItems"
        />
      </b-input-group>
      <b-card
        class="my-1"
        bg-variant="light"
      >
        <div
          v-if="stateSelected"
          class="small"
        >
          this will copy
          <span class="text-primary">family structure</span>
          <span
            v-if="fromIndex < 110 && toIndex < 110"
          > and <span class="text-primary">selected food list</span></span>
          from [ {{ listItems[listItems.findIndex(val => val.value === fromIndex)].text }} ] to
          [ {{ listItems[listItems.findIndex(val => val.value === toIndex)].text }} ]
        </div>
      </b-card>
      <b-button
        class="my-1"
        :disabled="!stateSelected"
        @click="goCopy(fromIndex, toIndex)"
      >
        copy Go
      </b-button>
    </b-card>
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      fromIndex: -1,
      toIndex: -1,
    }
  },
  computed: {
    stateSelected(){
      return (this.fromIndex >= 0 && this.toIndex >= 0)
    },
    listItems() {
      let res = []
      this.$store.state.fire.myApp.menuCases.forEach((val, index) => {
        res.push({
          'text': 'dietCalk' + index + ':' + val.note,
          'value': index + 100
        })
      })
      this.$store.state.fire.myApp.feasibilityCases.forEach((val, index) => {
        res.push({
          'text': 'feasibility' + index + ':' + val.note,
          'value': index + 200
        })
      })
      return res
    }
  },
  methods: {
    goCopy(fromIndex, toIndex){
      this.$store.dispatch('fire/copyAndPasteMyApp', {'fromId': fromIndex, 'toId':toIndex})
    }
  }
}
</script>
