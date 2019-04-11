<template slot-scope="scope">
  <div>
    <!-- 添加商品的按钮 -->
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 列表渲染 -->
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价值" width="180"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | dateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="4"
      @current-change="changePagination"
    ></el-pagination>
  </div>
</template>

<script>
/*eslint-disable */
import moment from 'moment'
export default {
  data() {
    return {
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.loadGoodsList()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    // 商品列表渲染
    async loadGoodsList(pagenum = 1) {
      let res = await this.$axios.get('goods', {
        params: {
          query: '',
          pagenum,
          pagesize: 4
        }
      })
      console.log(res)
      this.goodsList = res.data.data.goods
      this.total = res.data.data.total
    },
    // 分页功能
    changePagination(curPage) {
      this.loadGoodsList(curPage)
    }
  },
  // 过滤时间
  filters: {
    dateFilter(res) {
      return moment(res).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style>
</style>
