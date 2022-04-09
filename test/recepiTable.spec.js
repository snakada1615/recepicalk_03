import {mount, createLocalVue} from '@vue/test-utils';
import { describe, expect, it} from "@jest/globals";
import recepiTable from '@/components/molecules/recepiTable.vue'
import {BootstrapVue, BIconX, BIcon} from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue)
localVue.component('BIcon', BIcon)
localVue.component('BIconX', BIconX)

let crops=[
  {id:"1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"},
  {id:"2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"}
]

let newItem = {
  id:"3", Group: "veggie", Name: "Yasai", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"
}


describe('recepiTable', () => {
  it("recepiTable", async () => {
    const wrapper = mount(recepiTable, {
      localVue,
      propsData:{
        items: crops
      }
    })
    let myRows = wrapper.findAll('table tbody tr')
    let myCols = myRows.at(0).findAll('td')

    //初期値の表示を確認
    expect(wrapper.exists()).toBe(true);
    expect(myCols.at(2).text()).toBe('taro')

    //作物を追加
    crops.push(newItem)
    const newCrop = [...crops]

    wrapper.setProps({items: newCrop})
    await wrapper.vm.$nextTick()

    //表示の変更を確認
    myRows = wrapper.findAll('table tbody tr')
    myCols = myRows.at(2).findAll('td')
    expect(myCols.at(2).text()).toBe('Yasai')

    //作物を削除
    let myButton = myRows.at(2).findAll('td button')
    expect(myButton.exists()).toBe(true)
    myButton.trigger('click')
    await wrapper.vm.$nextTick()

    //作物リストの更新をemit
    expect(wrapper.emitted('update:items')[0][0].length).toBe(2)

  })
})


