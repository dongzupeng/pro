<template>
  <div class="order">
    <van-tabs
      @change="selectOrderStatus"
      :sticky="true"
      v-model="activeName"
      color="#60bfad"
      line-height="2"
      titlt-active-color="#60bfad"
    >
      <van-tab
        :title="item.title"
        :name="item.name"
        v-for="(item,index) in tabContent"
        :key="index"
      >
        <div class="order-content">
          <div class="order-items">
            <!-- 每个订单 -->
            <div class="order-item" v-for="(item,index) in orderNos" :key="index">
              <div class="order-item-title">
                <div class="fl order-no">{{item}}</div>
                <div class="fr" v-if="orderData[item].status==2">
                  <span class="confirm">已收货</span>
                  <span class="delete fl" @click="removeOrder(item)">
                    <van-icon name="delete" class="delete-icon" />
                  </span>
                </div>
                <div class="fr" v-else>
                  <span class="confirm" @click="recieve(item)">确认收货</span>
                </div>
              </div>

              <div>
                <div class="items" v-for="(v,i) in orderData[item].data" :key="i">
                  <div class="clearfix">
                    <div class="fl pro-img">
                        <img class="auto-img" :src="v.smallImg" alt="">
                    </div>
                    <div class="fl pro-info">
                      <div class="fl">
                        <div class="names">
                          <div class="zh-name">{{v.name}}</div>
                          <div class="en-name">{{v.enname}}</div>
                        </div>
                        <div class="rule">{{v.rule}}</div>
                      </div>
                      <div class="fr">
                        <div class="price">￥{{v.price}}</div>
                        <div class="count">x{{v.count}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-total clearfix">
                <div class="order-date fl">{{orderData[item].date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>  
                <div class="fr clearfix">
                  <span class="fl total-count">共计 {{orderData[item].count}} 件商品 合计：</span>
                  <span class="fl total-price">￥{{orderData[item].total}}</span>
                </div>
              </div>
            </div>

            <!-- 每个订单 -->
            
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../../assets/css/order.less";
export default {
  data() {
    return {
      tabContent: [
        {
          title: "全部",
          name: "0"
        },
        {
          title: "待收货",
          name: "1"
        },
        {
          title: "已收货",
          name: "2"
        }
      ],
      activeName: "0",
      isRecieve: false,

      //订单编号
      orderNos: [],

      //订单数据
      orderData: {}
    };
  },

  created(){
    //获取商品订单
    this.getOrderProducts();
  },

  methods:{
    //切换不同状态的商品
    selectOrderStatus(a){
      this.getOrderProducts();
    },

    //获取订单商品
    getOrderProducts(){
      let tokenString = localStorage.getItem('&tk');

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      })

      this.axios({
        method:'GET',
        url:'/findOrder',
        params:{
          appkey:this.appkey,
          tokenString,
          status:this.activeName
        }
      }).then(result =>{
        this.$toast.clear();
        
        if(result.data.code==70000){
          //降序排序
          
          result.data.result.sort((a,b) =>{
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })

          //获取所有订单编号
          let oids=[];

          result.data.result.forEach(v =>{
            if(oids.indexOf(v.oid) ===-1){
              oids.push(v.oid);
            }
          })

          this.orderNos=oids;

          //按照订单编号筛选商品
          let orderData={};

          result.data.result.forEach(v =>{
            if(!orderData[v.oid]){
              //不存在则添加一条
              orderData[v.oid]={
                data:[v],
                status:v.status,
                date:v.createdAt,
                count:v.count,
                total:v.count * v.price
              };
            }else{
              orderData[v.oid].count +=v.count;
              orderData[v.oid].total +=v.count * v.price;
              orderData[v.oid].data.push(v);
            }

          })
          
          

          this.orderData=orderData;

        }
      }).catch(err =>{
        this.$toast.clear();
        
      })
    },

    //确认收货
    recieve(oid) {
      //订单编号
      let tokenString= localStorage.getItem('&tk');

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      })

      this.axios({
        method:'POST',
        url:'/receive',
        data:{
          appkey:this.appkey,
          tokenString,
          oid
        }
      }).then(result =>{
        this.$toast.clear();
        
        if(result.data.code ==80000){
          this.orderData[oid].status=2;

          //如果是待收货，则删除页面上的订单数据
          if(this.activeName ==1){
            let index =this.orderNos.indexOf(oid);
            this.orderNos.splice(index,1);
          }
        }
      }).catch(err=>{
        this.$toast.clear();
        
      })
    },

    //删除订单
    removeOrder(oid) {
      //订单编号
      let tokenString = localStorage.getItem('&tk');

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method: 'POST',
        url: '/removeOrder',
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      }).then(result => {
        this.$toast.clear();
        

        if (result.data.code == 90000) {

          //删除页面的订单
          let index = this.orderNos.indexOf(oid);
          this.orderNos.splice(index, 1);
        }

      }).catch(err => {
        this.$toast.clear();
        
      })
    }


  },
};
</script>

