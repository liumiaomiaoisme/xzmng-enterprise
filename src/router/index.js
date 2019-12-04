import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

// import TechLogin from '@/views/Login/TechLogin'

import TechHome from '@/views/AppMain/TechHome'
import ProjectsList from '@/views/AppMain/MainModules/ProjectList/ProjectsList'
import RequirementsList from '@/views/AppMain/MainModules/RequirementList/RequirementsList'
import TeamManagement from '@/views/AppMain/MainModules/TeamManage/TeamManagement'
import ProductsList from '@/views/AppMain/MainModules/ProductList/ProductsList'
import MeetingList from '@/views/AppMain/MainModules/MeetingList/MeetingList'
import KnowledgeShare from '@/views/AppMain/MainModules/KnowledgeShare/KnowledgeShare'
import ProjectPhaseList from '@/views/AppMain/MainModules/ProjectPhaseList/ProjectPhaseList'
import SalesDemandsList from '@/views/AppMain/MainModules/SalesDemand/SalesDemand'

const TechLogin = () => import('@/views/Login/TechLogin')  // 路由懒加载
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/TechLogin' },
    { path: '/TechLogin', name: 'TechLogin', component: TechLogin },
    { path: '/TechHome', redirect: '/TechHome/ProjectsList' },
    { path: '/TechHome',
      name: 'TechHome',
      component: TechHome,
      meta: {
        requiresAuth: true // 登录路由添加自定义meta字段，来记录该页面是否需要身份验证
      },
      children: [
        { path: '/TechHome/ProjectsList', name: 'ProjectList', component: ProjectsList, meta: { requiresAuth: true } },
        { path: '/TechHome/RequirementsList', name: 'RequirementsList', component: RequirementsList, meta: { requiresAuth: true } },
        { path: '/TechHome/SalesDemandsList', name: 'SalesDemandsList', component: SalesDemandsList, meta: { requiresAuth: true } },
        { path: '/TechHome/TeamManagement', name: 'TeamManagement', component: TeamManagement, meta: { requiresAuth: true } },
        { path: '/TechHome/ProductsList', name: 'ProductsList', component: ProductsList, meta: { requiresAuth: true } },
        { path: '/TechHome/MeetingList', name: 'MeetingList', component: MeetingList, meta: { requiresAuth: true } },
        { path: '/TechHome/KnowledgeShare', name: 'KnowledgeShare', component: KnowledgeShare, meta: { requiresAuth: true } },
        { path: '/TechHome/ProjectPhaseList', name: 'ProjectPhaseList', component: ProjectPhaseList, meta: { requiresAuth: true } }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.token) {
      next()
    } else {
      next('/TechLogin')
    }
  } else {
    next()
  }
})

export default router
