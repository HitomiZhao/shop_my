<template>
  <el-table :data="rightsList" style="width: 100%">
    <el-table-column type="index" :index="indexMethod"></el-table-column>
    <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
    <el-table-column prop="path" label="路径" width="180"></el-table-column>
    <el-table-column prop="level" label="等级">
      <template slot-scope="scope">
        <span v-show="scope.row.level== 0 ">一级</span>
        <span v-show="scope.row.level== 1 ">二级</span>
        <span v-show="scope.row.level== 2 ">三级</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      rightsList: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          tag: '公司'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333,
          tag: '家'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
          tag: '公司'
        }
      ]
    }
  },
  created() {
    this.loadRightsList()
  },
  methods: {
    indexMethod(index) {
      return index
    },
    // 获取权限列表数据
    async loadRightsList() {
      let res = await this.$axios.get('rights/list')
      console.log(res)
      this.rightsList = res.data.data
    }
  }
}
</script>

<style scoped lang="less">
</style>
