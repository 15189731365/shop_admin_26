<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type='success' plain>添加角色</el-button>
    <!-- 表格功能 -->
    <el-table
      :data="rightList"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <!-- scope.row.level的值是字符串 -->
          <span v-if='scope.row.level==="0"'>一级</span>
          <span v-else-if='scope.row.level==="1"'>二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {},
  created() {
    // 发送请求获取到数据
    this.axios.get(`rights/list`).then(res => {
      console.log(res)
      let { data, meta: { status } } = res
      if (status === 200) {
        // 渲染页面
        this.rightList = data
      }
    })
  }
}
</script>

<style lang='less' scoped>
</style>
