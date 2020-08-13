<template>
  <div class="account">
    <van-nav-bar title="账号管理" left-text="返回"  @click-left="back" />

    <van-cell-group>
        <van-cell title="头像" class="van-cell">
            <div class="clearfix">
                <div class="fr userImg">
                    <img class="auto-img" :src="userInfo.userImg" alt="">
                    <van-uploader class="upload" :after-read="upload" />
                </div>
            </div>
        </van-cell>

        <van-cell title="用户id" class="van-cell" :value="userInfo.userId"></van-cell>
        <van-cell title="手机号" class="van-cell" :value="userInfo.phone"></van-cell>
        <van-cell title="昵称" class="van-cell" >
            <div class="clearfix">
                <div class="fr">
                    <van-field @blur="updateUserInfo({key:'nickName',value:userInfo.nickName,url:'/updateNickName'})" v-model="userInfo.nickName" class="van-filed" input-align="right"/>
                </div>
            </div>
        </van-cell>
        <van-cell>
            <div class="clearfix">
                <div class="fl van-cell-desc">个性签名</div>
                <div class="fl van-cell-textarea">
                    <textarea  @change="updateUserInfo({key:'desc',value:userInfo.desc, url:'/updateDesc'})" class="textarea fr" v-model="userInfo.desc"></textarea>
                </div>
            </div>
        </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import '../assets/css/account.less'
export default {
  data() {
    return {
      userInfo: {}
    };
  },

  created(){
      //获取用户信息
      this.getUserInfo();
  },

  methods: {
    //获取用户的消息
    getUserInfo() {
      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        mtthod: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "B001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //获取上传图片文件
    upload(file) {
      

      //获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      //获取图片类型
      let imgType = file.file.type.split("/")[1];

      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //修改昵称和简介
    updateUserInfo(i) {
      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: i.url,
        data: {
          appkey: this.appkey,
          tokenString,
          [i.key]: i.value
        }
      })
        .then(result => {
          this.$toast.clear();
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },


    //返回
    back(){
        this.$router.go(-1);
    }
  }
};
</script>

