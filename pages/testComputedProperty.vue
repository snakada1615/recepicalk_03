<template>
  <b-container>
    <test-computed
      :my-dat=myArray
    ></test-computed>
    <b-card>
      <div>nested ObjectやArrayはcomputed propertyで補足できない場合がある</div>
      <ol>
        <li>array[index]=valueを用いた値変更の場合</li>
        <li>子階層のエレメントをcomputedの式に含めていない場合</li>
      </ol>
    </b-card>
    <hr>
    <div>
      <b-button variant="success" @click="reset" class="my-1">reset</b-button>
    </div>
    <hr>
    <div>
      <b-button variant="success" @click="changeArray1(2)" class="my-1">change Array1
      </b-button>
      <div>Array[index] = valueを使用、firstChildエレメントをcomputed内で指定している</div>
    </div>
    <div>
      <b-button variant="success" @click="changeArray2(2)" class="my-1">change Array2
      </b-button>
      <div>Array.splice(index, 1, value)を使用、firstChildエレメントをcomputed内で指定している</div>
    </div>
    <div>
      <b-button variant="success" @click="changeArray3(2)" class="my-1">change Array3
      </b-button>
      <div>Array.splice(index, 1, value)を使用、secondChildエレメントをcomputed内で指定していない</div>
    </div>
    <hr>
    <div>
      <b-button variant="success" @click="changeObject1(1)" class="my-1">change Object1
      </b-button>
      <div>親要素（parent1）を変更。parent1をcomputed内で指定していない</div>
    </div>
    <div>
      <b-button variant="success" @click="changeObject2(1)" class="my-1">change Object2
      </b-button>
      <div>親要素（parent2）を変更。parent2をcomputed内で指定している</div>
    </div>
    <hr>
  </b-container>
</template>

<script>
import testComputed from "@/components/atoms/testComputed";

export default {
  components: {
    testComputed
  },
  data() {
    return {
      myArray: {
        parent1: 0,
        parent2: 0,
        child:{
          firstChild: [0, 1, 2, 3, 4],
          secondChild: [0, 1, 2, 3, 4],
        }
    },
      myArraySize: 5,
    }
  },
  methods: {
    changeArray1(val) {
      const dat = this.myArray.child.firstChild[val]
      this.myArray.child.firstChild[val] = dat + 1
      console.log(this.myArray)
    },
    changeArray2(val) {
      const dat = this.myArray.child.firstChild[val]
      this.myArray.child.firstChild.splice(val, 1, dat + 1)
      console.log(this.myArray)
    },
    changeArray3(val) {
      const dat = this.myArray.child.firstChild[val]
      this.myArray.child.secondChild.splice(val, 1, dat + 1)
      console.log(this.myArray)
    },
    changeObject1(val) {
      const dat = this.myArray.parent1
      this.myArray.parent1 = dat + val
      console.log(this.myArray)
    },
    changeObject2(val) {
      const dat = this.myArray.parent2
      this.myArray.parent2 = dat + val
      console.log(this.myArray)
    },
    reset() {
      this.myArray.child.firstChild.splice(0)
      this.myArray.child.secondChild.splice(0)
      for (let i = 0; i < this.myArraySize; i++) {
        this.myArray.child.firstChild.push(i)
        this.myArray.child.secondChild.push(i)
      }
      this.myArray.parent1 = 0
      this.myArray.parent2 = 0
    }
  }
}

</script>
