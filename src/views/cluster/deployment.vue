<template>
  <div v-loading="loading">
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

  <el-card 
    style="margin-bottom: 25px;"
    :body-style="{ padding: '20px' }"
    v-for="(item,key) in displayedCards" 
    :key="key">
    <div class="card">
      <div class="card-header" style="display: flex">
        <span @click="toggleContent(key,item.metadata.namespace)" 
              :class="{ 'element-icons el-icon-jianshao': item.expand, 'element-icons el-icon-zengjia': !item.expand }"
              style="font-size: 20px;color: rgb(109, 101, 144);">
        </span>
        <div style="width: 300px;">
          <div style="display: flex;">
            <span class="element-icons el-icon-cluster" 
                style="font-size: 28px;color: rgb(115, 119, 114);margin-left: 20px;">
            </span>
            <span class="element-icons el-icon-aws" style="color: rgb(182, 136, 10);font-size: 28px;"></span>
            <p style="margin-left: 10px;margin-top: 5px" class="title-head">DEPLOYMENT</p>
          </div>
          <p style="margin-left: 20px" class="title-head">{{item.metadata.name}}</p>

          <!-- <p style="margin-left: 20px" class="title-head" v-if="selectCluster==='Select a Cluster'">cluster : prod </p> -->
          <p style="margin-left: 20px" class="title-head" >cluster : {{displayCluster}} </p>
          <p style="margin-left: 20px" class="title-format">create time: {{item.metadata.creationTimestamp}}</p>
          <p style="margin-left: 20px" class="title-format">generation: {{item.metadata.generation}}</p>
        </div>
        <div  style="margin-left: 50px;width: 300px;">
          <p class="title-data">namespace: {{item.metadata.namespace}}</p>
          <p class="title-data">replicas: {{item.status.replicas}}</p>
          <p class="title-data" v-if="item.spec.template.spec.containers[0].hasOwnProperty('ports')">port: {{item.spec.template.spec.containers[0].ports[0].containerPort}}</p>
          <p class="title-data" v-if="item.spec.template.spec.containers[0].hasOwnProperty('ports')">image: {{item.spec.template.spec.containers[0].image}}</p>
        </div>
        <div  style="margin-left: 10px">
          <p class="title-data">lastTransitionTime: {{item.status.conditions[1].lastTransitionTime}}</p>
          <p class="title-data">lastUpdateTime: {{item.status.conditions[1].lastUpdateTime}}</p>
          <p class="title-data" style="width: 380px;">message: {{item.status.conditions[1].message}}</p>
          <p class="title-data">updatedReplicas: {{item.status.updatedReplicas}}</p>
        </div>
        <div  style="margin-left: 50px">
          <p class="title-data">availableReplicas: {{item.status.availableReplicas}}</p>
          <span v-if="item.status.availableReplicas === item.status.replicas" class="element-icons el-icon-dui"
              style="font-size: 25px;color: rgb(33, 158, 14); margin-left: 50px;margin-top: 20px;">
          </span>
          <span v-else class="element-icons el-icon-warning"
              style="font-size: 25px;color: rgb(197, 49, 79); margin-left: 50px;margin-top: 20px;"/>
        </div>
        <div  style="margin-left: 80px">
         <el-dropdown  @command="changeDeployment"  trigger="click" style="margin-top: 7px">
            <span style="font-weight: bold;font-size: 16px">
              . . .
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="option in deploymentOptions"
                    :key="option.value"
                    :command="beforeHandleCommand(option.value, item)"
                >{{option.value}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div  v-if="item.expand" v-loading="item.loading">
        <el-divider/>
        <p style="margin-left: 20px" class="title-head">{{item.metadata.name}} infrastructure </p>
        <el-tabs v-model="item.activeName" :key="key">
          <el-tab-pane label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pods list&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
            name="first">
            <el-table :data="item.tablePods" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column label="Name" width="400" >
                  <template #default="scope" >
                    <span>{{ scope.row.metadata.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Create Timestamp" width="220" >
                  <template #default="scope" >
                    <span >{{ scope.row.metadata.creationTimestamp }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Pod IP" width="180" >
                  <template #default="scope" >
                    <span>{{ scope.row.status.podIP }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Node IP" width="180" >
                  <template #default="scope" >
                    <span>{{ scope.row.status.hostIP }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Status" width="180" >
                  <template #default="scope" >
                    <span>{{ scope.row.status.phase }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Functions" width="180" >
                  <template #default="scope" >
                    <!-- target="_blank" -->
                    <el-link :href="goToThePage(item.metadata.namespace,scope.row.metadata.name)" type="primary"  style="color: #409EFF;">log</el-link>
                    <span>&nbsp;&nbsp;</span>
                    <!-- target="_blank" -->
                    <el-link :href="goToTheSshPage(item.metadata.namespace,scope.row.metadata.name, scope.row.spec.containers[0].name)" type="primary"  style="color: #409EFF;">ssh</el-link>
                    <span>&nbsp;&nbsp;</span>
                    <el-button :icon="Delete" disabled type="primary" @click="deleteDeterminePod(scope.row.metadata.name)">Delete</el-button>
                  </template>
                </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Services&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
                        name="second"></el-tab-pane>
        </el-tabs>
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
    :total="tableDeployments.length">
    <span>
      {{query.pageIndex}}/{{Math.ceil(tableDeployments.length / pagesize)}}
    </span>
  </el-pagination>
  <el-dialog 
    v-model="yamlDialogVisible" 
    :show-close="false" 
    title="Deployment Yaml Editor"
    custom-class="my-dialog-header"
    >
  <YamlEditor :content="sendingItemValues" @getContent="getContent" v-if="yamlDialogVisible"/>
    <div style="margin-top: 10px;">
      <el-button type="danger" @click="yamlDialogVisible = false">
        <el-icon class="el-icon--left"><CloseBold/></el-icon>
        close
      </el-button>
    </div>
</el-dialog>
</div>
</template>
  
<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'
import { CircleCloseFilled,CloseBold } from '@element-plus/icons-vue'
import {ref, reactive,computed } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox,ElLink } from 'element-plus';
import * as api  from '../../api/cluster';
import YamlEditor from '../../components/YamlEditor.vue';
const selectNamespace = ref<string>("Select a Namespace");
const selectCluster = ref<string>("Select a Cluster");
const displayCluster = ref<string>("");
const clusterOptions =[{"value": "prod"},{value: "microstrategy"}];
const namespaceOptions = ref<{value: ""}[]>([])
const deploymentOptions = [{value: "edit yaml"},{value: "resize the scale   "}]
const tableDeployments = ref<DeploymentItems[]>([]);
const tempDeployments = ref<DeploymentItems[]>([]);
const tablePods = ref<PodsItems[]>([])
const yamlDialogVisible = ref(false)
const sendingItemValues = ref()
const loading = ref(true)
const yamlData = "- hosts: all\n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: \"install {{ package_name }}\"\n    package:\n      name: \"{{ package_name }}\"\n      state: \"{{ state | default('present') }}\"";
const query = reactive({
    pageIndex: 1,
    pageSize: 5
  });
const pagesize = 5;
interface PodsItems {

}
interface DeploymentItems {
  expand: boolean,
  loading: boolean,
  tablePods: [],
  activeName: 'first',
  metadata: {
    creationTimestamp: string,
    generation: string,
    name: string,
    namespace: string
  },
  status: {
    availableReplicas: string,
    replicas: string,
    updatedReplicas: string,
    conditions: {
      message: string,
      lastUpdateTime: string,
      lastTransitionTime: string
    }[]
  },
  spec: {
    template: {
      spec: {
        containers: {
          image: string,
          ports: {containerPort: string}[]
        }[]
      }
    }
  }

}
const displayedCards=computed(() => {
      const startIndex = (query.pageIndex - 1) * query.pageSize;
      const endIndex = startIndex + query.pageSize;
      tempDeployments.value = tableDeployments.value.slice(startIndex, endIndex)
      // return tableDeployments.value.slice(startIndex, endIndex);
      return tempDeployments.value
})

const getContent = (v: any) => {
  console.log("=================>>>>>>>> getContent", v)
}

const toggleContent = (showcount: number, namespaces: string)=> {
  console.log("=================>>>>> showcount",showcount);
  console.log("=================>>>>> tableDeployments",tempDeployments.value[showcount]);
  tempDeployments.value[showcount].expand = !tempDeployments.value[showcount].expand;
  if (tempDeployments.value[showcount].expand === true){
    tempDeployments.value[showcount].loading = true
  }
  let temCluster;
  if (selectCluster.value === "Select a Cluster"){
    temCluster = "prod"
  }
  else{
    temCluster = selectCluster.value
  }
  getPodsList(namespaces, temCluster,tempDeployments.value[showcount].metadata.name, showcount)
};

const handleSizeChange=(val:any)=>{
  console.log(val)
};

const handleCurrentChange=(val:any)=>{
  console.log(val)
};

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
  ElMessage(`choose window: ${cluster}`);
  selectCluster.value = cluster;
  loading.value = true
  getNamespaces(selectCluster.value);
  selectNamespace.value="Select a Namespace"
  getDeployments( "" , selectCluster.value )
  displayCluster.value = selectCluster.value
};

const changeCommand = (namespace: string) => {
  ElMessage(`choose window: ${namespace}`)
  selectNamespace.value = namespace
  loading.value = true
  if(selectCluster.value==="Select a Cluster"){
    getDeployments( namespace, "prod")
  }
  else{
    getDeployments( namespace, selectCluster.value)
  }
};

const beforeHandleCommand =(editor: string,yamlValue : any)=>{
  return {
    editor,
    yamlValue
  }
}

const changeDeployment = (i: any) => {
  // ElMessage(`choose edit: ${editor}`)
  if (i.editor === "edit yaml"){
    yamlDialogVisible.value = true
    sendingItemValues.value = i.yamlValue
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
          value: o
        }
      }) : []
  })
};


const initialFunc =()=>{
  // selectCluster.value = "prod"
  displayCluster.value = "prod"
  getNamespaces("prod");
  getDeployments("", "prod")

}


const getDeployments = (namespace : string, env : string)=>{
  api.getDeployments({
    env: env,
    namespace: namespace
  }).then(e=>{
    console.log(e)
    const deployments = e.data || [] 
    tableDeployments.value = deployments? deployments.map((o:any, index:any) =>{
      return {
        ...o,
        expand: false,
        tablePods: [],
        activeName: "first",
        loading: false
      }
    }) :[]
    loading.value = false
  })
}

initialFunc();

const getPodsList = (namespace: string, env: string, deploymentName: string, row:number)=>{
  api.getPods({
    env: env,
    namespace: namespace,
    deploymentName: deploymentName
  }).then(e=>{
    // console.log(e)
    const pods = e.data || []
    // tablePods.value = pods ? pods.map((o:any, index:any) =>{
      tempDeployments.value[row].tablePods = pods ? pods.map((o:any, index:any) =>{
      return {
        ...o
      }
    }):[]
    console.log("=================>>>>>>>tablePods",tablePods)
    tempDeployments.value[row].loading = false;
  })
}
  
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
:deep(.el-dialog__header){
  padding: var(--el-dialog-padding-primary);
  padding-bottom: 1px !important;
  margin-right: 16px;
  word-break: break-all;
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
  width: 100%;
}
</style>
  