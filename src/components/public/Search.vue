<template>
    <div class="block">
        <el-row>
            <el-col :span="12">
                <el-input placeholder="请输入要搜索的员工信息" size="small"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="info" plain size="small">搜索</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
    .block{
        width: 100%;
        display: inline-block
    }
</style>
