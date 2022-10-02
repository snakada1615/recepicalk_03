export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'IFNA nutrition App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // style for loading screen
  loadingIndicator: {
    name: 'circle',
    color: '#9b3470',
    background: 'white'
  },


  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/app.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '@/plugins/helper'},
    {src: '@/plugins/firebasePlugin'}
  ],

  //
  router: {
    middleware: 'login'
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    ['bootstrap-vue/nuxt', {
      // Add the desired icon components to the `components` array
      css: false,
      components: [
        'BIcon',
        'BIconReception0',
        'BIconReception4',
        'BIconCaretDownSquare',
        'BIconCheckCircleFill',
        'BIconPersonCircle',
        'BIconHouseFill',
        'BIconExclamationCircleFill',
        'BIconCheck',
        'BIconPeopleFill',
        'BIconX',
        'BIconEnvelope',
        'BIconFacebook',
        'BIconTwitter',
        'BIconGoogle',
        'BIconChatDotsFill',
        'BIconBookmarkCheck',
        'BIconEye',
        'BIconEyeSlash',
        'BIconTrash',
        'BIconTrashFill',
        'BIconPencilSquare',
      ],
      componentPlugins: [
        'NavbarPlugin',
        'LayoutPlugin',
        'BadgePlugin',
        'ButtonPlugin',
        'ModalPlugin',
        'PaginationPlugin',
        'TabsPlugin',
        'CarouselPlugin',
        'CardPlugin',
        'ToastPlugin',
        'TablePlugin',
        'TooltipPlugin',
        'InputGroupPlugin',
        'FormPlugin',
        'FormGroupPlugin',
        'FormInputPlugin',
        'FormFilePlugin',
        'FormSelectPlugin',
        'FormCheckboxPlugin',
        'FormRadioPlugin',
        'FormTextareaPlugin',
        'ListGroupPlugin',
        'DropdownPlugin',
        'ImagePlugin',
        'ProgressPlugin',
        'OverlayPlugin'
      ],
    }],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
