<template>
  <div class='login'>
    <!-- 是通过form来管理数据的 传入一个对象
         el-form是组件  在页面标签中自动生成el-form类名
         ref 可以获取到dom对象 或者组件
     -->
<el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
  <img src="../assets/avatar.jpg" alt="">
  <el-form-item label="用户名" prop='username'>
    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop='password'>
    <el-input v-model="form.password" placeholder="请输入密码" type='password'></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm">登陆</el-button>
    <el-button @click='resetForm'>重置</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
// 引入axios
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单效验的规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        // 效验看是否成功 成功为true 失败为false
        if (valid) {
          // 表示效验成功,发送ajax请求
          axios
            .post('http://localhost:8888/api/private/v1/login', this.form)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success('登陆成功')
                // 将token存储到localStorage.setItem ,这个必须放在跳转之前 不然通不过路由守卫
                localStorage.setItem('token', res.data.data.token)
                // 验证成功，跳到首页
                this.$router.push('/home')
              } else {
                // 验证不通过 弹出消息框
                this.$message.error(res.data.meta.msg)
              }
            })
        } else {
          console.log('没通过')
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background: #fff;
    margin: 200px auto;
    padding: 70px 40px 15px;
    position: relative;
    border-radius: 20px;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -80px;
      border: 10px solid #fff;
      border-radius: 50%;
    }
    .el-button:nth-child(2) {
      margin-left: 80px;
    }
  }
}
</style>
