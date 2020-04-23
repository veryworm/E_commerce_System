<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogvisible"
    width="40%"
    :before-close="handleClose"
    @close="clearForm"
    >
    <div class="FormDiv">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForms" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input type="text" :disabled="isdisabled" v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item v-if="title=='新增用户数据'" label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item
                prop="email"
                label="邮箱"
                :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]"
            >
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model.number="ruleForm.mobile"></el-input>
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
        var checkMobile = ( rule, value, callback ) => {
            if( !value ) {
                return callback( new Error( '电话号不能为空' ) )
            }
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if( regMobile.test( value ) ){
                return callback()
            } 
            return callback( new Error( '请输入正确的电话号' ) )
        }; 
        return {
            ruleForm:{
                username:"",
                password:"",
                email:"",
                mobile:""
            },
            rules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: '用户名的长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '用户名的长度在6~15个字符之间',
                        trigger: 'blur'
                    }
                ],
                mobile:[
                    { validator: checkMobile, trigger:'blur' }
                ]
            }
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
    watch:{
        dialogvisible:{
            handler:"watchCurrentObj"
        }
    },
    computed:{
        isdisabled(){
            return this.title == '新增用户数据' ? false:true
        }
    },
    methods:{
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        // 提交表单
        submitForm(){
            if(this.title == '新增用户数据'){
                this.$refs.ruleForms.validate( async valid=>{
                    if(!valid)return
                    this.addHandler()
                })
            }else{
                this.$refs.ruleForms.validate( async valid=>{
                    if(!valid)return
                    this.editHandler()
                })
            }
        },
        // 新增
        async addHandler(){
            const {data:res} = await this.$http.post('users',this.ruleForm )
            if(res.meta.status!==201){
                this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            this.$emit('closeDrawer')
        },
        // 修改 
        async editHandler(){
            const {data:res} = await this.$http.put('users/'+this.ruleForm.id,{
                email:this.ruleForm.email,
                mobile:this.ruleForm.mobile
            })
            if(res.meta.status!==200){
                this.$message.error('修改用户失败')
            }
            this.$message.success('修改用户成功')
            this.$emit('closeDrawer')
        },
        // 监听是新增还是修改的currenObj
        watchCurrentObj(val){
            if(val){
                if(this.title=="新增用户数据"){
                    this.ruleForm = {...model.ruleForm}
                }else{
                    Object.assign(this.ruleForm,this.currentObj)
                }
            }
        },
        clearForm(){
            this.$refs.ruleForms.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>
