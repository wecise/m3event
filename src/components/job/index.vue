<template>
    <el-container>
        <el-main>
            <component  v-bind:is="currentView" :model="model" 
                        @goback="onGoBack"
                        @diagnosis="onDiagnosis"></component>
        </el-main>
    </el-container>
</template>

<script>

    import JobView from './job.vue';
    import DiagnosisView from './diagnosis.vue';
    export default {
        components:{
            JobView,
            DiagnosisView
        },
        data(){
            return {
                currentView: "JobView",
                model: null
            }
        },
        methods:{
            onDiagnosis(row){
                this.model = row;
                this.currentView = "DiagnosisView";
            },
            onGoBack(value){
                this.currentView = "JobView";
            }
        }
    }
</script>

<style scoped>
    .el-main{
        padding:0px;
    }
</style>