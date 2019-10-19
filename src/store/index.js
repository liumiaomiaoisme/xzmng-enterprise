import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    title: ''
  },
  mutations: {
    login (state, data) {
      localStorage.setItem('token', data)
      state.token = data
    },
    // 退出登录将, token清空
    logout (state) {
      localStorage.removeItem('token')
      state.token = ''
    }
  }
})

// 采用这种方法后 Vue.use(Vuex) 需要放在引入此文件的文件下
// export default () => {
//   return new Vuex.Store({
//     state: {

//     },
//     mutations: {

//     }
//   })
// }
