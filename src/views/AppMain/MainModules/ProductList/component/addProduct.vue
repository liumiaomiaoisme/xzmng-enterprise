<template>
   <el-dialog title="添加产品" :visible.sync="this.$store.state.addProductVisible" class="product-dialog-container" :before-close="maskFake">
      <el-form :model="addProductForm" status-icon ref="addProductForm" size="small" :rules="rules">
        <el-row>
          <el-col :span="15" class="part15-input-con">
            <el-form-item label="产品名称" :label-width="formLabelWidth" prop="tecProductName">
              <el-input v-model="addProductForm.tecProductName" autocomplete="off" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="part9-input-con">
            <el-form-item label="预计完成天数" :label-width="formLabelWidth" prop="tecProductCompleteDays">
               <el-input type="number" v-model.number="addProductForm.tecProductCompleteDays" autocomplete="off" placeholder="请输入预计天数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="产品审批人" :label-width="formLabelWidth" prop="tecProductCheckMember">
              <el-select v-model="addProductForm.tecProductCheckMember" placeholder="请选择产品审批人">
                <el-option :label="item.departmentName +'--'+ item.posName + '--' + item.empName" :value="item.empId" v-for="item in this.$store.state.ProductReviewerList" :key="item.empId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品类型" :label-width="formLabelWidth" prop="tecProductType">
              <el-select v-model="addProductForm.tecProductType" placeholder="请选择产品类型">
                <el-option :label="item.productTypeName" :value="item.productId" v-for="item in this.$store.state.ProductTypeList" :key="item.productId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="产品负责人" :label-width="formLabelWidth" prop="tecProductPrincipal">
              <el-select v-model="addProductForm.tecProductPrincipal" placeholder="请选择产品负责人">
                <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品发布日期" :label-width="formLabelWidth" prop="tecProductPublishDate">
              <el-date-picker
                v-model="addProductForm.tecProductPublishDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择产品发布日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-form-item label="产品简要" :label-width="formLabelWidth" prop="tecProductDesc">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品简要" v-model="addProductForm.tecProductDesc" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品调研总结" :label-width="formLabelWidth" prop="tecProductResearchSummary">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入产品调研总结" v-model="addProductForm.tecProductResearchSummary" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="产品附件" :label-width="formLabelWidth" prop="tecProductAnnex" class="product-annex">
          <el-upload
            class="upload-demo" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :limit='limitFileNumber'
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多上传3个文件,仅支持JPG、JPEG、PNG、GIF格式，且每个不超过2M</div>
          </el-upload>
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
        <el-button type="primary" @click="addProduct" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      uploadURl: 'http://47.100.56.42:9876',
      fileList: [],
      confirmVisible: false,
      autosize: false,
      limitFileNumber: 3,
      addProductForm: {
        tecProductName: '',
        tecProductDesc: '',
        tecProductType: '',
        tecProductResearchSummary: '',
        tecProductPrincipal: '',
        ui: '',
        dev: '',
        test: '',
        tecProductCompleteDays: null,
        tecProductPublishDate: '',
        tecProductCheckMember: '',
        tecProductAnnex: ''
      },
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
      },
      lastTime: 0
    }
  },
  methods: {
    maskFake () {},
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeProductDialog')
      this.$refs['addProductForm'].resetFields()
    },
    addProduct () {
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      this.$refs['addProductForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addProductForm }
          addForm.tecProductType = parseInt(addForm.tecProductType)
          addForm.ui = addForm.ui.toString()
          addForm.dev = addForm.dev.toString()
          addForm.test = addForm.test.toString()
          this.$axios.fetchPost('/api/product/add', addForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$store.commit('getProductList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
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
    handleSuccess (res, file, fileList) {
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.addProductForm.tecProductAnnex = this.fileList.toString()
    },
    handleRemove (file, fileList) {
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.addProductForm.tecProductAnnex = this.fileList.toString()
    },
    handleExceed () {
      this.$message({
        type: 'warning',
        message: '最多上传3个文件'
      })
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isJPEG && !isPNG && !isGIF) {
        this.$message.error('上传附件图片仅支持JPG、JPEG、PNG、GIF格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传附件图片大小不能超过 2MB!')
      }
      return (isJPG || isJPEG || isGIF || isPNG) && isLt2M
    }
  }
}
</script>
<style lang="scss">
  .product-dialog-container{
    .el-dialog{
      margin-top: 5vh!important;
      max-width: 800px!important;
      .part15-input-con {
        .el-input{
          width: 340px;
        }
      }
      .part9-input-con {
        .el-input{
          width: 124px;
        }
      }
    }
    .el-dialog__body {
      padding-bottom:10px!important;
      padding-top:10px!important;
    }
    .product-annex{
      margin-bottom: 0!important;
      .el-upload__tip {
        display: inline-block;
        margin-left: 10px;
      }
      .el-upload-list--picture .el-upload-list__item {
        display: inline-block;
        margin-right: 10px;
        padding: 10px 10px 10px 60px;
        height: 60px;
        width: 30.5%;
      }
      .el-upload-list--picture .el-upload-list__item-thumbnail {
        width: 40px;
        height: 40px;
        margin-left: -50px;
      }
      .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
        line-height: 40px;
        margin-right: 0;
      }
    }
  }
</style>
