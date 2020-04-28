<template>
    <div class="goodpage">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>订单页面</a></el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
                    prop="order_number"
                    label="订单编号"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="order_price"
                    label="商品价格"
                    >
                    </el-table-column>
                
                    <el-table-column
                    label="是否付款">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
                            <el-tag v-else type="success">已付款</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="是否发货">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.is_send === '否'" type="danger">未发货</el-tag>
                            <el-tag v-else type="success">已发货</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="下单时间">
                        <template slot-scope="scope">
                            {{scope.row.create_time | datafmt}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="180px"
                        >
                        <template slot-scope="scope">
                            <el-button @click="editHander(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
                            <el-button @click="lookdelivery(scope.row.id)" size="mini" type="success" icon="el-icon-location"></el-button>
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

            <!-- 查询地址对话框  -->
                <el-dialog
                title="修改地址"
                :visible.sync="dialogvisible"
                width="40%"
                @close="clearForm"
                >
                    <div class="FormDiv">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForms" label-width="90px" class="demo-ruleForm">
                            <el-form-item label="选取地址" prop="address1">
                                <el-cascader
                                    v-model="ruleForm.address2"
                                    :options="cityData"
                                    clearable
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>

                            <el-form-item label="详细地址" prop="address2">
                                <el-input type="password" v-model="ruleForm.address2" autocomplete="off"></el-input>
                            </el-form-item>
                            
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogvisible=false">取 消</el-button>
                    </span>
                </el-dialog>

            <!-- 查询物流对话框 -->
                <el-dialog
                    title="查询物流"
                    :visible.sync="deliveryvisible"
                    width="40%"
                    >
                    <div>
                        <el-timeline :reverse="reverse">
                            <el-timeline-item
                            v-for="(item, index) in deliveryData"
                            :key="index"
                            :timestamp="item.time">
                                {{item.context}}
                            </el-timeline-item>
                        </el-timeline>    
                    </div>   
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="deliveryvisible=false">取 消</el-button>
                    </span>
                </el-dialog>
        </el-card>
    </div>
</template>

<script>
import cityData from './citydata.js'
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
            ruleForm:{
                address1:'',
                address2:''
            },
            rules:{
                address1:[{required:true,message:'请选取地址',trigger:'blur'}],
                address2:[{required:true,message:'请填写详细地址',trigger:'blur'}]
            },
            reverse: true,
            activities: [{
                content: '活动按期开始',
                timestamp: '2018-04-15'
                }, {
                content: '通过审核',
                timestamp: '2018-04-13'
                }, {
                content: '创建成功',
                timestamp: '2018-04-11'
            }],
            gridList:[],
            deliveryData:[],
            total:null,
            cityData,
            dialogvisible:false,
            deliveryvisible:false
        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        async searchBody(){
            const { data:res } = await this.$http.get('orders',{ params:this.queryInfo })
            if( res.meta.status !== 200 )return this.$message.error(res.meta.msg)
            this.gridList = res.data.goods
            this.total = res.data.total
        },
        clearForm(){
            this.$refs.ruleForms.resetFields()
        },
        handleChange(){

        },
        clear(){},
        addHandler(){

        },
        async editHander(id){
            this.dialogvisible = true
        },
        async lookdelivery(){
            this.deliveryvisible = true
            const { data:res } = await this.$http.get('/kuaidi/1106975712662')
            if( res.meta.status !== 200 )return this.$message.error('查询物流失败')
            this.deliveryData = res.data
            console.log(this.deliveryData)
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
// @import '路径' 可以直接将其他文件的样式导入过来引用到当前style
    .el-cascader{
        width: 100%;
    }
</style>