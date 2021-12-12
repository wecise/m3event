<template>
    <el-container>
        <el-header>
            <el-page-header @back="onGoBack" :content="model.name"></el-page-header></el-header>
        <el-main>
            <el-tabs v-model="active" type="border-card" v-if="diagnosisData">
                <el-tab-pane label="作业详情" name="detail">
                    <diagnosis-detail :model="diagnosisData.detail" ></diagnosis-detail>
                </el-tab-pane>
                <el-tab-pane label="执行情况" name="jobrun">
                    <diagnosis-journal :model="diagnosisData"></diagnosis-journal>
                </el-tab-pane>
                <el-tab-pane label="作业命令" name="cmdrun">
                    <diagnosis-cmd :model="diagnosisData"></diagnosis-cmd>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
import App from '../../App.vue';
import diagnosisDetail from './detail.vue';
import diagnosisJournal from './jobrun.vue';
import diagnosisCmd from './cmdrun.vue';

export default {
    props: {
        model:Object
    },
    data(){
        return {
            active: "detail",
            diagnosisData: null
        }
    },
    components: {
        diagnosisDetail,
        diagnosisJournal,
        diagnosisCmd
    },
    created(){
        this.getDiagnosisData();
    },
    methods:{
        getDiagnosisData(){
            let param = encodeURIComponent(JSON.stringify(this.model));
            this.m3.callFS("/matrix/m3job/job_diagnosis.js",param).then( (res)=>{
                this.diagnosisData = res.message;
            });
        },
        onGoBack(){
            this.$emit("goback");
        }
    }
}
</script>

<style scoped>
    .el-header{
        line-height: 60px!important;
    }
    .el-main{
        padding: 0 20px;
    }
    .el-page-header {
        line-height: unset;
    }
</style>
<style>
    .el-input.is-disabled .el-input__inner {
        color: #333333!important;
    }
</style>

