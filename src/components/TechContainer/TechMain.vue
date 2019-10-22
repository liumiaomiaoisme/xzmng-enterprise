<template>
    <div class="mainHeaderContainer">
<!--        <el-row class="main-header">-->
<!--            <tag :type='this.type'>人员列表</tag>-->
<!--            <tag>考勤管理</tag>-->
<!--            <tag>请假管理</tag>-->
<!--        </el-row>-->
        <el-row class="main-container">
            <transition name="fade-transform" mode="out-in">
<!--                <router-view :key="key"/>-->
              <router-view></router-view>
            </transition>
        </el-row>
    </div>
</template>

<script>
// import Tag from '@/components/public/Tag'
export default {
  data () {
    return {
      type: 'plain'
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    }
  },
  components: {
    // Tag
  }
}
</script>

<style lang="scss" scoped>
  .mainHeaderContainer{
    width: 100%
  }
  .main-container{
      padding: 10px;
  }
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
</style>
