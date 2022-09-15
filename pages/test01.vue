<template>
  <b-container>
    <div>
      aloha
    </div>
  </b-container>
</template>
<script>

export default {
  data() {
    return {
      mySteps: ['Step 1', 'Step 2', 'Step 3'],
      currentStep:0
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
