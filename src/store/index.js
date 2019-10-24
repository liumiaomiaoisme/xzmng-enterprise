import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/util/axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    title: '',
    username: '',
    loading: false,
    // 项目列表
    projectListTableData: [],
    projectListTotalCount: 0,
    projectListPageSize: 8,
    // 项目列表弹框
    addDialogVisible: false,
    editDialogVisible: false,
    staffList: [],
    groupType: [],
    projectStageType: []
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
    },
    getUserInfo (state, data) {
      state.username = data
    },
    getFormatTime (state, data) {
      let newTime = new Date(data)
      let y = newTime.getFullYear()
      let mo = (newTime.getMonth() + 1).toString().padStart(2, '0')
      let d = newTime.getDate().toString().padStart(2, '0')
      let h = newTime.getHours().toString().padStart(2, '0')
      let mi = newTime.getMinutes().toString().padStart(2, '0')
      let s = newTime.getSeconds().toString().padStart(2, '0')
      return `${y}-${mo}-${d} ${h}:${mi}:${s}`
    },
    // 获取技术部所有员工
    getAllMember (state) {
      axios.fetchGet('api/emp/tecEmp')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.staffList = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取项目组类型
    getGroupType (state) {
      axios.fetchGet('api/group/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.groupType = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取项目阶段类型
    getProjectStageType (state) {
      axios.fetchGet('/api/stage/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectStageType = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 项目列表 请求
    getProjectList (state, data) {
      state.loading = true
      axios.fetchGet('/api/project/lists', {
        currentPage: data.currentPage,
        pageSize: state.projectListPageSize
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectListTableData = res.data.content.list
            state.loading = false
            state.projectListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchProjectList (state, data) {
      state.loading = true
      let form = data
      form.pageSize = state.projectListPageSize
      form.currentPage = 1
      axios.fetchGet('/api/project/lists', form)
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectListTableData = res.data.content.list
            state.loading = false
            state.projectListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 项目列表弹框
    openAddDialog (state) {
      console.log(1)
      state.addDialogVisible = true
    },
    closeAddDialog (state) {
      state.addDialogVisible = false
    }
  }
})
