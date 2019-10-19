<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 5px;
        padding-left: 10px;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
    }
</style>

<script>
export default {

}
</script>
