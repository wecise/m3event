<template>
    <el-container style="height:calc(100vh - 280px);">
        <el-main>
            <div class="block" v-if="model.cmds.rows">
                <el-timeline>
                    <el-timeline-item 
                        :timestamp="new Date(item.vtime).toLocaleString()" 
                        placement="top" 
                        v-for="item in model.cmds.rows"
                        :key="item.id">
                        <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding:0 20px;">
                            <h3>执行命令：{{item.name}}</h3>
                            <el-form label-width="80px">
                                <el-form-item label="位置">{{item.dir}}</el-form-item>
                                <el-form-item label="源">{{item.source}}</el-form-item>
                                <el-form-item label="服务器">{{item.host}}</el-form-item>
                                <el-form-item label="PID">{{item.pid}}</el-form-item>
                                <el-form-item label="RID">{{item.runid}}</el-form-item>
                                <el-form-item label="SID">{{item.sid}}</el-form-item>
                                <el-form-item label="状态" style="font-size:12px;" v-if="global.register.jobs.status[item.stauts]">{{global.register.jobs.status[item.stauts][1]}}</el-form-item>
                                <el-form-item label="类型" style="font-size:12px;" v-if="global.register.jobs.type[item.type]">{{global.register.jobs.type[item.type][1]}}</el-form-item>
                                <el-form-item label="开始时间">{{ new Date(item.stime).toLocaleString()}}</el-form-item>
                                <el-form-item label="结束时间">{{new Date(item.etime).toLocaleString()}}</el-form-item>
                                <el-form-item label="耗时">{{ item | pickDiff }}</el-form-item>
                                <el-form-item label="命令" v-if="item.cmd">
                                    <el-input type="textarea" rows="10" :value="item.cmd | pickString" ></el-input>
                                </el-form-item>
                                <el-form-item label="输出" v-if="item.out">
                                    <el-input type="textarea" rows="10" :value="item.out" ></el-input>
                                </el-form-item>
                                <el-form-item label="错误" v-if="item.err">
                                    <el-input type="textarea" rows="10" :value="item.err" ></el-input>
                                </el-form-item>
                                <el-form-item label="代码">{{item.code}}</el-form-item>
                            </el-form>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        props: {
            model: Object
        },
        data(){
            return {
                global: window.global
            }
        },
        filters: {
            pickDiff(item){
                let timeDiff = window.moment(item.etime).diff(window.moment(item.stime), "millisecond");
                if(timeDiff > 1000){
                    return window.moment(item.etime).diff(window.moment(item.stime), "seconds") + ' second';    
                } else {
                    return timeDiff + ' millisecond';    
                }
            }
        }
    }
</script>

<style scoped>
   
</style>