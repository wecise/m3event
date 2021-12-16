<template>
  <el-container style="background:#f2f2f2;height: calc(100vh - 130px);">
    <el-main style="padding: 0px;">
        <Split :gutterSize="5">
            <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                <TagTreeView :model="{domain:'policy'}" :fun="onRefreshByTag" ref="policyTagTree"></TagTreeView>
            </SplitArea>
            <SplitArea :size="80" :minSize="0" style="overflow:hidden;">
                <el-container style="height:100%;background:#ffffff;" 
                  v-loading="dt.loading"
                  element-loading-spinner="el-icon-loading">
                  <el-header style="line-height:60px;">
                      <el-button type="default" icon="el-icon-refresh" @click="onRefresh">刷新</el-button>
                      <el-button type="success" icon="el-icon-plus" @click="onNew">新建</el-button>
                      <el-button type="success" icon="el-icon-upload" @click="onUpload">上传</el-button>
                  </el-header>
                  <el-main>
                    
                      <el-card :body-style="{ padding: '10px' }" 
                          style="text-align: center;padding:0px;cursor:pointer;" :key="index" v-for="(item,index) in dt.rows"
                          @dblclick.native="onEdit(item)"
                          shadow="hover">
                          <el-dropdown style="position: absolute;right: 5px;top: 5px;cursor:pointer;">
                            <span class="el-dropdown-link">
                              <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <!-- <el-dropdown-item @click.native="onDeploy(item)">下发</el-dropdown-item> -->
                              <el-dropdown-item @click.native="onEdit(item)">编辑</el-dropdown-item>
                              <el-dropdown-item @click.native="onDelete(item)" divided>删除</el-dropdown-item>
                              <el-dropdown-item @click.native="onDownload(item)" divided>下载</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                          <svg-icon icon-class="policy" style="font-size:6em;"/>
                          <div style="padding: 14px;">
                              <span>{{item.name | formatName}}</span>
                              <p style="text-align:left;"><TagView domain='policy' :model.sync="item.tags" :id="item.id" :limit="1"></TagView></p>
                              <div class="bottom clearfix">
                                <time class="time">创建时间:{{  item.ctime | formatTime}}</time>
                              </div>
                          </div>
                      </el-card>
                    
                  </el-main>
                  <el-footer>
                      总计：{{dt.rows.length}}
                  </el-footer>
                  <!-- 策略编辑 -->
                  <el-dialog :title="'策略编辑 ' + dt.selected.name" 
                      width="85%"
                      :visible.sync="edit.show" 
                      :show-close="false"
                      :close-on-press-escape="true"
                      :close-on-click-modal="false"
                      :destroy-on-close="true"
                      @closed="(()=>{ this.dt.selected = null; })"
                      append-to-body
                      v-if="dt.selected">
                    <EditView :model="dt.selected" ref="editView" @dialog:close="onClose"></EditView>
                  </el-dialog>
                  <!-- 策略下发 -->
                  <el-dialog :title="'策略下发 ' + dialog.deploy.data.name" 
                      :visible.sync="dialog.deploy.show" 
                      :show-close="false"
                      :close-on-press-escape="true"
                      :close-on-click-modal="false"
                      :destroy-on-close="true"
                      v-if="dialog.deploy.show">
                    
                  </el-dialog>
                  <!-- 上传 -->
                  <el-dialog title="上传" 
                      :visible.sync="dialog.upload.show" 
                      :destroy-on-close="true"
                      :append-to-body="true"
                      :close-on-click-modal="false"
                      :close-on-press-escape="false"
                      width="40%!imortant"
                      center
                      v-if="dialog.upload.show">
                      <el-container>
                          <el-main style="text-align: center;">
                              <el-upload drag
                                  multiple
                                  :action="dialog.upload.url"
                                  :data="dialog.upload.ifIndex"
                                  :on-success="onUploadSuccess"
                                  :on-error="onUploadError"
                                  :on-remove="onUploadRemove"
                                  :list-type="text"
                                  :show-file-list="true"
                                  name="uploadfile">
                                  <i class="el-icon-upload"></i>
                              </el-upload>
                          </el-main>
                          <el-footer>
                              <i class="el-icon-s-data"></i> 上传文件：{{dialog.upload.fileList.length}}
                          </el-footer>
                      </el-container>
                  </el-dialog>
                </el-container>
            </SplitArea>
        </Split>
    </el-main>
  </el-container>
  
</template>

<script>

import _ from 'lodash';
import EditView from './EditView';
import TagView from '../tags/TagView';
import TagTreeView from '../tags/TagTreeView';

