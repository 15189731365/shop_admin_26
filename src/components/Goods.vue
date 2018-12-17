<template>
  <div class="goods">
    <el-button type='success' @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodList" style="width: 100%">
      <el-table-column type="index" width="50" :index='indexMethod'></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180">
        <template slot-scope="scope">
          {{scope.row.add_time|dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
           <el-button size='small' plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size='small' plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodList() {
      let res = await this.axios.get(`goods`, {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      let { data: { total, goods }, meta: { status } } = res
      if (status === 200) {
        this.total = total
        this.goodList = goods
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodList()
    },
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>
</style>
