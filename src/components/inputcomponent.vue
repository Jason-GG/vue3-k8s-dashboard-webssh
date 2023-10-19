<template>
    <el-input class = "inputcomponent" placeholder="input field" v-model="message" @input="updateMessage">
    </el-input>
  </template>
  
<script>
  export default {
    props: {
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
      updateMessage() {
        
        if(this.index !== undefined){
          this.$emit('update:value', {message:this.message, index: this.index});
        }
        else{
          this.$emit('update:value', this.message);
        }
        
      }
    }
  };
</script>
  
  <style scoped>
  .inputcomponent{
    /* clip:rect(2px 90px 30px 2px); */
    /* width:90px; */
    /* height:28px; */
    /* line-height:28px;
    font-size:15px;
    font-weight:bold; */
    margin-right: 20px; 
    width: 80%; 
}
:deep(.el-input__wrapper) {
  /* border: none !important; */
  border-bottom: 1px solid rgb(14, 12, 12) !important;
  border-radius: 0px !important;
  box-shadow: none !important;
  background-color: transparent !important;
}
/* :deep(.el-input) {
  border: none !important;
  box-shadow: none !important;
} */
/* :deep(.el-input .el-input__wrapper.is-focus ){
  box-shadow: none !important;
} */
  </style>
  