<template slot-scope="scope">
  <div>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand" :index="indexMethod">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id" class="row1">
            <el-col :span="4">
              <el-tag closable>{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id" class="row2">
                <el-col :span="4">
                  <el-tag closable type="success">{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="item3 in item2.children"
                    type="warning"
                    closable
                    :key="item3.id"
                    class="tag"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="showTree(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog title="角色授权" :visible.sync="dialogTreeVisible">
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expand-all="true"
        ref="tree"
      ></el-tree>
      <div slot="footer">
        <el-button @click="dialogTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="startAssign">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      roleList: [],
      dialogTreeVisible: false,
      data2: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      id: 0
    }
  },
  created() {
    this.loadUserList()
    this.TreeData()
  },
  methods: {
    indexMethod(index) {
      return index
    },
    // 加载角色列表
    async loadUserList() {
      let res = await this.$axios.get('roles')
      // console.log(res)
      this.roleList = res.data.data
    },
    // 树形数据渲染
    async TreeData() {
      let res = await this.$axios.get('rights/tree')
      // console.log(res)
      this.data2 = res.data.data
    },
    // 点击分配时弹出对话框,并且选中状态更新
    showTree(row) {
      this.dialogTreeVisible = true
      this.id = row.id
      let keys = []
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            keys.push(item3.id)
          })
        })
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    async startAssign() {
      let key1 = this.$refs.tree.getCheckedKeys()
      let key2 = this.$refs.tree.getHalfCheckedKeys()
      let keys = [...key1, ...key2]
      let res = await this.$axios.post(`roles/${this.id}/rights`, {
        rids: keys.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogTreeVisible = false
        this.loadUserList()
      }
    }
  }
}
</script>

<style scoped lang="less">
.row1 {
  border-bottom: 1px dashed blue;
  margin-bottom: 10px;
}
.row2 {
  margin-bottom: 10px;
}
.tag {
  margin: 0px 3px;
}
</style>
