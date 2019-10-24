<template>
  <el-container class="layout-container">
    <el-header>
      <home-header></home-header>
    </el-header>
    <el-container>
      <el-aside class="no-select">
        <home-aside></home-aside>
      </el-aside>
      <el-main>
        <el-row class="main-container">
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HomeAside from '@/views/Aside/Aside'
import HomeHeader from '@/views/Header/Header'
export default {
  data () {
    return {
      text: 'hello webpack!',
      plain: 'plain'
    }
  },
  methods: {

  },
  components: {
    HomeAside,
    HomeHeader
  }
}
</script>
<style lang="scss" scoped>
  .layout-container{
    height:100%;
    .el-header{
      width: 100%;
      color:#fff;
      background:#000;
      height: 40px!important;
      line-height: 40px;
      overflow: hidden;
    }
    .el-main{
      overflow: hidden;
      .fade-transform-leave-active,
      .fade-transform-enter-active {
        transition: all .5s;
      }
      .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
      }
      .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
      }
      .main-header.el-row{
          background-color: #f1f1f1;
      }
    }
    .el-aside{
      background-color: #545c64;
      height:100%;
      width:180px!important;
    }
  }
</style>
