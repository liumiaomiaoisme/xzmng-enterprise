<template>
  <el-row>
    <el-col :span="24">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF" >
        <el-menu-item v-for="(item, i) in menuGroup" :key='i' :index="i.toString()">
          <router-link :to="item.itemRouter">
            <i :class="item.itemIcon"></i>
            <span>{{item.itemName}}</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      isRouter: true,
      menuGroup: [
        { itemName: '项目列表', itemRouter: '/Tech/TechHome/ProjectsList', itemIcon: 'el-icon-s-order' },
        { itemName: '需求列表', itemRouter: '/Tech/TechHome/RequirementsList', itemIcon: 'el-icon-s-opportunity' },
        { itemName: '组管理', itemRouter: '/Tech/TechHome/TeamManagement', itemIcon: 'el-icon-s-custom' },
        { itemName: '产品列表', itemRouter: '/Tech/TechHome/ProductsList', itemIcon: 'el-icon-s-flag' },
        { itemName: '会议列表', itemRouter: '/Tech/TechHome/MeetingList', itemIcon: 'el-icon-s-management' },
        { itemName: '知识分享', itemRouter: '/Tech/TechHome/KnowledgeShare', itemIcon: 'el-icon-s-claim' },
        { itemName: '项目阶段列表', itemRouter: '/Tech/TechHome/ProjectPhaseList', itemIcon: 'el-icon-s-marketing' }]
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row{
    width: 100%;
  }
  .el-menu-item {
    box-sizing: border-box;
    width: 180px;
    a{
      display: inline-block;
      width: 100%;
      height: 100%;
      color:#fff;
      vertical-align: middle;
    }
    &.is-active{
      background-color:#3F474F!important;
      color:#409EFF;
      a{
        color:#409EFF;
      }
    }
  }
</style>
