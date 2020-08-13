<template>
  <div class="secure">
    <van-nav-bar title="安全中心" left-text="返回" @click-left="goback" />

    <div class="lists">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="showPassword" />
        <van-cell title="注销账号" is-link @click="destroy" />
      </van-cell-group>
    </div>

    <div class="logout">
      <van-button :round="true" :block="true" type="danger" @click="logout">退出登录</van-button>
    </div>
    <van-popup v-model="isOpen" position="bottom">
      <div class="xiugai">
        <van-form @submit="onSubmit">
          <van-field v-model="password.oldPassword" label="旧密码" placeholder="旧密码" />
          <van-field v-model="password.password" type="text" label="新密码" placeholder="新密码" />
          <div class="btn-submit">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/css/secure.less";
import validForm from "../assets/js/validForm";
export default {
  data() {
    return {
      isOpen: false,
      password: {
        oldPassword: "",
        password: ""
      }
    };
  },

  methods: {
    goback() {
      this.$router.go(-1);
    },

    //显示修改密码的界面
    showPassword() {
      this.isOpen = true;
    },

    //提交修改密码
    onSubmit() {
      if (!validForm.validUserForm(this.password)) {
        return;
      }

      let tokenString = localStorage.getItem("&tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          //新的密码
          password: this.password.password,
          //旧密码
          oldPassword: this.password.oldPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          
          //关闭修改密码弹出框
          this.isOpen = false;
          if (result.data.code == "E001") {
            //清除token
            localStorage.removeItem("&tk");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //退出登录
    logout(){
        localStorage.removeItem('&tk');
        this.$router.push({name:'Login'});
    },

    //注销账号
    destroy(){
        this.$dialog.confirm({
            title:'注销账户',
            message:'注销之后无法恢复',
            confirmButtonColor:'#e6a314'
        }).then( ()=>{
            //发起注销请求
            let tokenString = localStorage.getItem('&tk');

            this.$toast.loading({
                message:'加载中...',
                forbidClick:true,
                duration:0
            });

            this.axios({
                method:'POST',
                url:'/destroyAccount',
                data:{
                    appkey:this.appkey,
                    tokenString
                }
            }).then(result =>{
                
                this.$toast.clear();

                if(result.data.code=='G001'){
                    //清空token数据
                    localStorage.removeItem('&tk');
                    this.$router.push({name:'Login'});
                }else {
                    this.$toast(result.data.msg);
                }
            }).catch(err =>{
                this.$toast.clear();
            })
        }).catch(err=>{

        })
    }
  }
};
</script>

<style lang="less" scoped>
</style>