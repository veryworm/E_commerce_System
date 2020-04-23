<template>
    <div>
        <el-row v-for="item in currentObj1" :key="item.id" class="nextItem_Style">
            <el-col :span="6">
                <el-tag type="danger" @close="deleteRole(item,item.id,'item')" closable>{{item.authName}}</el-tag>
            </el-col>
            <el-col :span="18" >
                <el-row v-for="nextitem in item.children" :key="nextitem.id">
                    <el-col :span="4">
                        <el-tag @close="deleteRole(item,nextitem.id)" type="success" closable>{{nextitem.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row>
                            <el-col :span="2" v-for="lastItem in nextitem.children" :key="lastItem.id" :offset="3">
                                <el-tag @close="deleteRole(item,lastItem.id)" type="warning" closable>{{lastItem.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 无法直接修改prop传来的数据，重新给个值，然后computed
            ccc:this.currentObj
        }
    },
    props:{
        currentObj:Array,
        scopeRow:Object
    },
    watch:{
        currentObj:{
            immediate:true,
            handler:"watchCurrentObj"
        }
    },
    computed:{
        currentObj1(){
            return this.ccc
        }
    },
    methods:{
        watchCurrentObj(value){
            console.log(value)
        },
        async deleteRole(rightsItem,rightId,isItem){
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then( async () => {
                // 拿rightsItem里面的权限id
                // 父组件传过来的角色Id，因为子组件拿不到角色Id
                let roleId = this.scopeRow.id
                const {data:res} = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
                if(res.meta.status !== 200) return this.$message.error("删除失败")
                this.$message.success(res.meta.msg)
                // 删除成功后为了用户体验不刷新整个页面，只是把接口返回的数据替换掉当前结点的数据
                this.ccc = res.data
                if(isItem!==undefined){
                    rightsItem = res.data
                }
            })  
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })      
            })
        },
        

    }
}
</script>

<style lang="less" scoped>
    .nextItem_Style{
        line-height: 60px;
        border-bottom: 1px solid #ededed;
    }
</style>
