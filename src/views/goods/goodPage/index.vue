<template>
    <div class="goodpage">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>商品分类</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
             <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" @clear="clear" clearable placeholder="请输入内容">
                        <el-button @click="searchBody" slot="append" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="toAddpage" type="primary">添加商品</el-button>
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
                prop="goods_name"
                label="商品名称"
                >
                </el-table-column>

                <el-table-column
                prop="goods_price"
                label="商品价格"
                >
                </el-table-column>
               
                <el-table-column
                prop="goods_number"
                label="商品数量">
                </el-table-column>

                <el-table-column
                prop="goods_weight"
                label="商品重量">
                </el-table-column>

                <el-table-column
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.add_time | datafmt}}
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
        </el-card>
    </div>
    
</template>

<script>
export default {
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

        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        clear(){

        },
        async searchBody(){
            const { data:res } = await this.$http.get('goods',{ params:this.queryInfo })
            if( res.meta.status !== 200 )return this.$message.error(res.meta.msg)
            this.gridList = res.data.goods
            this.total = res.data.total
        },
        addHandler(){

        },
        async editHander(id){
            this.title = '修改用户数据'
            const{data:res} = await this.$http.get(`users/${id}`)
            if(res.meta.status !==200)return this.$message.error('更新用户状态失败')
            this.currentObj = res.data
            this.dialogvisible = true
        },
        deleteHandler(){
            // ### 1.8.5. 删除商品
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
        // 跳转到添加商品页面
        toAddpage(){
            this.$router.push('/addGoodPage')
        }

    }
}
</script>

<style lang="less" scoped>

</style>
