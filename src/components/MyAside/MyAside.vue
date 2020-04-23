<template>
    <el-aside :width="isCollapse ? '64px' : '200px' ">
        <el-menu
            background-color="#333744"
            text-color="#fff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            active-text-color="#ffd04b"
            :default-active="activepath"
            router
            >
            <!-- router:是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <div :style="{ transform: isCollapseStyle }" class="collapse_style" @click="collpaseHandler">|||</div>
            <!-- 一级菜单 -->
            <el-submenu v-for="item in menuList" :key="item.id" :index="'/' + item.path">
                <template slot="title">
                    <i :class="itemIcon[ item.id ]"></i>
                    <span>{{ item.authName }}</span>
                </template>
            <!-- 二级菜单 -->
                <el-menu-item v-for="menItem in item.children" :key="menItem.id" :index=" '/'+menItem.path " @click="getItemPath( '/'+menItem.path )">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{ menItem.authName }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>    
</template>
<script>
export default {
    data(){
        return {
            menuList:[],
            isCollapse:false,
            isCollapseStyle:null,
            activepath:'',
            itemIcon:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            }
        }
    },
    created(){
        this.getMenus()
        this.activepath = window.sessionStorage.getItem( 'activepath' )
    },
    methods:{
        // 获取左侧列表数据
        async getMenus(){
            const { data:res } = await this.$http.get('menus')
            if( res.meta.status !== 200 ) return this.$message.error( res.meta.msg )
            this.menuList = res.data
        },
        // 折叠菜单
        collpaseHandler(){
            this.isCollapse = !this.isCollapse
            if( !this.isCollapse ) return this.isCollapseStyle = null
            this.isCollapseStyle = "rotate( 90deg )"
        },
        getItemPath(activepath){
            window.sessionStorage.setItem( 'activepath',activepath )
            this.activepath = activepath
        }

    }   
}
</script>

<style lang="less" scoped>
    .iconfont{
        margin-right: 20px;
    }
    .el-menu{
        border: none;
    }
    .collapse_style{
        letter-spacing: .1em;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
        line-height: 26px;
        font-size: 14px;
        // transform: 
    }
</style>
