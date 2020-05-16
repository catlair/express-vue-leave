<template>
  <div class="home">
    <h1>Vue+Koa+Mongodb 小练习</h1>
    <CommentBox @addData="addData"/>
    <div class="comment-list">
      <div class="comment-item-title" v-if="commentData.length !== 0">
        <p>留言列表:</p>
      </div>
      <div class="empty-comment" v-else>
        还没有留言...
      </div>
      <CommentItem
              v-for="item in commentData"
              :key="item._id"
              :comment="item"
              @delLeave="delLeave"/>
      <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pagination.size"
              :current-page.sync="pagination.page"
              :hide-on-single-page="false"
              :total="pagination.total"
              @current-change="turnPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import CommentBox from "../components/CommentBox";
  import CommentItem from "../components/CommentItem";

  import request from "../plugins/axios/request";


  export default {
    name: 'Home',
    components: {
      CommentBox,
      CommentItem
    },
    data() {
      return {
        pagination: {
          page: 1,
          size: 10,
          total: 0
        },
        commentData: []
      }
    },
    mounted() {
      this.getLeave()
    },
    methods: {
      addData() {
        // //在数组最前面追加数据
        // this.commentData.unshift(data);
        // //总数+1
        // this.pagination.total = Number(this.pagination.total) + 1;
        //回到第一页:
        this.pagination.page = 1;
        this.getLeave()
      },
      async getLeave() {
        let res = await request.getLeave({
              size: this.pagination.size,
              page: this.pagination.page
            }
        )
        this.commentData = res.data.data.list.sort((a, b) => {
          return b.createTime - a.createTime;
        })
        this.pagination = res.data.data.pagination
      },
      turnPage() {
        this.getLeave()
      },
      delLeave() {
        this.getLeave();
      }
    }
  }
</script>
<style lang="scss">
  .home {
    margin: 20px auto 40px auto;

    h1 {
      margin-bottom: 20px;
    }

    .comment-item-title {
      text-align: left;
      font-size: 22px;
      font-weight: 700;
      margin: 20px auto;
    }

    .comment-list {
      width: 800px;
      margin: auto;
      position: relative;

      .empty-comment {
        font-size: 22px;
        color: #ccc;
        margin: 20px 0;
      }
    }
  }
</style>