<template>
  <b-container>
    <header
      class="sticky-top"
    >
      <b-card>
        <test-computed
          :my-dat=myArray
        ></test-computed>
      </b-card>
      <b-card>
        <div>nested ObjectやArrayはcomputed propertyで補足できない場合がある</div>
        <ol>
          <li>array[index]=valueを用いた値変更の場合</li>
          <li>監視対象のエレメントをcomputedの式に含めていない場合</li>
          <li>Objectに新規要素を追加した場合:Object.newKey = newValue</li>
          <li>Objectに追加した新規要素:this.$set(Object, newKey, newValue)</li>
        </ol>
        <div>これらに対応するため以下に留意</div>
        <ol>
          <li>Array.splice()の利用 </li>
          <li>Object.Assign()の利用 </li>
          <li>Object全体でなく監視対象のelementを記載</li>
        </ol>
      </b-card>
    </header>
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
    <div>
      <b-button variant="success" @click="changeArray4()" class="my-1">change Array4
      </b-button>
      <div>Array.map()を使用、firstChildエレメントをcomputed内で指定している</div>
    </div>
    <div>
      <b-button variant="success" @click="changeArray5()" class="my-1">change Array5
      </b-button>
      <div>別のArrayを丸ごと代入、firstChildエレメントをcomputed内で指定している</div>
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
    <div>
      <b-button variant="success" @click="changeObject3(1)" class="my-1">change Object3
      </b-button>
      <div>新しい要素（parent3）を追加。: Object.newKey = 'neValue'</div>
    </div>
    <div>
      <b-button variant="success" @click="changeObject4()" class="my-1">change Object4
      </b-button>
      <div>新しい要素（parent4）を追加。: this.$set(Object, 'newKey', newValue)</div>
    </div>
    <div>
      <b-button variant="success" @click="changeObject5()" class="my-1">change Object5
      </b-button>
      <div>新しい要素（parent5）を追加。: Object.assign({}, Object, {'key': newValue})</div>
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
        child: {
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
    changeArray4() {
      this.myArray.child.firstChild = this.myArray.child.firstChild.map(function (item, index) {
        return index === 2 ? item + 1 : item
      })
      console.log(this.myArray)
    },
    changeArray5() {
      this.myArray.child.firstChild = [11, 22, 33, 44, 55, 66, 77, 88, 99, 100]
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
    changeObject3(val) {
      const dat = this.myArray.parent2
      this.myArray.parent3 = dat + val
      console.log(this.myArray)
    },
    changeObject4() {
      if (Object.keys(this.myArray).indexOf('parent4')>0){
        this.myArray.parent4 += 1
      } else {
        this.$set(this.myArray, 'parent4', 0)
      }
      console.log(this.myArray)
    },
    changeObject5() {
      if (Object.keys(this.myArray).indexOf('parent5')>0){
        this.myArray = Object.assign({}, this.myArray, {parent5: this.myArray.parent5 +1})
      } else {
        this.myArray = Object.assign({}, this.myArray, {parent5: 0})
      }
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
      this.$delete(this.myArray, 'parent3')
      this.$delete(this.myArray, 'parent4')
    }
  }
}

</script>
