import Vue from 'vue';
import axios from "axios";
import store from '../../store';
import router from "../../router";


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: 'http://47.107.50.221:3001/api',
  timeout: 10000,
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

//request拦截器
_axios.interceptors.request.use(
    config => {
      // 每次发送请求，检查 vuex 中是否有token,如果有放在headers中
      if (store.state.user.token) {
        config.headers.Authorization = store.state.user.token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

//response interceptor 响应拦截器
_axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      let {response} = error;
      if (response != null) {
        // 未登录时,服务器设置的返回401
        if (response.status === 401) {
          let msg = response.data || '请重新登录!';
          alert(msg);
          store.commit("remove")  // token过期,清除
          router.replace({ //跳转到登录页面
            path: '/login',
            // 添加一个重定向后缀，等登录以后再到这里来
            query: {redirect: router.currentRoute.fullPath}
          }).then(r => {
            console.error(r);
          });
          return Promise.reject(error.response);
        }
      } else {
        console.log(error)
      }
      return Promise.reject(error);
    }
);

// eslint-disable-next-line no-unused-vars
Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default _axios;