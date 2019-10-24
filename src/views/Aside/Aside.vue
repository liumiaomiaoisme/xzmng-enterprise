<template>
  <div class="aside-container">
    <el-row>
      <el-col :span="24">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
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
    </div>
</template>

<script>
export default {
  data () {
    return {
      menuGroup: [
        { itemName: '项目列表', itemRouter: '/TechHome/ProjectsList', itemIcon: 'el-icon-s-order' },
        { itemName: '需求列表', itemRouter: '/TechHome/RequirementsList', itemIcon: 'el-icon-s-opportunity' },
        { itemName: '组管理', itemRouter: '/TechHome/TeamManagement', itemIcon: 'el-icon-s-custom' },
        { itemName: '产品列表', itemRouter: '/TechHome/ProductsList', itemIcon: 'el-icon-s-flag' },
        { itemName: '会议列表', itemRouter: '/TechHome/MeetingList', itemIcon: 'el-icon-s-management' },
        { itemName: '知识分享', itemRouter: '/TechHome/KnowledgeShare', itemIcon: 'el-icon-s-claim' },
        { itemName: '项目阶段列表', itemRouter: '/TechHome/ProjectPhaseList', itemIcon: 'el-icon-s-marketing' }]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .aside-container {
    .user-avatar{
      margin: 20px 0;
      text-align: center;
      color: #fff;
      h3{
        margin-bottom: 10px;
      }
    }

    .el-row {
      width: 100%;
    }

    .el-menu-item {
      box-sizing: border-box;
      width: 180px;

      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: #fff;
        vertical-align: middle;
      }

      &.is-active {
        background-color: #3F474F !important;
        color: #409EFF;

        a {
          color: #409EFF;
        }
      }
    }
  }
</style>
