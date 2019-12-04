<template>
  <el-dialog title="添加分享" :visible.sync="this.$store.state.addShareVisible" class="share-dialog-container" :before-close="maskFake">
    <el-form :model="addShareForm" status-icon ref="addShareForm" size="small" :rules="rules">
      <el-form-item label="分享标题" :label-width="formLabelWidth" prop="tecShareTitle">
        <el-input v-model="addShareForm.tecShareTitle" autocomplete="off" placeholder="请输入分享标题"></el-input>
      </el-form-item>
      <el-form-item label="分享类型" :label-width="formLabelWidth" prop="tecShareType" class="type-item">
        <el-select v-model="addShareForm.tecShareType" placeholder="请选择分享类型">
          <el-option :label="item.tyName" :value="item.tyId" v-for="item in this.$store.state.shareTypeDate" :key="item.tyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分享状态" :label-width="formLabelWidth" prop="tecShareStatus" class="type-item">
        <el-select v-model="addShareForm.tecShareStatus" placeholder="请选择分享状态">
          <el-option label='草稿' :value="0"></el-option>
          <el-option label='发布' :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分享标签" :label-width="formLabelWidth" prop="tecShareLabel" class="label-input">
        <el-select size="medium" v-model="addShareForm.tecShareLabel" multiple :multiple-limit="5" filterable allow-create placeholder="请选择或创建分享标签">
          <el-option v-for="item in ShareLabelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <span class="label-tip">分享标签最多可接受5个</span>
      <el-form-item  prop="tecShareContent" class="editor-item">
        <quill-editor
          v-model="addShareForm.tecShareContent"
          ref="myQuillEditor"
          class="editor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
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
      <el-button type="primary" @click="addShare" size="small">确 定</el-button>
    </div>
   </el-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['link']
]

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      ShareLabelOptions: [{
        value: 'vue',
        label: 'vue'
      }, {
        value: 'java',
        label: 'java'
      }, {
        value: 'python',
        label: 'python'
      }],
      confirmVisible: false,
      addShareForm: {
        tecShareTitle: '',
        tecShareType: null,
        tecShareStatus: null,
        tecShareLabel: '',
        tecShareContent: ''
      },
      formLabelWidth: '90px',
      rules: {
        tecShareTitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        tecShareType: [
          { required: true, message: '请选择分享类型', trigger: 'blur' }
        ],
        tecShareLabel: [
          { required: true, message: '请输入分享标签', trigger: 'blur' }
        ],
        tecShareStatus: [
          { required: true, message: '请选择分享状态', trigger: 'blur' }
        ],
        tecShareContent: [
          { required: true, message: '请输入分享内容', trigger: 'blur' }
        ]
      },
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '点击输入 ...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {}
          }
        }
      },
      timer: null,
      lastTime: 0
    }
  },
  methods: {
    maskFake () {},
    // 富文本编辑器
    onEditorBlur (e) {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {},
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeAddShare')
      this.$refs['addShareForm'].resetFields()
    },
    addShare () {
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      // 添加的请求
      this.$refs['addShareForm'].validate((valid) => {
        if (valid) {
          let shareForm = { ...this.addShareForm }
          shareForm.tecShareLabel = shareForm.tecShareLabel.toString()
          this.$axios.fetchPost('/api/share/add', shareForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$store.commit('getShareList', {
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
    }
  }
}
</script>
<style lang="scss">
  .share-dialog-container{
    .el-dialog{
      margin-top: 5vh!important;
      box-sizing: border-box;
      min-width: 600px;
      width: 66%;
      .el-form-item--small.el-form-item {
          margin-bottom: 22px;
      }
      .el-input {
        width: 220px;
      }
      .editor-item{
        margin-top: 10px;
        width: 100%;
        height: 450px;
        .el-form-item__content{
          height: 450px;
        }
        .editor{
          width: 100%;
          height: 400px;
        }
      }
      .label-input{
        width: 634px!important;
        .el-select.el-select--medium {
          width: 530px!important;
          .el-input.el-input--medium{
            width: 530px!important;
          }
        }
      }
      .label-tip{
        color:#F56C6C
      }
    }
    .el-dialog__body {
      padding: 10px 20px;
      color: #606266;
      font-size: 14px;
    }
    .el-dialog .el-form-item--small.el-form-item {
      display: inline-block;
    }
  }

</style>
