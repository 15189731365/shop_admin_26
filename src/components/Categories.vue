<template>
  <div class="categories">
    <el-button type='success' @click='showAdd'>添加分类</el-button>
    <!-- 表格
    childKey 代表子节点的数据名字 默认值是children
    tree-key 将子节点的数据放在父节点的下面 默认的是id
    parent-key 表示父节点的id 不指定就无法回收
            level-key="cat_level"
        :indentSize="20"这两个配合使用才能让各层级之间首行缩进
    -->
    <el-table
      :data="categoryList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key='cat_id'
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20">
      </el-table-tree-column>
      <el-table-column
        prop="cat_deleted"
        label="是否删除">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
           <el-button size='small' plain type="primary" icon="el-icon-edit" @click='edit(scope.row)'></el-button>
          <el-button size='small' plain type="danger" icon="el-icon-delete" @click='del(scope.row.cat_id)'></el-button>
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
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类框
    change-on-select 表示选择任意一级选项
    options是选项中的值 需要进行配置
    props 配置options对应的值-->
    <el-dialog
      title="分配角色"
      :visible.sync="showaddDialog"
      width="40%"
      >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-cascader
            :options="options"
            change-on-select
            :props='props'
            clearable
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showaddDialog = false">取 消</el-button>
        <el-button type="primary" @click='addCategory'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="showeditDialog"
      width="40%"
      >
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showeditDialog = false">取 消</el-button>
        <el-button type="primary" @click='editCategory'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      showaddDialog: false,
      showeditDialog: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      options: [],
      props: {
        children: 'children',
        label: 'cat_name', // 最终展示的名字
        value: 'cat_id'
      }
    }
  },
  methods: {
    // 商品数据列表
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.categoryList = data.result
        this.total = data.total
        // console.log(this.categoryList)
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    // 显示添加分类框
    async showAdd() {
      this.showaddDialog = true
      // 发送ajax请求获取到数据
      let res = await this.axios.get(`categories`, {
        params: {
          type: 2
        }
      })
      console.log(res)
      this.options = res.data
    },
    // 添加分类
    addCategory() {
      // 表单验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送请求
        let res = await this.axios.post(`categories`, {
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        // console.log(res)
        let { meta: { status } } = res
        if (status === 201) {
          // 创建成功 关闭模态框
          this.showaddDialog = false
          // 重新渲染页面
          this.getCategoryList()
          // 重置表单
          this.$refs.addForm.resetFields()
          // 提示信息
          this.$message.success('恭喜，添加完成')
        }
      })
    },
    // 删除分类
    async del(id) {
      try {
        await this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送ajax请求
        let res = await this.axios.delete(`categories/${id}`)
        let { meta: { status } } = res
        if (status === 200) {
          this.getCategoryList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    // 显示修改框
    edit(user) {
      this.showeditDialog = true
      this.editForm.cat_name = user.cat_name
      this.editForm.cat_id = user.cat_id
    },
    // 提交修改框
    editCategory() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        console.log(res)
        let { meta: { status } } = res
        if (status === 200) {
          this.showeditDialog = false
          this.$refs.editForm.resetFields()
          this.$message.success('修改成功')
          this.getCategoryList()
        }
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
