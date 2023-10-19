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
          <div style="width: 400px;">
          <div style="display: flex;">
              <span class="element-icons el-icon-cluster" 
                style="font-size: 28px;color: rgb(115, 119, 114);margin-left: 20px;">
              </span>
            <span class="element-icons el-icon-aws" style="color: rgb(182, 136, 10);font-size: 28px;"></span>
            <p style="margin-left: 20px" class="title-head">JOB</p>
          </div>

          <p style="margin-left: 20px" class="title-head">{{item.metadata.name}}</p>
          <p style="margin-left: 20px" class="title-head">cluster: {{displayCluster}}</p>
          <p style="margin-left: 20px;" class="title-head">namespace: {{item.metadata.namespace}}</p>
          <p style="margin-left: 20px" class="title-data">manager: {{item.metadata.managedFields[0].manager}}</p>
          <p style="margin-left: 20px" class="title-format">resourceVersion: {{item.metadata.resourceVersion}}</p>
          <p style="margin-left: 20px" class="title-format">fieldsType: {{item.metadata.managedFields[0].fieldsType}}</p>
          <p style="margin-left: 20px" class="title-format">apiVersion: {{item.metadata.managedFields[0].apiVersion}}</p>
          <p style="margin-left: 20px" class="title-format">create time: {{item.metadata.creationTimestamp}}</p>
        </div>
        <div  style="margin-left: 10px; width: 600px;">
          <p class="title-data"  >container number:  {{item.spec.template.spec.containers.length}} </p>
          <p class="title-data"  >nodeSelector:  {{item.spec.template.spec.nodeSelector}} </p>
          <p class="title-data"  >image:  {{item.spec.template.spec.containers[0].image}} </p>
          <p class="title-data"  >resources:  {{item.spec.template.spec.containers[0].resources}} </p>
          <p class="title-data"  >command:  {{item.spec.template.spec.containers[0].command}} </p>

        </div>
        <div  style="margin-left: 10px; width: 400px;">
          <p class="title-head">Status</p>
          <p class="title-data"  >completionTime:  {{item.status.completionTime}} </p>
          <p class="title-data"  >conditions:  {{item.status.conditions}} </p>
          <p class="title-data"  >startTime:  {{item.status.startTime}} </p>
          <p class="title-data"  >succeeded:  {{item.status.succeeded}} </p>
        </div>
        <div  style="margin-left: 10px">
         <el-dropdown @command="changeJob"  trigger="click" style="margin-top: 7px">
            <span style="font-weight: bold;font-size: 16px">
              . . .
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="option in jobsOptions"
                    :key="option.value"
                    :command="beforeHandleCommand(option.value, item)"
                >{{option.value}}</el-dropdown-item>
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
      :total="tableJobs.length">
      <span>
        {{query.pageIndex}}/{{Math.ceil(tableJobs.length / pagesize)}}
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
  const selectNamespace = ref<string>("Select a namespace");
  const selectCluster = ref<string>("Select a Cluster");
  const sendingItemValues = ref()
  const clusterOptions =[{"value": "prod"},{value: "microstrategy"}];
  const namespaceOptions = ref<{value: ""}[]>([])
  const jobsOptions = [{value: "edit yaml"},{value: "resize the scale   "}]
  const tableJobs = ref<JobsItems[]>([]);
  const tablePods = ref<PodsItems[]>([])
  const yamlDialogVisible = ref(false)
  const displayCluster = ref<string>("");
  const loading = ref(true)
  const query = reactive({
    pageIndex: 1,
    pageSize: 5
  });
  const pagesize = 5;
  interface PodsItems {
  
  };
  interface JobsItems {
    metadata: {
      name: string,
      namespace: string,
      creationTimestamp: string,
      resourceVersion: string,
      managedFields: {
        manager: string,
        fieldsType: string,
        apiVersion: string
      }[]
    },
    spec: {
      template: {
        spec: {
          nodeSelector: string,
          containers: {
            image: string,
            resources: string,
            command: string
          }[]
        }
      }
    },
    status: {
      completionTime: string,
      conditions: string,
      startTime: string,
      succeeded: string
    }

  };
  
  
  const displayedCards=computed(() => {
      const startIndex = (query.pageIndex - 1) * query.pageSize;
      const endIndex = startIndex + query.pageSize;
      return tableJobs.value.slice(startIndex, endIndex);
});

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
  };
  
  const handleCommand = (cluster: string) => {
    ElMessage(`choose window: ${cluster}`)
    selectCluster.value = cluster
    getNamespaces(selectCluster.value);
    selectNamespace.value="Select a Namespace"
    loading.value = true
    getJobs("",selectCluster.value)
    displayCluster.value = cluster
  };
  const beforeHandleCommand =(editor: string,yamlValue : any)=>{
  return {
    editor,
    yamlValue
  }
}
  const changeJob = (i: any)=>{
    if (i.editor === "edit yaml"){
      yamlDialogVisible.value = true
      sendingItemValues.value = i.yamlValue
      console.log("=================+>>>>>>>>>>>>yamlDialogVisible:", yamlDialogVisible)
    }
  };
  const getContent = (v: any) => {
    console.log("=================>>>>>>>> getContent", v)
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

const changeCommand = (namespace: string) => {
  ElMessage(`choose window: ${namespace}`)
  selectNamespace.value = namespace
  loading.value = true
  if (selectCluster.value === "Select a Cluster"){
    getJobs( namespace, "microstrategy")
  }
  else{
    getJobs( namespace, selectCluster.value)
  }
  
};
  
  
  const initialFunc =()=>{
    // selectCluster.value = "microstrategy"
    displayCluster.value = "microstrategy"
    getNamespaces("microstrategy");
    getJobs("","microstrategy")
  };
  
  
  const getJobs = (namespace : string, env : string)=>{
    api.listJobs({
      env: env,
      namespace: namespace
    }).then(e=>{
      console.log(e)
      const jobs = e.data.items || [] 
      tableJobs.value = jobs? jobs.map((o:any, index:any) =>{
        return {
          ...o,
        }
      }) :[]
      loading.value = false
    })
  };
  
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
    margin-top: 5px;
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
    