export default {
  name: "PolicyView",
  props: {
    global:Object,
    model: Object
  },
  components:{
    EditView,
    TagView,
    TagTreeView
  },
  data() {
    return {
      dt: {
        loading:false,
        rows:[],
        selected: null
      },
      views: {
        default: ""
      },
      edit:{
        show: false
      },
      dialog: {
        deploy: {
          show: false,
          data: null
        },
        upload: {
            show: false,
            url: '/fs/etc/extend?issys=true',
            ifIndex: {index:true},
            data: {
                parent: '/etc/extend'
            },
            fileList: []
        }
      }
    };
  },
  filters:{
    formatTime(value){
      return new Date(value).toLocaleString();
    },
    formatName(value){
      return value.split(".")[0];
    }
  },
  created(){
     this.initData();
  },
  methods: {
    onUploadFileChange(file){
      this.upload.param.uploadfile = file.raw;
    },
    initData(){
        this.dt.loading = true;
        let param = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/m3event/policy/action.js", param).then(rtn=>{
            this.dt.rows = _.orderBy(rtn.message,['name'],['asc']);
            this.edit.show = false;
            this.dt.loading = false;
        }).catch(err=>{
          console.error(err);
          this.dt.loading = false;
        })
    },
    onRefresh(){
      this.initData();
    },
    onRefreshByTag(tag){
        if(_.isEmpty(tag)){
          this.initData();
        } else {
          this.dt.loading = true;
          let param = encodeURIComponent(JSON.stringify({  action: "search", param: tag  }));
          this.m3.callFS("/matrix/m3event/policy/action.js", param).then((rtn)=>{
              this.dt.rows = _.orderBy(rtn.message,['name'],['asc']);
              this.edit.show = false;
              this.dt.loading = false;
          }).catch(err=>{
            console.error(err);
            this.dt.loading = false;
          })
        }
    },
    onNew(){

      this.$prompt('请输入策略名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        
        if(_.isEmpty(value)){
            this.$message({
                type: 'warning',
                message: '请输入策略名称！'
            });
            return false;
        }

        let param = encodeURIComponent(JSON.stringify({  action: "add", data:"", name: value }));
        this.m3.callFS("/matrix/m3event/policy/action.js", param).then( rtn=>{
            this.dt.rows = rtn.message;
            this.onRefresh();
        })

        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新建策略操作'
        });       
      });

      
    },
    onEdit(item){
      this.dt.selected = item;
      this.edit.show = true;
    },
    onDownload(item){
      let url = `/static${item.fullname}`;
      let target = '_blank';
      window.open(url, target);
    },
    onDelete(item){
      this.$confirm(`确定要删除该策略 ${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       
        this.m3.dfs.deleteFile(item).then(()=>{
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.onRefresh();
        }).catch((err)=>{
          this.$message({
            type: "error",
            message: "删除失败 " + err
          })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    onClose(){
      this.edit.show = false;
      this.onRefresh();
    },
    onDeploy(item){
      this.dialog.deploy.show = true;
      this.dialog.deploy.data = item;
    },
    onUpload(){
        this.dialog.upload.show = true;
    },
    onUploadSuccess(res,file,FileList){
        this.dialog.upload.fileList = FileList;
        
        _.forEach(FileList,(v)=>{
            let attr = {remark: '', rate: '0'};
            this.m3.dfs.updateAttr({parent:v.parent, name:v.name, attr:attr});
        })

        // 刷新
        this.onRefresh();

        this.$message({
            type: "success",
            dangerouslyUseHTMLString: true,
            message: `上传成功！`
        })

        this.dialog.upload.show = false;

    },
    onUploadError(){
        this.$message({
            type: "error",
            dangerouslyUseHTMLString: true,
            message: `上传失败，请确认！`
        })
    },
    onUploadRemove(file, fileList) {
        
        this.m3.dfs.deleteFile({parent:this.dialog.upload.data.parent, name:file.name}).then(rtn=>{
            this.onRefresh(this.dialog.upload.data,null);
        });
        
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  .el-main{
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding:0px 10px;
  }
  .el-footer{
    height: 30px!important;
    line-height: 30px;
  }
  .el-card{
    position: relative;
    max-width: 25em;
    width: 25em;
    height: auto;
    border-radius: 10px !important;
    border: unset;
    box-shadow: rgb(0 0 0 / 5%) 0px 0px 5px 0px;
    background: rgb(239, 244, 246);
    margin: 10px;
  }

  .el-card+.el-card{
    margin: 10px;
  }

  .time {
    font-size: 12px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  
  .btn-upload{
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
  }
</style>
