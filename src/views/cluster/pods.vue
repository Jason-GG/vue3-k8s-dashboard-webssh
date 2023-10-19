<template>
  <div>
    <div style="display: flex">
      <el-select style="  width: 200px;"
        v-model="selectCluster" 
        @change="handleCommand"
        filterable>
        <el-option
          v-for="item in clusterOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        />
      </el-select>
      <div style="margin-left: 30px">
        <el-select 
         style="  width: 300px;"
          v-model="selectNamespace" 
          @change="changeCommand"
          filterable>
          <el-option
            v-for="item in namespaceOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  
    <el-divider/>
    <div v-loading="loading">
      <el-card 
        style="margin-bottom: 25px;"
        :body-style="{ padding: '20px' }"
        v-for="(item,key) in displayedCards" 
        :key="key">
        <div class="card">
          <div class="card-header" style="display: flex;">
            <span @click="toggleContent(key)" 
                :class="{ 'element-icons el-icon-jianshao': item.expand, 'element-icons el-icon-zengjia': !item.expand }"
                style="font-size: 20px;color: rgb(109, 101, 144);">
            </span>
            <div style="width: 400px;">
              <div style="display: flex;">
                <span class="element-icons el-icon-cluster" 
                    style="font-size: 28px;color: rgb(115, 119, 114);margin-left: 20px;">
                </span>
                <span class="element-icons el-icon-aws" style="color: rgb(182, 136, 10);font-size: 28px;"></span>
                <p style="margin-left: 20px" class="title-head">POD</p>
              </div>
              <p style="margin-left: 20px" class="title-head">{{item.metadata.name}}</p>
              <!-- <p style="margin-left: 20px" class="title-head" v-if="selectCluster==='Select a Cluster'">cluster : prod </p> -->
              <p style="margin-left: 20px" class="title-head" >cluster : {{displayCluster}} </p>
              <p style="margin-left: 20px" class="title-data" v-if="item.metadata.hasOwnProperty('ownerReferences')">kind: {{item.metadata.ownerReferences[0].kind}}</p>
              <p style="margin-left: 20px" class="title-format">create time: {{item.metadata.creationTimestamp}}</p>
            </div>
            <div  style="margin-left: 20px;width: 250px;">
              <p class="title-data">namespace: {{item.metadata.namespace}}</p>
              <p class="title-data" v-if="item.metadata.hasOwnProperty('ownerReferences')">apiVersion: {{item.metadata.ownerReferences[0].apiVersion}}</p>
              <p class="title-data">restartPolicy: {{item.spec.restartPolicy}}</p>
              <!-- <p class="title-data">port: {{item.spec.template.spec.containers[0].ports[0].containerPort}}</p>
              <p class="title-data" style="width: 300px;">image: {{item.spec.template.spec.containers[0].image}}</p> -->
            </div>
            <div  style="margin-left: 50px;width: 250px;">
              <p class="title-data">nodeSelector: {{item.spec.nodeSelector}}</p>
              <p class="title-data">Node IP: {{item.status.hostIP}}</p>
              <p class="title-data">Pod IP: {{item.status.podIP}}</p>
            </div>
            <!-- editing part ? 'element-icons el-icon-dui':' -->
            <div  style="margin-left: 50px">
              <p class="title-data">Status: {{item.status.phase}}</p>
              <span v-if="['Running','Succeeded'].includes(item.status.phase)" class="element-icons el-icon-dui"
                  style="font-size: 25px;color: rgb(33, 158, 14); margin-left: 50px;margin-top: 20px;">
              </span>
              <span v-else class="element-icons el-icon-warning"
                  style="font-size: 25px;color: rgb(229, 34, 73); margin-left: 50px;margin-top: 20px;"/>
            </div>
            <div  style="margin-left: 80px; margin-top: 5px;">
              <el-link :href="goToThePage(item.metadata.namespace,item.metadata.name)" type="primary"  style="color: #409EFF;">log</el-link>
              <span>&nbsp;&nbsp;</span>
              <el-link :href="goToTheSshPage(item.metadata.namespace,item.metadata.name, item.spec.containers[0].name)" type="primary" style="color: #409EFF;">ssh</el-link>
              <span>&nbsp;&nbsp;</span>
            </div>
          </div>
          <div  v-if="item.expand" >
          <el-divider/>
          <p style="margin-left: 20px" class="title-head"> container list </p>
          <el-table :data="item.spec.containers" style="width: 100%" :row-class-name="tableRowClassName">
              <el-table-column label="Name" width="200" >
                <template #default="scope" >
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="imagePullPolicy" width="130" >
                <template #default="scope" >
                  <span>{{ scope.row.imagePullPolicy }}</span>
                </template>
              </el-table-column>
              <el-table-column label="resources.requests" width="270" >
                <template #default="scope" >
                  <span>{{ scope.row.resources.requests }}</span>
                </template>
              </el-table-column>
              <el-table-column label="resources.limits" width="270" >
                <template #default="scope" >
                  <span>{{ scope.row.resources.limits }}</span>
                </template>
              </el-table-column>
              <el-table-column label="image" >
                <template #default="scope" >
                  <span >{{ scope.row.image }}</span>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div v-else/>
        </div>
      </el-card>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="query.pageIndex"
        :page-size="query.pageSize"
        layout="prev, slot, next, total, jumper"
        :total="tablePods.length">
        <span>
          {{query.pageIndex}}/{{Math.ceil(tablePods.length / pagesize)}}
        </span>
      </el-pagination>
    </div>
  </div>
  </template>
    
