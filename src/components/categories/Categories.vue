<template slot-scope="scope">
  <div>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加按钮</el-button>
    <!-- 渲染列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="180"
        tree-key="cat_id"
        parent-key="cat_pid"
        levelKey="cat_level"
        :indentSize="30"
      ></el-table-tree-column>

      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.cat_deleted? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePagination"
      :page-size="4"
    ></el-pagination>
    <!-- 添加按钮的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogAddCateVisible">
      <el-form :model="addCateform" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级名称">
          <el-cascader
            :options="options"
            change-on-select
            :props="defaultProp"
            v-model="addCateform.cat_pid_arr"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="startAddCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      tableData: [
        {
          cat_name: '王小虎',
          cat_deleted: false,
          cat_level: 0
        }
      ],
      total: 0,
      pagenum: 1,
      pagesize: 4,
      // 添加按钮的对话框
      dialogAddCateVisible: false,
      addCateform: {
        cat_name: '',
        cat_pid_arr: []
      },
      // 级联选择器
      options: [
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created() {
    this.getCategoriesList()
    this.getCategoriesList1()
  },
  methods: {
    // 获取数据
    async getCategoriesList(pagenum = 1) {
      let res = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum,
          pagesize: 4
        }
      })
      console.log(res)
      this.tableData = res.data.data.result
      this.total = res.data.data.total
    },
    // 分页
    changePagination(curPage) {
      console.log(curPage)
      this.getCategoriesList(curPage)
    },
    // 级联选择器数据渲染  获取二级选择器数据
    async getCategoriesList1() {
      let res = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(res)
      this.options = res.data.data
    },
    // 点击展示对话框
    showAddDialog() {
      this.dialogAddCateVisible = true
    },
    // 开始添加数据
    async startAddCate() {
      const { cat_name, cat_pid_arr } = this.addCateform
      let res = await this.$axios.post('categories', {
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1],
        cat_name,
        cat_level: cat_pid_arr.length
      })
      console.log(res)
      if (res.data.meta.status === 201) {
        this.dialogAddCateVisible = false
        this.getCategoriesList()
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
