<template>
  <div class='home'>
    <el-container>
      <el-header>
        <div class="login"></div>
        <div class="title">电商后台管理系统</div>
        <div class="logout">
          欢迎光临
          <a href="javescript:;" @click='logout'>退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- default-active 表示当前的展示导航高亮 可以通过导航的route
               el-menu 表示导航栏菜单
               el-submenu 表示是一级菜单
               template 表示是一级菜单的内容
               el-menu-item 表示是二级菜单
               unique-opened 加在menu属性中 表示是否只展开一个子菜单
               router 开启路由 可以通过点击菜单的 通过index来进行组件间的跳转

           -->
          <el-menu
            :default-active="$route.path.slice(1).split('-')[0]"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router>
            <el-submenu :index="item.path" v-for='item in roleList' :key='item.id'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单项 -->
              <el-menu-item :index="item2.path" v-for='item2 in item.children' :key='item2.id'>
                <i class="el-icon-menu"></i>
                <span slot="title">{{item2.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    logout() {
      // 点击弹出模态框
      this.$confirm('确定是否退出?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 点击确定 相当于退出登录 需要删除token，并且跳转到登陆页面 不需要发送ajax请求
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功'
          })
        })
        .catch(() => {
          // 点击取消
          this.$message({
            type: 'error',
            message: '已取消退出'
          })
        })
    }
  },
  async created() {
    // 获取左侧菜单栏的权限数据
    let res = await this.axios.get(`menus`)
    console.log(res)
    let { data, meta: { status } } = res
    if (status === 200) {
      this.roleList = data
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      padding: 0 200px;
      background-color: #b3c1cd;
      position: relative;
      .login {
        position: absolute;
        left: 20px;
        top: 0;
        width: 180px;
        height: 60px;
        background-image: url('../assets/logo.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .logout {
        position: absolute;
        right: 20px;
        top: 0;
        width: 200px;
        height: 60px;
        line-height: 60px;
        text-align: right;
        font-weight: bolder;
        a {
          color: darkorange;
        }
      }
      .title {
        line-height: 60px;
        text-align: center;
        font-weight: bolder;
        font-size: 28px;
        color: white;
      }
    }
    .el-aside {
      background-color: #545c64;
      .el-menu {
        border-right: none;
      }
    }
    .el-main {
      background-color: #d4dfe4;
    }
  }
}
</style>
