<template>
    <div id="authority">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>角色管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col>
                    <el-button @click="addHandler" type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <el-table
                :data="gridList"
                border
                stripe
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <Role-Tree :scopeRow="scope.row" :currentObj="scope.row.children" @success="success"></Role-Tree>
                    </template>
                </el-table-column>

                <el-table-column
                type="index"
                >
                </el-table-column>

                <el-table-column
                prop="roleName"
                label="角色名称"
                >
                </el-table-column>

                <el-table-column
                prop="roleDesc"
                label="角色描述"
                >
                </el-table-column>
               
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="300px"
                    >
                    <template slot-scope="scope">
                        <el-button @click="editHander(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="deleteHandler(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button @click="distribute(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页区
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination> -->

            <!-- 新增修改弹框 -->
            <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
            <Tree-Model :currentRow="currentRow"  :dialogVisible.sync="dialogVisible" @closeDrawer="closeDrawer"></Tree-Model>


        </el-card>
    </div>
</template>

<script>
import quanxian from './quanxianTree';
import treeModel from './treeModel';
export default {
    components:{
        "Role-Tree":quanxian,
        "Tree-Model":treeModel
    },
    data(){
        return {
            gridList:[],
            dialogVisible:false,
            currentRow:{}
        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        async searchBody(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.gridList = res.data
        },
        addHandler(){

        },
        // 编辑
        editHander(){

        },
        // 删除
        deleteHandler(){

        },
        // 分配
        async distribute(currentRow){
            console.log(currentRow)
            this.dialogVisible = true
            this.currentRow = currentRow
        },
        
        closeDrawer(){
            this.dialogVisible = false
            this.searchBody()
        },
        success(roleId){
            this.searchBody()
        }
    }
}
</script>

<style lang="less" scoped>
</style>
