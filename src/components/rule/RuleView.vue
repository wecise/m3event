<template>
    <el-container style="background:#f2f2f2;">
        <el-main style="padding:1px;border-bottom:1px solid #dddddd;">
            <Split direction="horizontal" :gutterSize="5">
                <SplitArea :size="control.configTree.show?25:0" :minSize="0" style="overflow:hidden;">
                    <TreeView ref="treeView" @node-click="onTreeNodeClick" @node-open="onTreeNodeOpen"></TreeView>
                </SplitArea>
                <SplitArea :size="control.configTree.show?75:100" :minSize="0" style="overflow:hidden;">
                    <el-container>
                        <el-header style="height: 35px;line-height: 35px;">
                            
                            <el-tooltip content="切换视图">
                                <el-button type="text" @click="onTogglePanel">
                                    <span :class="control.configTree.show?'el-icon-s-fold':'el-icon-s-unfold'" style="font-size:15px;"></span>
                                </el-button>
                            </el-tooltip>

                            <el-tooltip content="保存" >
                                <el-button type="text" @click="configUpdate" v-if="saveStatus()">
                                    <i class="el-icon-position" style="color:#009688;font-size:15px;"></i>
                                </el-button>
                            </el-tooltip>
                            
                        </el-header>
                        <el-main style="padding:0px;position: relative;overflow:hidden;">                            
                            <el-tabs v-model="configTabs.activeIndex" type="border-card" closable @tab-remove="configClose" v-if="tabsStatus()">
                                <el-tab-pane :key="item.name" :name="item.name" v-for="item in configTabs.tabs">
                                    <span slot="label" v-if="item.dir">
                                        <i class="el-icon-folder-opened" style="color:#ff0000;" v-if="tabPaneStatus(item.name)"></i>
                                        <i class="el-icon-folder-opened" style="color:#409eff;" v-else></i> {{item.title}}
                                        <el-dropdown trigger="click">
                                            <span class="el-dropdown-link">
                                                <i class="el-icon-arrow-down"></i>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click.native="configCopy(item.name)" :class="'copy'+item.name">复制</el-dropdown-item>
                                                <el-dropdown-item @click.native="configDegug(item.name)" divided>调试</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(0,item)" divided>关闭</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(1,item)">关闭其它标签页</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(2,item)">关闭右侧标签页</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </span>
                                    <span slot="label" v-else>
                                        <i class="el-icon-document" style="color:#ff0000;" v-if="tabPaneStatus(item.name)"></i>
                                        <i class="el-icon-document" style="color:#409eff;" v-else></i> {{item.title}}
                                        <el-dropdown trigger="click">
                                            <span class="el-dropdown-link">
                                                <i class="el-icon-arrow-down"></i>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <!--el-dropdown-item @click.native="configCopy(item.name)" :class="'copy'+objectHash.sha1(item.name)">复制</el-dropdown-item-->
                                                <el-dropdown-item @click.native="configDegug(item.name)">调试</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(0,item)" divided>关闭</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(1,item)">关闭其它标签页</el-dropdown-item>
                                                <el-dropdown-item @click.native="tabClose(2,item)">关闭右侧标签页</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </span>
                                    <EditRuleView :model="item.model" :ref="'EditRuleView-'+item.name" @editor:value="onEditorChange"  @editor:change="(v)=>{control.save.show=v;saveStatus();}"></EditRuleView>
                                </el-tab-pane>
                            </el-tabs>
                            
                            <div style="background:#ffffff;padding:20px;height:100%;display:block;text-align:center;" v-else>
                                <h2 style="margin: 0px 0px 40px 0px;">欢迎使用配置管理</h2>
                                <p>
                                    
                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('etc')">
                                        <i class="el-icon-money" style="font-size:48px;"></i> <p>全局配置</p>
                                    </el-button>

                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('hosts')">
                                        <i class="el-icon-office-building" style="font-size:48px;"></i> <p>服务器组管理</p>
                                    </el-button>
                                    
                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('jobs')">
                                        <i class="el-icon-postcard" style="font-size:48px;"></i> <p>作业定义</p>
                                    </el-button>
                                
                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('rules')">
                                        <i class="el-icon-s-data" style="font-size:48px;"></i> <p>规则管理</p>
                                    </el-button>

                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('locks')">
                                        <i class="el-icon-lock" style="font-size:48px;"></i> <p>全局锁</p>
                                    </el-button>

                                    <el-button style="width:100px;height:90px;" @click="onToggleKey('notify')">
                                        <i class="el-icon-warning-outline" style="font-size:48px;"></i> <p>通知设置</p>
                                    </el-button>
                                
                                </p>
                                <!-- <object src="../../assets/svg/configWorld.svg" 
                                    type="image/svg+xml" style="width:40vw;height:40vh;background: #ffffff;">
                                </object> -->
                                <p>
                                    如有任何意见或建议，请及时反馈给我们。
                                    <el-link href="mailto:m3@wecise.com">Email：m3@wecise.com</el-link>
                                </p>
                            </div>

                        </el-main>
                    </el-container>
                </SplitArea>
            </Split>
        </el-main>
        <el-footer>
            时间：{{currentDateTime}}
            <el-divider direction="vertical"></el-divider>
            当前编辑：{{configTabs.activeIndex}}  
            <el-divider direction="vertical"></el-divider>  
            打开：{{configTabs.tabs.length}}
            <span style="float:right;" v-if="configTabs.activeIndex">
                <el-button type="text" icon="el-icon-tickets" @click="configDegug(configTabs.activeIndex)"></el-button>
            </span>
        </el-footer>
    </el-container>
