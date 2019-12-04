import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router' // 只写目录会自动找到目录中的index文件
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '@/util/axios'
import throttle from '@/util/throttle'
import formatTime from '@/util/formatTime'
import QuillEditor from 'vue-quill-editor'
import '@/assets/base.css'

Vue.use(ElementUI)
Vue.use(QuillEditor)

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$throttle = throttle
Vue.prototype.$formatTime = formatTime

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
