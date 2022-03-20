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
      driPopulations: [{id: 1, count: 8}],
      targetSwitch: false,
      driItems: [
        {
          En: "1088.0",
          Fe: "5.8",
          max_vol: "900",
          Name: "child 6-23 month",
          Pr: "11.65",
          Va: "400.0",
          id: 0
        },
        {
          En: "3066.0",
          Fe: "44.4",
          max_vol: "2500",
          Name: "lactating",
          Pr: "61.0",
          Va: "850.0",
          id: 1
        },
        {
          En: "2913.0",
          Fe: "24.9",
          max_vol: "2600",
          Name: "adolescent all",
          Pr: "52.65",
          Va: "600.0",
          id: 2
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

    // targetSwitchの値変更
    await wrapper.setProps({targetSwitch: true})

    // driSelectSingle/Multiの表示確認
    expect(wrapper.findComponent('.single').exists()).toBe(true)
    expect(wrapper.findComponent('.multi').exists()).toBe(false)

  })
})
