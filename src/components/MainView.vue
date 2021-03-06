<template>
  <el-container>
    <el-main style="padding:0px 10px;">
      <el-tabs v-model="tabs.activeTab" closable @tab-remove="removeTab">
        <el-tab-pane label="事件列表" name="event-list">
          <el-container>
            <el-header>
              <el-input
                placeholder="请输入内容"
                v-model="search.model.term"
                class="input-with-select"
                clearable
                @clear="onSearch"
                @keyup.enter.native="onSearch"
              >
                <el-select
                  v-model="views.value"
                  slot="prepend"
                  placeholder="选择视图"
                >
                  <el-option
                    :value="item.name"
                    :key="index"
                    v-for="(item,index) in views.list"
                  >
                    {{item.name.replace(/.json/,"")}}
                  </el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                ></el-button>
              </el-input>
            </el-header>
            <el-main :loading="loading">
              <EventList ref="eventList" :model="search.result.list" :global="global" :options="search.result.options" @onSearch="onSearch" @onDiagnosis="((data)=>{ addTab(data.row,data.menu) })"></EventList>
            </el-main>
            
          </el-container>
        </el-tab-pane>
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list">
            <span slot="label">
              <span v-if="item.callback==='DiagnosisView'">
                
                  <el-button
                      type="default"
                      :style="'position:absolute;top:15px;left:10px;padding: 3px;border-radius: 15px;color:#ffffff;background:' + global.register.event.severity[item.data.severity][2]">
                  </el-button>
                  {{item.title}} {{ item.data.id }}
              </span>
              <span v-else>
                 {{item.title}}
              </span>
            </span>
          <!-- 分析 -->
          <DiagnosisView :model="item.data" :global="global" v-if="item.callback==='DiagnosisView'"></DiagnosisView>
          <!-- 智能分组 -->
          <SmartGroupView :model="item.data" :global="global" v-else-if="item.callback==='SmartGroupView'"></SmartGroupView>
          <!-- 右键菜单 -->
          <CtmenuKeepView :model="item.data" :global="global" v-else-if="item.callback==='CtmenuKeepView'"></CtmenuKeepView>
          <!-- 实体抽取 -->
          <EntityView :model="item.data" :global="global" v-else-if="item.callback==='EntityView'"></EntityView>
          <!-- 级别定义 -->
          <SeverityView :model="item.data" :global="global" v-else-if="item.callback==='SeverityView'"></SeverityView>
          <!-- 视图定制 -->
          <DashView :model="item.data" :global="global" v-else-if="item.callback==='DashView'"></DashView>
          <!-- 通知管理 -->
          <NotifyView :model="item.data" :global="global" v-else-if="item.callback==='NotifyView'"></NotifyView>
          <!-- 规则管理 -->
          <RuleView :model="item.data" :global="global" v-else-if="item.callback==='RuleView'"></RuleView>
          <!-- 任务管理 -->
          <JobView :model="item.data" :global="global" v-else-if="item.callback==='JobView'"></JobView>
          <!-- 接口管理 -->
          <FsView :model="item.data" :global="global" v-else-if="item.callback==='FsView'"></FsView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>

import _ from 'lodash';
import $ from 'jquery';
import EventList from './EventList.vue';
import DiagnosisView from './diagnosis/DiagnosisView';
import SmartGroupView from './diagnosis/SmartGroupView';
import EntityView from './diagnosis/EntityView';
import CtmenuKeepView from './contextmenu/CtmenuKeepView';
import SeverityView from './utils/SeverityView';
import DashView from './dashview/DashView';
import NotifyView from './notify/NotifyView';
import RuleView from './rule/RuleView';
import JobView from './job/JobView';
import FsView from './editor/FsView';

export default {
  name: "MainView",
  props: {
    global: Object
  },
  components:{
    EventList,
    DiagnosisView,
    CtmenuKeepView,
    SmartGroupView,
    EntityView,
    SeverityView,
    DashView,
    NotifyView,
    RuleView,
    JobView,
    FsView
  },
  data() {
    return {
      loading: false,
      views: {
        value: "运维告警",
        list: []
      },
      search: {
        type: "#/matrix/devops/alert",
        model: {
          term: "",
          view: "all",
        },
        result: {
          list: null,
          options: {
            dtContainerHeight: '115px',
          }
        }
      },
      tabs: {
        activeTab: 'event-list',
        list: []
      }
    };
  },
  watch: {
    'tabs.list':{
        handler(val){
            if(val.length > 0){
                $("#tab-event-list").show();
            }else {
                $("#tab-event-list").hide();
            }
        },
        deep:true
    },
  },
  created(){

    this.initViews();
    this.onSearch();

    this.eventHub.$on("event-diagnosis",(data)=>{
      this.addTab(data.row,data.menu)
    })
  },
  mounted(){
    this.hideTabEventViewConsoleUl();
  },
  methods: {
    hideTabEventViewConsoleUl(){
      if($('#tab-event-list').is(':visible')) {
          $("#tab-event-list").hide();
          $("#tab-event-list > span").hide();
      } else {
          setTimeout(this.hideTabEventViewConsoleUl, 50);
      } 
    },
    initViews(){
        let term = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
            this.views.list = _.orderBy(rtn.message,['name'],['asc']);
        })
    },
    onSearch() {
      
      this.loading = true;

      let param = {
        view: this.search.model.view,
        term: this.search.model.term
          ? `${this.search.type} | ${this.search.model.term}`
          : this.search.type,
      };

      this.m3.callFS(
        "/matrix/eventConsole/event_list.js",
        encodeURIComponent(JSON.stringify(param))
      ).then( (rtn)=>{
          this.search.result.list = rtn.message; 
          this.loading = false;
      }).catch( ()=>{
        this.loading = false;
      } );

    },
    addTab(row,menu){

      let find = _.find(this.tabs.list, {name:row.id});
      
      if(find){
        this.tabs.activeTab = row.id;
      } else {
        let data = row;
        /* 智能分组需要传入ids */
        if( _.includes(['smartGroup'],row.id) ){
            data = _.compact(_.map(this.$refs.eventList.dt.rows,'id'));
        } else if(  _.includes(['entityEtl'],row.id) ){
            data = _.compact(_.map(this.$refs.eventList.dt.rows,'entity'));
        } 
        let tabObj = {name: row.id, title: menu.name, type: menu.type, callback: menu.callback, data: data};
        this.tabs.list.push(tabObj);
        this.tabs.activeTab = row.id;
      }

      
    },
    removeTab(targetName){
      let tabs = this.tabs.list;
        let activeName = this.tabs.activeTab;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              } else {
                activeName = 'event-list';
              }
            }
          });
        }
        
        this.tabs.activeTab = activeName;
        this.tabs.list = tabs.filter(tab => tab.name !== targetName);

        // 关闭智能分组
        this.$refs.eventList.control.ifSmartGroup = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-header {
  height: 40px!important;
  padding: 0px;
}

.el-main {
  padding: 0px;
  overflow: hidden;
}
.el-input-group__prepend > .el-select {
  width: 120px;
}
</style>
