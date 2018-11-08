<template>
  <div class='home'>
    <el-container>
      <el-header>
        <div class="login"></div>
        <div class="title">电商后台管理系统</div>
        <div class="logout">
          欢迎光临
          <a href="#">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {}
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
    }
    .el-main {
      background-color: #d4dfe4;
    }
  }
}
</style>
