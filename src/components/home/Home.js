/*eslint-disable */
export default {
  data() {
    return {
      menusList: []
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    logout() {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$message({
            type: 'success',
            message: '退出成功!',
            duration: 1000
          })
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
            duration: 1000
          })
        })
    },
    // 左侧菜单栏
    async getMenus() {
      let res = await this.$axios.get('menus')
      console.log(res)
      this.menusList = res.data.data
    }
  }
}
