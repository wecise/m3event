<template>

  <el-container>
    <el-header>
      <el-tooltip content="刷新">
        <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
      </el-tooltip>
      <el-tooltip content="上传新媒介">
        <el-button type="text" @click="onUpload">
          <i class="el-icon-upload" style="color:#3ae23a;font-size:16px;"></i>
        </el-button>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-table
        :data="dt.rows"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <template v-for="(item,index) in dt.columns">
          <el-table-column 
            :key="index"
            :label="item.title" 
            :prop="item.field" 
            v-if="item.visible">
          </el-table-column>
        </template>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play"  @click="onPlay(scope.$index, scope.row)" v-if="!scope.row.isPlay"> 播放</el-button>
            <el-button type="text" icon="el-icon-video-pause"  @click="onStop(scope.$index, scope.row)" v-else> 停止</el-button>
            <el-button type="text" icon="el-icon-delete"  @click="onDelete(scope.$index, scope.row)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog title="上传声音媒介" :visible.sync="dialog.show" 
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <el-container style="height:100%;">
            <el-main style="padding:10px;">
                <div v-if="dialog.rtnInfo">
                    <el-button type="text" icon="el-icon-close" @click="clearUploadInfo"></el-button>
                    <section>
                        <code>{{dialog.rtnInfo.message.join(",")}}</code>
                    </section>
                </div>
                <el-upload name="uploadfile" 
                    class="upload-demo" 
                    drag :auto-upload="true"
                    :on-change="onUploadChange"
                    :on-success="onUploadSuccess"
                    :file-list="dialog.fileList"
                    accept=".mp3,.wav"
                    action="/fs/assets/audio?issys=true"
                    ref="upload"
                    v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传声音文件</div>
                </el-upload>
            </el-main>
            <el-footer style="line-height:60px;text-align:center;">
                <el-button type="default" @click="onUploadCancel">取消</el-button>
            </el-footer>
        </el-container>
    </el-dialog>

  </el-container>
</template>

<script>
import _ from 'lodash';
import {Howl} from 'howler';
export default {
  name: "MediaView",
  props: {
    model: Object
  },
  data() {
    return {
      dt: {
        rows:[],
        columns: [],
        selected: []
      },
      sound: null,
      dialog: {
        show: false,
        fileList: [],
        rtnInfo: null
      }
    };
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
      this.m3.callFS("/matrix/notify/getVoiceList.js",null).then((rt)=>{
        let rtn = rt.message;
        this.$set(this.dt,'rows', rtn.rows);
        this.$set(this.dt,'columns', _.map(rtn.columns, (v)=>{
                              
          if(_.isUndefined(v.visible)){
            _.extend(v, { visible: true });
          }

          if(!v.render){
            return v;
          } else {
            return _.extend(v, { render: eval(v.render) });
          }
          
        }));

      }) 
    },
    onRefresh(){
      this.initData();
    },
    onUpload(){
        this.dialog.show = true;
    },
    onPlay(index){
      
      if(this.sound){
        this.sound.stop();
      }

      let src = `/fs${this.dt.rows[index].fullname}?type=open&issys=true`;
      this.sound = new Howl({
        src: [src],
        volume: 1
      });
      this.sound.play();
      this.$set(this.dt.rows[index],'isPlay',true);
    },
    onStop(index){
      this.sound.stop();
      this.$set(this.dt.rows[index],'isPlay',false);
    },
    onDelete(index,item){

      this.$confirm(`确认要删除该声音文件：${item.name}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
                        
        let param = {parent:item.parent, name: item.name};
        this.m3.dfsDelete(param).then(()=>{
            this.$message({
                type: 'success',
                message: '删除声音文件成功!'
            });
            this.initData();
        }).catch((err)=>{
          this.$message({
              type: 'error',
              message: '删除声音文件失败 ' + err.message
          });
        })
        
        
      });
    },
    onUploadChange(file) {
      this.dialog.fileList = [file.raw];
    },
    onUploadCancel(){
      this.dialog.show = false;
    },
    onUploadSuccess(){
      this.initData();
    },
    clearUploadInfo(){
        this.dialog.rtnInfo = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px)!important;
  }
  .el-header{
    height:40px!important;
    line-height:40px;
  }
  .el-main{
    padding:0px;
    overflow: hidden;
  }
</style>
