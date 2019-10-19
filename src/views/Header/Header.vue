<template>
  <el-row>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6"><h4>技术管理系统</h4></el-col>
      <el-col>
      <el-menu :default-active="activeIndex" mode="horizontal" background-color="#000" active-text-color>
        <el-menu-item index="1">人事管理</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
      </el-menu>
      </el-col>
      <el-col :span="6" class="text-push-right">
        <el-dropdown>
          <span class="el-dropdown-link text-lg text-color">
            admin
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="#">个人信息</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-row>
</template>

<style lang="scss">
  ul.el-menu.el-menu--horizontal{
    height: 40px;
    line-height: 40px;

    .el-menu-item,
    .el-submenu__title{
      height: 40px;
      line-height: 40px;
      color: #fff;
    }
  }
</style>

<script>
export default {
  data () {
    return {
      activeIndex: '1'
    }
  }
}
</script>
