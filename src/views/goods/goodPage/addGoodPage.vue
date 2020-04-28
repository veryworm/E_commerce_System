<template>
   <div>
       <!-- <h1>添加 商品页面</h1> -->
       <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>商品页面</a></el-breadcrumb-item>
            <el-breadcrumb-item>添加商品页面</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-card class="box-card">
             <el-alert
                title="添加商品信息"
                center
                show-icon
                type="info">
            </el-alert>

            <el-steps :space="200" align-center :active="active" finish-status="success">
                <el-step v-for="item in stepStatusItem" :key="item.statusId" :title="item.title">

                </el-step>
            </el-steps>

            <el-tabs :before-leave="beforeleaveHandler" v-model="TabsValue" @tab-click="tabClick" :tab-position="tabPosition" style="height: 100%;">
                <el-tab-pane v-for="(item,index) in tabPaneItem" :name="item.label" :key="item.leftTabId" :label="item.label">
                    <div class="right" v-if="index == '0'">
                        <!-- 基本信息 -->
                        <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="ruleForm.goods_name"></el-input>
                            </el-form-item>
                        
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="ruleForm.goods_price"></el-input>
                            </el-form-item>

                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="ruleForm.goods_weight"></el-input>
                            </el-form-item>
                        
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="ruleForm.goods_number"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="商品分类" prop="goods_number"> 
                                <!-- <el-input v-model="ruleForm.goods_number"></el-input> -->
                                <el-cascader
                                v-model="ruleForm.goods_cat"
                                :props="ParamsProps"
                                :options="categoryList"
                                clearable
                                @change="handleChange"></el-cascader>
                            </el-form-item>

                        </el-form>
                    </div>

                    <div v-if="index == '1' ">
                        <el-form>
                            <el-form-item v-for="items in dynamicData" :key="items.attr_id" :label="items.attr_name">
                                <el-checkbox-group v-model="items.attr_vals" size="small">
                                    <el-checkbox border v-for="(vals_item,i) in items.attr_vals" :key="i" :label="vals_item"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    
                    <div v-if="index == '2' ">
                        <el-form>
                            <el-form-item v-for="items in staticData" :key="items.attr_id" :label="items.attr_name">
                                <el-input v-model="items.attr_vals"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div v-if="index == '3'">
                        <el-upload
                            class="upload-demo"
                            :action="imgURL"
                            :headers="headers"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="successHandler"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <el-dialog
                            title="预览图片"
                            :visible.sync="imgVisbile"
                            width="30%"
                            :before-close="handleClose">
                            <div class="imgDiv">
                                <img class="imgStyle" :src="previewImgUrl" alt="">
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="imgVisbile = false">关 闭</el-button>
                            </span>
                        </el-dialog>
                    </div>

                    <div v-if="index == 4">
                        <quill-editor v-model="ruleForm.goods_introduce">

                        </quill-editor>
                        <el-button class="addStyle" @click="submit" type="primary">
                            添加
                        </el-button>
                    </div>
                </el-tab-pane>

                
            </el-tabs>
        </el-card>
   </div> 
</template>

