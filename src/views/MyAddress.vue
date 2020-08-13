<template>
    <div class="myaddress">
        <van-nav-bar
            title="收货地址"
            left-text="返回"
            @click-left="goPage"
         />
         <van-address-list
            v-model="aid"
            :list="addressList"
            default-tag-text="默认"
            @add="goAddress"
            @edit="goAddress"
        />


    </div>
</template>

<script>
import '../assets/css/myaddress.less'
    export default {
        data(){
            return{
                aid:'1',

                //地址列表
                addressList:[

                ]
            };
        },

        created(){
            this.getAddressData();
        },


        methods:{

            //返回
            goPage(){
                this.$router.go(-1);
            },

            //获取地址数据
            getAddressData(){
                let tokenString=localStorage.getItem('&tk');

                this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                })

                this.axios({
                    method:'GET',
                    url:'/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(result=>{
                    this.$toast.clear();
                    
                    if(result.data.code==20000){
                        result.data.result.forEach(v=>{
                            let currentAddress={
                                id:v.aid,
                                tel:v.tel,
                                name:v.name,
                                address:v.province + v.city + v.county + v.addressDetail,
                                isDefault:Boolean(v.isDefault)
                            };

                            //默认选择默认地址
                            if(v.isDefault){
                                this.aid=v.aid;
                            }
                            this.addressList.push(currentAddress);
                        })
                    }
                }).catch(err=>{
                    this.$toast.clear();
                    
                })
            },

            //新增，编辑地址 新增地址不用携带aid，编辑地址需要携带aid adi：地址id
            goAddress(address){
                let o={
                    name:'Address'
                };

                if(address){
                    o.params={
                        aid:address.id
                    }
                }
                this.$router.push(o);
            }
        }
    }
</script>

<style lang="less" scoped>

</style>