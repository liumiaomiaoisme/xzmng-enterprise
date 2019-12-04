<template>
  <el-dialog title="审核产品" :visible.sync="this.$store.state.checkProductVisible" class="product-dialog-container check-product" :close-on-click-modal="false">
    <el-form :model="addProductForm" status-icon ref="addProductForm" size="small" :rules="rules">
      <el-form-item label="产品名称" :label-width="formLabelWidth" prop="tecProductName">
        <el-input v-model="addProductForm.tecProductName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="产品审核状态" :label-width="formLabelWidth" prop="checkType">
        <el-select placeholder="请选择产品审核状态" v-model="addProductForm.checkType">
          <el-option label="未审核" :disabled="true" :value="0"></el-option>
          <el-option label="已审核" :value="1"></el-option>
          <el-option label="驳回" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品审核意见" :label-width="formLabelWidth" prop="tecProductAuditmind">
        <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品审核意见" v-model="addProductForm.tecProductAuditmind" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-popover placement="top-end" width="186" v-model="confirmVisible" class="pop-cancle">
        <p>取消将会丢失已编辑的内容，确定取消吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="confirmVisible = false">再想想</el-button>
          <el-button type="primary" size="mini" @click="closeDialog">确定</el-button>
        </div>
        <el-button slot="reference" size="small">取 消</el-button>
      </el-popover>
      <el-button type="primary" @click="editProduct" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      confirmVisible: false,
      autosize: false,
      formLabelWidth: '126px',
      rules: {
        checkType: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        tecProductAuditmind: [
          { required: true, message: '请输入产品审核意见', trigger: 'blur' }
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
      this.confirmVisible = false
      this.$store.commit('closeCheckProduct')
      this.$refs['addProductForm'].resetFields()
    },
    editProduct () {
      this.$refs['addProductForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addProductForm }
          addForm.tecProductCheckType = this.addProductForm.checkType
          addForm.ui = addForm.uiId
          addForm.dev = addForm.devId
          addForm.test = addForm.testId
          delete addForm.tecProductCreateDate
          delete addForm.tecProductCheckDate
          delete addForm.tecProductPublishDate
          delete addForm.uiId
          delete addForm.devId
          delete addForm.testId
          delete addForm.checkType
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
    }
  }
}
</script>

<style lang="scss">
  .product-dialog-container.check-product{
    .el-dialog{
      margin-top: 15vh!important;
      max-width: 600px!important;
      min-width: 600px!important;
    }
    .el-dialog__body {
      padding-bottom:30px!important;
      padding-top:30px!important;
    }
    .el-dialog .el-input,.el-dialog .el-textarea{
      width: 400px;
    }
  }
</style>
