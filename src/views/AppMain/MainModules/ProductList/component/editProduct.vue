<template>
   <el-dialog title="编辑产品" :visible.sync="this.$store.state.editProductVisible" class="project-dialog-container" :before-close="closeDialog">
     <el-form :model="addProductForm" status-icon ref="addProductForm" size="small" :rules="rules">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="tecProductName">
          <el-input v-model="addProductForm.tecProductName" autocomplete="off" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品简要" :label-width="formLabelWidth" prop="tecProductDesc">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品简要" v-model="addProductForm.tecProductDesc" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品调研总结" :label-width="formLabelWidth" prop="tecProductResearchSummary">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品调研总结" v-model="addProductForm.tecProductResearchSummary" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品类型" :label-width="formLabelWidth" prop="tecProductType">
          <el-select v-model="addProductForm.tecProductType" placeholder="请选择产品类型">
            <el-option :label="item.productTypeName" :value="item.productId" v-for="item in this.$store.state.ProductTypeList" :key="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品负责人" :label-width="formLabelWidth" prop="tecProductPrincipal">
          <el-select v-model="addProductForm.tecProductPrincipal" placeholder="请选择产品负责人">
            <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="UI 参与人" :label-width="formLabelWidth" prop="ui">
          <el-select v-model="addProductForm.ui" multiple placeholder="请选择UI 参与人">
            <el-option
              v-for="item in this.$store.state.staffList" :key="item.empId" :label="item.empName" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发参与人" :label-width="formLabelWidth" prop="dev">
          <el-select v-model="addProductForm.dev" multiple placeholder="请选择开发参与人">
            <el-option
              v-for="item in this.$store.state.staffList" :key="item.empId" :label="item.empName" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试参与人" :label-width="formLabelWidth" prop="test">
          <el-select v-model="addProductForm.test" multiple placeholder="请选择测试参与人">
            <el-option
              v-for="item in this.$store.state.staffList" :key="item.empId" :label="item.empName" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计完成天数" :label-width="formLabelWidth" prop="tecProductCompleteDays">
          <el-input v-model.number="addProductForm.tecProductCompleteDays" autocomplete="off" placeholder="请输入预计完成天数"></el-input>
        </el-form-item>
        <el-form-item label="产品发布日期" :label-width="formLabelWidth" prop="tecProductPublishDate">
          <el-date-picker
            v-model="addProductForm.tecProductPublishDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择产品发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品审批人" :label-width="formLabelWidth" prop="tecProductCheckMember">
          <el-select v-model="addProductForm.tecProductCheckMember" placeholder="请选择产品审批人">
            <el-option :label="item.posName + '--' + item.empName" :value="item.empId" v-for="item in this.$store.state.ProductReviewerList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品审核意见" :label-width="formLabelWidth" prop="tecProductAuditmind">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品审核意见" v-model="addProductForm.tecProductAuditmind" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品附件" :label-width="formLabelWidth" prop="tecProductAnnex">
          <el-upload
            class="avatar-uploader" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :show-file-list="false"
            enctype="multipart/form-data"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="addProductForm.tecProductAnnex" :src="addProductForm.tecProductAnnex" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
     <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="editProduct" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      autosize: false,
      relativePath: '',
      formLabelWidth: '126px',
      rules: {
        tecProductName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        tecProductDesc: [
          { required: true, message: '请输入产品简要', trigger: 'blur' }
        ],
        tecProductType: [
          { required: true, message: '请选择产品类型', trigger: 'blur' }
        ],
        tecProductPrincipal: [
          { required: true, message: '请选择产品负责人', trigger: 'change' }
        ],
        tecProductPublishDate: [
          { required: true, message: '请选择产品发布日期', trigger: 'change' }
        ],
        tecProductCompleteDays: [
          { required: true, message: '请输入产品预计完成天数', trigger: 'blur' },
          { type: 'number', message: '项目周期应为数字值', trigger: 'blur' }
        ],
        tecProductCheckMember: [
          { required: true, message: '请选择产品审批人', trigger: 'blur' }
        ],
        tecProductAuditmind: [
          { required: true, message: '请输入产品审核意见', trigger: 'blur' }
        ],
        tecProductResearchSummary: [
          { required: true, message: '请输入产品调研总结', trigger: 'blur' }
        ],
        ui: [
          { required: true, message: '请选择产品UI参与人', trigger: 'blur' }
        ],
        dev: [
          { required: true, message: '请选择产品开发参与人', trigger: 'blur' }
        ],
        test: [
          { required: true, message: '请选择产品测试参与人', trigger: 'blur' }
        ],
        tecProductAnnex: [
          { required: true, message: '请上传附件', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    addProductForm () {
      return this.$store.state.editProductForm
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeEditProduct')
      this.$refs['addProductForm'].resetFields()
    },
    editProduct () {
      this.$refs['addProductForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addProductForm }
          addForm.ui = addForm.uiId
          addForm.dev = addForm.devId
          addForm.test = addForm.testId
          // addForm.empId = addForm.empId.toString()
          if (addForm.tecProductAnnex.indexOf('http://47.100.56.42:9876') === -1) {
            addForm.tecProductAnnex = 'http://47.100.56.42:9876' + this.relativePath
          }
          delete addForm.tecProductCreateDate
          delete addForm.uiId
          delete addForm.devId
          delete addForm.testId
          delete addForm.tecProductCheckType
          console.log(addForm)
          this.$axios.fetchPost('/api/product/update', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getProductList', {
                  currentPage: 1
                })
                this.closeDialog()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.addProjectForm.tecProductAnnex = URL.createObjectURL(file.raw)
      this.relativePath = res.relativePath
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片仅支持JPG、JPEG、PNG、GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