<script setup lang="ts" name="basetable">
const loading = ref(true)
import { ElButton, ElDialog } from 'element-plus'
import { CircleCloseFilled,CloseBold } from '@element-plus/icons-vue'
import {ref, reactive, computed } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox,ElLink } from 'element-plus';
import * as api  from '../../api/cluster';
// import YamlEditor from '../../components/YamlEditor.vue';
const selectNamespace = ref<string>("Select a Namespace");
const selectCluster = ref<string>("Select a Cluster");
const displayCluster = ref<string>("");
const clusterOptions =[{"value": "prod"},{value: "microstrategy"}];
const namespaceOptions = ref<{value: ""}[]>([])
const deploymentOptions = [{value: "edit yaml"},{value: "resize the scale"}]
const tablePods = ref<PodsItems[]>([])
const displayPods = ref<PodsItems[]>([])
const yamlDialogVisible = ref(false)
interface PodsItems {
  expand: boolean,
  metadata: {
    name: string,
    namespace: string,
    creationTimestamp: string,
    ownerReferences: {
      kind: string,
      apiVersion: string
    }[]
  },
  spec: {
    restartPolicy: string,
    nodeSelector: string,
    containers: {
      name: string
    }[]
  },
  status: {
    phase: string,
    hostIP: string,
    podIP: string
  }
}
const query = reactive({
	pageIndex: 1,
	pageSize: 5
});
const pagesize = 5;
  
  
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: PodsItems
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const handleCommand = (cluster: string) => {
  ElMessage(`choose window: ${cluster}`)
  selectCluster.value = cluster
  selectNamespace.value = "Select a Namespace"
  loading.value = true
  displayCluster.value = cluster
  getNamespaces(selectCluster.value);
  getPods( "", selectCluster.value)
};

const changeCommand = (namespace: string) => {
  ElMessage(`choose window: ${namespace}`)
  selectNamespace.value = namespace
  loading.value = true
  if (selectCluster.value === "Select a Cluster"){
    getPods( namespace, "prod")
  }
  else{
    getPods( namespace, selectCluster.value)
  }
};

const changeDeployment = (editor: string) => {
  // ElMessage(`choose edit: ${editor}`)
  if (editor === "edit yaml"){
    yamlDialogVisible.value = true
    console.log("=================+>>>>>>>>>>>>yamlDialogVisible:", yamlDialogVisible)
  }
};

