<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left">
      <div class="title-container">
        <h2 class="title">登录技术管理系统</h2>
      </div>

      <el-form-item prop="username">
        <span class="icon el-icon-s-custom"></span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="icon el-icon-lock"></span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <i class="icon el-icon-view" @click="showPwd" ref="eyeIcon"></i>
      </el-form-item>

      <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span>username: admin</span>
        <span>password: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      passwordType: 'password',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'text') {
        this.passwordType = 'password'
        this.$refs.eyeIcon.style.color = '#889aa4'
      } else {
        this.passwordType = 'text'
        this.$refs.eyeIcon.style.color = '#409EFF'
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLogin () {
      this.loading = true
      this.submitForm('loginForm')
      this.$axios.fetchPost('http://47.100.56.42:8068/oauth/token', {
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then((res) => {
        this.loading = false
        if (res.data.statuscode === 200) {
          this.$store.commit('login', res.data.content.accessToken)
          this.$router.push({
            path: '/Tech/TechHome'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 460px;
    max-width: 100%;
    padding-top: 160px ;
    margin: 0 auto;
    overflow: hidden;
    .title-container{
      margin-bottom: 30px;
      text-align: center;
      .title{
        color:#fff;
      }
    }
    .el-form-item{
      position: relative;
      margin-bottom: 30px;
      .icon{
        display: inline-block;
        width: 40px;
        text-align: center;
        color:#409EFF;
        font-size: 20px;
        vertical-align: middle;
        position:absolute;
        left:0;
        top:10px;
        z-index: 2;
        &.el-icon-view{
          color:#889aa4;
          left:initial;
          right: 20px;
          cursor: pointer;
        }
      }
      .el-input__inner{
        padding-left: 40px!important;
      }
    }
    .el-button{
      width: 100%;
      margin-bottom: 30px;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
