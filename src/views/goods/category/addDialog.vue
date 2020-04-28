<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogvisible"
    width="40%"
    :before-close="handleClose"
    @close="clearForm"
    >
    <div class="FormDiv">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormsone" label-width="90px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input type="text" v-model="ruleForm.cat_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item v-if="title === '新增分类'" label="父级分类" prop="mobile">
                <el-cascader
                v-model="checkedCategory"
                :props="categoryProps"
                :options="categoryList"
                clearable
                @change="handleChange"></el-cascader>
            </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
    </el-dialog>    
</template>

<script>
import model from './model.js'
export default {
    data(){
        return {
            ruleForm:{
                cat_pid:0,
                cat_name:'',
                cat_level:0
            },
            rules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            categoryList:[],
            checkedCategory:[],
            categoryProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover',
                checkStrictly: true 
            },

            
        }
    },
    watch:{
        dialogvisible:{
            handler:"watchCurrentObj"
        }
    },
    props:{
        dialogvisible:{
            type:Boolean,
            default:(()=>{return false})
        },
        title:{
            type:String
        },
        currentObj:{
            type:Object
        }
    },
    computed:{
       
    },
    created(){
        this.getcategoryList()
    },
    methods:{
        async getcategoryList(){
            const {data:res} = await this.$http.get('categories',
                { params:{type:2} }
            )
            if(res.meta.status!==200)return this.$message.error('获取数据失败')
            console.log(res.data)
            this.categoryList = res.data
        },
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        // 提交表单
        submitForm(){
            this.$refs.ruleFormsone.validate( async valid=>{
                if(!valid)return
                if(this.title == '新增分类'){
                    this.addHandler()
                }else{
                    this.editHandler()
                }
            })
            
        },
         // 新增
        async addHandler(){
            const { data:res } = await this.$http.post('categories',this.ruleForm)
            if( res.meta.status!==201 )return this.$message.error('新增分类失败')
            this.$emit('closeDrawer')
            this.$message.success('新增分类成功')
        },
        // 修改 
        async editHandler(){
            const {data:res} = await this.$http.put('categories/'+this.ruleForm.cat_id,{
               cat_name:this.ruleForm.cat_name
            })
            if(res.meta.status!==200){
                this.$message.error('修改分类失败')
            }
            this.$message.success('修改分类成功')
            this.$emit('closeDrawer')
        },
        handleChange(){
            if(this.checkedCategory.length>0){
                this.ruleForm.cat_pid = this.checkedCategory[this.checkedCategory.length-1]
                this.ruleForm.cat_level = this.checkedCategory.length
            }else{
                // 大家电/电视
                // 1.如果只填入名称啥也不选，cat_level为0，就是一级栏目比如'大家电'这个级别的
                // 2.如果选了大家电，cat_level为1，就是大家电下级的栏目'电视'这个级别的栏目
                // 3.如果再选电视，cat_level就为2，就是大家电下级的栏目电视 再下级的栏目”比如电视的分类液晶之类的“
                this.ruleForm.cat_pid = ''
                this.ruleForm.cat_level = ''
            }
        },
        watchCurrentObj(val){
            if( val && this.title=='新增分类' ){
                this.checkedCategory = []
                this.ruleForm.cat_pid = 0
                this.cat_name = ''
                this.cat_level = 0
            }else{
                Object.assign(this.ruleForm,this.currentObj)
            }
        },
        clearForm(){
            // this.$refs.ruleForms.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
    .el-cascader{
        width: 100%;
    }
</style>
