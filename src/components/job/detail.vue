<template>
    <el-container style="height:calc(100vh - 280px);">
        <el-main>
            <el-row :gutter="10" style="height:100%;">
                <el-col :xs="12" :sm="10" :md="6" :lg="6" :xl="10" style="height:100%;">
                    <div class="grid-content" style="text-align:center;">
                        <img src="/static/assets/images/entity/png/linux.png" class="image">
                        <h3>{{model.rows.host}}</h3>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="14" :md="18" :lg="18" :xl="14" style="height:100%;">
                    <el-form label-width="120px" style="height:100%;overflow-x: hidden;overflow-y: auto;" class="form-no-border">
                        <!-- 有模板 -->
                        <template v-if="model.template">
                            <el-form-item :label="item.title" v-for="item in model.template" :key="item.id" style="margin-bottom: 10px;">
                                <div v-if="item.data==='value' && model.rows[item.data] <= 100">
                                    <progress :value="model.rows[item.data]" max="100"></progress> 
                                    <b style="font-size:12px;">{{model.rows[item.data]}}%</b>
                                </div>
                                <div v-else-if="item.data==='value' && model.rows[item.data] > 100">
                                    <el-input :value="model.rows[item.data]" disabled></el-input>
                                </div>
                                <div v-else>
                                    <el-input :value="model.rows[item.data] | timeFormat" disabled></el-input>
                                </div>
                            </el-form-item>
                        </template>
                        <!-- 没有模板 -->
                        <el-form-item :label="key" class="form-group" v-for="(value,key) in model.rows" :key="key" style="padding: 0px 10px;margin-bottom: 1px;" v-else>
                            <div class="col-sm-10" style="border-left: 1px solid rgb(235, 235, 244);">
                                <div v-if="key==='value' && value <= 100">
                                    <progress :value="value" max="100"></progress> <b style="font-size:12px;">{{value}}%</b>
                                </div>
                                <div v-else-if="key==='value' && value > 100">
                                    <el-input :placeholder="key" :value="value" disabled></el-input>
                                </div>
                                <div v-else>
                                    <el-input :placeholder="key" :value="value | timeFormat" disabled></el-input>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import _ from 'lodash';
    export default {
        props: {
            model:Object
        },
        filters:{
            timeFormat(evt){
                // 2019-03-13T21:35:31.678Z
                // 检查是否是UTC格式
                if(_.indexOf(evt,'T') === 10 && (_.indexOf(evt,'Z') === 23 || _.indexOf(evt,'Z') === 19) ){
                    return new Date(evt).toLocaleString();
                } else {
                    return evt;
                }
            }
        }
    }
</script>

<style scoped>
    
</style>
