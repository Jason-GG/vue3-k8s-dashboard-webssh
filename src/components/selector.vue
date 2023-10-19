<template>
  <el-select class = "selector"  v-model="message" @change="updateMessage" >
      <el-option :label="item" :value="item" v-for="(item,index) in options" :key="index" />
  </el-select>
</template>
  
<script>
  import { ref, computed, defineEmits } from 'vue';
  
  export default {
    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      index:{
        type: Number,
        required: false
      }
    },
    data() {
      return {
        message: this.value
      };
    },
    methods:{
      updateMessage(){
        // console.log("updateMessage",this.updateMessage)
        
        if(this.index !== undefined){
          this.$emit('update:selectvalue', {message:this.message, index: this.index});
        }
        else{
          this.$emit('update:selectvalue', this.message);
        }
      }
    }
  };
</script>
  
<style scoped>
.selector{
  /*clip:rect(2px 90px 30px 2px);*/
  /* width:90px; */
  /* height:28px; */
  /* line-height:28px;
  font-size:15px; 
  font-weight:bold; */
  margin-right: 20px; 
  width: 40%; 
}
:deep(.el-input__wrapper) {
  /* border: none !important;
  border-bottom: 2px solid rgb(14, 12, 12) !important;
  border-radius: 0px !important;
  box-shadow: none !important; */
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
:deep(.el-select .el-input__wrapper.is-focus ){
  box-shadow: none !important;
}
</style>
  