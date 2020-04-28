<template>
    <div id="datapage">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a>数据页面</a></el-breadcrumb-item>
            <el-breadcrumb-item>数据图表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div id="main" style="width: 900px;height:400px;"></div>
        </el-card>

    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data(){
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    async mounted(){
        // 1.初始化
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1')
        if( res.meta.status !== 200) return this.$message.error('获取折线图失败')
        // 2.需要把服务器的数据和提供的数据merge一下，才能有鼠标跟随效果
        const result = _.merge( res.data, this.options )
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
        // console.log()
    
    }
}
</script>

<style lang="less" scoped>

</style>