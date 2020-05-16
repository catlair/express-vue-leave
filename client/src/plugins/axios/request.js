import instance from './index'

export default {
  // 获取验证码
  getVerifyCode() {
    return instance.get('/verifycode');
  },
  // 用户注册
  regUser(data) {
    return instance.post('/user/reg', data);
  },
  // 用户登录
  loginUser(data) {
    return instance.post('/user/login', data);
  },
  // 添加留言
  addLeave(data) {
    return instance.post('/leave', data);
  },
  // 获取留言
  getLeave(data) {
    let {page = 1, size = 10} = data;
    return instance.get(`/leave?page=${page}&size=${size}`);
  },
  // 删除留言
  delLeave(id) {
    return instance.delete(`/leave/${id}`);
  },
  // 根据用户id获取用户信息
  getUser(id) {
    return instance.get(`/user?_id=${id}`);
  }
}