</template>

<script>
import _ from 'lodash';
import TreeView from './TreeView';
import EditRuleView from './EditRuleView';


export default {
    name: "RuleView",
    props: {
        model: Object
    },
    components:{
        TreeView,
        EditRuleView
    },
    data() {
        return {
            configTabs: {
                tabs:[],
                activeIndex: '',
            },
            control: {
                configTree: {
                    show: false
                },
                save: {
                    show: false,
                    visible: false,
                    list: []
                }
            },
            configTreeSelectedNode:{}
        }
    },
    computed:{
        currentDateTime: function(){ 
            return this.moment().format(window.global.register.format);
        }
    },
    filters:{
        
    },
    watch:{
        'configTabs.tabs'(val){
            if(_.isEmpty(val)){
                this.control.save.show = false;
            }
        }
    },
    created() {
        // 默认边栏显示状态
        this.control.configTree.show = (localStorage.getItem("CONFIG-TREE-IFSHOW") == 'true');
    },
    mounted() {
        
    },
    methods: {
        saveStatus(){
            this.control.save.visible = this.control.save.show && !_.isEmpty(this.configTabs.tabs);
            return this.control.save.show && !_.isEmpty(this.configTabs.tabs);
        },
        tabsStatus(){
            return !_.isEmpty(this.configTabs.tabs);
        },
        tabPaneStatus(name){
            return _.includes(this.control.save.list, name);
        },
        onTreeNodeClick(data){
            this.configTreeSelectedNode = data;
        },
        onTreeNodeOpen(data){
            this.configOpen(data);
        },
        onToggleKey(key){
            
            this.control.configTree.show = true;
            
            let keyPath = ["",window.COMPANY_OSPACE,key].join("/");
            
            this.$refs.configTree.defaultExpandedKeys.push(keyPath);
            this.$refs.configTree.onCollapseAll();
            this.$refs.configTree.$refs.tree.setCurrentKey(keyPath);
        },
        onTogglePanel(){
            this.control.configTree.show = !this.control.configTree.show;

            localStorage.setItem("CONFIG-TREE-IFSHOW",this.control.configTree.show);
        },
        onEditorChange(data){
            let node = _.find(this.configTabs.tabs,{name: this.configTabs.activeIndex });
            node.model.value = data;
        },
        tabClose(key,tab){
            const self = this;

            if(key === 0){
                self.configClose(tab.name);
            } else if( key === 1 ){
                let others = _.xor(self.configTabs.tabs,[tab]);
                _.forEach(others,(v)=>{
                    self.configClose(v.name);
                })
            } else {
                let others = self.configTabs.tabs.slice(_.indexOf(self.configTabs.tabs,tab) + 1, self.configTabs.tabs.length);
                _.forEach(others,(v)=>{
                    self.configClose(v.name);
                })
            }
        },
        configImport(event){
            
            let file = event.target.files[0];
            const h = this.$createElement;

            this.$msgbox({
                    title: `确认要导入配置`, 
                    message: h('span', null, [
                        h('p', null, `文件名称：${file.name}`),
                        h('p', null, `修改时间：${file.lastModifiedDate}`),
                        h('p', null, `文件大小：${this.m3.bytesToSize(file.size)}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                let rtn = this.m3.ruleImport(file,null);

                if(rtn == 1){
                    this.eventHub.$emit("CONFIG-TREE-REFRESH-EVENT", '/');
                }

            }).catch(() => {
                    
            }); 
                        
        },
        configExport(){
            
            this.$confirm(`确认要导出所有配置?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.m3.ruleExport(this.configTreeSelectedNode.key,this);
                
            }).catch(() => {
                
            });

        },
        configOpen(treeNode){
            
            this.configTreeSelectedNode = treeNode;

            try {
                let id = treeNode.key;//tId;
                //if(this.configTabs.activeIndex === id) return false;
                // 已经打开
                if(_.find(this.configTabs.tabs,{name:id})){
                    this.configTabs.activeIndex = id;
                    return false;
                }
                
                // 添加tab
                this.configTabs.activeIndex = id;
                this.configTabs.tabs.push({dir: treeNode.dir, title: treeNode.key, name: id, type: 'config', model: treeNode});                                

            } catch(error){
                console.log(error)
                this.configTabs.tabs = [];
            }
        },
        configClose(targetName){
            const self = this;

            let closeFun = function(){
                let tabs = self.configTabs.tabs;
                let activeIndex = self.configTabs.activeIndex;
                if (activeIndex === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                    let nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        activeIndex = nextTab.name;
                    }
                    }
                });
                }
                
                self.configTabs.activeIndex = activeIndex;
                self.configTabs.tabs = tabs.filter(tab => tab.name !== targetName);

                // 重置是否编辑状态
                self.control.save.list = _.xor(self.control.save.list, [targetName]);
            }

            if(_.includes(this.control.save.list, targetName)) {

                this.$confirm(`${targetName} 已修改，确认是否保存`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    this.onConfigSave();
                    
                }).catch(() => {
                    
                    closeFun();
                    
                });
            } else {
                closeFun();
            }

            
        },
        configNew(){

            // 初始化位置
            this.dialog.configNew.parent = this.configTreeSelectedNode.key || '/';

            this.dialog.configNew.show = true;

        },
        onConfigSave(){
            

            if(_.isEmpty(this.dialog.configNew.name)){
                this.$message({
                    type: "warning",
                    message: "配置名称不能为空！"
                })
                return false;
            }

            this.dialog.configNew.loading = true;
            
            this.dialog.configNew.formItem.key = [this.dialog.configNew.parent, this.dialog.configNew.name].join("/").replace(/\/\//g,'/');
            
            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要添加以下配置`, 
                    message: h('span', null, [
                        h('p', null, `位置：${this.dialog.configNew.formItem.key}`),
                        h('p', null, `值：${_.truncate(this.dialog.configNew.formItem.value)}`),
                        h('p', null, `TTL：${ this.dialog.configNew.formItem.ttl ? this.dialog.configNew.formItem.ttl : ''}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.ruleAdd(this.dialog.configNew.formItem).then( (rtn)=>{
                    if(rtn == 1){
                        this.$message({
                            type: "success",
                            message: "保存成功！"
                        })
                        
                        this.eventHub.$emit("CONFIG-TREE-REFRESH-EVENT", this.dialog.configNew.formItem.key);

                        // 重置是否编辑状态
                        this.control.save.list = _.xor(this.control.save.list, [this.dialog.configNew.formItem.key]);
                        
                        this.dialog.configNew.show = false;

                    } else {
                        this.$message({
                            type: "error",
                            message: "保存失败：" + rtn
                        })
                    }

                    this.dialog.configNew.loading = false;
                } );

            }).catch(() => {
                this.dialog.configNew.loading = false;
            }); 

        },
        configUpdate(){
            
            let item = _.find(this.configTabs.tabs,{name:this.configTabs.activeIndex}).model;


            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要更新以下配置`, 
                    message: h('span', null, [
                        h('p', null, `位置：${item.key}`),
                        h('p', null, `值：${_.truncate(item.value)}`),
                        h('p', null, `TTL：${ _.isUndefined(item.ttl) ? '' : item.ttl }`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.ruleAdd(item).then( ()=>{
                    
                    this.$message({
                        type: "success",
                        message: "更新成功！"
                    });

                    this.control.save.show = false;

                    // 重置是否编辑状态
                    this.control.save.list = _.xor(this.control.save.list, [item.key]);

                    this.eventHub.$emit("CONFIG-TREE-REFRESH-EVENT", item.key);
                    
                }).catch((err)=>{
                    this.$message({
                        type: "error",
                        message: "更新失败：" + err
                    })
                });

            }).catch(() => {
                    
            }); 
            
        },
        configDelete(){
            
            let item = this.configTreeSelectedNode;

            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要删除以下配置`, 
                    message: h('span', null, [
                        h('p', null, `位置：${item.key}`),
                        h('p', null, `值：${_.truncate(item.value)}`),
                        h('p', null, `TTL：${  _.isUndefined(item.ttl) ? '' : item.ttl }`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.ruleDelete(item).then( (rtn)=>{
                    if(rtn == 1){
                        // 刷新Tree
                        this.eventHub.$emit("CONFIG-TREE-REFRESH-EVENT",item.key);
                        // 关闭Tab
                        this.configClose(item.key);
                        // 重置选择
                        this.configTreeSelectedNode = null;

                        // 重置是否编辑状态
                        this.control.save.list = _.xor(this.control.save.list, [item.key]);

                    }
                } );

            }).catch(() => {
                    
            }); 

        },
        configCopy(){
            /* new Clipboard(`.copy${objectHash.sha1(item)}`, {
                text: (trigger)=> {
                    this.$message("已复制");
                    let id = objectHash.sha1(this.configTabs.activeIndex);
                    let editor = ace.edit(this.$refs[`configManageRef${id}`][0].$refs.editorContainer);
                    return editor.getValue();
                }
            }); */
        },
        configDegug(name){
            this.$refs[`EditRuleView-${name}`][0].debug.show = !this.$refs[`EditRuleView-${name}`][0].debug.show
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
      height: calc(100vh - 115px);
  }


  .el-footer{
      height:30px!important;
      line-height: 30px;
      border-top:1px solid #ffffff;
      color:#888888;
  }

  .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }
</style>
