nutritionBar example

```vue
<template>
  <b-jumbotron bg-variant="light" border-variant="primary">
     <nutrition-bar
       cropName="Iron"
       :iconNum=3
       :max="10"
       :nutritionTarget="test"
       :rating="rate"
       :showDri="true"
     ></nutrition-bar> 
  </b-jumbotron>
</template>
<script> 
  export default {
    data(){
      return{
        test:100,
        rate:8
      }
    }  
  }
</script>
```
