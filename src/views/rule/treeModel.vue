<template>
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <!-- 树组件 -->
    <el-tree
    show-checkbox 
    :data="rightList" 
    :props="RightTreeProps" 
    default-expand-all
    node-key="id"
    ref="rightTree"
    :default-checked-keys="checkedArray"
    >
    </el-tree>

    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    props:{
        dialogVisible:{
            type:Boolean,
            default:(()=>{return false})
        },
        currentRow:{
            type:Object
        }
    },
    watch:{
        dialogVisible:{
            handler:"watchTreeList"
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
            checkedArray:[]
        }
    },
    methods:{
        handleClose(){
            this.$emit('closeDrawer',false)
        },
        submit(){

        },
        async watchTreeList(val){
            if(val){
                const {data:res} = await this.$http.get('rights/tree')
                if(res.meta.status !==200 ) return this.$message.error('获取权限列表失败')
                this.rightList = res.data
                // 调用递归
                this.diguiHandler(this.currentRow,this.checkedArray)
            }else{
                this.checkedArray = []
            }
        },
        // 递归
        diguiHandler(currentRow,arr){
            // 1.currentRow是父组件传过来的角色和最外层的children数据
            // 2.!currentRow.children如果没有证明是三级节点，我们只需要获取到3级结点的id
            // 3.然后进行递归调用,第一次最外层的数据，有children，所以继续进行对下一级的children进行递归，就这么一层一层的进行下去，直到children没有为止，然后把id放到数组
            // 4.只监听三级权限
            if(!currentRow.children){
                return arr.push(currentRow.id)
            }
            currentRow.children.forEach((item)=>{
                this.diguiHandler(item,arr)
            })
        },
        async submit(){
            const arr = [
                ...this.$refs.rightTree.getCheckedKeys(),
                ...this.$refs.rightTree.getHalfCheckedKeys()
            ]
            const idStr = arr.join(',')
            const { data:res } = await this.$http.post(`roles/${this.currentRow.id}/rights`,
                { rids: idStr }
            )
            if( res.meta.status !==200 ) return this.$message.error('更新权限失败')
            this.$message.success('更新权限成功')
            this.$emit('closeDrawer')
        }

    }
}
</script>
