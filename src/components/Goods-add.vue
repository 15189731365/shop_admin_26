<template>
  <div class="goods-add">
    <!-- 步骤条
    active表示当前显示的-->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏
    activeName表示对应的pane的name 点击切换 -->
    <el-tabs tab-position="left"  v-model='activeName' @tab-click="handleClick">
      <el-tab-pane label="基本信息" name='info'>
        <el-form :model='addForm' label-width='80px'>
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
              <el-cascader :options="options" v-model="addForm.goods_cat" :props="props">
              </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type='success' @click='next'>下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name='pic'>
        <!-- action 指定图片上传的地址
         -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="header"
          :on-success='handleSuccess'
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type='success' @click='nextT'>下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name='content'>
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type='primary' @click='add'>添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        pics: [],
        goods_introduce: ''
      },
      header: { Authorization: localStorage.getItem('token') },
      activeName: 'info',
      options: [],
      props: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      }
    }
  },
  methods: {
    // 点击tab时触发的
    handleClick(tab) {
      console.log(tab)
      this.active = +tab.index
    },
    // 点击下一步 让步骤条上的active改成1 并且
    next() {
      this.active = 1
      this.activeName = 'pic'
    },
    nextT() {
      this.active = 2
      this.activeName = 'content'
    },
    handleSuccess(res) {
      console.log(res)
      let { data: { tmp_path: tmpPath }, meta: { status } } = res
      if (status === 200) {
        this.addForm.pics.push({ pic: tmpPath })
      }
    },
    async add() {
      // this.addForm.goods_cat = this.addForm.goods_cat.join()
      // 不能使用这样的方式 因为goods_cat与级联菜单绑定 所以只能是一个数组
      let res = await this.axios.post(`goods`, {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      console.log(res)
      let { meta: { status } } = res
      if (status === 201) {
        // 创建成功
        this.$router.push('/goods')
        this.$message.success('创建成功')
      }
    }
  },
  async created() {
    let res = await this.axios.get(`categories?type=3`)
    console.log(res)
    let { data, meta: { status } } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang='less' scoped>
// 对于动态生成的标签 是没有随机属性的 但是scoped里写的样式是带有随机属性的 所以需要在前面加上deep
.quill-editor {
  background-color: white;
  /deep/.ql-editor {
    height: 300px;
  }
}
</style>
