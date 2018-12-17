<template>
  <div class='users'>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div>
      <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
      </el-input>
      <el-button type="success" plain @click='showAddDialog=true'>用户添加</el-button>
    </div>
    <!-- 表格 -->
    <!-- el-table 表示是表格组件
         :data="tableData" 表示需要填入的数据列表
         label 表示这一列的题目
         prop 表示数据中对应对象中的键名
     -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态">
        <!-- 自定义内容这一列 必须使用template -->
        <template slot-scope="scope">
          <!-- 通过scope.row来获取表格的数据 -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change='changeState(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size='small' plain type="primary" icon="el-icon-edit" @click='showeditUser(scope.row)'></el-button>
          <el-button size='small' plain type="danger" icon="el-icon-delete" @click='del(scope.row.id)'></el-button>
          <el-button size='small' plain type="success" icon="el-icon-check" @click='showAssign(scope.row)'>分配角色</el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页
        background 表示按钮背景颜色
        @current-change 表示注册给按钮 点击显示当前页
        @size-change 表示每页显示多少条 注册事件
        current-page 表示当前页
        page-size 表示每页条数
        total 表示一共多少条数据
        page-sizes 表示分别一页多少条数据
        layout 表示分页一共具有的功能
    -->
    <el-pagination
      background
      @current-change='handleCurrentChange'
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size='pageSize'
      :page-sizes="[2, 4, 6, 8]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 弹出框 -->
    <!-- 添加弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="showAddDialog"
      width="40%"
      >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="showEditDialog"
      width="40%"
      >
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户弹出框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="showAssignDialog"
      width="40%"
      >
      <el-form :model="assignForm" :rules="rules" ref="assignForm" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="assign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      // query为查询的关键字
      query: '',
      currentPage: 1,
      pageSize: 2,
      tableData: [],
      showAddDialog: false,
      showEditDialog: false,
      showAssignDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 发送ajax请求来渲染数据
    getUserList() {
      // 绑定数据之后应该发送ajax来请求数据 后面的api应该带着token进行获取数据 不然获取不到数据
      this.axios
        .get('users', {
          params: {
            query: this.query,
            // 当前页码
            pagenum: this.currentPage,
            // 每页显示条数
            pagesize: this.pageSize
          }
        })
        .then(res => {
          console.log(res)
          let { meta: { status }, data: { users, total } } = res
          if (status === 200) {
            this.tableData = users
            this.total = total
          }
        })
    },

    // 点击当前页 来渲染数据
    handleCurrentChange(val) {
      // console.log(val)
      // 根据val拿到页数 根据val发送ajax请求 重新渲染页面
      this.currentPage = val
      this.getUserList()
    },

    // 改变每页显示的总数 来渲染数据
    handleSizeChange(val) {
      // val表示每页显示的个数,应该从第一页开始显示
      this.currentPage = 1
      // console.log(val)
      this.pageSize = val
      this.getUserList()
    },

    // 搜索关键字来进行渲染数据
    search() {
      // 通过关键字来进行搜索
      this.currentPage = 1
      this.getUserList()
    },

    // 根据id来进行删除数据
    del(id) {
      // 根据id拿到数据 发送ajax请求进行删除数据
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          return this.axios({
            method: 'delete',
            url: `users/${id}`
          })
        })
        .then(res => {
          // console.log(res)
          let { meta: { status } } = res
          if (status === 200) {
            // 表示删除成功 需要重新渲染页面
            if (this.tableData.length === 1 && this.currentPage > 1) {
              this.currentPage = this.currentPage - 1
            }
            this.getUserList()
          }
          this.$message.success('删除成功了')
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    },
    // 改变用户状态
    changeState(user) {
      this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`
      }).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          // 修改成功 应该重新渲染页面
          this.getUserList()
        }
      })
    },
    // 点击确认添加数据
    addUser() {
      // 关闭模态框 效验表单 发送请求

      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 效验成功
          this.axios({
            method: 'post',
            url: 'users',
            data: this.addForm
          }).then(res => {
            let { meta: { status } } = res
            if (status === 201) {
              // 修改成功 退出模态框 重新渲染页面 并且应该在最后一个页面
              this.showAddDialog = false
              // 此时的total是渲染之前的 浏览器里少一条 所以total++
              this.total++
              this.currentPage = Math.ceil(this.total / this.pageSize)
              this.getUserList()
              // 重置表单
              this.$refs.addForm.resetFields()
            }
          })
        }
      })
    },
    // 点击编辑
    showeditUser(users) {
      this.showEditDialog = true
      this.editForm.id = users.id
      this.editForm.username = users.username
      this.editForm.mobile = users.mobile
      this.editForm.email = users.email
    },
    editUser() {
      // 验证表单 发送ajax请求
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 效验成功 发送ajax请求
          this.axios({
            method: 'put',
            url: `users/${this.editForm.id}`,
            data: this.editForm
          }).then(res => {
            // console.log(res)
            let { meta: { status } } = res
            if (status === 200) {
              // 关闭模态框
              this.showEditDialog = false
              // 修改成功 重新渲染页面
              this.getUserList()
              // 清空内容
              this.$refs.editForm.resetFields()
            }
          })
        }
      })
    },
    // 显示分配用户框
    async showAssign(user) {
      this.showAssignDialog = true
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      // 获取角色列表的数据
      this.getRoleList()
      // 需要回显角色的名字 select绑定的是rid 所以需要拿到rid值
      let res = await this.axios.get(`users/${user.id}`)
      console.log(res)
      let { data: { rid }, meta: { status } } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
    },
    // 提交分配用户
    assign() {
      this.$refs.assignForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
          rid: this.assignForm.rid
        })
        console.log(res)
        let { meta: { status } } = res
        if (status === 200) {
          // 关闭模态框
          this.showAssignDialog = false
          // 重置表单
          this.$refs.assignForm.resetFields()
          // 重新渲染页面
          this.getUserList()
          // 显示成功消息
          this.$message.success('分配成功')
        }
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.el-input {
  width: 400px;
  margin-bottom: 10px;
}
</style>
