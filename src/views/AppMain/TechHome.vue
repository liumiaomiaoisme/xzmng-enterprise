<template>
  <el-container class="layout-container">
    <el-header>
      <home-header></home-header>
    </el-header>
    <el-container>
      <el-aside class="no-select"  width="200px">
        <home-aside></home-aside>
      </el-aside>
      <el-main>
        <tech-main></tech-main>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HomeAside from '@/views/Aside/Aside'
import HomeHeader from '@/views/Header/Header'
import TechMain from '@/components/TechContainer/TechMain'
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
    HomeHeader,
    TechMain
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
      height: 60px;
      line-height: 60px;
      min-width:600px;
      overflow: hidden;
    }
    .el-main{
      min-width:600px;
    }
    .el-aside{
      background-color: #545c64;
      height:100%;
    }
  }
</style>
