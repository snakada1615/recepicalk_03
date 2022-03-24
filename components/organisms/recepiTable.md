recepiTable example:

```vue
<template>
  <b-jumbotron bg-variant="light" border-variant="primary">
    <recepi-table
      :items="cropList"
      head-row-variant="success"
      table-variant="light"
      foot-row-variant="light"
      @rowClick="onRecepiclick"
    >
    </recepi-table>
    <div style="color: #3b8070">clicked item</div>
    Name: {{clickedList.Name}}, Group: {{clickedList.Group}}, Energy: {{clickedList.En}}, Protein: {{clickedList.Pr}}, Vit-A: {{clickedList.Va}}, Iron: {{clickedList.Fe}}, Weight: {{clickedList.Wt}}
    <div/>
    <div style="color: #3b8070">add item</div>
    <ul>
      <li v-for="item in candidate">
        <b-button @click="addData(item)" size="sm" variant="info">add</b-button> Name: {{item.Name}}, Group: {{item.Group}}, Energy: {{item.En}}, Protein: {{item.Pr}}, Vit-A: {{item.Va}}, Iron: {{item.Fe}}, Weight: {{item.Wt}} 
      </li>
    </ul>
  </b-jumbotron>
</template>
<script>
  export default {
    data(){
      return {
        candidate:[
          {id:"1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"},
          {id:"2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"}        
        ],
        cropList:[],
        clickedList:{}
      }
    },
    methods:{
      onRecepiclick(rec){
        console.log(rec)
        this.clickedList = rec
      },
      addData(val){
        this.cropList.push(val)
      }
    }
  }

</script>
```
