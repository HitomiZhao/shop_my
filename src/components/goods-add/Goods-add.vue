<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs tab-position="left" @tab-click="clickTabs" v-model="activeName">
      <el-tab-pane label="基本信息" name="one">
        <el-form ref="form" :model="goodsAddForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsAddForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsAddForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsAddForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              change-on-select
              :props="defaultProp"
              v-model="goodsAddForm.goods_cat"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio :label="true" v-model="goodsAddForm.goods_isPormotion"
              >是</el-radio
            >
            <el-radio :label="false" v-model="goodsAddForm.goods_isPormotion"
              >否</el-radio
            >
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next('two', 2)">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="two">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="uploadPic"
          :headers="headers"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-button type="primary" @click="next('three', 3)">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="three" class="father">
        <quill-editor
          v-model="goodsAddForm.goods_introduce"
          ref="myQuillEditor"
          :options="editorOption"
        >
        </quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/*eslint-disable */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 1,
      activeName: 'three',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 级联选择器数据
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        }
      ],
      goodsAddForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        goods_isPormotion: false,
        goods_introduce: '',
        pics: []
      },
      editorOption: {
        placeholder: '哈哈'
      },
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 图片
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.goodsCate()
  },
  methods: {
    clickTabs(el) {
      this.active = +el.index + 1
    },
    // 点击下一步事件
    next(step, el) {
      this.active = el
      this.activeName = step
    },
    // 商品分类渲染
    async goodsCate() {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      this.options = res.data.data
    },
    // 图片上传
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadPic(res) {
      console.log(res.data.tmp_path)
      this.goodsAddForm.pics.push({
        pic: res.data.tmp_path
      })
    },
    // 添加商品
    async addGoods() {
      const {
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        goods_isPormotion
      } = this.goodsAddForm
      let res = await this.$axios.post('goods', {
        goods_name,
        goods_cat: goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        goods_isPormotion
      })
      if (res.data.meta.status === 201) {
        this.$router.push('/goods')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
<style lang="less">
.father /deep/ .ql-editor {
  height: 300px;
  background-color: yellow;
}
</style>
