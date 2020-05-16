import Vue from 'vue'
import {
  Form,
  FormItem,
  Input,
  Button,
  Link,
  Col,
  Row,
  Pagination,
  Avatar,
  Message,
  MessageBox
} from 'element-ui'


Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Link)
Vue.use(Col)
Vue.use(Row)
Vue.use(Pagination)
Vue.use(Avatar)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
