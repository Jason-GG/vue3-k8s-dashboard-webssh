<template>
  <div v-loading="loading">
    <div style="display: flex">
        <!-- <el-dropdown @command="handleCommand" style="margin-top: 7px">
          <span style="font-weight: bold;font-size: 16px">
            Select the kubernetes cluster
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="item in clusterOptions"
                  :key="item.value"
                  :command="item.value">
                  {{item.value}}
                </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
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
    </div>
  
    <el-divider/>
  
    <el-card 
      style="margin-bottom: 25px;"
      :body-style="{ padding: '20px' }"
      v-for="(item,key) in displayedCards" 
      :key="key">
      <div class="card">
        <div class="card-header" style="display: flex">
          <!-- <span @click="toggleContent(key)" 
                :class="{ 'element-icons el-icon-jianshao': item.expand, 'element-icons el-icon-zengjia': !item.expand }"
                style="font-size: 20px;color: rgb(109, 101, 144);">
          </span> -->
          <div style="width: 400px;">
          <div style="display: flex;">
            <span class="element-icons el-icon-cluster" 
                style="font-size: 28px;color: rgb(115, 119, 114);margin-left: 20px;">
            </span>
            <span class="element-icons el-icon-aws" style="color: rgb(182, 136, 10);font-size: 28px;"></span>
            <p style="margin-left: 10px;margin-top: 5px" class="title-head">NAMESPACE</p>
          </div>
          <p style="margin-left: 20px" class="title-head">namespace: {{item.metadata.name}}</p>
          <p style="margin-left: 20px" class="title-head">cluster: {{displayCluster}}</p>
          <p style="margin-left: 20px" class="title-format">create time: {{item.metadata.creationTimestamp}}</p>
          <p style="margin-left: 20px" class="title-format">resourceVersion: {{item.metadata.resourceVersion}}</p>
        </div>
        <div  style="margin-left: 80px; width: 550px;">
          <p class="title-data"  >labels:  {{item.metadata.labels}} </p>
          <p class="title-data" style="width: 380px;">manager: {{item.metadata.managedFields[0].manager}}</p>
          <p class="title-data">fieldsType: {{item.metadata.managedFields[0].fieldsType}}</p>
          <p class="title-data">apiVersion: {{item.metadata.managedFields[0].apiVersion}}</p>
        </div>
        <div  style="margin-left: 80px">
          <p class="title-data">status: {{item.status.phase}}</p>
          <span v-if="item.status.phase === 'Active'" class="element-icons el-icon-dui"
              style="font-size: 25px;color: rgb(33, 158, 14); margin-left: 50px;margin-top: 20px;">
          </span>
          <span v-else class="element-icons el-icon-warning"
              style="font-size: 25px;color: rgb(197, 49, 79); margin-left: 50px;margin-top: 20px;"/>
        </div>
        <div  style="margin-left: 80px">
         <el-dropdown @command="changeDeployment"  trigger="click" style="margin-top: 7px">
            <span style="font-weight: bold;font-size: 16px">
              . . .
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="item in namespaceOptions"
                    :key="item.value"
                    :command="item.value"
                >{{item.value}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
    </div>
    </div>
    </el-card>
    <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    v-model:currentPage="query.pageIndex"
    :page-size="query.pageSize"
    layout="prev, slot, next, total, jumper"
    :total="tableNamespaces.length">
    <span>
      {{query.pageIndex}}/{{Math.ceil(tableNamespaces.length / pagesize)}}
    </span>
  </el-pagination>
  </div>
  </template>
    
<script setup lang="ts" name="basetable">
import { ElButton, ElDialog } from 'element-plus'
import { CircleCloseFilled,CloseBold } from '@element-plus/icons-vue'
import {ref, reactive,computed } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox,ElLink } from 'element-plus';
import * as api  from '../../api/cluster';
import { fa } from 'element-plus/es/locale';
// import YamlEditor from '../../components/YamlEditor.vue';
const selectNamespace = ref<string>("production-env");
const selectCluster = ref<string>("Select a Cluster");
const displayCluster = ref<string>("");
const clusterOptions =[{"value": "prod"},{value: "microstrategy"}];
const namespaceOptions = [{value: "Deployment"},{value: "Pod"},{value: "Job"},{value: "Service"}]
const tableNamespaces = ref<NamespacesItems[]>([]);
const tempNamespaces= ref<NamespacesItems[]>([]);
const tablePods = ref<PodsItems[]>([]);
const loading = ref(true)
const yamlDialogVisible = ref(false)
const query = reactive({
  pageIndex: 1,
  pageSize: 5
});
const pagesize = 5;
interface PodsItems {

}
interface NamespacesItems {
  metadata: {
    name: string,
    creationTimestamp: string,
    resourceVersion: string,
    labels: string,
    managedFields: [
      {
        manager: string,
        fieldsType: string,
        apiVersion: string
    }
  ]
  },
  status: {
    phase: string
  }

}

const displayedCards=computed(() => {
      const startIndex = (query.pageIndex - 1) * query.pageSize;
      const endIndex = startIndex + query.pageSize;
      tempNamespaces.value = tableNamespaces.value.slice(startIndex, endIndex)
      // return tableDeployments.value.slice(startIndex, endIndex);
      return tempNamespaces.value
})
const toggleContent = (showcount: number)=> {
  console.log("=================>>>>> showcount",showcount);
  // console.log("=================>>>>> tableDeployments",tableDeployments.value[showcount]);
  // tableDeployments.value[showcount].expand = !tableDeployments.value[showcount].expand;
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
  ElMessage(`choose window: ${cluster}`)
  selectCluster.value = cluster
  loading.value = true
  getNamespaces(selectCluster.value);
  displayCluster.value = cluster
};

const changeDeployment=()=>{

}

const goToThePage=(podname: string)=>{
  // const externalURL = '/#/podlog?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value;
  const externalURL = 'https://cmdbservice.cloud.microstrategy.com/#/podlog?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value;
  return externalURL;
}

const goToTheSshPage=(podname: string, containerName: string)=>{
  // const externalURL = '/#/podlog?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value;
  const externalURL = 'https://cmdbservice.cloud.microstrategy.com/#/webssh?podname='+podname+'&namespace='+selectNamespace.value+'&cluster='+selectCluster.value+'&containerName='+containerName;
  return externalURL;
}


const getNamespaces=(namespace: string)=>{
  api.getNamespacesDetail({
    cluster: namespace //"prod"
  }).then(e=>{
  console.log(e)
  const namespaceList = e.data || [] 
  tableNamespaces.value = namespaceList? namespaceList.map((o:any, index:any) =>{
  return {
      ...o
  }
  }) :[]
  loading.value = false
  })
};


const initialFunc =()=>{
  // selectNamespace.value = "production-env"
  // selectCluster.value = "prod"
  loading.value = true
  displayCluster.value = "prod"
  getNamespaces("prod");

}
const handleSizeChange=(val:any)=>{
  console.log(val)
};

const handleCurrentChange=(val:any)=>{
  console.log(val)
};

//   const getDeployments = (namespace : string, env : string)=>{
//     api.getDeployments({
//       env: env,
//       namespace: namespace
//     }).then(e=>{
//       console.log(e)
//       const deployments = e.data || [] 
//       tableNamespaces.value = deployments? deployments.map((o:any, index:any) =>{
//         return {
//           ...o,
//           expand: false,
//           tablePods: [],
//           activeName: "first"
//         }
//       }) :[]
//     })
//   }

initialFunc();
  
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
    