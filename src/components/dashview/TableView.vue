<template>
  
    <el-table
      :data="dt.rows"
      border
      stripe
      style="width: 100%;height:20vh!important;">
      <template v-for="(item,index) in dt.columns">
        <el-table-column
            :key="index"
            sortable
            :prop="item.field"
            :label="item.title"
            show-overflow-tooltip
            v-if="item.field">
        </el-table-column>
      </template>
    </el-table>

</template>

<script>
import _ from 'lodash';

export default {
  name: "TableView",
  props: {
    model: Object
  },
  data() {
    return {
        dt: {
            rows: [],
            columns: []
        }
    }
  },
  watch:{
    model: {
      handler(){
        this.initData();
      },
      deep: true
    }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
      
      _.extend(this.dt, {columns: _.map(this.model.template, function(v){
                
                if(_.isUndefined(v.visible)){
                    _.extend(v, { visible: true });
                }

                if(!v.render){
                    return v;
                } else {
                    return _.extend(v, { render: eval(v.render) });
                }
                
            })});
            
            _.extend(this.dt, { rows: this.model.rows });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
