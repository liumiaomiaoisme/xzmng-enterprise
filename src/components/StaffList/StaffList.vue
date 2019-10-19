<template>
    <div class="container">
        <el-table
            :data="tableData"
            stripe: true
            border
            size='small'
            fit:true
            height="470"
            highlight-current-row
            style="width: 100%">
            <el-table-column
                type="selection"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                fixed
                prop="empName"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="empSex"
                label="性别">
            </el-table-column>
            <el-table-column
                prop="empAge"
                label="年龄">
            </el-table-column>
            <el-table-column
                prop="empEdu"
                label="学历">
            </el-table-column>
            <el-table-column
                prop="empStatus"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="empSchool"
                label="毕业院校"
                width="150">
            </el-table-column>
            <el-table-column
                prop="empCountry"
                label="国籍">
            </el-table-column>
            <el-table-column
                prop="empProvince"
                label="省份">
            </el-table-column>
            <el-table-column
                prop="empCity"
                label="市区">
            </el-table-column>
            <el-table-column
                prop="empAddress"
                label="地址"
                width="180">
            </el-table-column>
            <el-table-column
                prop="empPhone"
                label="电话"
                width="180">
            </el-table-column>
            <el-table-column
                prop="empNational"
                label="民族">
            </el-table-column>
            <el-table-column
                prop="empIdcard"
                label="身份证号码"
                width="180">
            </el-table-column>
            <el-table-column
                prop="empWork"
                label="工作经历">
            </el-table-column>
            <el-table-column
                prop="empEntryTime"
                label="入职时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="empPositionId"
                label="入职职位">
            </el-table-column>
            <el-table-column
                prop="empDepartmentId"
                label="部门">
            </el-table-column>
            <el-table-column
                prop="empNote"
                label="面试结果">
            </el-table-column>
            <el-table-column
                prop="empProbation"
                label="试用期">
            </el-table-column>
            <el-table-column
                prop="empSubsidy"
                label="其他补给"
                width="180">
            </el-table-column>
            <el-table-column
                prop="empDescs"
                label="附件">
            </el-table-column>
            <el-table-column
                fixed = "right"
                label="操作">
                <a href="#">编辑</a>
                <a href="#">删除</a>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: ['tableData']
}
</script>

<style lang="scss" scoped>
  .el-pagination{
    margin-top: 10px;
    text-align: center;
  }
  .el-table__row{
    height: 40px !important;
  }
</style>
