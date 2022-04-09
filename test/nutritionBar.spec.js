import {mount, createLocalVue} from '@vue/test-utils';
import { describe, expect, it} from "@jest/globals";
import nutritionBar from '@/components/molecules/nutritionBar.vue'
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


