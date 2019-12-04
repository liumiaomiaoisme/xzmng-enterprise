<template>
  <div class="product-container">
    <!-- product-search-form   -->
    <el-form :model="productSearchForm" class="search-container" size="mini" ref="productSearchForm">
      <el-form-item prop="tecProductName">
        <el-input v-model="productSearchForm.tecProductName" prefix-icon="el-icon-search" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item prop="principalName">
        <el-input  v-model="productSearchForm.principalName" prefix-icon="el-icon-search" placeholder="请输入产品负责人"></el-input>
      </el-form-item>
      <el-form-item prop="tecProductType">
        <el-select placeholder="请选择产品类型" v-model="productSearchForm.tecProductType" clearable>
          <el-option :label="item.productTypeName" :value="item.productId" v-for="item in this.$store.state.ProductTypeList" :key="item.productId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="checkName">
        <el-input  v-model="productSearchForm.checkName" prefix-icon="el-icon-search" placeholder="请输入测试人"></el-input>
      </el-form-item>
      <el-form-item  prop="tecProductCheckType">
        <el-select placeholder="请选择审核状态" v-model="productSearchForm.tecProductCheckType" clearable>
          <el-option :label="item.typeName" :value="item.typeNumb" v-for="item in ProductCheckType" :key="item.typeNumb"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="date-form" prop="createDate">
        <el-date-picker
          v-model="productSearchForm.createDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="产品创建日期范围起" end-placeholder="产品创建日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="publishDate">
        <el-date-picker
          v-model="productSearchForm.publishDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="发布日期范围起" end-placeholder="发布日期日范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProduct" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('productSearchForm')">重置</el-button>
    </el-form>

    <!-- product-table-->
    <el-button @click="openAddProductDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.productListTableData" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column prop="tecProductName" label="产品名称" fixed width="160"></el-table-column>
      <el-table-column prop="tecProductDesc" label="产品简要">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品简要" width="200" trigger="hover" :content="scope.row.tecProductDesc">
            <el-button slot="reference" class="tips-btn">查看简要</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="empName" label="产品负责人" width="96" ></el-table-column>
      <el-table-column prop="productTypeName" label="产品类型"></el-table-column>
      <el-table-column prop="tecProductCreateDate" label="产品创建时间" width="106" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecProductCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductCompleteDays" label="产品预计完成天数"></el-table-column>
      <el-table-column prop="ui" label="产品UI 参与人">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品UI参与人" width="200" trigger="hover" :content="scope.row.ui">
            <el-button slot="reference" class="tips-btn">查看UI</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="dev" label="产品开发参与人">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品开发参与人" width="200" trigger="hover" :content="scope.row.dev">
            <el-button slot="reference" class="tips-btn">查看开发</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="test" label="产品测试参与人">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品测试参与人" width="200" trigger="hover" :content="scope.row.test">
            <el-button slot="reference" class="tips-btn">查看测试</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductPublishDate" label="产品预计上线时间" width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProductPublishDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductResearchSummary" label="产品调研总结">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品调研总结" width="200" trigger="hover" :content="scope.row.tecProductResearchSummary">
            <el-button slot="reference" class="tips-btn">查看总结</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="fileList" label="附件" width="180">
        <template slot-scope="scope">
          <el-image v-for="i in scope.row.fileList" :src="i" :key='i' :preview-src-list="scope.row.fileList"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="productCheckName" label="产品审核人" width="96"></el-table-column>
      <el-table-column prop="tecProductCheckDate" label="产品审核时间" width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProductCheckDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductAuditmind" label="产品审核意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品审核意见" width="200" trigger="hover" :content="scope.row.tecProductAuditmind">
            <el-button slot="reference" class="tips-btn">查看意见</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductCheckType" label="产品审核状态"></el-table-column>
      <el-table-column fixed="right" label="产品审核操作" width="120">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.passed" type="primary" icon="el-icon-edit-outline" round size="mini" @click="openCheckProduct(scope.row.tecProductId)">审核</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="88">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="openEditProduct(scope.row.tecProductId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteProject(scope.row.tecProductId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.productListPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.productListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-product></add-product>
    <edit-product></edit-product>
    <checkProduct></checkProduct>
  </div>
</template>
<script>
import AddProduct from '@/views/AppMain/MainModules/ProductList/component/addProduct.vue'
import EditProduct from '@/views/AppMain/MainModules/ProductList/component/editProduct.vue'
import checkProduct from '@/views/AppMain/MainModules/ProductList/component/checkProduct.vue'
export default {
  data () {
    return {
      currentPage: 1,
      multipleSelection: [],
      productSearchForm: {
        tecProductName: '',
        principalName: '',
        tecProductType: null,
        checkName: '',
        tecProductCheckType: null,
        createDate: '',
        publishDate: ''
      },
      ProductCheckType: [{
        typeNumb: 0,
        typeName: '未审核'
      }, {
        typeNumb: 1,
        typeName: '已审核'
      }, {
        typeNumb: 2,
        typeName: '驳回'
      }]
    }
  },
  created () {
    this.$store.commit('getProductList', {
      currentPage: this.currentPage
    })
    this.$store.commit('getProductType')
  },
  methods: {
    openCheckProduct (id) {
      this.$store.commit('openCheckProduct', id)
    },
    openAddProductDialog () {
      this.$store.commit('openAddProduct')
    },
    openEditProduct (id) {
      this.$store.commit('openEditProduct', id)
    },
    deleteProject (id) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteProduct', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getNextPage () {
      this.$store.commit('getProductList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getProductList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getProductList', {
        currentPage: this.currentPage
      })
    },
    searchProduct () {
      let searchForm = { ...this.productSearchForm }
      if (searchForm.createDate) {
        searchForm.createDateStart = searchForm.createDate[0]
        searchForm.createDateEnd = searchForm.createDate[1]
        delete searchForm.createDate
      }
      if (searchForm.publishDate) {
        searchForm.publishDateStart = searchForm.publishDate[0]
        searchForm.publishDateEnd = searchForm.publishDate[1]
        delete searchForm.publishDate
      }
      this.$store.commit('searchProduct', searchForm)
    },
    resetSearch (formName) {
      this.$store.commit('getProductList', {
        currentPage: 1
      })
      this.$refs[formName].resetFields()
    }
  },
  components: {
    'add-product': AddProduct,
    'edit-product': EditProduct,
    checkProduct
  }
}
</script>
<style lang="scss" scoped>
  .product-container{
    position: relative;
    .el-table{
      margin-top: 10px;
    }
    .el-table th>.cell{
      white-space:pre-line;
      word-wrap: break-word;
    }
    .tips-btn{
      width: 60px;
      padding: 6px 0px;
      font-size: 12px;
    }
    .el-pagination{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      bottom: -50px;
    }
    .search-container{
      .el-form-item{
        display: inline-block;
        width:172px;
        margin-right: 6px;
        margin-bottom: 4px;
        &.date-form{
          width:350px;
        }
      }
      margin-bottom: 10px;
    }
    .el-table td, .el-table th {
      padding: 10px 0;
    }
    .el-image{
      width: 50px;
      height: 50px;
      margin: 0 1px;
      border: 1px solid #EBEEF5;
    }
  }
</style>
