import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from "./module/userInfo";

Vue.use(Vuex)

const state = {
  user: {
    _id: window.sessionStorage.getItem('_id') || '',
    nickname: window.sessionStorage.getItem('nickname') || '',
    token: window.sessionStorage.getItem('token') || ''
  }
};
const mutations = {
  //保存用户信息
  save: (state, data) => {
    state.user._id = data._id;
    state.user.token = data.token;
    state.user.nickname = data.nickname;

    window.sessionStorage.setItem('_id', data._id);
    window.sessionStorage.setItem('token', data.token);
    window.sessionStorage.setItem('nickname', data.nickname);
  },
  //清空用户信息
  remove: (state) => {
    state.user.token = '';
    state.user.nickname = '';
    state.user._id = '';

    window.sessionStorage.removeItem('_id');
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('nickname');
  }
};
const actions = {};

export default new Vuex.Store({
  modules: {
    userInfo
  },
  state,
  mutations,
  actions
})