const deleteDeterminePod = (podname: string)=>{
  api.deletePod({
    env: selectCluster.value,
    namespace: selectNamespace.value,
    podName: podname
  }).then(e=>{
    console.log(e)
    initialFunc();
  })
}
const toggleContent = (showcount: number)=> {
  displayPods.value[showcount].expand = !displayPods.value[showcount].expand;
};

const goToThePage=(namespace: string,podname: string)=>{
  // const externalURL = '/#/podlog?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value;
  let temCluster;
  if (selectCluster.value === "Select a Cluster"){
    temCluster = "prod"
  }
  else{
    temCluster = selectCluster.value
  }
  const externalURL = 'https://cmdbservice.cloud.microstrategy.com/#/podlog?podname='+podname+'&namespace='+namespace+'&cluster='+temCluster;
  return externalURL;
}

const goToTheSshPage=(namespace: string,podname: string, containerName: string)=>{
  // const externalURL = '/#/podlog?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value;
  let temCluster;
  if (selectCluster.value === "Select a Cluster"){
    temCluster = "prod"
  }
  else{
    temCluster = selectCluster.value
  }
  const externalURL = 'https://cmdbservice.cloud.microstrategy.com/#/webssh?podname='+podname+'&namespace='+namespace+'&cluster='+temCluster+'&containerName='+containerName;
  return externalURL;
}

const getNamespaces=(namespace: string)=>{
  api.getNamespaces({
    cluster: namespace //"prod"
  }).then(e=>{
    // console.log(e);
    const namespaceList = e.data || [] 
    namespaceOptions.value = namespaceList? namespaceList.map((o:any,index:any) => {
        return {
          value: o,
          expand: false
        }
      }) : []
  })
};


const initialFunc =()=>{
  // selectCluster.value = "prod"
  displayCluster.value = "prod"
  getNamespaces("prod");
  getPods( "", "prod")

}


const getPods = (namespace : string, env : string)=>{
  api.listPobs({
    env: env,
    namespace: namespace
  }).then(e=>{
    console.log(e)
    const Pods = e.data || [] 
    tablePods.value = Pods? Pods.map((o:any, index:any) =>{
      return {
        ...o
      }
    }) :[]
    loading.value = false
  })
}

const displayedCards=computed(() => {
      const startIndex = (query.pageIndex - 1) * query.pageSize;
      const endIndex = startIndex + query.pageSize;
      displayPods.value = tablePods.value.slice(startIndex, endIndex)
      return displayPods.value;
})

initialFunc();

const handleSizeChange=(val:any)=>{
  console.log(val)
};

const handleCurrentChange=(val:any)=>{
  console.log(val)
};

    
</script>
  
<style scoped>
  :deep(.el-input__wrapper) {
  border: none !important;
  border-bottom: 1px solid rgb(102, 79, 79) !important;
  border-radius: 0px !important;
  box-shadow: none !important;
  background-color: transparent !important;
  margin-top: 1px;
  font-weight: bold ;
  font-size: 16px ;
  font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
  color: #3c414c;
}
:deep(.el-select) {
  border: none !important;
  box-shadow: none !important;
}
  .title-head {
    font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
    font-weight: Bold;
    font-size: 16px;
    color: #606266
  }
  .custom-select {
    border: none;
    border-radius: 0;
    background-color: #eef1f6;
    padding: 5px;
    outline: none;
  }
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  
  .title-data{
    font-size: 14px;
    font-family: -apple-system, system-ui, HelveticaNeue, Helvetica;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.4px;
    color: #606266;
    margin-top: 10px;
  }
  .title-format {
    font-size: 12px;
    font-family: -apple-system, system-ui, HelveticaNeue, Helvetica;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.4px;
    color: rgba(0, 0, 0, 0.6);
  }
  .dialog-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }
  </style>
    