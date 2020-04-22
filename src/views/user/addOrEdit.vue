<template>
    <el-dialog
    title="提示"
    :visible.sync="dialogvisible"
    width="40%"
    :before-close="handleClose"
    >
    <div class="FormDiv">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
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

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
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
export default {
    data(){
        return {
            ruleForm:{
                username:"",
                password:"",
                email:"",
                mobile:""
            },
            rules:{
                username:[
                    {required:true, message:"请输入2-5为字母",trigger:'blur'},
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                checkPass:[
                    {required:true, message:"请输入2-5为字母",trigger:'blur'},
                    { min: 5, max: 9, message: '长度在 5 到 9 个字符', trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '手机号不能为空'},
                    { type: 'number', message: '手机号必须为数字值'}
                ]
            }
        }
    },
    props:{
        dialogvisible:{
            type:Boolean,
            default:(()=>{return false})
        }
    },
    methods:{
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        // 提交表单
        submitForm(){

        },
        resetForm(){
            this.$refs.ruleForm.resetField()
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>