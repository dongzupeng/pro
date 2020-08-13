<template>
  <div class="my">
    <div class="myBox" :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}">
      <div class="change clearfix">
        <div class="fr changeimg">
          <div>更换背景</div>
          <van-uploader class="upload" :max-size="maxSize" :after-read="upload" />
        </div>
      </div>
      <div class="user-info">
        <div class="clearfix">
          <div class="my-img fl">
            <img class="auto-img" :src="userInfo.userImg" alt />
          </div>
          <div class="nickname fl">{{userInfo.nickName}}</div>
        </div>
        <div class="desc">个性签名：{{userInfo.desc == '' ? '这个人很懒，没有写什么东西！' : userInfo.desc}}</div>
      </div>
    </div>

    <div>
      <van-cell-group>
        <van-cell @click="toPage(item.routeName)" :title="item.title" is-link v-for="(item, index) in listsData" :key="index" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  data() {
    return {
      //上传文件大小限制1MB
      maxSize: 1 * 1024 * 1024,
      listsData: [
        {
          title: "账号管理",
          routeName: 'Account'
        },
        {
          title: "地址管理",
          routeName: 'MyAddress'
        },
        {
          title: "我的收藏",
          routeName: 'Like'
        },
        {
          title: "安全中心",
          routeName: 'Secure'
        }
      ],

      //用户的信息
      userInfo: {}
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {

    //跳转到相应的页面
    toPage(name) {
      this.$router.push({name});
    },

    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //获取上传文件的base64
    upload(file) {
      

      //获取图片base64
      let serverBase64Img = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');

      //获取图片类型
      let imgType = file.file.type.split('/')[1];

      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img,
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'I001') {
            this.userInfo.userBg = result.data.userBg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>
