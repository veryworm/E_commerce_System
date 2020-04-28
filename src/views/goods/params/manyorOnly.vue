<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogvisible"
    width="50%"
    :before-close="handleClose">
    <el-form :model="manyForm" :rules="rules" ref="allForm" label-width="100px">
        <el-form-item :label="title==='添加动态参数'?'动态参数':'静态参数'" prop="attr_name">
            <el-input v-model="manyForm.attr_name"></el-input>
        </el-form-item>
        
    </el-form>    
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    props:{
        title:{
            type:String
        },
        dialogvisible:{
            type:Boolean,
            default:(()=>{return false})
        },
        currentRow:{
            type:Object
        },
        activeName:{
            type:String
        },
        catId:{
            type:Number
        }
    },
    watch:{
        dialogvisible:{
            handler:"watchTreeList"
        }
    },
    computed:{
        message(){
            return this.title == '添加动态参数'?'请填写动态参数':'请填写静态参数'
        }
    },
    data(){
        return {
            // 权限数据
            rightList:[],
            // 指定树的框架
            RightTreeProps:{
                children: 'children',
                label: 'authName'
            },
            checkedArray:[],
            manyForm:{
                attr_name:''
            },
            rules:{
                attr_name:[
                    {required:true,message:this.message,trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        async submit(){
            this.$refs.allForm.validate(async valid=>{
                if(!valid)return
                const {data:res} = await this.$http.post(`categories/${this.catId}/attributes`,
                    {
                        attr_name:this.manyForm.attr_name,
                        attr_sel:this.activeName,
                    }
                )
                if( res.meta.status !==201 ) return this.$message.error('更新动态参数失败')
                this.$message.success('更新动态参数成功')
                this.$emit('closeDrawer')
            })
            // const { data:res } = await this.$http.post(`roles/${this.currentRow.id}/rights`,
            //     { rids: idStr }
            // )
            // if( res.meta.status !==200 ) return this.$message.error('更新权限失败')
            // this.$message.success('更新权限成功')
            // this.$emit('closeDrawer')
        },
        async watchTreeList(val){
            if(val){
                
            }else{

            }
        },

    }
}
</script>
