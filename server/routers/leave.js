const {Comment} = require('../database')

/**
 * @api {get} /leave 获取留言
 * @apiName getLeave
 * @apiGroup Leave
 * @apiVersion 0.1.0
 *
 * @apiParam {Number} page 获取的页码数.
 * @apiParam {Number} size 每一页的留言数量.
 *
 * @apiSuccess {Number} total 留言总数.
 * @apiSuccess {Number} page  获取的页码数.
 * @apiSuccess {Number} size  每一页的留言数量.
 *
 */
async function getLeaves(ctx) {
  let {size = 10, page = 1} = ctx.query;
  /*
     这里分页查询有2种方法：
     1. 第一种方法，就是我这里用到的，用skip跳过多少个，然后limit取到多少个
     2. 第二种方法，在客服端把当前的最后一个的_id给传过来，然后用$lt来找到比当前_id小的。就把page换成最后一个元素的_id
     在效率上来讲，第二种方法效率更高，但是如果你想放回的内容的不是按_id排序的，那还是用第一种方法吧
   */
  try {
    let options = {
      skip: Number((page - 1) * size),
      limit: Number(size),
      sort: {"createTime": "-1"}
    }
    let res = await Comment.find({}, null, options);
    let total = await Comment.countDocuments();
    ctx.body = {
      code: 200,
      msg: '获取留言成功',
      data: {
        list: res,
        pagination: {
          total,
          page: Number(page),
          size: Number(size)
        }
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: "获取留言失败，服务器异常，请稍后再试！"
    }
  }
}

/**
 * @api {post} /leave 添加留言
 * @apiName addLeave
 * @apiGroup Leave
 * @apiVersion 0.1.0
 *
 * @apiHeader {String} Authorization 用户token
 *
 * @apiParam {String} content 留言内容.
 *
 */
async function addLeaver(ctx) {
  let {content = ''} = ctx.request.body;
  if (!ctx._id) {
    ctx.body = {
      code: 401,
      msg: "未授权操作"
    }
    return;
  }
  if (content === '') {
    ctx.body = {
      code: 401,
      msg: "留言失败，请写点什么吧!"
    }
    return;
  }
  if (content.length >= 150) {
    ctx.body = {
      code: 401,
      msg: "你说的太多了，最多只能输入150个字符哦。"
    }
    return;
  }
  try {
    let comment = new Comment({
      user_id: ctx._id,
      content
    });
    let res = await comment.save();
    if (res._id != null) {
      ctx.body = {
        code: 200,
        msg: '留言成功！',
        data: res
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '留言失败，服务器异常，请稍后再试!'
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '留言失败，服务器异常，请稍后再试!'
    }
  }
}

/**
 * @api {delete} /leave/:id 删除留言
 * @apiName deleteLeave
 * @apiGroup Leave
 * @apiVersion 0.1.0
 *
 * @apiHeader {String} Authorization 用户token
 *
 * @apiParam {String} id 留言信息的id.
 *
 */
async function deleteLeaver(ctx) {
  let _id = ctx.params.id;
  if (!ctx._id) {
    ctx.body = {
      code: 401,
      msg: "未授权操作"
    }
    return;
  }
  try {
    let res = await Comment.findOneAndDelete({_id, user_id: ctx._id});
    if (res == null) {
      ctx.body = {
        code: 404,
        msg: '删除留言失败，不存在该留言!'
      }
    } else {
      ctx.body = {
        code: 200,
        msg: '删除留言成功!'
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '删除留言失败，服务器异常!'
    }
  }
}

module.exports = {
  addLeaver,
  deleteLeaver,
  getLeaves
}