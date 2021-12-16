<template>
    <el-container style="height: calc(100vh - 201px);background: #f2f2f2;" @mouseover.native="onLayout">
        <el-header style="height:auto!important;min-height:60px!important;padding:10px;">
             <div style="display:flex;">
                <span>
                    <span style="font-weight:600;">时间区间：</span>
                    <el-date-picker
                        v-model="attr.time.value"
                        :picker-options="attr.time.options"
                        type="datetimerange"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        ref="datePicker">
                    </el-date-picker>
                </span>
                <span style="margin:0 15px;">
                    <span style="font-weight:600;">选择属性：</span>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-grid el-icon--right" style="cursor:pointer;padding-top:10px;font-size:16px;"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" style="width:30vw;padding:20px;">
                            <el-container>
                                <el-header style="height: 40px;line-height: 40px;padding:0px;" v-if="attr.dt.selected.length > 1">
                                    <span style="float:right;">
                                        <el-button type="success" @click="onAttrSelect(';')">选择（OR）</el-button>
                                        <el-button type="warning" @click="onAttrSelect('|')">选择（AND）</el-button>
                                    </span>
                                </el-header>
                                <el-header style="height: 40px;line-height: 40px;padding:0px;" v-else-if="attr.dt.selected.length == 1">
                                    <span style="float:right;">
                                        <el-button type="primary" @click="onAttrSelect(',')">选择同一 {{ attr.dt.selected | pickAttrName }}</el-button>
                                    </span>
                                </el-header>
                                <el-header style="height: 40px;line-height: 40px;padding:0px;" v-else>
                                    <span>选择属性
                                    </span>
                                </el-header>
                                <el-main style="padding: 10px 0 0 0;">
                                    <el-table
                                        ref="attrTable"
                                        height="50vh"
                                        border
                                        stripe
                                        :data="attr.dt.rows"
                                        tooltip-effect="dark"
                                        style="width: 100%"
                                        @selection-change="onAttrSelectionChange">
                                        <el-table-column
                                            type="selection"
                                            width="55">
                                        </el-table-column>
                                        <el-table-column
                                            prop="name"
                                            label="属性"
                                            width="120">
                                        </el-table-column>
                                        <el-table-column
                                            prop="value"
                                            label="值">
                                        </el-table-column>
                                    </el-table>
                                </el-main>
                            </el-container>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
             </div>
            <div class="tag-box" v-if="attr.tag.list.length > 0">
                <el-tag 
                    class="tag-box-item"
                    :key="index" 
                    v-for="(tag,index) in attr.tag.list"
                    :type="attr.tag.type"
                    effect="dark"
                    closable
                    @close="onAttrTagClose(tag)">{{tag}}</el-tag>
            </div>
        </el-header>
        <el-main>  
            <EventList ref="eventList" 
                :model="result.dt" 
                :global="global" 
                :refreshEnable="false" 
                :options="result.dt.options" 
                rowClass="historySameEvent" 
                @DiagnosisView="onDiagnosis">
            </EventList> 
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';
import EventList from '../EventList';

export default {
    name: "HistoryView",
    props: {
        model: Object,
        global: Object
    },
    data(){

        const eTime = new Date();
        const sTime = new Date();
        sTime.setTime(sTime.getTime() - 3600 * 1000 * 1);
        
        return {
            attr:{
                dt: {
                    // 属性列表
                    rows: [],
                    // 选择的属性
                    selected: [],
                    // 初始化的属性
                    init: ['biz','host','entity']
                },
                // 根据选择的属性生成的tag条件
                tag: {
                    list:[],
                    type: _.sample(['info'])
                },
                time: {
                    options: {
                        shortcuts: [
                        {
                            text: '最近一小时',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 1);
                            picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一天',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一周',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近一个月',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近三个月',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                            }
                        }]
                    },
                    value: [sTime,eTime]
                }
            },
            result: {
                dt: {
                    rows: [],
                    columns: [],
                    options:{
                        header:false,
                        dtContainerHeight: '290px',
                        severityBar: false
                    }
                }
            }
        }
    },
    watch:{
        'attr.tag.list':{
            handler(val){
                if(_.isEmpty(val)) {
                    this.result.dt.rows = [];
                    return false;
                }
                this.onSearchByTags({attr:val, time:this.attr.time.value});
            },
            immediate: true
        },
        'attr.time.value':{
            handler(val){
                this.onSearchByTags({attr:this.attr.tag.list, time:val});
            },
            immediate: true
        }
    },
    filters: {
        pickAttrName(val){
            return _.map(val,'name')[0];
        }
    },
    components:{
        EventList
    },
    created(){  
        this.initData();
        // 初始化维度查询
        this.initAttr();
    },
    methods:{
        onLayout(){
            this.$nextTick(()=>{
                this.$refs.eventList.$refs.table.doLayout();
            })
        },
        initData(){
            this.attr.dt.rows = _.compact(_.map(this.model, (v,k)=>{
                                    if(!v) return;
                                    return {name:k, value:v};
                                }));
        },
        onDiagnosis(data){
            this.eventHub.$emit("event-diagnosis", data);
        },
        initAttr(){
            this.attr.dt.selected = _.filter(this.attr.dt.rows, (v)=>{
                                        if( _.indexOf(this.attr.dt.init,v.name) !== -1 ){
                                            return v;
                                        }
                                    });
            
            this.onAttrSelect(" ; ");
        },
        onAttrSelectionChange(val){
            this.attr.dt.selected = val;
        },
        onAttrSelect(val){
            let selected = _.map(this.attr.dt.selected, (v)=>{
                return `${v.name}='${v.value}'`;
            }).join(` ${val} `);
            
            if( _.indexOf(this.attr.tag.list,selected) !== -1 ) {
                this.$message({
                    type: "info",
                    message: "已选择属性"
                })
                return;
            } else {
                this.attr.tag.list.push( selected );
            }

            if(!_.isEmpty(this.attr.dt.selected)){
                this.attr.dt.selected = [];
                
                if(this.$refs.attrTable){
                    this.$refs.attrTable.clearSelection();
                }
            }
        },
        onAttrTagClose(tag){
            this.attr.tag.list.splice(this.attr.tag.list.indexOf(tag), 1);
        },
        onSearchByTags(val){
            
            let term = val.attr;

            if(val.time){
                term = _.concat(term,[`window ${val['time'][0]} to ${val['time'][1]} for ctime`]);
            }

            let param = encodeURIComponent(JSON.stringify(  term.join(" | ") ).replace(/%/gi,'%25'));
            
            this.m3.callFS("/matrix/m3event/diagnosis/history.js", param).then( (rtn)=>{
                let rt = rtn.message;
                _.extend(this.result.dt, {columns: _.map(rt.columns, (v)=>{
                    
                    if(_.isUndefined(v.visible)){
                        _.extend(v, { visible: true });
                    }

                    if(!v.render){
                        return v;
                    } else {
                        return _.extend(v, { render: eval(v.render) });
                    }
                    
                })});
                
                _.extend(this.result.dt, { rows: rt.rows });

                _.extend(this.result.dt, { summary:rt.summary });

            } )
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
    .el-main{
        padding: 0px;
        overflow: hidden;
    }

    .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }

    .tag-box{
        display: flex;
        flex-wrap: wrap;
        height:auto;
        align-items: center;
        overflow: auto;
        padding:5px 0px;;
        background: #f2f2f2;
    }
    .tag-box-item{
        margin: 5px;
    }
</style>
