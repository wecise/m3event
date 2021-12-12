<template>
    <el-container style="height:calc(100vh - 280px);">
        <el-main>
            <div class="block" v-if="model.journal.rows">
                <el-timeline>
                    <el-timeline-item 
                        :timestamp="new Date(item.vtime).toLocaleString()" 
                        :color="global.register.jobs.status[item.status][2]"
                        size="large"
                        placement="top" 
                        v-for="item in model.journal.rows"
                        :key="item.id">
                        <el-card style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding:0 20px;">
                            <h4>
                                {{item.name}}
                            </h4>
                            <el-form label-width="80px">
                                <el-form-item label="状态" v-if="item.status">
                                    <el-button type="text" :style="item.status | pickStatusStyle">{{ global.register.jobs.status[item.status][1] }}</el-button>
                                </el-form-item>
                                <el-form-item label="类型" v-if="item.type">
                                    {{ global.register.jobs.type[item.type][1] }}
                                </el-form-item>
                                <el-form-item label="开始时间">
                                    {{ new Date(item.stime).toLocaleString() }}
                                </el-form-item>
                                <el-form-item label="结束时间">
                                    {{ new Date(item.etime).toLocaleString() }}
                                </el-form-item>
                                <el-form-item label="耗时">
                                    {{ item | pickDiff }}
                                </el-form-item>
                                <el-form-item label="命令" v-if="item.cmds">
                                    <el-input type="textarea" :value="item.cmds | pickString" rows="10"></el-input>
                                </el-form-item>
                                <el-form-item label="输出" v-if="item.out">
                                    <el-input type="textarea" :value="item.out" rows="10"></el-input>
                                </el-form-item>
                                <el-form-item label="错误" v-if="item.err">
                                    <el-input type="textarea" :value="item.err" rows="10"></el-input>
                                </el-form-item>
                                <el-form-item label="代码" v-if="item.code">
                                    {{item.code}}
                                </el-form-item>
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
    props:{
        model: Object
    },
    data(){
        return {
            global: window.global
        }
    },
    filters:{
        pickStatusStyle(status){
            try{
                return `padding:5px;background:${window.global.register.jobs.status[status][2]};`;
            } catch(err){
                return `padding:5px;`;
            }
        },
        pickString(val){
            try{
                if(typeof val == 'object'){
                    return JSON.stringify(val,null,2);
                } else {
                    return val;
                }
            } catch(err){
                return '';
            }
        },
        pickDiff(item){
            let timeDiff = window.moment(item.etime).diff( window.moment(item.stime), "millisecond");
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