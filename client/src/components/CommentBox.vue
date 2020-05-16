<template>
  <div class="comment-box">
    <div class="box-title">
      <p>
        留下点什么吧...
        <el-button @click="exitLogin">退出登录</el-button>
      </p>
    </div>
    <el-row>
      <el-col :span="5" class="user-info">
        <el-avatar :size="120"
                   src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
        <p class="nickname">{{nickname}}</p>
      </el-col>
      <el-col :span="19">
        <el-input
                type="textarea"
                placeholder="最多150个字符"
                v-model="content"
                :rows="6"
                resize="none"
                maxlength="150"
                show-word-limit
        >
        </el-input>
      </el-col>
    </el-row>
    <div class="publish">
      <el-button
              size="medium"
              type="primary"
              :disabled="false"
              @click="publish"
      >发表
      </el-button>
    </div>
  </div>
</template>

<script>
  import request from "../plugins/axios/request";

  export default {
    name: "CommentBox",
    data() {
      return {
        content: ''
      }
    },
    computed: {
      nickname() {
        return this.$store.state.user.nickname;
      }
    },
    methods: {
      exitLogin() {
        this.$router.push('/login')
        this.$message({
          message: '退出登录成功!',
          type: 'success',
          showClose: true,
        });
      },
      async publish() {
        if (this.content === '') {
          this.$message({
            message: '你还是说点什么吧!',
            type: 'info',
            showClose: true,
          });
        } else {
          let res = await request.addLeave({content: this.content});
          let {code, msg, data = {}} = res.data;
          if (code === 200) {
            this.content = "";
            //保存用户_id
            data.user_id = this.$store.state.user._id;
            this.$emit("addData");
            this.$message({
              message: msg,
              type: 'success',
              showClose: true,
            });
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .comment-box {
    width: 800px;
    margin: auto;
    box-sizing: border-box;
    border: 1px solid #ccc;
    text-align: left;
    padding: 5px;

    .box-title {
      position: relative;
      font-size: 22px;
      font-weight: 700;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;

      .el-button {
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .user-info {
      text-align: center;

      .nickname {
        font-size: 18px;
        font-weight: bold;
        margin: 10px 0;
      }
    }

    .el-textarea {
      font-size: 16px;
    }

    .publish {
      text-align: right;

      .el-button {
        margin: 10px auto;
        padding: 10px 40px;
      }
    }
  }
</style>