<template>
  <div>
	<el-card shadow="never">
			<div slot="header">
			  <el-page-header  title="POD" :content="podNameConst" @back="$router.go(-1)"/>
			</div>
      <div style="display: flex;margin-top: 20px;" class="title-head">
        <div class="blue-title">basic information</div>
        <el-dropdown @command="changeCommand" style="margin-left: 80px;">
          <div style="font-size: 18px; display: flex;" >
            <div style="font-size: 18px; position: relative;   top: -1px;">{{ selectContainer }}</div>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="item in containersOption"
                  :key="item.value"
                  :command="item.value"
              >{{item.value}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div style="margin-left: 20px;">Auto Refresh the logs:</div>
        <el-switch v-model="auto" style="margin-left: 3px;" @change="autorefresh"/>
        <div style="margin-left: 20px;">Follow:</div>
        <el-switch v-model="followauto" style="margin-left: 3px;"/>
        <!-- <div style="margin-left: 20px;margin-top: 3px;">Container:</div> -->
      </div>

			<!-- <el-row class="box">
        <el-col :span="12" class="card-header">
            <el-form ref="form" label-width="120px">
            <el-form-item label="迭代名字：">{{ formData.sprintPlanName }}</el-form-item>
            <el-form-item label="应用名字：">{{ formData.appName }}</el-form-item>
            <el-form-item label="分支名：">{{ formData.gitBranch }}</el-form-item>
            <el-form-item label="变更类型：">{{ formData.typeLabel }}</el-form-item>
            <el-form-item v-if="formData.webFrontDeployInfo && formData.webFrontDeployInfo.commitId" label="commitId">
                {{ formData.webFrontDeployInfo.commitId }}
            </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12">
            <el-form ref="form" label-width="120px">
            <el-form-item label="JobNumber：">{{ formData.buildNumber }}</el-form-item>
            <el-form-item v-if="formData.imageTag" label="镜像tag：">{{ formData.imageTag }}</el-form-item>
            <el-form-item label="状态：">{{ formData.statusLabel }}</el-form-item>
            </el-form>
        </el-col>   style="overflow-y: scroll; height: 700px;"
			</el-row> -->
			<el-divider />
      <div class="log">
        <!-- <el-scrollbar ref="scrollbarRef" height="400px" always @scroll="scroll"></el-scrollbar> -->
        <!-- <el-scrollbar height="700px" always ref="scrollbarRef" >
          <div ref="innerRef">
            <pre class="log-code" v-html="code"></pre>
          </div>
        </el-scrollbar> -->

        <el-scrollbar  class="log-code" ref="scrollbarRef" height="700px" always >
          <div ref="innerRef">
            <pre  v-for="item in code" :key="item" v-html="item"  style="width: 100%; overflow: auto;white-space: pre-wrap;"></pre>
          </div>
        </el-scrollbar>
			</div>
	</el-card>
  </div>
</template>
<script  setup lang="ts" name="basetable">

interface containerItem {

}

import { ElScrollbar,ElMessage } from 'element-plus'
const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const selectContainer = ref<string>("cmdb-service");
const containersOption = [{"value": "cmdb-service"}]
import * as api  from '../../api/cluster';
import {ref, onMounted, onBeforeUnmount } from 'vue';
// const code = ref("");
const code = ref<string[]>([]);
const auto = ref(true)
const followauto = ref(true)
let intervalId : any;
let lastTimeLog ="";
import {useRoute } from 'vue-router';
const router = useRoute();
const podNameConst = ref("")
let g_podname :any ;
let g_namespace :any;
let g_cluster :any;


onMounted(() => {
  console.log("===================>>>>>>>router",router.query["podname"])
  console.log("===================>>>>>>>namespace",router.query["namespace"])
  console.log("===================>>>>>>>cluster",router.query["cluster"])
  g_cluster = router.query["cluster"]
  g_namespace = router.query["namespace"]
  g_podname = router.query["podname"]
  podNameConst.value =  String(router.query["podname"])
  initGetlogs();
  startLogFetching();
});

onBeforeUnmount(() => {
  stopLogFetching()
});


const getlogs=()=>{
  api.getPodLog({
    env: g_cluster,
    namespace: g_namespace,
    podName: g_podname,
    number: "200"
  }).then(e=>{
    let diff = findDifferences( code.value, e.data)
    code.value = code.value.concat(diff); //+= diff
    lastTimeLog = e.data
    if (followauto.value === true){
      // console.log("====================>>>>>> true", followauto.value)
      scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
    }
  })
};

const initGetlogs=()=>{
  api.getPodLog({
    env: g_cluster,
    namespace: g_namespace,
    podName: g_podname,
    number: "400"
  }).then(e=>{
      let diff = findDifferences( code.value, e.data)
      code.value = code.value.concat(diff); //+= diff
      lastTimeLog = e.data
  })
};

const autorefresh= ()=>{
  console.log(auto.value)
  if (auto.value === true){
    startLogFetching()
  }
  else{
    stopLogFetching()
  }
}

const changeCommand = (container: string) => {
  ElMessage(`choose container: ${container}`)
  selectContainer.value = container
  
};


// Function to find the differences between two strings
const findDifferences = (original : string[], newStr : string) => {
  let diff = [];
  const linesOriginal = original;
  const linesNewStr = newStr.split('\n');

  for (let i = 0; i < linesNewStr.length; i++) {
      let temStr = linesNewStr[i].replace(/\n/g, '');
      // console.log("=================+>>>>>>>>>temStr:", temStr)
      if (!linesOriginal.includes(linesNewStr[i])) {
        // diff += `Difference in line ${i + 1}:\n`;
        // diff += `${linesNewStr[i]}\n`;
        diff.push(`${linesNewStr[i]}`)
      }
      // // let temStr = linesNewStr[i].replace(/\n/g, '');
      // // console.log("=================+>>>>>>>>>temStr:", temStr)
      // if (!linesOriginal.includes(linesNewStr[i])&& linesNewStr[i] !== "") {
      //   console.log("=================+>>>>>>>>>temStr:", linesNewStr[i])
      //   // diff += `Difference in line ${i + 1}:\n`;
      //   // diff += `${linesNewStr[i]}\n`;
      //     diff.push(`${linesNewStr[i]}\n`)
      // }
  }
  return diff;
};

const startLogFetching = () => {
  // Start fetching logs every 5 seconds (adjust the interval as needed)
  intervalId = setInterval(getlogs, 3000);
};

const stopLogFetching = () => {
  // Stop the log fetching interval
  clearInterval(intervalId);
};

</script>
  
<style scoped>
  .log {
    margin-top: 1px;
  }
  .b2-code-small{
    font-size: 18px;
    font-display: rgb(90, 241, 208);
  }
  .code {
    background: black;
    min-height: 600px;
    border-radius: 5px;
    margin-bottom: 30px;
    color: #6F6;
    font-size: 14px;
    white-space: break-spaces;
    height: 700px;
    overflow:scroll;
    padding:10px;
    overflow:scroll;
    /* overflow-scrolling: auto; */
  }
  .log-code{
    background: #002b35;
    /* min-height: 600px; */
    /* border-radius: 5px; */
    /* margin-bottom: 30px; */
    color: #b1c6c8;
    font-size: 16px;
    /* line-height: 24px; */
    /* white-space: break-spaces; */
    /* overflow:scroll; */
    padding: 10px;
    /* overflow-y: scroll; */
    /* scroll-padding-top: 700px; */
  }

  .blue-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 12px;
    margin-top: 3px;
    color: #409eff;
    position: relative;   
    top: 5px;
  }
  .title-head {
    display: inline-flex;
    align-items: center;
    position: relative;
    line-height: 20px;
    height: 32px;
    vertical-align: middle;
}
</style>