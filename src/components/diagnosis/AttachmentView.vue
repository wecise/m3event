<template>
    <el-container style="height: calc(100vh - 205px)">
      <el-header style="height: 40px!important;line-height: 40px;">
          <el-tooltip content="刷新" placement="top">
              <el-button type="text" @click="onRefresh" icon="el-icon-refresh" >
              </el-button>
          </el-tooltip>
          <el-tooltip content="时间轴视图" placement="top">
              <el-button type="text" @click="currentView='timeline-view'" icon="el-icon-picture" >
              </el-button>
          </el-tooltip>
          <el-tooltip content="列表视图" placement="top">
              <el-button type="text" @click="currentView='grid-view'" icon="el-icon-s-grid" >
              </el-button>
          </el-tooltip>
          <el-tooltip content="上传文档" placement="top">
              <el-button type="text" @click="onUpload" icon="el-icon-upload"  style="color:#29d70b;">
              </el-button>
          </el-tooltip>
      </el-header>
      <el-main @dblclick.native="reverse=!reverse">
        <el-timeline :reverse="reverse" class="attachment-timeline" v-if="currentView=='timeline-view'">
              <el-timeline-item
                v-for="row in dt.rows"
                :key="row.id"
                :icon="row.ftype | formatType"
                :color="row.ftype | formatColor"
                :timestamp="row.vtime | formatDateTime"
                @click.native="onAttachOpen(row)"
                style="cursor:pointer;">
              名称：{{row.name}}
              <p>
                  大小：{{row.size | formatSize}}
              </p>
              <p>
                  作者：{{row.author}}
              </p>
              </el-timeline-item>
          </el-timeline>
          <el-checkbox-group v-model="dt.selected" v-else>
              <el-button type="default" 
                      @click="onAttachOpen(item)"
                      style="max-width: 12em;width: 12em;height:110px;border-radius: 10px!important;margin: 5px;border: unset;box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.2);"
                      :key="item.id"
                      v-for="item in dt.rows">
                      <el-image style="width:34px;height:34px;margin:5px;" :src="item | pickIcon">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" style="font-size:32px;"></i>
                          </div>
                      </el-image>
                      <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:5px;text-align:center;">
                          {{item.name}}
                      </p>
                      <!-- <el-checkbox :label="item.id" :ref="'checkBox_'+item.id"></el-checkbox> -->
              </el-button>
          </el-checkbox-group>
      </el-main>
      <!-- 上传 -->
      <el-dialog title="上传" 
          :visible.sync="dialog.upload.show" 
          :append-to-body="true"
          :modal-append-to-body="false"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="50%!imortant"
          center
          v-if="dialog.upload.show">
          <el-container style="border:unset!important;background:#f2f2f2;">
              <el-header v-if="model">
                  实体: {{model.entity}} 事件: {{model.id}}
              </el-header>
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
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      <div class="el-upload__tip" slot="tip">单个不超过500MB</div>
                  </el-upload>
              </el-main>
              <el-footer>
                  <i class="el-icon-s-data"></i> 上传文件：{{dialog.upload.fileList.length}}
              </el-footer>
          </el-container>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialog.upload.show = false">取 消</el-button>
          </span>
      </el-dialog>
    </el-container>
</template>

<script>
import _ from 'lodash';

export default {
  name: "AttachmentView",
  props: {
    model: Object
  },
  data() {
    return {
      currentView:"timeline-view",
      baseUrl: "/script/matrix/m3event/attachment",
      dt: {
          rows: [],
          selected: []
      },
      reverse: true,
      dialog: {
          upload: {
              show: false,
              url: '/fs/script/matrix/m3event/attachment?issys=true',
              ifIndex: {index:true},
              data: null,
              fileList: []
          } 
      }
    };
  },
  filters: {
      pickIcon(item){
          return `${window.assetsURLBase}/images/files/png/${item.ftype}.png`;
      },
      formatType(val){
        return val==='dir'?'el-icon-folder-opened':'el-icon-document';
      },
      formatColor(val){
        return val==='dir'?'#ff9800':'#4caf50';
      },
      formatSize(val){
          return window.m3.utils.bytesSize(val);
      },
      pickStatus(val){
          return window.global.register.event.status[val][1];
      },
      formatDateTime(val){
          return new Date(val).toLocaleString();
      }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let param = {parent: [this.baseUrl,this.model.entity,this.model.id].join("/"), fullname: [this.baseUrl,this.model.entity,this.model.id].join("/")};
        this.m3.dfs.list(param).then((res)=>{
            this.dt.rows = res.message;
        })
    },
    onRefresh(){
      this.initData();
    },
    onAttachOpen(item){
      window.open(`/static${item.fullname}`,'_blank');
    },
    onUpload(){
        this.dialog.upload.url = [['','fs'+this.baseUrl,this.model.entity].join("/"),this.model.id].join("/")+'?issys=true';
        this.onAttchNewDir();
        this.dialog.upload.show = true;
    },
    onAttchNewDir(){
        try{
            let param = {
                            parent: [this.baseUrl,this.model.entity].join("/"), 
                            name: this.model.id,
                            data:{content:null,ftype:'dir',attr:""}
            };
            this.m3.dfs.newFile(param);
        }catch(err){
            console.error(err);
        }
    },
    onUploadSuccess(res,file,FileList){
        this.dialog.upload.fileList = FileList;
        
        _.forEach(FileList,(v)=>{
            let attr = {remark: '', rate: '0'};
            this.m3.dfs.updateAttr({parent:v.parent, name:v.name, attr: attr });
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
    onUploadRemove(file) {
        
        this.m3.dfs.deleteFile({parent:this.model.parent, name:file.name}).then(()=>{
            this.onRefresh();
        }).catch(err=>{
          console.error(err);
        });
        
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    overflow: hidden;
  }
  .el-button--mini, .el-button--small {
    font-size: 15px;
  }
</style>
<style>
  .attachment-timeline .el-timeline-item__node--normal {
      left: -10px!important;
      top: -10px!important;
      width: 32px!important;
      height: 32px!important;
  }
  #pane-attachmment .el-checkbox-group .el-checkbox__label{
    display: none;
  }
</style>
