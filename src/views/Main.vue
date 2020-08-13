<template>
    <div class="main">
        <div>
            <!-- 二级路由插座 -->
            <router-view></router-view>
        </div>

            <van-tabbar class="nav" v-model="tabBarName" active-color="#60bfad" inactive-color="#000"  @change="toggleTabBar">
                <van-tabbar-item  v-for="(item,index) in tabBarData" :key="index" :icon="item.icon">{{item.title}}</van-tabbar-item>
               
            </van-tabbar>

    </div>
</template>

<script>
import '../assets/css/main.less'
    export default {
        data(){
            return{
                tabBarName:0,

                //底部导航数据
                tabBarData:[
                    {
                        icon:'apps-o',
                        title:'菜单',
                        routeName:'Menu',
                        url:'/main/menu'
                    },
                     {
                        icon:'orders-o',
                        title:'订单',
                        routeName:'Order',
                        url:'/main/order'
                    },
                     {
                        icon:'cart-o',
                        title:'购物车',
                        routeName:'Shopcart',
                        url:'/main/shopcart'
                    },
                     {
                        icon:'contact',
                        title:'我的',
                        routeName:'My',
                        url:'/main/my'
                    },
                ]
            }
        },

        created(){
            //获取路径的hash
            let locationHash=location.hash.slice(1);


            //修复返回之后底部导航不正确的bug
            for(let i=0 ; i<this.tabBarData.length; i++){
                if(this.tabBarData[i].url == locationHash){
                    this.tabBarName=i;
                    break;
                }
            }
        },

        methods:{
            //切换底部导航
            toggleTabBar(index){
                
                this.$router.push({name:this.tabBarData[index].routeName});
            }
        }
    }
</script>

<style lang="less" scoped>

</style>