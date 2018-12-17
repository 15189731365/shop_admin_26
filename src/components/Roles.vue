<template>
  <div class="roles">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type='success' plain @click='addRoleDialog=true'>添加角色</el-button>
    <!-- 表格功能 -->
    <el-table
      :data="roleList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if='scope.row.children.length===0'>暂无数据</el-row>
          <!-- 一级权限 -->
          <el-row v-for="level1 in scope.row.children" :key='level1.id' class="level1">
            <el-col :span='4'><el-tag closable @close='deleteRight(scope.row,level1.id)'>{{level1.authName}}</el-tag></el-col>
            <el-col :span='20'>
              <!-- 二级权限 -->
              <el-row v-for='level2 in level1.children' :key="level2.id" class="level2">
                <el-col :span='4'><el-tag closable type='success' @close='deleteRight(scope.row,level2.id)'>{{level2.authName}}</el-tag></el-col>
                <el-col :span='20'>
                  <!-- 三级权限 -->
                  <el-tag class="level3" closable type='danger' v-for="level3 in level2.children" :key='level3.id' @close='deleteRight(scope.row,level3.id)'>{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size='small' plain type="primary" icon="el-icon-edit" @click='showedit(scope.row.id)'></el-button>
          <el-button size='small' plain type="danger" icon="el-icon-delete" @click='del(scope.row.id)'></el-button>
          <el-button size='small' plain type="success" icon="el-icon-check" @click='showAssignRight(scope.row)'>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="assignDialogVisible"
      width="40%">
      <!-- show-checkbox表示前面的选中框
           default-expand-all 表示全部展开
           data 对应的树状图数据
       -->
      <el-tree ref='tree' :data="rightList" :props="defaultProps" show-checkbox default-expand-all node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRight()'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="addRoleDialog"
      width="40%">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click='addRole'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="editRoleDialog"
      width="40%">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click='editRole'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {
        roleName: '',
        roelDesc: ''
      },
      editForm: {
        roleName: '',
        roelDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' }
        ]
      },
      roleList: [],
      assignDialogVisible: false,
      addRoleDialog: false,
      editRoleDialog: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleid: ''
    }
  },
  methods: {
    // 获取权限数据
    async getRightList() {
      // 发送ajax请求 将所有的权限请求回来
      let res = await this.axios.get(`rights/tree`)
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 获取角色数据
    async getRoleList() {
      let res = await this.axios.get('roles')
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 删除角色指定权限
    async deleteRight(role, rightid) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightid}`)
      console.log(res)
      // 重新渲染页面
      let { data, meta: { status } } = res
      // 不应该整个页面重新渲染 而是权限的数据改变就可以
      // this.getRoleList()
      if (status === 200) {
        role.children = data
        this.$message.success('删除成功')
      }
    },
    // 展示权限分配框
    async showAssignRight(role) {
      this.roleid = role.id
      // 让模态框显示
      this.assignDialogVisible = true
      // 发送ajax请求 将所有的权限请求回来
      // let res = await this.axios.get(`rights/tree`)
      // console.log(res)
      // let { data, meta: { status } } = res
      // if (status === 200) {
      //   this.rightList = data
      // }
      this.getRightList()
      // 请求回来的数据还没有渲染到页面上，需要在nextTick中回调进行，拿到数据
      this.$nextTick(() => {
        // 获取到三级权限的id 放到数组里 就可以让对应的显示
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 修改权限
    async assignRight() {
      // 获取到半选状态的id
      let half = this.$refs.tree.getHalfCheckedKeys()
      // 获取到选中状态的id
      let checked = this.$refs.tree.getCheckedKeys()
      // 拼接成数组
      let all = [...half, ...checked]

      // console.log(this.roleid)
      let res = await this.axios.post(`roles/${this.roleid}/rights`, {
        rids: all.join()
      })
      console.log(res)
      let { meta: { status } } = res
      if (status === 200) {
        // 更新成功 关闭模态框
        this.assignDialogVisible = false
        // 重新渲染页面
        this.getRoleList()
      }
    },
    // 添加角色
    addRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.post('roles', this.addForm)
        console.log(res)
        if (res.meta.status === 201) {
          // 关闭模态框
          this.addRoleDialog = false
          // 重新渲染页面
          this.getRoleList()
          // 重置表单
          this.$refs.addForm.resetFields()
          // 提示信息
          this.$message.success('添加成功')
        }
      })
    },
    // 展示编辑模态框
    async showedit(id) {
      this.editRoleDialog = true
      // 回显数据
      let res = await this.axios.get(`roles/${id}`)
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        this.editForm.roleName = data.roleName
        this.editForm.roleDesc = data.roleDesc
        this.roleid = data.roleId
      }
    },
    // 提交编辑
    editRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 发送请求编辑
        let res = await this.axios.put(`roles/${this.roleid}`, this.editForm)
        let { meta: { status } } = res
        if (status === 200) {
          // 关闭模态框 重新渲染
          this.editRoleDialog = false
          this.getRoleList()
          this.$refs.editForm.resetFields()
          this.$message.success('修改成功')
        }
      })
    },
    // 删除角色
    async del(id) {
      try {
        await this.$confirm('确定删除信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${id}`)
        let { meta: { status } } = res
        if (status === 200) {
          this.$message.success('删除成功')
          this.getRoleList()
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang='less' scoped>
.level1 {
  .level2 {
    margin-bottom: 10px;
    .level3 {
      margin-bottom: 5px;
      margin-right: 10px;
    }
  }
}
</style>
