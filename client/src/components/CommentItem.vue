<template>
  <div class="comment-item">
    <div class="user-info">
      <div class="avatar-box">
        <el-avatar :size="60" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
      </div>
      <div class="other-info">
        <p class="user-name">{{userInfo.nickname}}</p>
        <p class="create-time">{{createTime}}</p>
      </div>
    </div>
    <div class="comment-content" v-text="comment.content">
    </div>
    <div class="del-box" v-show="this.comment.user_id === $store.state.user._id">
      <span class="del-btn" @click="deleteLeave">删除</span>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../plugins/utils'
  import request from "../plugins/axios/request";

  export default {
    name: "CommentItem",
    props: {
      comment: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {}
    },
    async created() {
      await this.$store.dispatch('getUserInfo', this.comment.user_id)
    },
    computed: {
      createTime() {
        return formatDate(this.comment.createTime);
      },
      userInfo() {
        return this.$store.state.userInfo.data.find(item => {
          return item._id === this.comment.user_id;
        })
      }
    },
    methods: {
      deleteLeave() {
        this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await request.delLeave(this.comment._id)
          let {msg, code} = res.data;
          this.$message({
            type: code === 200 ? 'success' : 'error',
            message: msg
          });
          if (code === 200) {
            this.$emit('delLeave');
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style lang="scss">
  .comment-item {
    width: 800px;
    margin: 20px auto;
    text-align: left;
    box-shadow: 0 0 6px #ccc;
    padding: 10px 5px;
    box-sizing: border-box;
    transition: box-shadow .6s;
    position: relative;

    &:hover {
      cursor: pointer;
      box-shadow: 0 5px 20px #ccc;
    }

    .user-info {
      display: flex;

      .avatar-box {
        width: 60px;
        min-width: 60px;
        height: 60px;

        img {
          width: 100%;
          border-radius: 50%;
        }
      }

      .other-info {
        flex: 1;
        padding-left: 10px;

        .user-name {
          font-size: 22px;
          line-height: 40px;
          font-weight: bold;
        }

        .create-time {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }

    .comment-content {
      padding: 10px 5px;
      font-size: 14px;
      word-break: break-all;
    }

    .del-box {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 50px;
      font-size: 18px;
      background-color: rgba(245, 108, 108, 0.8);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px #ccc;

      .del-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
