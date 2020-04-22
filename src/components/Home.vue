<template>
<!-- 如果在里面内容外部有个div，设置高度会不生效，需要去掉外部的div -->
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/mylogo.jpg" alt="">
            </div>
            <div>
                <h4>电商后台管理系统</h4>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
            <el-container class="aside_main">
                <!-- 侧边栏 -->
                <My-Aside></My-Aside>
                <!-- 主页面 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
    </el-container>
</template>

<script>
import MyAside from './MyAside/MyAside.vue'
export default {
    components:{
        "My-Aside":MyAside
    },
    data(){
        return {
        }
    },
    created(){
        // this.getMenus()
    },
    methods:{
        
        // 退出
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: black;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
    > div {
        display: flex;
        align-items: center;
        img{
            width:180px; 
            height:60px
        }
    }
}
.el-aside {
    background-color: #333744;
}
.el-main {
    background-color: #EAEDF1;
}
.el-button{
    margin-right: 10px;
}

</style>
