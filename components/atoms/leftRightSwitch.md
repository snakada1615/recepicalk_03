leftRightSwitch example:

```vue
<template>
  <b-jumbotron border-variant="primary" bg-variant="light">
    <left-right-switch
      labelLeft="left message"
      labelRight="right message"
      name="check"
      v-model="test"
    />
  </b-jumbotron>
</template>
<script>
  export default {
    data(){
      return {
        test:false
      }
    },
  }

</script>
```
