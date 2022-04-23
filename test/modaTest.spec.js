import modalTest from '@/components/molecules/modaltest.vue'
import { mount, createLocalVue} from '@vue/test-utils';
import {describe, expect, it} from "@jest/globals";
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

const wrapper = mount(modalTest, {
  localVue,
  propsData: {
    show:false
  }
});

describe('modalTest', () =>{
  it("modalTest", async()=>{
    const modalWrapper = wrapper.findComponent({ name: 'BModal' });

    //表示されていないことを確認
    expect(modalWrapper.exists()).toBe(true)
    expect(modalWrapper.props('visible')).toBe(false)
    let modalShow = modalWrapper.emitted('show')
    let modalHide = modalWrapper.emitted('hide')
    expect(modalShow).toBe(undefined)
    expect(modalHide).toBe(undefined)

    //modal表示をトリガー
    await wrapper.setProps({show: true})

    //表示されていることを確認
    expect(modalWrapper.props('visible')).toBe(true)
    modalShow = modalWrapper.emitted('show')
    expect(modalShow).toBeTruthy()
    expect(modalShow.length).toBe(1)

    //Cancelボタンを押す
    const modalCancel = modalWrapper.findAllComponents('.btn').at(1)
    await modalCancel.trigger('click')

    //表示されていないことを確認
    modalHide = modalWrapper.emitted('hide')
    expect(modalHide).toBeTruthy()
    expect(modalHide.length).toBe(1)
    expect(modalWrapper.props('visible')).toBe(false)

  })
})
