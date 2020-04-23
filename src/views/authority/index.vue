<template>
    <div id="authority">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格 -->
        <el-card class="box-card">
            <!-- <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" @clear="clear" clearable placeholder="请输入内容">
                        <el-button @click="searchBody" slot="append" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="addHandler" type="primary">添加</el-button>
                </el-col>
            </el-row> -->
            <!-- 表格区 -->
            <el-table
                :data="gridList"
                border
                stripe
                style="width: 100%">
                <el-table-column
                type="index"
                >
                </el-table-column>

                <el-table-column
                prop="authName"
                label="权限名称"
                >
                </el-table-column>

                <el-table-column
                prop="path"
                label="路径"
                >
                </el-table-column>
               
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==0">一级</el-tag>
                        <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
                        <el-tag v-else type="success">三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页区
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination> -->

            <!-- 新增修改弹框 -->
            <!-- <AddOrEdit :dialogvisible.sync="dialogvisible" :currentObj="currentObj" :title="title" @closeDrawer="closeDrawer"></AddOrEdit> -->

        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            gridList:[]
        }
    },
    created(){
        this.searchBody()
    },
    methods:{
        async searchBody(){
            const {data:res} = await this.$http.get('rights/list')
            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
            this.gridList = res.data
            console.log(this.gridList)
        }
    }
}
</script>

<style lang="less" scoped>

</style>