<script>
import _ from 'lodash'
export default {
    data(){
        return {
            active:0,
            tabPosition:'left',
            TabsValue:'基本信息',
            categoryList:[],
            imgVisbile:false,
            dynamicData:[],//商品参数:动态参数
            staticData:[], //商品属性:静态参数
            imgURL:'http://127.0.0.1:8888/api/private/v1/upload',
            previewImgUrl:'', //预览图片的地址
            // 图片上传的请求头对象
            headers:{
                Authorization:window.sessionStorage.getItem('token')
            },
            stepStatusItem:[
                {statusId:1,title:'基本信息'},
                {statusId:2,title:'商品参数'},
                {statusId:3,title:'商品属性'},
                {statusId:4,title:'商品图片'},
                {statusId:5,title:'商品内容'},
                {statusId:6,title:'完成'}
            ],
            tabPaneItem:[
                {leftTabId:1,label:'基本信息'},
                {leftTabId:2,label:'商品参数'},
                {leftTabId:3,label:'商品属性'},
                {leftTabId:4,label:'商品图片'},
                {leftTabId:5,label:'商品内容'}
            ],
            ruleForm:{
                goods_name:'',
                goods_price:'0',
                goods_cat:'',
                goods_weight:'0',
                goods_number:'0',
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            rules:{
                goods_name:[
                    {required:true,message:'请填写商品名称'}
                ],
                goods_price:[
                    {required:true,message:'请填写商品价格'}
                ],
                goods_weight:[
                    {required:true,message:'请填写商品重量'}
                ],
                goods_number:[
                    {required:true,message:'请填写商品数量'}
                ]
            },
            ParamsProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover',
                checkStrictly: true 
            },
            
        }
    },
    computed:{
        cateId() {
            if (this.ruleForm.goods_cat.length === 3) {
                return this.ruleForm.goods_cat[2]
            }
            return null
        },
    },
    created(){
        this.getCategories()
    },
    methods:{
        async getCategories(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200)return this.$message.error('获取分类失败')
            this.categoryList = res.data
        },
        async tabClick(event){
            if( this.ruleForm.goods_cat == "" )return this.$message.error('请选择商品分类')
            if( event.name == '商品参数' ){
                // 访问的是动态面板
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                    { params:{ sel: 'many' } }
                )
                if(res.meta.status!==200)return this.$message.error('获取商品参数失败')
                res.data.forEach((item)=>{
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                // 动态参数
                this.dynamicData = res.data
            }else if( event.name == '商品属性' ){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                    { params:{ sel: 'only' } }
                )
                if(res.meta.status!==200)return this.$message.error('获取商品属性失败')
                // 动态参数
                this.staticData = res.data
                console.log(this.staticData,'data')
            }
        },
        async handleChange(){
            if(this.ruleForm.goods_cat.length!==3){
                return this.ruleForm.goods_cat = []
            }
        },
        beforeleaveHandler(activeName,oldActiveName){
            if(this.ruleForm.goods_cat == "" ) return false
            return true
        },
        // upload
        handlePreview(file, fileList){
            this.previewImgUrl = file.response.data.url
            this.imgVisbile = true
        },
        handleRemove(file){
            const index = this.ruleForm.pics.findIndex((item)=>{
                return item.pic == file.response.data.tmp_path
            })
            this.ruleForm.pics.splice(index,1)
            
        },
        successHandler(response){
            const imgTemporalUrl = { pic:response.data.tmp_path }
            this.ruleForm.pics.push( imgTemporalUrl )
        
        },
        handleClose(){
            this.imgVisbile = false
        },
        async submit(){
            const form = _.cloneDeep(this.ruleForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理动态参数
            this.dynamicData.forEach(item =>{
                const newInfo = {
                    attr_id:item.attr_id,
                    // attr_value是一个数组，但接口要求传以空格分开的字符串，使所以转换一下
                    attr_value:item.attr_vals.join(' ')
                }
                this.ruleForm.attrs.push(newInfo)
            })
            form.attrs = this.ruleForm.attrs
            // 处理静态参数
            this.staticData.forEach(item =>{
                const newInfo = {
                    attr_id:item.attr_id,
                    // 静态参数的attr_value本身就是字符串，所以不用转换
                    attr_value:item.attr_vals
                }
                this.ruleForm.attrs.push(newInfo)
            })
            form.attrs = this.ruleForm.attrs
            // 调用添加接口
            const {data:res} = await this.$http.post('goods',form)
            if( res.meta.status !== 201 )return this.$message.error('添加商品失败')
            this.$message.success('添加商品成功')
            this.$router.push({path:'/Goods'})
        }

    }
}
</script>

<style lang="less" scoped>
    .right{
        height: 100%
    }
    .el-checkbox{
        margin: 0 5px 0 0 !important;
    }
    .imgStyle{
        width: 100%;
    }
    .imgDiv{
        padding: 60px;
    }
    .addStyle{
        float: right;
    }
    
</style>
