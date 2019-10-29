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
    // 技术部员工列表
    staffList: [],
    groupType: [],
    projectStageType: [],
    editProjectFormData: {},
    // 产品列表
    productListTableData: [],
    productListTotalCount: 0,
    productListPageSize: 10,
    // date Tmp
    dateTmp: '',
    // 产品添加编辑
    addProductVisible: false,
    editProductVisible: false,
    // 产品审核人
    ProductReviewerList: [],
    ProductTypeList: [],
    editProductForm: {},
    // 知识分享
    addShareVisible: false,
    editShareVisible: false,
    shareListData: [],
    shareTypeDate: [],
    editShareForm: {},
    shareListTotalCount: 0,
    shareListPageSize: 10,
    // 项目阶段
    projectPhaseList: [],
    projectPhaseListPageSize: 10,
    projectPhaseListTotalCount: 0,
    addProjectPhaseVisible: false,
    editProjectPhaseVisible: false,
    editProjectPhaseForm: {},
    // 项目阶段项目列表
    projectsList: []
  },
  mutations: {
    // 项目阶段
    deleteMultipleProjectPhase (state, data) {
      axios.fetchPost('/api/stage/batchDelete', {
        ids: data
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getProjectPhaseList', {
              currentPage: 1
            })
          }
        })
    },
    deleteProjectPhase (state, data) {
      axios.fetchPost('/api/stage/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getProjectPhaseList', {
              currentPage: 1
            })
          }
        })
    },
    getProjectsList (state) {
      axios.fetchGet('/api/stage/projects')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectsList = res.data.content
          }
        })
    },
    openAddProjectPhase (state) {
      state.addProjectPhaseVisible = true
    },
    closeAddProjectPhase (state) {
      state.addProjectPhaseVisible = false
    },
    openEditProjectPhase (state, data) {
      this.commit('getProjectsList')
      axios.fetchGet('/api/stage/list/' + data)
        .then(res => {
          state.editProjectPhaseForm = res.data.content[0]
          if (state.editProjectPhaseForm.tecStageReceiveDate) {
            this.commit('getFormatTime', state.editProjectPhaseForm.tecStageReceiveDate)
            state.editProjectPhaseForm.tecStageReceiveDate = state.dateTmp
          }
        })
      state.editProjectPhaseVisible = true
    },
    closeEditProjectPhase (state) {
      state.editProjectPhaseVisible = false
    },
    getProjectPhaseList (state, data) {
      state.loading = true
      axios.fetchGet('/api/stage/lists', {
        currentPage: data.currentPage,
        PageSize: state.projectPhaseListPageSize
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectPhaseList = res.data.content.list
            for (let i of state.projectPhaseList) {
              if (i.tecStageReceiveDate) {
                this.commit('getFormatTime', i.tecStageReceiveDate)
                i.tecStageReceiveDate = state.dateTmp
              }
              if (i.tecProjectEstimatedEnd) {
                this.commit('getFormatTime', i.tecProjectEstimatedEnd)
                i.tecProjectEstimatedEnd = state.dateTmp
              }
              if (i.tecStageStatus !== undefined) {
                if (i.tecStageStatus === 0) {
                  i.tecStageStatus = '未完成'
                } else if (i.tecStageStatus === 1) {
                  i.tecStageStatus = '进行中'
                } else if (i.tecStageStatus === 2) {
                  i.tecStageStatus = '已完成'
                }
              }
              if (i.tecStageTestStatus !== undefined) {
                if (i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                } else if (i.tecStageTestStatus === 1) {
                  i.tecStageTestStatus = '通过'
                } else if (i.tecStageTestStatus === 2) {
                  i.tecStageTestStatus = '有bug'
                }
              }
            }
            state.loading = false
            state.projectPhaseListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchProjectPhase (state, data) {
      data.currentPage = 1
      data.pageSize = state.projectPhaseListPageSize
      state.editShareVisible = true
      axios.fetchGet('/api/stage/lists', data)
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectPhaseList = res.data.content.list
            for (let i of state.projectPhaseList) {
              if (i.tecStageReceiveDate) {
                this.commit('getFormatTime', i.tecStageReceiveDate)
                i.tecStageReceiveDate = state.dateTmp
              }
              if (i.tecProjectEstimatedEnd) {
                this.commit('getFormatTime', i.tecProjectEstimatedEnd)
                i.tecProjectEstimatedEnd = state.dateTmp
              }
              if (i.tecStageStatus !== undefined) {
                if (i.tecStageStatus === 0) {
                  i.tecStageStatus = '未完成'
                } else if (i.tecStageStatus === 1) {
                  i.tecStageStatus = '进行中'
                } else if (i.tecStageStatus === 2) {
                  i.tecStageStatus = '已完成'
                }
              }
              if (i.tecStageTestStatus !== undefined) {
                if (i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                } else if (i.tecStageTestStatus === 1) {
                  i.tecStageTestStatus = '通过'
                } else if (i.tecStageTestStatus === 2) {
                  i.tecStageTestStatus = '有bug'
                }
              }
            }
            state.loading = false
            state.projectPhaseListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索起止时间格式化
    dateKeyClear (state, data) {
      if (data.mDate) {
        console.log(data.mDate)
        data.sDateStart = data.mDate[0]
        data.sDateEnd = data.mDate[1]
        delete data.mDate
        console.log(data.mDate)
      } else {
        delete data.sDateStart
        delete data.sDateEnd
      }
    },
    // 知识分享
    openEditShare (state, data) {
      state.editShareVisible = true
      axios.fetchGet('/api/share/list/' + data)
        .then(res => {
          console.log(res)
          state.editShareForm = res.data.content[0]
        })
    },
    closeEditShare (state) {
      state.editShareVisible = false
    },
    openAddShare (state) {
      state.addShareVisible = true
    },
    closeAddShare (state) {
      state.addShareVisible = false
    },
    getShareList (state, data) {
      state.loading = true
      axios.fetchGet('/api/share/lists', {
        currentPage: data.currentPage,
        pageSize: state.shareListPageSize
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            state.shareListData = res.data.content.list
            for (let i of state.shareListData) {
              if (i.tecShareCreateDate) {
                this.commit('getFormatTime', i.tecShareCreateDate)
                i.tecShareCreateDate = state.dateTmp
              }
              if (i.tecShareStatus === 0) {
                i.tecShareStatus = '草稿'
              } else {
                i.tecShareStatus = '发布'
              }
            }
            state.loading = false
            state.shareListTotalCount = res.data.content.totalCount
          }
        })
    },
    searchShare (state, data) {
      axios.fetchGet('/api/share/lists', data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.shareListData = res.data.content.list
            for (let i of state.shareListData) {
              if (i.tecShareCreateDate) {
                this.commit('getFormatTime', i.tecShareCreateDate)
                i.tecShareCreateDate = state.dateTmp
              }
              if (i.tecShareStatus === 0) {
                i.tecShareStatus = '草稿'
              } else {
                i.tecShareStatus = '发布'
              }
            }
          }
        })
    },
    deleteShare (state, data) {
      axios.fetchPost('/api/share/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getShareList', {
              currentPage: data.currentPage
            })
          }
        })
    },
    getShareType (state) {
      axios.fetchGet('/api/share/types')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.shareTypeDate = res.data.content
          }
        })
    },
    // 登录token
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
      state.dateTmp = `${y}-${mo}-${d} ${h}:${mi}:${s}`
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
    // 搜索项目列表
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
    },
    // 产品列表 请求
    getProductList (state, data) {
      state.loading = true
      axios.fetchGet('/api/product/lists', {
        currentPage: data.currentPage,
        pageSize: state.productListPageSize
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            state.productListTableData = res.data.content.list
            for (let i of state.productListTableData) {
              if (i.tecProductCheckType !== 'undefined') {
                switch (i.tecProductCheckType) {
                  case 0:
                    i.tecProductCheckType = '未审核'
                    break
                  case 1:
                    i.tecProductCheckType = '已审核'
                    break
                  case 2:
                    i.tecProductCheckType = '驳回'
                    break
                }
              }
              if (i.tecProductCreateDate) {
                this.commit('getFormatTime', i.tecProductCreateDate)
                i.tecProductCreateDate = state.dateTmp
              }
              if (i.tecProductCheckDate) {
                this.commit('getFormatTime', i.tecProductCheckDate)
                i.tecProductCheckDate = state.dateTmp
              }
              if (i.tecProductPublishDate) {
                this.commit('getFormatTime', i.tecProductPublishDate)
                i.tecProductPublishDate = state.dateTmp
              }
            }
            state.loading = false
            state.productListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 产品审核人 列表
    getReviewer (state, data) {
      axios.fetchGet('/api/emp/reviewer')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.ProductReviewerList = res.data.content
          }
        })
    },
    // 产品类型
    getProductType (state, data) {
      axios.fetchGet('/api/product/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.ProductTypeList = res.data.content
          }
        })
    },
    // 产品列表弹框
    openAddProduct (state) {
      Promise.all([this.commit('getAllMember'), this.commit('getReviewer'), this.commit('getProductType')])
        .then(res => {
          state.addProductVisible = true
        })
    },
    closeProductDialog (state) {
      state.addProductVisible = false
    },
    openEditProduct (state, data) {
      axios.fetchGet('/api/product/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            let tmpForm = res.data.content[0]
            if (tmpForm.tecProjectPrincipal) {
              tmpForm.tecProjectPrincipal = parseInt(tmpForm.tecProjectPrincipal)
            }
            if (tmpForm.uiId) {
              tmpForm.ui = tmpForm.uiId.split(',').map(Number)
            }
            if (tmpForm.devId) {
              tmpForm.dev = tmpForm.devId.split(',').map(Number)
            }
            if (tmpForm.testId) {
              tmpForm.test = tmpForm.testId.split(',').map(Number)
            }
            if (tmpForm.tecProductPublishDate) {
              this.commit('getFormatTime', tmpForm.tecProductPublishDate)
              tmpForm.tecProductPublishDate = state.dateTmp
            }
            state.editProductForm = tmpForm
            Promise.all([this.commit('getAllMember'), this.commit('getReviewer'), this.commit('getProductType')])
              .then(res => {
                state.editProductVisible = true
              })
          }
        })
    },
    closeEditProduct (state) {
      state.editProductVisible = false
    },
    deleteProduct (state, data) {
      axios.fetchPost('/api/product/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getProductList', {
              currentPage: 1
            })
          }
        })
    },
    searchProduct (state, data) {
      data.currentPage = 1
      data.pageSize = state.productListPageSize
      state.loading = true
      axios.fetchGet('/api/product/lists', data)
        .then(res => {
          if (res.data.statuscode === 400 && res.data.msg === '没有任何产品的信息，请稍后重试') {
            state.productListTableData = []
          }
          if (res.data.statuscode === 200) {
            state.productListTableData = res.data.content.list
            for (let i of state.productListTableData) {
              if (i.tecProductCheckType !== 'undefined') {
                switch (i.tecProductCheckType) {
                  case 0:
                    console.log(i.tecProductCheckType)
                    i.tecProductCheckType = '未审核'
                    break
                  case 1:
                    i.tecProductCheckType = '已审核'
                    break
                  case 2:
                    i.tecProductCheckType = '驳回'
                    break
                }
              }
              if (i.tecProductCreateDate) {
                this.commit('getFormatTime', i.tecProductCreateDate)
                i.tecProductCreateDate = state.dateTmp
              }
              if (i.tecProductCheckDate) {
                this.commit('getFormatTime', i.tecProductCheckDate)
                i.tecProductCheckDate = state.dateTmp
              }
              if (i.tecProductPublishDate) {
                this.commit('getFormatTime', i.tecProductPublishDate)
                i.tecProductPublishDate = state.dateTmp
              }
            }
          }
          state.loading = false
          state.productListTotalCount = res.data.content.totalCount
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
