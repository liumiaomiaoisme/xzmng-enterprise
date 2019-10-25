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
    projectStageType: [],
    editProjectFormData: {}
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
    deleteProject (state, data) {
      axios.fetchPost('/api/project/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getProjectList', {
              currentPage: 1
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteMultipleProject (state, data) {
      console.log(data)
      axios.fetchPost('api/project/batchDelete/', {
        ids: data
      })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.commit('getProjectList', {
              currentPage: 1
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 项目列表弹框
    openAddDialog (state) {
      state.addDialogVisible = true
    },
    closeAddDialog (state) {
      state.addDialogVisible = false
    },
    openEditDialog (state, data) {
      axios.fetchGet('/api/project/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            let tmpForm = res.data.content[0]
            console.log(tmpForm.tecProjectPrincipal)
            if (tmpForm.tecProjectPrincipal) {
              tmpForm.tecProjectPrincipal = parseInt(tmpForm.tecProjectPrincipal)
            }
            if (tmpForm.empId) {
              tmpForm.empId = tmpForm.empId.split(',').map(Number)
            }
            if (tmpForm.stageType) {
              for (let i of state.projectStageType) {
                if (i.stageType === tmpForm.stageType) {
                  tmpForm.tecProjectStage = i.id
                }
              }
            }
            if (tmpForm.tecProjectStatus) {
              switch (tmpForm.tecProjectStatus) {
                case 0:
                  tmpForm.tecProjectStatus = '未开始'
                  break
                case 1:
                  tmpForm.tecProjectStatus = '进行中'
                  break
                case 2:
                  tmpForm.tecProjectStatus = '已结束'
                  break
              }
            }
            if (tmpForm.tecProjectStartDate) {
              tmpForm.tecProjectStartDate = new Date(tmpForm.tecProjectStartDate)
            }
            if (tmpForm.tecProjectPublishDate) {
              tmpForm.tecProjectPublishDate = new Date(tmpForm.tecProjectPublishDate)
            }
            if (tmpForm.tecProjectEstimatedEndDate) {
              tmpForm.tecProjectEstimatedEndDate = new Date(tmpForm.tecProjectEstimatedEndDate)
            }
            state.editProjectFormData = tmpForm
            state.editDialogVisible = true
          }
        })
    },
    closeEditDialog (state) {
      state.editDialogVisible = false
    }
  }
})
