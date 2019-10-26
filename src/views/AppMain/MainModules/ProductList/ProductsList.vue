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
      <el-form-item>
        <el-select placeholder="请选择产品类型" v-model="productSearchForm.tecProductType" clearable>
          <el-option :label="item.productTypeName" :value="item.productId" v-for="item in this.$store.state.ProductTypeList" :key="item.productId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="date-form" prop="createDate">
        <el-date-picker
          v-model="productSearchForm.createDate" type="daterange" range-separator="至" start-placeholder="产品创建日期范围起" end-placeholder="产品创建日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="publishDate">
        <el-date-picker
          v-model="productSearchForm.publishDate" type="daterange" range-separator="至" start-placeholder="发布日期范围起" end-placeholder="发布日期日范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProject" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('projectSearchForm')">重置</el-button>
    </el-form>

    <!-- product-table-->
    <el-button @click="openAddProductDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
<!--    <el-button @click="deleteMultipleProject" type="danger" size="mini" icon="el-icon-delete-solid">批量删除</el-button>-->
    <el-table ref="multipleTable"  :data="this.$store.state.productListTableData"
              stripe border fit @selection-change="handleSelectionChange" v-loading="this.$store.state.loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="tecProductName" label="产品名称" fixed width="120"></el-table-column>
      <el-table-column prop="tecProductDesc" label="产品简要">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品简要" width="200" trigger="hover" :content="scope.row.tecProductDesc">
            <el-button slot="reference" class="tips-btn">查看简要</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="empName" label="产品负责人"></el-table-column>
      <el-table-column prop="tecProductType" label="产品类型"></el-table-column>
      <el-table-column prop="tecProductCreateDate" label="产品创建时间" width="100" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecProductCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductCheckDate" label="产品审核时间" width="100">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProductCheckDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="productCheckName" label="产品审核人"></el-table-column>
      <el-table-column prop="tecProductAuditmind" label="产品审核意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="产品审核意见" width="200" trigger="hover" :content="scope.row.tecProductAuditmind">
            <el-button slot="reference" class="tips-btn">查看意见</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecProductCheckType" label="产品审核状态"></el-table-column>
      <el-table-column prop="tecProductCompleteDays" label="产品预计完成天数"></el-table-column>
      <el-table-column prop="ui" label="产品UI参与人">
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
      <el-table-column prop="tecProductPublishDate" label="产品预计上线时间" width="100">
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
      <el-table-column prop="tecProductAnnex" label="附件">
        <template slot-scope="scope">
          <el-link :href="scope.row.tecProductAnnex" target="_blank">查看附件</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditProduct(scope.row.tecProductId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteProject(scope.row.tecProductId)"></el-button>
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
  </div>
</template>
<script>
import AddProduct from '@/views/AppMain/MainModules/ProductList/component/addProduct.vue'
import EditProduct from '@/views/AppMain/MainModules/ProductList/component/editProduct.vue'
export default {
  data () {
    return {
      currentPage: 1,
      multipleSelection: [],
      productSearchForm: {}
    }
  },
  created () {
    this.$store.commit('getProductList', {
      currentPage: this.currentPage
    })
    this.$store.commit('getProductType')
  },
  methods: {
    openAddProductDialog () {
      this.$store.commit('openAddProduct')
    },
    openEditProduct (id) {
      this.$store.commit('openEditProduct', id)
    },
    deleteProject (id) {
      this.$store.commit('deleteProduct', id)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    }
  },
  components: {
    'add-product': AddProduct,
    'edit-product': EditProduct
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
  }
</style>
