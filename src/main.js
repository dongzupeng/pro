import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

//导入font-awesome字体图标库
import 'font-awesome/css/font-awesome.min.css'

//导入vant框架
import {
  NavBar,
  Form,
  Field,
  Button,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Toast,
  Lazyload,
  Panel,
  Stepper,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  CouponCell,
  CouponList,
  Card,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Popup ,
  Tabs,
  Tab,
  Icon,
  Cell,
  CellGroup,
  Uploader,
  Dialog

} from 'vant'

//导入用于设置 rem 基准值模块
import 'lib-flexible'



//注册vant框架的组件
Vue
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Toast)
  .use(Lazyload)
  .use(Panel)
  .use(Stepper )
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(CouponCell)
  .use(CouponList )
  .use(Card)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Popup)
  .use(Tabs)
  .use(Tab)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Dialog)
  //注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
axios.defaults.baseURL='http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//发起请求之前处理
axios.interceptors.request.use(config=>{
  if(config.method=='post'){
    let paramsString='';
    //post请求参数序列化，转成一个字符串
    for(let key in config.data){
      paramsString+= key + '=' + config.data[key] + '&'
    }

    config.data=paramsString.slice(0,-1);
  }

  return config;
})

Vue.config.productionTip = false

//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

//全局过滤器
Vue.filter('formatDate',(value,format) =>{
  let currentTime=new Date(value);

  //获取年份
  let currentYear=currentTime.getFullYear();
  if(/(y+)/.test(format)){
    //获取匹配组的内容
    let yearContent= RegExp.$1;

    format=format.replace(yearContent,currentYear);
  }

  let dateObject={
    M:currentTime.getMonth()+1,
    d:currentTime.getDate(),
    h:currentTime.getHours(),
    m:currentTime.getMinutes(),
    s:currentTime.getSeconds(),
  };


  for(let key in dateObject) {
    //创建动态正则表达式
    let reg =new RegExp(`(${key}+)`);

    if(reg.test(format)){
      //获取匹配组的内容，RegExp.$n必须需要test验证通过可以获取
      let content=RegExp.$1;

      //控制补0
      let value= dateObject[key] >=10 ? dateObject[key] : content.length==2 ? '0' + dateObject[key] : dateObject[key]

      format=format.replace(content,value);
    }
  }

  return format;
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
