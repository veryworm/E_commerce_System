<template>
    <div id="user">
        <!-- 用户管理面包屑 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>用户管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>  
        <!-- 列表区 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" @clear="clear" clearable placeholder="请输入内容">
                        <el-button @click="searchBody" slot="append" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="addHandler" type="primary">添加</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <el-table
                :data="gridList"
                border
                stripe
                style="width: 100%">
                <el-table-column
                type="index"
                >
                </el-table-column>

                <el-table-column
                prop="username"
                label="用户名"
                >
                </el-table-column>

                <el-table-column
                prop="email"
                label="邮箱"
                >
                </el-table-column>
               
                <el-table-column
                prop="mobile"
                label="电话">
                </el-table-column>

                <el-table-column
                prop="role_name"
                label="角色">
                </el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                        v-model="scope.row.mg_state"
                        @change="changeStatus(scope.row)"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>    
                    </template>
                </el-table-column>

                 <el-table-column
                    fixed="right"
                    label="操作"
                    width="180px"
                    >
                    <template slot-scope="scope">
                        <el-button @click="editHander(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click="deleteHandler(scope.row.id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
                        <el-button @click="distribute(scope.row)" size="mini" type="warning" icon="el-icon-setting"></el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页区 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

            <!-- 新增修改弹框 -->
            <AddOrEdit :dialogvisible.sync="dialogvisible" :currentObj="currentObj" :title="title" @closeDrawer="closeDrawer"></AddOrEdit>

            <!-- 分配权限弹框 -->
            <distributeDialog :dialogvisible.sync="rightVisible" :currentUser="currentUser" @closeDrawer="closeDrawer"></distributeDialog>
        </el-card>
    </div>
</template>

<script>
import AddOrEdit from './addOrEdit.vue'
import distributeDialog from './distributeUserRole'
import model from './model.js'

export default {
    components:{
        AddOrEdit,
        distributeDialog
    },
    data(){
        return {
            queryInfo:{
                query:'',
                // 当前页码
                pagenum:1,
                // 显示多少条数据
                pagesize:2
            },
            gridList:[],
            total:null,
            dialogvisible:false,
            rightVisible:false,
            currentObj:{},
            currentUser:{},
            title:''
        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        // 查询数据
        async searchBody(){
            const { data:res } = await this.$http.get('users',{ params:this.queryInfo })
            if( res.meta.status !== 200 )return this.$message.error(res.meta.msg)
            this.gridList = res.data.users
            this.total = res.data.total
        },
        // 搜索功能
        async changeStatus(row){
            const { data:res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
            if(res.meta.status !== 200){
                row.mg_state = !row.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
            this.searchBody()
        },
        // 清空搜索框
        clear(){
            this.searchBody()
        },
        // 编辑打开模态框
        async editHander(id){
            this.title = '修改用户数据'
            const{data:res} = await this.$http.get(`users/${id}`)
            if(res.meta.status !==200)return this.$message.error('更新用户状态失败')
            this.currentObj = res.data
            this.dialogvisible = true
        },
        // 添加打开模态框
        addHandler(){
            this.title = '新增用户数据'
            this.dialogvisible = true
        },
        // 子组件发送关闭模态框
        closeDrawer(val){
            this.dialogvisible = val
            this.rightVisible = false
            this.searchBody()
        },
        // 删除
        async deleteHandler(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteSuccess()
            })  
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            // const {data:res} = await this.$http.delete(`users/${id}`)
            // if(res.meta.status!==200)return this.$message.error('删除失败')
            // this.$message.success('删除成功')
            // this.refresh()
        },
        // 分配
        async distribute(currentUser){
            this.currentUser = currentUser
            this.rightVisible = true
        },
        // 选择当前页要呈现多少条数据
        handleSizeChange(val){
            this.queryInfo.pagesize = val
            this.searchBody()
        },
        // 当前页的变化
        handleCurrentChange(val){
            this.queryInfo.pagenum = val
            this.searchBody()
        },
        refresh(){
            Object.assign(this.queryInfo,model.queryInfo)
            this.searchBody()
        },
        async deleteSuccess(){
            const {data:res} = await this.$http.delete(`users/${id}`)
            if(res.meta.status!==200)return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.refresh()
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }

    }
}
</script>

<style lang="less" scoped>
    .el-button{
        margin-left: 5px;
    }
</style>
