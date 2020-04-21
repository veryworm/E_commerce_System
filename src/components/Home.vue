<template>
<!-- 如果在里面内容外部有个div，设置高度会不生效，需要去掉外部的div -->
    <el-container class="home-container">
        <el-header>
            <div>
                <img style="width:150px; height:60px; border-radius:50%" src="../assets/mylogo.jpg" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
            <el-container class="aside_main">
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
    </el-container>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
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
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
}
  
.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #EAEDF1;
}

</style>
