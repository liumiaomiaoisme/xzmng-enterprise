import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '@/util/axios'
import QuillEditor from 'vue-quill-editor'
import '@/assets/base.css'
// import { throttle } from '@/util/utils.js'

Vue.use(ElementUI)
Vue.use(QuillEditor)

Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
