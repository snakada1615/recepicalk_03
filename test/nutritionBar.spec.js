import {mount, createLocalVue, createWrapper} from '@vue/test-utils';
import {afterEach, describe, expect, it} from "@jest/globals";
import nutritionBar from '@/components/organisms/nutritionBar.vue'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue)

describe('nutritionBar', () => {
  it("nutritionBar", async () => {
    const wrapper = mount(nutritionBar, {
      localVue
    })

    expect(wrapper.exists()).toBe(true)

  })
})


