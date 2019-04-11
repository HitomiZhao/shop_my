/*eslint-disable */
export default {
  data() {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    startLogin() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return
        }
        let res = await this.$axios.post('login', this.ruleForm)
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          localStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
    },
    // submitForm (formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       alert('submit!')
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
