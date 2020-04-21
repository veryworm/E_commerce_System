<template>
    <div class="Login_constainer">
        <div class="Login_box">
            <div class="Login_img_constainer">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form :model="LoginForm" :rules="rules" label-width="0" class="Login_form" ref="refForm">
                <el-form-item prop="username">
                    <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user" type="text"></el-input>
                </el-form-item>

                 <el-form-item prop="password">
                    <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>

                 <el-form-item class="btns">
                    <el-button @click="Login" type="primary">登录</el-button>
                    <el-button @click="clearForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data(){
        return {
            LoginForm:{
                username:'admin',
                password:'123456'
            },
            rules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    {min:3,max:5,message:'长度在3到5个字符',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:5,max:7,message:'长度在5到7个字符',trigger:'blur'}
                ]
            },

        }
    },
    methods:{
        clearForm(){
            this.$refs.refForm.resetFields()
        },
        Login(){
            this.$refs.refForm.validate(async val=>{
                if( !val )return
                console.log(this.LoginForm,'form')
                const { data: res } = await this.$http.post("login", this.LoginForm)
                if( res.meta.status !== 200 )return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 1.将登录之后的token保存在客户端的sesssionStorage中
                    // 1.1sessionStorage 就是token保存在会话期间的token
                    // 1.2localstorage就是永久存储
                // 2.token只应该在当前网站打开生效，所以将token保存在sessionStorage中
                // 3.通过编程式导航跳转到后台首页
                window.sessionStorage.setItem('token',res.data.token)
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .Login_constainer{
        background-color: rgb(134, 187, 233);
        height: 100%;
    }
    .Login_box{
        width: 450px;
        height: 300px;
        border-radius: 10px;
        background-color: #ffffff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);//横轴 纵轴
        .Login_img_constainer{
            width: 140px;
            height: 140px;
            background-color: aliceblue;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ffffff;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);//横轴 纵轴
            img{
                width: 140px;
                height: 140px;
                background-color: #ffffff;
                border-radius: 50%;
                
            }
        }
    }
    .Login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px; //上下，右左
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>
