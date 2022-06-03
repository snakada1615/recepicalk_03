import { mount, createLocalVue } from '@vue/test-utils';
import {afterEach, describe, expect, it} from "@jest/globals";
import driSelectAll from '@/components/organisms/driSelectAll.vue'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('driSelectAll',  () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  wrapper = mount(driSelectAll,{
    localVue,
    propsData:{
      driPopulations: [
        {id: 1, count: 1},
        {id: 2, count: 0},
        {id: 3, count: 2}
      ],
      targetSwitch: false,
      driItems: [
        {
          En: "1088.0",
          Fe: "5.8",
          max_vol: "900",
          Name: "child 6-23 month",
          Pr: "11.65",
          Va: "400.0",
          id: 1
        },
        {
          En: "3066.0",
          Fe: "44.4",
          max_vol: "2500",
          Name: "lactating",
          Pr: "61.0",
          Va: "850.0",
          id: 2
        },
        {
          En: "2913.0",
          Fe: "24.9",
          max_vol: "2600",
          Name: "adolescent all",
          Pr: "52.65",
          Va: "600.0",
          id: 3
        }
      ]
    }
  })


  it('driSelectAllの切り替え確認', async() => {

    // wrapperが存在する
    expect(wrapper.exists()).toBe(true)

    // targetSwitchの初期値確認
    expect(wrapper.findComponent({name: 'BFormCheckbox'}).props().checked).toBe(false)

    // driSelectSingle/Multiの表示確認
    expect(wrapper.findComponent('.single').exists()).toBe(false)
    expect(wrapper.findComponent('.multi').exists()).toBe(true)
    expect(wrapper.emitted('changeNutritionValue')[0]).toEqual(
      [
        { En: 6914, Pr: 116.95, Va: 1600, Fe: 55.599999999999994 }
      ]
    )

    // targetSwitchの値変更
    await wrapper.setProps({targetSwitch: true})

    // driSelectSingle/Multiの表示確認
    expect(wrapper.findComponent('.single').exists()).toBe(true)
    expect(wrapper.findComponent('.multi').exists()).toBe(false)

    //driSelectSingleでリストの3番目を選択
    const select = wrapper.findComponent('.jest_select')
    select.findAllComponents('option').at(3).element.selected = true
    await select.trigger('change')

    //選択後のemitでtargetの変化を確認
    //初期値は{ id: 1, count: 1 }, { id: 2, count: 0 }, { id: 3, count: 2 }
    expect(wrapper.emitted('update:target')[0][0]).toEqual(
      [
        { id: 1, count: 0 }, { id: 2, count: 0 }, { id: 3, count: 1 }
      ]
    )
  })
})
