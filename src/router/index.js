import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

import TechLogin from '@/views/AppMain/MainModules/TechLogin'
import TechHome from '@/views/AppMain/TechHome'
import ProjectsList from '@/views/AppMain/MainModules/ProjectsList'
import RequirementsList from '@/views/AppMain/MainModules/RequirementsList'
import TeamManagement from '@/views/AppMain/MainModules/TeamManagement'
import ProductsList from '@/views/AppMain/MainModules/ProductsList'
import MeetingList from '@/views/AppMain/MainModules/MeetingList'
import KnowledgeShare from '@/views/AppMain/MainModules/KnowledgeShare'
import ProjectPhaseList from '@/views/AppMain/MainModules/ProjectPhaseList'

Vue.use(Router)

const router = new Router({
  // mode: 'hash',
  routes: [
    { path: '/', redirect: '/Tech/TechLogin' },
    { path: '/Tech/TechLogin', name: 'TechLogin', component: TechLogin },
    { path: '/Tech/TechHome', redirect: '/Tech/TechHome/ProjectsList' },
    { path: '/Tech/TechHome',
      name: 'TechHome',
      component: TechHome,
      meta: {
        requiresAuth: true // 登录路由添加自定义meta字段，来记录该页面是否需要身份验证
      },
      children: [
        { path: '/Tech/TechHome/ProjectsList', name: 'ProjectList', component: ProjectsList, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/RequirementsList', name: 'RequirementsList', component: RequirementsList, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/TeamManagement', name: 'TeamManagement', component: TeamManagement, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/ProductsList', name: 'ProductsList', component: ProductsList, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/MeetingList', name: 'MeetingList', component: MeetingList, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/KnowledgeShare', name: 'KnowledgeShare', component: KnowledgeShare, meta: { requiresAuth: true } },
        { path: '/Tech/TechHome/ProjectPhaseList', name: 'ProjectPhaseList', component: ProjectPhaseList, meta: { requiresAuth: true } }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.token) {
      next()
    } else {
      next('/Tech/TechLogin')
    }
  } else {
    next()
  }
})

export default router
