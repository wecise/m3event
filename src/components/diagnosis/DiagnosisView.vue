<template>
  <el-container>
    <el-main>
      <el-tabs v-model="tabs.activeTab" type="border-card">
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list" lazy>
          <span slot="label">{{item.title}} <span @click="onTip(item)" class="el-icon-question" v-if="item.desc"></span></span>
          <InfoView :model="model" v-if="item.type==='info'"></InfoView>
          <JournalView :model="model" v-else-if="item.type==='journal'"></JournalView>
          <AttributeRelView :model="model" :global="global" v-else-if="item.type==='attribute'"></AttributeRelView>
          <HistoryView :model="model" v-else-if="item.type==='history'"></HistoryView>
          <GraphView :model="[model.entity]" v-else-if="item.type==='graph'"></GraphView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import InfoView from './InfoView.vue';
import JournalView from './JournalView.vue';
import AttributeRelView from './AttributeRelView.vue';
import HistoryView from './HistoryView.vue';
import GraphView from './GraphView.vue'

export default {
  name: "DiagnosisView",
  props: {
    model: Object,
    global: Object
  },
  components:{
    InfoView,
    JournalView,
    AttributeRelView,
    HistoryView,
    GraphView
  },
  data() {
    return {
      tabs: {
          list: [],
          activeTab: 'info'
      }
    };
  },
  created(){
    this.tabs.list = [
            {name:'info',title:'告警信息',type:'info',data: this.model},
            {name:'journal',title:'告警轨迹',type:'journal', data: this.model, desc:'当前告警的生命周期。'},
            {name:'attribute',title:'维度关联性告警',type:'attribute', data: this.model, desc:'选则当前告警属性，可多选、可单选，通过选择不同的属性组合进行关联告警的查找、分析，从而通过相关告警快速定位问题所在。'},
            {name:'history',title:'历史相似告警',type:'history', data: this.model},
            {name:'graph',title:'资源分析',type:'graph', data: this.model}
          ];
  },
  methods: {
    onTip(item){
        if(!item.desc) return false;
        
        const h = this.$createElement;
        this.$notify({
          title: item.title,
          position: 'top-right',
          message: h('i', { style: 'color: teal'}, item.desc)
        });
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
