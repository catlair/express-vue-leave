<template>
  <div class="login-from">
    <div class="form">
      <h1>用户登录</h1>
      <el-form label-position="left" ref="loginForm" status-icon label-width="80px" :model="user" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-col :span="18">
            <el-input v-model="user.code"></el-input>
          </el-col>
          <img
                  :src="codeImg"
                  alt="验证码"
                  class="verify-code"
                  @click="getVerifyCode">
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="router-link">
        <el-link :underline="false" @click="registerRouter">没有账号,前去注册</el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '../plugins/axios/request'

  export default {
    name: "Login",
    data() {
      return {
        user: {
          username: '',
          password: '',
          codeToken: '',
          code: ''
        },
        codeImg: '',
        rules: {
          username: [
            {validator: this.validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: this.validatePass, trigger: 'blur'}
          ],
          code: [
            {validator: this.validateCode, trigger: 'blur'}
          ]
        }
      };
    },
    async created() {
      await this.getVerifyCode();
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginUser();
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
        this.$router.push('/register');
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
      async loginUser() {
        let res = await request.loginUser(this.user);
        let {code, msg, data = {}} = res.data;
        this.$message({
          message: msg,
          type: code === 200 ? 'success' : 'error',
          showClose: true,
        });
        //失败重新获取验证码
        if (code !== 200) {
          await this.getVerifyCode();
        } else {
          //成功后保存登录信息,跳转至首页
          this.$store.commit('save', {
            _id: data._id,
            token: data.token,
            nickname: data.nickname
          })

          await this.$router.push('/home');
        }
      }
    }
  }
</script>