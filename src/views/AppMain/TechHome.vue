<template>
  <el-container>
    <el-header height="40px">
      <home-header></home-header>
    </el-header>
    <el-container>
      <el-aside class="no-select">
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
  section.el-container.is-vertical{
    height: 100%;
  }
  .el-header{
    width: 1920px;
    color: #fff;
    background-color: #000;
    line-height: 40px;
  }
  main.el-main{
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  .el-aside{
    background-color: #545c64;
    width: 180px!important;
  }
  main.el-main{
    min-width: 700px;
  }
</style>
