<template>
    <div id="category">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>分类参数</a></el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-card class="box-card">
             <div class="alertStyle">
                <el-alert
                title="只允许为第三级分类设置相关参数"
                type="warning">
                </el-alert>
            </div>
            <el-row>
                <el-col :span="3">
                    <span>选择商品分类:</span>
                </el-col>
                <el-col :span="3">
                    <el-cascader
                    v-model="checkedParams"
                    :props="ParamsProps"
                    :options="categoryList"
                    clearable
                    @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

             <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                     <el-button @click="addManyParams" :disabled="checkedParams.length!==3" type="primary">添加动态参数</el-button>
                     <!-- 动态参数表格区 -->
                    <el-table
                        :data="manyTableData"
                        border
                        stripe
                        style="width: 100%">
                        <el-table-column
                        type="index"
                        >
                        </el-table-column>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                :key="tag"
                                v-for="(tag,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row,index)">
                                {{tag}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.haveInputVisible"
                                v-model="scope.row.haveInputText"
                                ref="saveTagInput"
                                size="small"
                                @blur="handleInputConfirm(scope.row)"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column
                        prop="attr_name"
                        label="属性名称"
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
                                <!-- <el-button @click="distribute(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addManyParams" :disabled="checkedParams.length!==3" type="primary">添加静态参数</el-button>
                    <!-- 静态参数表格区 -->
                    <el-table
                        :data="onlyTableData"
                        border
                        stripe
                        style="width: 100%">
                        <el-table-column
                        type="index"
                        >
                        </el-table-column>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                           <template slot-scope="scope">
                                <el-tag
                                :key="tag"
                                v-for="(tag,index) in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row,index)">
                                {{tag}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.haveInputVisible"
                                v-model="scope.row.haveInputText"
                                ref="saveTagInput"
                                size="small"
                                @blur="handleInputConfirm(scope.row)"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column
                        prop="attr_name"
                        label="商品名称"
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
                                <!-- <el-button @click="distribute(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            

            <!-- 新增修改弹框 -->
            <ManyOrOnly :activeName="activeName" :catId="catId" :dialogvisible.sync="dialogvisible" :title="title" @closeDrawer="closeDrawer"></ManyOrOnly>

        </el-card>
    </div>
</template>

<script>
import ManyOrOnly from './manyorOnly'
export default {
    components:{
        ManyOrOnly
    },
    data(){
        return {
            gridList:[],
            // 级联数据
            categoryList:[],
            checkedParams:[],
            // 动态参数列表数据
            manyTableData:[],
            // 静态参数列表数据
            onlyTableData:[],
            activeName:'many',
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            ParamsProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover',
                checkStrictly: true 
            },
            columns:[
                {
                    label: '分类名称',
                    prop: 'cat_name',
                    width: '400px',
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
            inputVisible:false,
            inputValue:'',
            currentObj:{},
            title:''
        }
    },
    computed:{
        catId(){
            if(this.checkedParams.length!==3){
                return null
            }
            return this.checkedParams[2]
        }
    },
    created(){
        this.getCategories()
    },
    methods:{
        // 获取级联分类数据
        async getCategories(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200)return this.$message.error('获取分类失败')
            this.categoryList = res.data
        },
        // tab点击事件
        async handleTabsClick(tab, event){
            this.activeName = tab.name
            this.getGoodCategory()
        },
        async handleChange(){
            this.getGoodCategory()
        },
        async getGoodCategory(){
            if(this.checkedParams.length!==3){
                this.checkedParams = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            const {data:res} = await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!==200)return this.$message.error('获取参数失败')
            // 判断点击级联单个商品的数据是动态参数还是点击tab标签获取到的静态数据
            res.data.forEach((item)=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                // 如果不给每个对象本身添加"haveInputVisible"和"haveInputText",就会造成每个对象之间的联动
                // 给每一项添加两个字段，一个为控制input的显示，另一个为文本框的内容
                item.haveInputVisible = false
                item.haveInputText = ""
            })
            if(this.activeName=='many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        // 新增
        addManyParams(){
            if(this.activeName == 'many'){
                this.title = '添加动态参数'
                
            }else{
                this.title = '添加静态参数'
            }
            this.dialogvisible = true

        },
        // 编辑
        async editHander(row){
            // 1.7.4根据 ID 查询参数
            // ### 1.7.5. 编辑提交参数
            
            // const {data:res} = await this.$http.get(`categories/${row.cat_id}`)
            // if(res.meta.status!==200)return this.$message.error('获取分类数据失败')
            // this.title = '编辑分类'
            // this.currentObj = res.data
            // this.dialogvisible = true
        },
        // 删除
        async deleteHandler(id){
            // ### 1.7.3. 删除参数
            // const {data:res} = await this.$http.delete(`categories/${id}`)
            // if(res.meta.status!==200)return this.$message.error('删除分类数据失败')
            // this.$message.success('删除成功')
            // this.searchBody()
        },
        // 移除tag标签
        handleClose(row,index){
            row.attr_vals.splice(index, 1);
        },
        // 扩展
        handleInputConfirm(row){
            if(row.haveInputText.trim().length ===0){
                row.haveInputText = ""
                row.haveInputVisible = false
                return
            }
            row.attr_vals.push(row.haveInputText.trim())
            row.haveInputText = ""
            row.haveInputVisible = false
            
        },
        showInput(row){
            // 让当前行的input显示
            row.haveInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        closeDrawer(val){
            this.dialogvisible = val
            this.getGoodCategory()
        },

    }
}
</script>

<style lang="less" scoped>
    .opo{
        margin-top: 15px;
    }
    .alertStyle{
        margin-bottom:15px
        // padding: 10px;
    }
    .el-tag{
        margin: 5px;
    }
    .input-new-tag{
        width: 100px;
    }
</style>
