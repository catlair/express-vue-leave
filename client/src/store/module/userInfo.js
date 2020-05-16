import request from "../../plugins/axios/request";

//用于存储所有留言用户的信息
const state = {
  data: []
}

const actions = {
  async getUserInfo({state, commit}, _id) {

    let index = state.data.findIndex((item) => {
      return item._id === _id;
    })

    if (index === -1) {
      state.data.push({
        _id,
        nickname: ''
      })
      let res = await request.getUser(_id);
      let {code, data} = res.data;
      if (code === 200) {
        commit('saveUserInfo', data)
      }
    }
  }
}

const mutations = {
  saveUserInfo(state, data) {
    let {_id = '', nickname = ''} = data;
    state.data.forEach( item => {
      if(item._id === _id){
        item.nickname = nickname;
      }
    })
    state.data.push(data)
  }
}

export default {
  state,
  actions,
  mutations
}