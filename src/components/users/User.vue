<template slot-scope="scope">
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryText">
          <el-button slot="append" icon="el-icon-search" @click="queryResult"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button @click="showAddUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <div>
            <el-switch
              v-model="scope.row.mg_state"
              active-text="按月付费"
              @change="changeState(scope.row)"
            ></el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="mini"
              @click="showAssignDialog(scope.row)"
            >分配角色</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="2"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
    <!-- 添加的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUserVisible">
      <el-form
        :model="addUserForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="startAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog title="收货地址" :visible.sync="dialogEditUserVisible">
      <el-form :model="EditForm" label-width="100px">
        <el-form-item label="用户名">
          <el-tag type="info" v-model="EditForm.username" autocomplete="off">{{EditForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="EditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="EditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="startEditUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogAssignRolesVisible">
      <el-form :model="AssignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag
            v-model="AssignForm.username"
            autocomplete="off"
            type="primary"
          >{{AssignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" prop="region">
          <el-select v-model="AssignForm.roleName" placeholder="请选择角色">
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in roleList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      userList: [
        {
          username: '王小虎',
          email: '2016-05-02',
          mobile: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      total: 0,
      pagenum: 1,
      queryText: '',
      dialogAddUserVisible: false,
      addUserForm: {
        username: '测试',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ]
      },
      // 编辑
      dialogEditUserVisible: false,
      EditForm: {
        username: '',
        email: '',
        mobile: '',
        id: 0
      },
      // 分配角色
      dialogAssignRolesVisible: false,
      AssignForm: {
        username: '',
        roleName: '',
        id: 0,
        rid: ''
      },
      // 声明一个空数组,盛放数据
      roleList: []
    }
  },
  created() {
    const curpage = this.$route.params.page
    console.log(curpage)
    this.loadUserList(curpage)
    this.loadRolesList()
  },
  methods: {
    // 获取用户数据列表
    async loadUserList(pagenum = 1, query) {
      let res = await this.$axios.get('users', {
        params: {
          query,
          pagenum,
          pagesize: 2
        }
      })
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
        this.pagenum = res.data.data.pagenum
      }
    },
    // 分页效果
    changePage(pagenum, query) {
      this.$router.push('/users/' + pagenum)
      this.loadUserList(pagenum, this.queryText)
    },
    // 状态
    async changeState(row) {
      console.log(row)
      const { id, mg_state } = row
      let res = await this.$axios.put(`users/${id}/state/:type`, {
        type: mg_state
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: '用户状态设置成功',
          type: 'success',
          duration: 1000
        })
      }
    },
    // 删除功能
    async delUser(id) {
      try {
        await this.$confirm('此操作将删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$axios.delete('users/' + id)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1000
          })
          this.loadUserList(1)
        } else {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          })
        }
      } catch (error) {}
    },
    // 查询功能
    queryResult() {
      this.loadUserList(1, this.queryText)
    },
    //点击添加,弹出对话框
    showAddUserDialog() {
      this.dialogAddUserVisible = true
    },
    // 点击确定发送请求,渲染页面
    async startAddUser() {
      let res = await this.$axios.post('users', this.addUserForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 1000
        })
        this.dialogAddUserVisible = false
        this.loadUserList()
      }
    },
    // 点击编辑弹出对话框
    showEditDialog(row) {
      console.log(row)
      const { id, username, email, mobile } = row
      this.dialogEditUserVisible = true
      this.EditForm.username = username
      this.EditForm.email = email
      this.EditForm.mobile = mobile
      this.EditForm.id = id
    },
    // 点击编辑的确定时,发送请求
    async startEditUser() {
      const { id, email, mobile } = this.EditForm
      let res = await this.$axios.put('users/' + id, {
        email,
        mobile
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogEditUserVisible = false
        this.$message({
          message: '修改数据成功',
          type: 'success',
          duration: 1000
        })
        this.loadUserList(this.pagenum)
      }
    },
    async loadRolesList() {
      let res = await this.$axios.get('roles')
      // console.log(res)
      this.roleList = res.data.data
    },
    // 点击分配角色弹出对话框
    async showAssignDialog(row) {
      const { id, username } = row
      this.dialogAssignRolesVisible = true
      this.AssignForm.username = username
      this.AssignForm.id = id
      // console.log(row)

      let res = await this.$axios.get('users/' + id)
      // console.log(res)
      this.AssignForm.rid = res.data.data.rid
    },
    // 点击确定分配角色
    async assignRoles() {
      const { id, rid, username } = this.AssignForm
      let res = await this.$axios.put(`users/${id}/role`, {
        rid
      })
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogAssignRolesVisible = false
        this.loadUserList()
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
