<template>
    <div class="like">
         <van-nav-bar title="我的收藏" left-text="返回"  @click-left="goback" />

         <div class="likeContent">
             <div class="fl like-item" :class="[index % 2 ==0 ? 'left' : 'right']" v-for="(item,index) in likeData" :key="index">
                 <div @click="searchDetail(item.pid)">
                     <img class="auto-img" v-lazy="item.smallImg" alt="">
                 </div>
                 <div class="pro-name one-text">{{item.name}}</div>
                 <div class="pro-enname one-text">{{item.enname}}</div>
                 <div class="pro-price-box">
                     <div class="fl pro-price">￥{{item.price}}</div>
                     <div class="delete fr" @click="deleteLike(item.pid,index)">
                         <van-icon name="like-o" />
                     </div>
                 </div>
             </div>
         </div>
    </div>
</template>

<script>
import '../assets/css/like.less'
    export default {
        data(){
            return{
             //放入收藏的商品
             likeData:[]
            }
        },

        created(){
            //得到收藏的商品数据
            this.getLikeData();
        },

        methods:{

            //返回
            goback(){
                this.$router.go(-1);
            },
            //获取收藏的商品数据
            getLikeData(pid){
                let tokenString = localStorage.getItem("&tk");

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0
                });

                this.axios({
                    method: "GET",
                    url: "/findAllLike",
                    params: {
                    appkey: this.appkey,
                    tokenString
                    }
                })
                    .then(result => {
                    this.$toast.clear();
                    
                    if (result.data.code == 2000) {
                        this.likeData = result.data.result;
                    }
                    })
                    .catch(err => {
                    this.$toast.clear();
                    
                    });
            },

            //根据商品的id查看商品详情
            searchDetail(aid){
                this.$router.push({name:'Detail',query:{pid}});
            },

            //删除收藏商品
            deleteLike(pid,index){
                    let tokenString = localStorage.getItem("&tk");

                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0
                    });

                    this.axios({
                        method: "POST",
                        url: "/notlike",
                        data: {
                        appkey: this.appkey,
                        tokenString,
                        pid
                        }
                    })
                        .then(result => {
                        this.$toast.clear();
                        
                        if (result.data.code == 900) {
                            this.likeData.splice(index, 1);
                        }
                        })
                        .catch(err => {
                        this.$toast.clear();
                        
                        });
            }
        }
    }
</script>

<style lang="less" scoped>

</style>