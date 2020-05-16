<template>
  <div class="login-from">
    <div class="form">
      <h1>用户注册</h1>
      <el-form label-position="left" ref="loginForm" status-icon label-width="80px" :model="user" :rules="rules">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="user.rePassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-col :span="18">
            <el-input v-model="user.code"></el-input>
          </el-col>
          <img
                  class="verify-code"
                  :src="codeImg"
                  alt="验证码"
                  @click="getVerifyCode">
        </el-form-item>
        <el-form-item label-width="0">
          <el-button
                  type="primary"
                  @click="submitForm('loginForm')"
          >提交
          </el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="router-link">
        <el-link :underline="false" @click="registerRouter" class="router-link">已经有账号了,去登录</el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import request from "../plugins/axios/request";

  export default {
    name: "Login",
    data() {
      return {
        user: {
          nickname: '',
          username: '',
          password: '',
          rePassword: '',
          code: '',
          codeToken: ''
        },
        codeImg: '',
        rules: {
          username: [
            {validator: this.validateUsername, required: true, trigger: 'blur'}
          ],
          password: [
            {validator: this.validatePass, required: true, trigger: 'blur'}
          ],
          rePassword: [
            {validator: this.validateRePass, required: true, trigger: ['blur', 'change']}
          ],
          nickname: [
            {validator: this.validateNickname, required: true, trigger: 'blur'}
          ],
          code: [
            {validator: this.validateCode, required: true, trigger: 'blur'}
          ]
        }
      };
    },
    async created() {
      window.addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
          this.regUser()
        }
      })
      await this.getVerifyCode();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.regUser()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      registerRouter() {
        this.$router.push('/login');
      },
      validateUsername(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入用户账号'));
        } else {
          callback();
        }
      },
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入用户密码'));
        } else {
          callback();
        }
      },
      validateRePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      validateNickname(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入用户昵称'));
        } else {
          callback();
        }
      },
      validateCode(rule, value, callback) {
        if (value === '') {
          callback(new Error('验证码不能为空'))
        } else {
          callback()
        }
      },
      async getVerifyCode() {
        let {data, status} = await request.getVerifyCode()
        if (status === 200) {
          this.codeImg = data.data.img;
          this.user.codeToken = data.data.token;
        }
      },
      async regUser() {
        let res = await request.regUser(this.user);
        this.$message({
          message: res.data.msg,
          type: res.data.code === 200 ? 'success' : 'error',
          showClose: true,
        });
        if (res.data.code !== 200) {
          await this.getVerifyCode();
          return
        }
        //自动跳转到登陆页面
        await this.$router.push('/login');
      }
    }
  }
</script>