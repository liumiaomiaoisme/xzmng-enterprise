import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/util/axios'
import { MessageBox, Message } from 'element-ui'
Vue.use(Vuex)
let $confirm = MessageBox.confirm

export default new Vuex.Store({
  state: {
    user: {},
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userName: '',
    depName: '',
    posName: '',
    userId: null,
    loading: false,
    userGroup: [],
    userGroupSelect: [],
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
    checkProductVisible: false,
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
    testProjectPhaseVisible: false,
    editProjectPhaseForm: {},
    testProjectPhaseForm: {},
    // 项目阶段项目列表
    projectsList: [],
    // 会议列表
    meetingTableData: [],
    meetingPageSize: 10,
    meetingTotalCount: null,
    addMeetingVisible: false,
    editMeetingVisible: false,
    editMeetingForm: {},
    editEndMeetingVisible: false,
    // 需求列表
    requirementListTableData: [],
    requirementTotalCount: 0,
    requirementPageSize: 10,
    requirementCurrentPage: 1,
    addRequirementVisible: false,
    editRequirementVisible: false,
    ModifyPerson: [],
    ModifyTeam: [],
    projectsForRequire: [],
    requireFormSubmitData: {
      tecDemandName: '',
      Modifier: '',
      tecDemandProjectId: '',
      tecDemandModifierPersonal: '',
      tecDemandModifierGroup: '',
      tecDemandEmergencyLevel: '',
      tecDemandExpectedRepairDate: '',
      tecDemandAnnex: ''
    },
    isResouceGet: 0,
    feedbackVisible: false,
    checkName: '',
    receiveRequireVisible: false,
    // 销售需求
    SalesDemandData: [],
    SalesDemandTotalcount: 0,
    editDemandVisible: false,
    editDemandForm: [],
    overDemandvisible: false
  },
  mutations: {
    // 销售需求
    openEditDemand (state, data) {
      axios.fetchGet('/api/market_demand/list/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.editDemandForm = res.data.content
            state.editDemandVisible = true
          }
        })
    },
    closeEditDemand (state) {
      state.editDemandVisible = false
    },
    searchDemand (state, data) {
      state.loading = true
      let receiveList
      axios.fetchGet('/api/market_demand/checkReceive')
        .then(res => {
          if (res.data.statuscode === 200) {
            receiveList = res.data.content
          }
          return axios.fetchGet('/api/market_demand/lists', data)
        })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.SalesDemandData = res.data.content.list
            state.SalesDemandTotalcount = res.data.content.totalCount
            state.SalesDemandData.forEach((item) => {
              item.receive = receiveList.indexOf(item.demandId) !== -1
              item.demandStatus = item.demandStatus === 0 ? '已提交技术部' : '未提交'
              item.demandSeverity = item.demandSeverity === 0 ? '严重' : '不严重'
              item.demandType = item.demandType === 0 ? '新需求' : '修改功能等'
              item.demandSource = item.demandSource === 0 ? '客户提的' : '本身bug'
              if (item.demandSuperiorReviewStatus === 0) {
                item.demandSuperiorReviewStatus = '未审批'
              } else if (item.demandSuperiorReviewStatus === 1) {
                item.demandSuperiorReviewStatus = '已审批'
              } else if (item.demandSuperiorReviewStatus === 2) {
                item.demandSuperiorReviewStatus = '已驳回'
              }
              item.init = true
              item.ing = false
              item.over = false
              item.reject = false
              if (item.demandFeedbackStatus === 0) {
                item.demandFeedbackStatus = '已完成'
                item.init = false
                item.over = true
              } else if (item.demandFeedbackStatus === 1) {
                item.demandFeedbackStatus = '进行中'
                item.init = false
                item.ing = true
              } else if (item.demandFeedbackStatus === 2) {
                item.demandFeedbackStatus = '未分配'
              } else if (item.demandFeedbackStatus === 3) {
                item.demandFeedbackStatus = '已驳回'
                item.init = false
                item.reject = true
              }
              if (item.demandFile) {
                item.fileList = item.demandFile.split(',')
                item.docList = []
                item.imgList = []
                item.fileList.forEach(itemImg => {
                  if (itemImg.indexOf('.doc') === -1) {
                    item.imgList.push(itemImg)
                  } else {
                    item.docList.push(itemImg)
                  }
                })
              }
              if (item.demandExpectedRepair) {
                item.demandExpectedRepair = item.demandExpectedRepair.substr(0, 10)
              }
              if (item.demandStartTime) {
                item.demandStartTime = item.demandStartTime.substr(0, 10)
              }
              if (item.demandSuperiorRevieweTime) {
                item.demandSuperiorRevieweTime = item.demandSuperiorRevieweTime.substr(0, 10)
              }
              if (item.demandFeedbackTime) {
                item.demandFeedbackTime = item.demandFeedbackTime.substr(0, 10)
              }
              if (item.demandSuperiorReviewTime) {
                item.demandSuperiorReviewTime = item.demandSuperiorReviewTime.substr(0, 10)
              }
            })
          }
          if (res.data.statuscode === 400 && res.data.msg === '没有任何需求的信息') {
            state.SalesDemandData = []
            state.SalesDemandTotalcount = 0
          }
          state.loading = false
        })
    },
    getSalesDemand (state, data) {
      state.loading = true
      let receiveList
      axios.fetchGet('/api/market_demand/checkReceive')
        .then(res => {
          if (res.data.statuscode === 200) {
            receiveList = res.data.content
          }
          return axios.fetchGet('/api/market_demand/lists', {
            currentPage: data.currentPage
          })
        })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.SalesDemandData = res.data.content.list
            state.SalesDemandTotalcount = res.data.content.totalCount
            state.SalesDemandData.forEach((item) => {
              item.receive = receiveList.indexOf(item.demandId) !== -1
              item.demandStatus = item.demandStatus === 0 ? '已提交技术部' : '未提交'
              item.demandSeverity = item.demandSeverity === 0 ? '严重' : '不严重'
              item.demandType = item.demandType === 0 ? '新需求' : '修改功能等'
              item.demandSource = item.demandSource === 0 ? '客户提的' : '本身bug'
              if (item.demandSuperiorReviewStatus === 0) {
                item.demandSuperiorReviewStatus = '未审批'
              } else if (item.demandSuperiorReviewStatus === 1) {
                item.demandSuperiorReviewStatus = '已审批'
              } else if (item.demandSuperiorReviewStatus === 2) {
                item.demandSuperiorReviewStatus = '已驳回'
              }
              item.init = true
              item.ing = false
              item.over = false
              item.reject = false
              if (item.demandFeedbackStatus === 0) {
                item.demandFeedbackStatus = '已完成'
                item.init = false
                item.over = true
              } else if (item.demandFeedbackStatus === 1) {
                item.demandFeedbackStatus = '进行中'
                item.init = false
                item.ing = true
              } else if (item.demandFeedbackStatus === 2) {
                item.demandFeedbackStatus = '未分配'
              } else if (item.demandFeedbackStatus === 3) {
                item.demandFeedbackStatus = '已驳回'
                item.init = false
                item.reject = true
              }
              if (item.demandFile) {
                item.fileList = item.demandFile.split(',')
                item.docList = []
                item.imgList = []
                item.fileList.forEach(itemImg => {
                  if (itemImg.indexOf('.doc') === -1) {
                    item.imgList.push(itemImg)
                  } else {
                    item.docList.push(itemImg)
                  }
                })
              }
              if (item.demandExpectedRepair) {
                item.demandExpectedRepair = item.demandExpectedRepair.substr(0, 10)
              }
              if (item.demandStartTime) {
                item.demandStartTime = item.demandStartTime.substr(0, 10)
              }
              if (item.demandSuperiorRevieweTime) {
                item.demandSuperiorRevieweTime = item.demandSuperiorRevieweTime.substr(0, 10)
              }
              if (item.demandFeedbackTime) {
                item.demandFeedbackTime = item.demandFeedbackTime.substr(0, 10)
              }
              if (item.demandSuperiorReviewTime) {
                item.demandSuperiorReviewTime = item.demandSuperiorReviewTime.substr(0, 10)
              }
            })
          }
          if (res.data.statuscode === 400 && res.data.msg === '没有任何需求的信息') {
            state.SalesDemandData = []
            state.SalesDemandTotalcount = 0
          }
          state.loading = false
        })
    },
    // 需求列表
    openReceiveRequire (state, data) {
      axios.fetchGet('/api/demand/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            let tmpForm = res.data.content[0]
            state.requireFormSubmitData = tmpForm
            state.receiveRequireVisible = true
            state.isResouceGet++
          }
        })
    },
    closeReceiveRequire (state, data) {
      state.receiveRequireVisible = false
    },
    endRequirement (state, data) {
      axios.fetchGet('/api/demand/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            let tmpForm = res.data.content[0]
            state.requireFormSubmitData = tmpForm
            state.feedbackVisible = true
          }
        })
    },
    closeEndRequirement (state) {
      state.feedbackVisible = false
    },
    cancelRequirement (state, data) {
      axios.fetchPost('/api/demand/cancel', {
        tecDemandId: data
      })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.commit('getRequirementList', {
              currentPage: 1
            })
            Message({
              type: 'success',
              message: '需求已取消'
            })
          }
          if (res.data.statuscode === 400 && res.data.statuscode === '需求取消失败，请稍后重试！') {
            Message({
              type: 'success',
              message: '需求取消失败，请稍后重试！'
            })
          }
        })
    },
    searchRequirement (state, data) {
      state.loading = true
      axios.fetchGet('/api/demand/lists', data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.requirementListTableData = res.data.content.list
            state.requirementTotalCount = res.data.content.totalCount
            for (let i of state.requirementListTableData) {
              i.init = true
              i.ing = false
              i.over = false
              i.cancel = false
              if (i.tecDemandStatus === 0) {
                i.tecDemandStatus = '未领取'
              } else if (i.tecDemandStatus === 1) {
                i.init = false
                i.ing = true
                i.tecDemandStatus = '进行中'
              } else if (i.tecDemandStatus === 2) {
                i.init = false
                i.ing = false
                i.over = true
                i.tecDemandStatus = '已结束'
              } else if (i.tecDemandStatus === 3) {
                i.init = false
                i.ing = false
                i.over = false
                i.cancel = true
                i.tecDemandStatus = '已取消'
              }
              if (i.tecDemandCreateDate !== undefined || null) {
                this.commit('getFormatTime', i.tecDemandCreateDate)
                i.tecDemandCreateDate = state.dateTmp
              }
              if (i.tecDemandExpectedRepairDate !== undefined || null) {
                this.commit('getFormatTime', i.tecDemandExpectedRepairDate)
                i.tecDemandExpectedRepairDate = state.dateTmp
              }
              if (i.tecDemandEmergencyLevel !== undefined || null) {
                if (i.tecDemandEmergencyLevel === 0) {
                  i.tecDemandEmergencyLevel = '很紧急'
                } else if (i.tecDemandEmergencyLevel === 1) {
                  i.tecDemandEmergencyLevel = '不紧急'
                }
              }
              if (!i.tecDemandModifierPersonalName && !i.tecDemandModifierGroupName) {
                i.Modifier = ''
              } else if (!i.tecDemandModifierPersonalName) {
                i.Modifier = '修改组--' + i.tecDemandModifierGroupName
              } else {
                i.Modifier = '修改人--' + i.tecDemandModifierPersonalName
              }
              if (i.tecDemandAnnex) {
                i.fileList = i.tecDemandAnnex.split(',')
                i.docList = []
                i.imgList = []
                i.fileList.forEach(item => {
                  if (item.indexOf('.doc') === -1) {
                    i.imgList.push(item)
                  } else {
                    i.docList.push(item)
                  }
                })
              }
            }
          } else if (res.data.statuscode === 400 && res.data.msg === '没有任何需求的信息') {
            state.requirementListTableData = []
            state.requirementTotalCount = res.data.content.totalCount
          }
          state.loading = false
        })
    },
    deleteRequirement (state, data) {
      axios.fetchPost('/api/demand/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            Message({
              type: 'success',
              message: '删除需求成功'
            })
            this.commit('getRequirementList', {
              currentPage: 1
            })
          } else if (res.data.statuscode === 400 && res.data.msg === '删除需求失败，请稍后重试！') {
            Message({
              type: 'error',
              message: '删除需求失败，请稍后重试！'
            })
          }
        })
    },
    closeEditRequirement (state) {
      state.editRequirementVisible = false
    },
    openEditRequirement (state, data) {
      axios.fetchGet('/api/demand/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            let tmpForm = res.data.content[0]
            if (tmpForm.tecDemandModifierPersonal === undefined || null) {
              axios.fetchGet('/api/group/list/' + tmpForm.tecDemandModifierGroup)
                .then(res => {
                  let teamInfo = res.data.content[0]
                  tmpForm.Modifier = [1, teamInfo.groupTypeName, tmpForm.tecDemandModifierGroup]
                  state.isResouceGet++
                })
            } else {
              tmpForm.Modifier = [0, tmpForm.tecDemandModifierPersonal]
            }
            if (tmpForm.tecDemandExpectedRepairDate) {
              this.commit('getFormatTime', tmpForm.tecDemandExpectedRepairDate)
              tmpForm.tecDemandExpectedRepairDate = state.dateTmp
            }
            if (tmpForm.tecDemandAnnex) {
              tmpForm.fileList = tmpForm.tecDemandAnnex.split(',')
              tmpForm.getfileList = []
              tmpForm.fileList.forEach((item, i, arr) => {
                let tmp = {}
                tmp.name = '附件' + (i + 1)
                tmp.url = item
                tmpForm.getfileList.push(tmp)
              })
            }
            if (tmpForm.tecDemandEmergencyLevel !== undefined || null) {
              tmpForm.tecDemandEmergencyLevel = tmpForm.tecDemandEmergencyLevel === 0 ? '很紧急' : '不紧急'
            }
            state.requireFormSubmitData = tmpForm
            console.log(state.requireFormSubmitData)
            state.editRequirementVisible = true
          }
        })
    },
    getAllStaff (state) {
      state.ModifyPerson = []
      axios.fetchGet('api/emp/tecEmp')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.staffList = res.data.content
            state.staffList.forEach(item => {
              let obj = {
                value: null,
                label: ''
              }
              obj.value = item.empId
              obj.label = item.empName
              state.ModifyPerson.push(obj)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTeamOption (state) {
      state.ModifyTeam = []
      axios.fetchGet('/api/group/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            let teamType = res.data.content
            axios.fetchGet('/api/group/lists')
              .then(res => {
                let teamInfo = res.data.content.list
                let teamName = []
                teamInfo.forEach(item => {
                  let obj = {
                    name: '',
                    type: '',
                    id: null
                  }
                  obj.type = item.groupTypeName
                  obj.name = item.tecGroupName
                  obj.id = item.tecGroupId
                  teamName.push(obj)
                })
                teamType.forEach(item => {
                  for (let i of teamName) {
                    if (i.type === item.groupTypeName) {
                      let childrenList = []
                      let objChild = {
                        value: null,
                        label: ''
                      }
                      objChild.value = i.id
                      objChild.label = i.name
                      childrenList.push(objChild)
                      let obj = {
                        value: null,
                        label: '',
                        children: childrenList
                      }
                      obj.value = item.groupTypeName
                      obj.label = item.groupTypeName
                      state.ModifyTeam.push(obj)
                    }
                  }
                })
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getProjectsForRequire (state) {
      axios.fetchGet('/api/project/lists')
        .then(res => {
          if (res.data.statuscode === 200) {
            let allData = res.data.content.list
            for (let i of allData) {
              let obj = {
                name: '',
                id: null
              }
              obj.name = i.tecProjectName
              obj.id = i.tecProjectId
              state.projectsForRequire.push(obj)
            }
          }
        })
    },
    openAddRequirement (state) {
      state.addRequirementVisible = true
    },
    closeAddRequirement (state) {
      state.addRequirementVisible = false
    },
    receiveRequirement (state, data) {
      axios.fetchGet('/api/demand/receive', data)
    },
    getRequirementList (state, data) {
      state.loading = true
      axios.fetchGet('/api/demand/group')
        .then(res => {
          if (res.data.statuscode === 200) {
            state.userGroup = res.data.content
          }
          return axios.fetchGet('/api/demand/lists', {
            currentPage: data.currentPage,
            pageSize: state.requirementPageSize
          })
        })
        .then(res => {
          if (res.data.statuscode === 200) {
            state.requirementListTableData = res.data.content.list
            state.requirementTotalCount = res.data.content.totalCount
            console.log(state.requirementListTableData)
            for (let i of state.requirementListTableData) {
              i.init = true
              i.ing = false
              i.over = false
              i.cancel = false
              i.showFinish = false
              i.operate = false
              i.showCancle = false
              if (state.depName === '技术部') {
                i.operate = true
              }
              if (state.userId === i.tecDemandPromoter) {
                i.showCancle = true
              }
              if (i.tecDemandModifierGroup) {
                // 修改人id和登录用户id判断
                state.userGroup.forEach(item => {
                  if (item.tecGroupId === i.tecDemandModifierGroup) {
                    i.showFinish = true
                  }
                })
              } else if (i.tecDemandModifierPersonal) {
                // 修改人id和登录用户id判断
                if (state.userId === i.tecDemandModifierPersonal) {
                  i.showFinish = true
                }
              }
              if (i.tecDemandStatus === 0) {
                i.tecDemandStatus = '未领取'
              } else if (i.tecDemandStatus === 1) {
                i.init = false
                i.ing = true
                i.tecDemandStatus = '进行中'
              } else if (i.tecDemandStatus === 2) {
                i.init = false
                i.ing = false
                i.over = true
                i.tecDemandStatus = '已结束'
              } else if (i.tecDemandStatus === 3) {
                i.init = false
                i.ing = false
                i.over = false
                i.cancel = true
                i.tecDemandStatus = '已取消'
              }
              if (i.tecDemandCreateDate !== undefined || null) {
                this.commit('getFormatTime', i.tecDemandCreateDate)
                i.tecDemandCreateDate = state.dateTmp
              }
              if (i.tecDemandExpectedRepairDate !== undefined || null) {
                this.commit('getFormatTime', i.tecDemandExpectedRepairDate)
                i.tecDemandExpectedRepairDate = state.dateTmp
              }
              if (i.tecDemandEmergencyLevel !== undefined || null) {
                if (i.tecDemandEmergencyLevel === 0) {
                  i.tecDemandEmergencyLevel = '很紧急'
                } else if (i.tecDemandEmergencyLevel === 1) {
                  i.tecDemandEmergencyLevel = '不紧急'
                }
              }
              if (!i.tecDemandModifierPersonalName && !i.tecDemandModifierGroupName) {
                i.Modifier = ''
              } else if (!i.tecDemandModifierPersonalName) {
                i.Modifier = '修改组--' + i.tecDemandModifierGroupName
              } else {
                i.Modifier = '修改人--' + i.tecDemandModifierPersonalName
              }
              if (i.tecDemandAnnex) {
                i.fileList = i.tecDemandAnnex.split(',')
                i.docList = []
                i.imgList = []
                i.fileList.forEach(item => {
                  if (item.indexOf('.doc') === -1) {
                    i.imgList.push(item)
                  } else {
                    i.docList.push(item)
                  }
                })
              }
            }
          }
          if (res.data.statuscode === 400 && res.data.msg === '') {
            state.requirementListTableData = []
            state.requirementTotalCount = 0
          }
          state.loading = false
        })
    },
    // 会议列表
    editEndMeeting (state, data) {
      this.commit('getAllMember')
      axios.fetchGet('/api/meeting/list/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.editMeetingForm = res.data.content[0]
            if (state.editMeetingForm.empId) {
              state.editMeetingForm.empId = state.editMeetingForm.empId.split(',').map(Number)
            }
            state.editMeetingForm.tecMeetingSolveProblem = '已解决'
            if (state.editMeetingForm.tecMeetingStartDate) {
              this.commit('getFormatTime', state.editMeetingForm.tecMeetingStartDate)
              state.editMeetingForm.tecMeetingStartDate = state.dateTmp
            }
            if (state.editMeetingForm.tecMeetingEndDate) {
              this.commit('getFormatTime', state.editMeetingForm.tecMeetingEndDate)
              state.editMeetingForm.tecMeetingEndDate = state.dateTmp
            }
            state.editEndMeetingVisible = true
          }
        })
    },
    closeEditEndMeeting (state) {
      state.editEndMeetingVisible = false
    },
    overMeeting (state, data) {
      axios.fetchPost('/api/meeting/end/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getMeetingList', {
              currentPage: 1,
              pageSize: 10
            })
            Message({
              type: 'success',
              message: '会议已结束'
            })
          } else if (res.data.statuscode === 400 && res.data.msg === '更新会议状态，请稍后重试！') {
            this.commit('getMeetingList', {
              currentPage: 1,
              pageSize: 10
            })
            Message({
              type: 'error',
              message: '会议状态更新失败，请稍后重试！'
            })
          }
        })
    },
    startMeeting (state, data) {
      axios.fetchPost('/api/meeting/ing/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.commit('getMeetingList', {
              currentPage: 1,
              pageSize: 10
            })
            Message({
              type: 'success',
              message: '会议已开始'
            })
          } else if (res.data.statuscode === 400 && res.data.msg === '更新会议状态，请稍后重试！') {
            this.commit('getMeetingList', {
              currentPage: 1,
              pageSize: 10
            })
            Message({
              type: 'error',
              message: '会议状态更新失败，请稍后重试！'
            })
          }
        })
    },
    getMeetingList (state, data) {
      state.loading = true
      axios.fetchGet('/api/meeting/lists', {
        currentPage: data.currentPage,
        pageSize: state.meetingPageSize
      })
        .then(res => {
          if (res.data.statuscode === 200) {
            console.log(res)
            state.meetingTableData = res.data.content.list
            for (let i of state.meetingTableData) {
              i.resolve = false
              i.started = true
              i.isOver = false
              if (i.tecMeetingStartDate) {
                this.commit('getFormatTime', i.tecMeetingStartDate)
                i.tecMeetingStartDate = state.dateTmp.substr(0, 16)
              }
              if (i.tecMeetingEndDate) {
                this.commit('getFormatTime', i.tecMeetingEndDate)
                i.tecMeetingEndDate = state.dateTmp.substr(0, 16)
              }
              if (i.tecMeetingSolveProblem === 0) {
                i.tecMeetingSolveProblem = '未解决'
              } else if (i.tecMeetingSolveProblem === 1) {
                i.tecMeetingSolveProblem = '已解决'
                i.resolve = true
              }
              if (i.tecMeetingStatus === 0) {
                i.tecMeetingStatus = '未开始'
                i.started = false
              } else if (i.tecMeetingStatus === 1) {
                i.tecMeetingStatus = '进行中'
                i.started = true
              } else if (i.tecMeetingStatus === 2) {
                i.tecMeetingStatus = '已结束'
                i.started = true
                i.isOver = true
              }
            }
            state.loading = false
            state.meetingTotalCount = res.data.content.totalCount
          }
        })
    },
    searchMeeting (state, data) {
      data.currentPage = 1
      axios.fetchGet('/api/meeting/lists', data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.meetingTableData = res.data.content.list
            for (let i of state.meetingTableData) {
              i.resolve = false
              i.started = true
              i.isOver = false
              if (i.tecMeetingStartDate) {
                this.commit('getFormatTime', i.tecMeetingStartDate)
                i.tecMeetingStartDate = state.dateTmp.substr(0, 16)
              }
              if (i.tecMeetingEndDate) {
                this.commit('getFormatTime', i.tecMeetingEndDate)
                i.tecMeetingEndDate = state.dateTmp.substr(0, 16)
              }
              if (i.tecMeetingSolveProblem === 0) {
                i.tecMeetingSolveProblem = '未解决'
              } else if (i.tecMeetingSolveProblem === 1) {
                i.tecMeetingSolveProblem = '已解决'
                i.resolve = true
              }
              if (i.tecMeetingStatus === 0) {
                i.tecMeetingStatus = '未开始'
                i.started = false
              } else if (i.tecMeetingStatus === 1) {
                i.tecMeetingStatus = '进行中'
                i.started = true
              } else if (i.tecMeetingStatus === 2) {
                i.tecMeetingStatus = '已结束'
                i.started = true
                i.isOver = true
              }
            }
            state.loading = false
            state.meetingTotalCount = res.data.content.totalCount
          } else if (res.data.msg === '没有任何会议的信息') {
            state.meetingTableData = []
          }
        })
    },
    openAddMeetingDialog (state) {
      this.commit('getAllMember')
      state.addMeetingVisible = true
    },
    closeAddMeeting (state) {
      state.addMeetingVisible = false
    },
    openEditMeeting (state, data) {
      this.commit('getAllMember')
      axios.fetchGet('/api/meeting/list/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            console.log(res)
            state.editMeetingForm = res.data.content[0]
            if (state.editMeetingForm.empId) {
              state.editMeetingForm.empId = state.editMeetingForm.empId.split(',').map(Number)
            }
            if (state.editMeetingForm.tecMeetingStartDate) {
              this.commit('getFormatTime', state.editMeetingForm.tecMeetingStartDate)
              state.editMeetingForm.tecMeetingStartDate = state.dateTmp
            }
            if (state.editMeetingForm.tecMeetingEndDate) {
              this.commit('getFormatTime', state.editMeetingForm.tecMeetingEndDate)
              state.editMeetingForm.tecMeetingEndDate = state.dateTmp
            }
            state.editMeetingForm.tecMeetingSolveProblem = '未解决'
            state.editMeetingVisible = true
          }
        })
    },
    closeEditMeeting (state) {
      state.editMeetingVisible = false
    },
    deleteMeeting (state, data) {
      axios.fetchPost('/api/meeting/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getMeetingList', {
              currentPage: 1
            })
            Message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
    },
    // 项目阶段
    deleteProjectPhase (state, data) {
      axios.fetchPost('/api/stage/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            this.commit('getProjectPhaseList', {
              currentPage: 1
            })
            Message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
    },
    getAllProjectsList (state) {
      axios.fetchGet('/api/stage/projects')
        .then(res => {
          console.log(res)
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
      this.commit('getAllProjectsList')
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
    // 项目阶段测试结果
    openTestProjectPhase (state, data) {
      axios.fetchGet('/api/stage/list/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.testProjectPhaseForm = res.data.content[0]
            state.testProjectPhaseVisible = true
          }
        })
    },
    closeTestProjectPhase (state, data) {
      state.testProjectPhaseVisible = false
    },
    receiveProjectPhase (state, data) {
      // let params = '?ids=' + data
      axios.fetchPost('/api/stage/receive', {
        ids: data
      })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            Message({
              type: 'success',
              message: '领取任务成功'
            })
            this.commit('getProjectPhaseList', {
              currentPage: data.currentPage,
              PageSize: state.projectPhaseListPageSize
            })
          } else if (res.data.msg === '领取阶段任务失败，请稍后重试！') {
            Message({
              type: 'success',
              message: '领取任务失败，请稍后重试！'
            })
          }
        })
    },
    finishProjectPhase (state, data) {
      axios.fetchPost('/api/stage/complete/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            Message({
              type: 'success',
              message: '修改阶段成功'
            })
            this.commit('getProjectPhase' +
              'List', {
              currentPage: data.currentPage,
              PageSize: state.projectPhaseListPageSize
            })
          } else if (res.data.msg === '修改阶段失败，请稍后重试！') {
            Message({
              type: 'success',
              message: '修改阶段失败，请稍后重试！'
            })
          }
        })
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
              i.isInit = true// 控制领取按钮是否显示
              i.isDev = false// 控制完成按钮是否显示
              i.isFinish = false// 控制测试结果是否显示
              i.isTest = false // 控制测试按钮是否显示
              i.isOver = false // 显示完成disable
              i.isShowfeedBack = false // 首次完成等待测试不显示测试反馈
              i.projectOver = true // 项目终止 不可操作
              if (i.tecStageReceiveDate) {
                this.commit('getFormatTime', i.tecStageReceiveDate)
                i.tecStageReceiveDate = state.dateTmp
              }
              if (i.tecProjectEstimatedEnd) {
                this.commit('getFormatTime', i.tecProjectEstimatedEnd)
                i.tecProjectEstimatedEnd = state.dateTmp
              }
              if (i.tecStageStatus !== undefined || null) {
                if (i.tecStageStatus === 0) {
                  i.tecStageStatus = '未领取'
                } else if (i.tecStageStatus === 1) {
                  i.tecStageStatus = '进行中'
                  i.isInit = false// 不显示领取
                  i.isDev = true// 显示完成
                } else if (i.tecStageStatus === 2 && i.tecStageTestStatus === undefined) {
                  i.tecStageStatus = '已完成'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = false // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageStatus === 2) {
                  i.tecStageStatus = '已完成'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageStatus === 3) {
                  i.tecStageStatus = '项目终止'
                  i.projectOver = false
                }
              }
              if (i.tecStageTestStatus !== undefined || null) {
                if (i.tecStageStatus === '已完成' && i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                  i.isInit = false// 不显示领取
                  i.isDev = true// 显示完成
                  i.isTest = false// 不显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageTestStatus === 1) {
                  i.tecStageTestStatus = '通过'
                  i.isFinish = true// 显示测试结果
                  i.isInit = false// 不显示领取
                  i.isDev = false// 显示完成 disable
                  i.isTest = false// 不显示测试中
                  i.isOver = true // 显示完成 disable
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                }
              }
            }
            state.projectPhaseListTotalCount = res.data.content.totalCount
          }
          if (res.data.statuscode === 400 && res.data.msg === '没有任何阶段的信息') {
            state.projectPhaseList = []
            state.projectPhaseListTotalCount = 0
          }
          state.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchProjectPhase (state, data) {
      data.currentPage = 1
      data.pageSize = state.projectPhaseListPageSize
      axios.fetchGet('/api/stage/lists', data)
        .then(res => {
          if (res.data.statuscode === 200) {
            state.projectPhaseList = res.data.content.list
            for (let i of state.projectPhaseList) {
              i.isInit = true// 控制领取按钮是否显示
              i.isDev = false// 控制完成按钮是否显示
              i.isFinish = false// 控制测试结果是否显示
              i.isTest = false // 控制测试按钮是否显示
              i.isOver = false // 显示完成disable
              i.isShowfeedBack = false // 首次完成等待测试不显示测试反馈
              if (i.tecStageReceiveDate) {
                this.commit('getFormatTime', i.tecStageReceiveDate)
                i.tecStageReceiveDate = state.dateTmp
              }
              if (i.tecProjectEstimatedEnd) {
                this.commit('getFormatTime', i.tecProjectEstimatedEnd)
                i.tecProjectEstimatedEnd = state.dateTmp
              }
              if (i.tecStageStatus !== undefined || null) {
                if (i.tecStageStatus === 0) {
                  i.tecStageStatus = '未领取'
                } else if (i.tecStageStatus === 1) {
                  i.tecStageStatus = '进行中'
                  i.isInit = false// 不显示领取
                  i.isDev = true// 显示完成
                } else if (i.tecStageStatus === 2 && i.tecStageTestStatus === undefined) {
                  i.tecStageStatus = '已完成'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = false // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageStatus === 2) {
                  i.tecStageStatus = '已完成'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                }
              }
              if (i.tecStageTestStatus !== undefined || null) {
                if (i.tecStageStatus === '已完成' && i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                  i.isInit = false// 不显示领取
                  i.isDev = false// 不显示完成
                  i.isTest = true// 显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageTestStatus === 0) {
                  i.tecStageTestStatus = '未通过'
                  i.isInit = false// 不显示领取
                  i.isDev = true// 显示完成
                  i.isTest = false// 不显示测试中
                  i.isFinish = true// 显示测试结果
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                } else if (i.tecStageTestStatus === 1) {
                  i.tecStageTestStatus = '通过'
                  i.isFinish = true// 显示测试结果
                  i.isInit = false// 不显示领取
                  i.isDev = false// 显示完成 disable
                  i.isTest = false// 不显示测试中
                  i.isOver = true // 显示完成 disable
                  i.isShowfeedBack = true // 首次完成等待测试不显示测试反馈
                }
              }
            }
            state.projectPhaseListTotalCount = res.data.content.totalCount
          }
          if (res.data.statuscode === 400 && res.data.msg === '没有任何阶段的信息') {
            state.projectPhaseList = []
            state.projectPhaseListTotalCount = 0
          }
          state.loading = false
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
          state.editShareForm.tecShareLabel = state.editShareForm.tecShareLabel.split(',')
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
            Message({
              type: 'success',
              message: '删除成功!'
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
    getUserInfo (state) {
      let userInfo
      axios.fetchGet('/api/current/user')
        .then(res => {
          userInfo = res.data.content
          state.userId = userInfo.empId
          state.userName = userInfo.empName
          state.userName = userInfo.empName
          return axios.fetchGet('/api/depName/' + userInfo.empDepartmentId)
        })
        .then(res => {
          state.depName = res.data.content[0].depName
          return axios.fetchGet('api/posName/' + userInfo.empPositionId)
        })
        .then(res => {
          state.posName = res.data.content[0].posName
        })
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
            for (let i of state.projectListTableData) {
              i.disabled = true
              i.isInit = false
              i.isfinished = false
              if (i.tecProjectStartDate) {
                this.commit('getFormatTime', i.tecProjectStartDate)
                i.tecProjectStartDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectPublishDate) {
                this.commit('getFormatTime', i.tecProjectPublishDate)
                i.tecProjectPublishDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectEstimatedEndDate) {
                this.commit('getFormatTime', i.tecProjectEstimatedEndDate)
                i.tecProjectEstimatedEndDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectStatus !== undefined || null) {
                switch (i.tecProjectStatus) {
                  case 0:
                    i.tecProjectStatus = '未开始'
                    i.disabled = false
                    i.isInit = true
                    break
                  case 1:
                    i.tecProjectStatus = '进行中'
                    i.isStarted = true
                    i.isfinished = false
                    break
                  case 2:
                    i.tecProjectStatus = '已结束'
                    i.isfinished = true
                    break
                }
              }
            }
            state.loading = false
            state.projectListTotalCount = res.data.content.totalCount
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 项目状态更新
    updateProjectStatus (state, data) {
      axios.fetchPost('/api/project/updateStatus', data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.commit('getProjectList', {
              currentPage: data.currentPage,
              pageSize: state.projectListPageSize
            })
            Message({
              type: 'success',
              message: '项目状态更新成功!'
            })
            if (data.status === 2) {
              setTimeout(() => {
                $confirm('是否需要结束该项目下所有阶段?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios.fetchPost('/api/stage/end/' + data.projectId)
                    .then(res => {
                      if (res.data.statuscode === 200) {
                        Message({
                          type: 'success',
                          message: '已成功结束该项目下所有阶段!'
                        })
                      }
                      if (res.data.statuscode === 200 && res.data.msg === '改项目没有任何阶段，或结束阶段失败') {
                        Message({
                          type: 'error',
                          message: '结束该项目下所有阶段失败!'
                        })
                      }
                    })
                }).catch(() => {
                  Message({
                    type: 'info',
                    message: '已取消结束该项目下所有阶段'
                  })
                })
              }, 300)
            }
          } else if (res.data.statuscode === 400 && res.data.msg === '状态更新失败，请稍后重试！') {
            Message({
              type: 'error',
              message: '项目状态更新失败,请稍后重试!'
            })
          }
        })
    },
    getProjectStatusType () {
      axios.fetchGet('/api/stage/type')
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
            for (let i of state.projectListTableData) {
              i.disabled = true
              if (i.tecProjectStartDate) {
                this.commit('getFormatTime', i.tecProjectStartDate)
                i.tecProjectStartDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectPublishDate) {
                this.commit('getFormatTime', i.tecProjectPublishDate)
                i.tecProjectPublishDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectEstimatedEndDate) {
                this.commit('getFormatTime', i.tecProjectEstimatedEndDate)
                i.tecProjectEstimatedEndDate = state.dateTmp.substr(0, 10)
              }
              if (i.tecProjectStatus !== undefined || null) {
                switch (i.tecProjectStatus) {
                  case 0:
                    i.tecProjectStatus = '未开始'
                    i.disabled = false
                    break
                  case 1:
                    i.tecProjectStatus = '进行中'
                    break
                  case 2:
                    i.tecProjectStatus = '已结束'
                    break
                }
              }
            }
            console.log(state.projectListTableData)
          } else if (res.data.msg === '没有任何项目的信息！') {
            state.projectListTableData = []
          }
          state.loading = false
          state.projectListTotalCount = res.data.content.totalCount
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteProject (state, data) {
      axios.fetchPost('/api/project/delete/' + data)
        .then(res => {
          if (res.data.statuscode === 200) {
            Message({
              type: 'success',
              message: '删除成功!'
            })
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
          console.log(res)
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
            state.checkName = tmpForm.tecProjectName
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
              i.passed = false
              if (i.tecProductCheckType !== 'undefined') {
                switch (i.tecProductCheckType) {
                  case 0:
                    i.tecProductCheckType = '未审核'
                    break
                  case 1:
                    i.tecProductCheckType = '已审核'
                    i.passed = true
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
              if (i.tecProductAnnex) {
                i.fileList = i.tecProductAnnex.split(',')
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
    openCheckProduct (state, data) {
      axios.fetchGet('/api/product/list/' + data)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            state.editProductForm = res.data.content[0]
            state.checkProductVisible = true
          }
        })
    },
    closeCheckProduct (state) {
      state.checkProductVisible = false
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
            if (tmpForm.tecProductAnnex) {
              tmpForm.fileList = tmpForm.tecProductAnnex.split(',')
              tmpForm.getfileList = []
              tmpForm.fileList.forEach((item, i, arr) => {
                let tmp = {}
                tmp.name = '附件' + (i + 1)
                tmp.url = item
                tmpForm.getfileList.push(tmp)
              })
            }
            state.editProductForm = tmpForm
            console.log(state.editProductForm)
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
            Message({
              type: 'success',
              message: '删除成功!'
            })
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
