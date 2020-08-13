<template>
    <div class="forget">
         <van-nav-bar title="找回密码" left-text="返回"  @click-left="goback" />
         <div class="forget-box">
             <div v-if="!isnext">
                 <van-form>
                    <van-field
                        v-model="begin.email"
                        type="text"
                        label="邮箱"
                        placeholder="邮箱地址"
                    />
                    <van-field
                        key="code"
                        v-model="begin.code"
                        type="text"
                        label="验证码"
                        placeholder="6位验证码">

                        <template #button>
                           <van-button size="small" :disabled="isSent" @click="sentCode" >{{msg}}</van-button>
                        </template>
                    </van-field>
            
                    <div class="register-btn">
                        <van-button round block type="info" native-type="submit" @click="next">下一步</van-button>
                    </div>
                 </van-form>
             </div>

             <div v-else>
                 <van-form @submit="submit">
                      <van-field
                        v-model="info.phone"
                    
                        type="text"
                        label="手机号"
                        placeholder="手机号"
                        clearable
                        left-icon="phone-o"
                    >
                        
                    </van-field>
                    <van-field
                        v-model="info.password"
                        :type="isEye ? 'text' : 'password'"
                        label="新密码"
                        placeholder="请输入您的新密码"
                        left-icon="contact"
                        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
                        @click-right-icon="viewPasswordType"
                    />
                    <div class="register-btn">
                        <van-button round block type="info" native-type="submit">提交</van-button>
                    </div>
                 </van-form>
             </div>
         </div>
    </div>
</template>

<script>
import '../assets/css/forget.less'
import validForm from '../assets/js/validForm'
    export default {
        data(){
            return {
                isnext:false,
                begin:{
                    email:'',
                    code:''
                },

                info:{
                    phone:'',
                    password:''
                },

                isEye:false,
                msg:'发送验证码',
                isSent:false
            }
        },

        methods:{
            goback(){
                if(this.isnext){
                    this.isnext=false;
                }else{
                    this.$router.go(-1);
                }
            },

            //切换显示密码的方式
            viewPasswordType(){
                this.isEye=!this.isEye;
            },


            //下一步
            next(){
                if(!validForm.validUserForm(this.begin)){
                    return;
                }

                //发送验证码请求
                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                });


                this.axios({
                    method:'POST',
                    url:'/checkValidCode',
                    data:{
                        appkey:this.appkey,
                        validcode:this.begin.code
                    }
                }).then(result =>{
                    this.$toast.clear();

                    if(result.data.code=='K001'){
                        this.isnext=true;
                    }else{
                        this.$toast(result.data.msg);
                    }
                }).catch(err =>{
                    this.$toast.clear();
                })
                
            },

            //发送验证码
            sentCode(){
                if(!validForm.validUserForm({email:this.begin.email})){
                    return;
                }

                //获取邮箱验证码
                let time=60;
                this.msg=time+ '秒后重新发送';
                this.isSent=true;
                let timer = setInterval(()=>{
                    if(time ==0){
                        clearInterval(timer);
                        timer=null;
                        this.msg='发送验证码';
                        this.isSent=false;
                    }else {
                        time--;
                        this.msg = time + '秒后重新发送';

                    }
                },1000);

                //发起发送验证码请求
                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                });

                this.axios({
                    method:'POST',
                    url:'/emailValidCode',
                    data:{
                        appkey:this.appkey,
                        email:this.begin.email
                    }
                }).then(result =>{
                    this.$toast.clear();
                    this.$toast(result.data.msg);
                }).catch(err =>{
                    this.$toast.clear();
                })
            },

            //提交 找回密码
            submit(){
                if(!validForm.validUserForm(this.info)){
                    return;
                }

                thid.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:'POST',
                    url:'/retrievePassword',
                    data:{
                        appkey:this.appkey,
                        phone:this.info.phone,
                        password:this.info.password
                    }
                }).then(result =>{
                    this.$toast.clear();

                    if(result.data.code=='L001'){
                        this.$toast.push({name:'Login'});
                    }else {
                        this.$toast(result.data.msg);
                    }
                }).catch(err =>{
                    this.$toast.clear();
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>