<template>
    <el-dialog
    title="分配权限"
    :visible.sync="dialogvisible"
    width="30%"
    @close="clearForm"
    :before-close="handleClose">
    <div>
        <p>用户名: {{currentUser.username}}</p>
        <p>角色: {{currentUser.role_name}}</p>
        <el-select v-model="roleId" placeholder="请选择">
            <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
            </el-option>
        </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    data(){
        return {
            roleId:'',
            roleList:[]
        }
    },
    props:{
        dialogvisible:{
            type:Boolean,
            default:(()=>{return false})
        },
        currentUser:{
            type:Object
        }
    },
    watch:{
        dialogvisible:{
            handler:"watchCurrentObj"
        }
    },
    methods:{
        clearForm(){
            // this.$refs.ruleForms.resetFields()
        },
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        // 分配角色
        async submit(){
            if(!this.roleId){
                return this.$message.error('请选择分配角色')
            }
            const {data:res} = await this.$http.put(`users/${this.currentUser.id}/role`,{
                rid:this.roleId
            })  
            if(res.meta.status !== 200 )return this.$message.error('加载角色权限失败')
            this.$message.success('分配角色成功')
            this.$emit('closeDrawer',false)
        },
        async watchCurrentObj(val){
            if(val){
                const {data:res} = await this.$http.get('roles')  
                if(res.meta.status !== 200 )return this.$message.error('加载角色权限失败')
                this.roleList = res.data
            }
        },


    }
}
</script>

<style lang="less" scoped>
</style>
