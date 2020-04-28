<template>
    <div id="category">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>分类管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
         <el-card class="box-card">
            <el-row>
                <el-col :span="3">
                    <el-button @click="addHandler" type="primary">添加</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <div class="opo">
                <tree-table
                    index-text="#"
                    :data="gridList"
                    :columns="columns"
                    show-row-hover
                    :selection-type="false"
                    border
                    :expand-type="false"
                    >
                    <!-- 是否有效 -->
                    <template slot="isEffective" slot-scope="scope">
                        <i v-if="scope.row.cat_deleted === false" class="el-icon-error"></i>
                        <i v-else class="el-icon-success"></i>
                    </template>
                    <!-- 排序 -->
                    <template slot="sort" slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag type="info" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
                    </template>

                    <template slot="setting" slot-scope="scope">
                        <el-button @click="editHander(scope.row)" size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click="deleteHandler(scope.row.cat_id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
                    </template>

                </tree-table>
            </div>

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

        </el-card>
    </div>
</template>

<script>
import AddOrEdit from './addDialog'
export default {
    components:{
        AddOrEdit
    },
    data(){
        return {
            gridList:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            columns:[
                {
                    label: '分类名称',
                    prop: 'cat_name',
                    width: '400px',
                },
                {
                    label: '是否有效',
                    prop: 'cat_deleted',
                    minWidth: '50px',
                    type: 'template',
                    template: 'isEffective',
                },
                {
                    label: '排序',
                    prop: 'cat_level',
                    minWidth: '50px',
                    type: 'template',
                    template: 'sort',
                },
                {
                    label: '操作',
                    minWidth: '100px',
                    type: 'template',
                    template: 'setting',
                }
            ],
            total:null,
            dialogvisible:false,
            currentObj:{},
            title:''
        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        async searchBody(){
            const {data:res} = await this.$http.get('categories',
                { params:this.queryInfo }
            )
            if(res.meta.status!==200)return this.$message.error('获取分类失败')
            this.gridList = res.data.result
            this.total = res.data.total
        },
        // 新增
        addHandler(){
            this.title = '新增分类'
            this.dialogvisible = true
        },
        // 编辑
        async editHander(row){
            const {data:res} = await this.$http.get(`categories/${row.cat_id}`)
            if(res.meta.status!==200)return this.$message.error('获取分类数据失败')
            this.title = '编辑分类'
            this.currentObj = res.data
            this.dialogvisible = true
        },
        // 删除
        async deleteHandler(id){
            const {data:res} = await this.$http.delete(`categories/${id}`)
            if(res.meta.status!==200)return this.$message.error('删除分类数据失败')
            this.$message.success('删除成功')
            this.searchBody()
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
        closeDrawer(val){
            this.dialogvisible = val
            this.rightVisible = false
            this.searchBody()
        },

    }
}
</script>

<style lang="less" scoped>
    .opo{
        margin-top: 15px;
    }
</style>
