<template>
  <el-card class="json-editor">
      <Codemirror v-model:value="code" 
      :options="cmOptions" border 
      :height="500" 
      style="font-size: 16px;" 
      @change="UpdateTextValue">
      </Codemirror>
  </el-card>
</template>
<script lang="ts">
import { ref, defineComponent, markRaw } from "vue";
import type { Editor, EditorConfiguration } from "codemirror";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";
import jsyaml from 'js-yaml';
window.jsyaml = jsyaml;
// language
import "codemirror/mode/javascript/javascript.js";

// theme
import "codemirror/theme/darcula.css";

// console.dir();

export default defineComponent({
  components: {
    Codemirror,
  },
  props:{
    content: {
      type: Object,
      default: () => ({}) 
    }
  },
  setup(props,{emit}) {
    const code = ref('');
    let y = jsyaml.dump(props.content)
    code.value = y;
    const cmOptions: EditorConfiguration = {
      lineNumbers: true, // 是否显示行数
      mode: "yaml",  // 接受的类型，json xml....
      gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"], // 样式的宽度
      // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      theme: "rubyblue",//"rubyblue", // 主题
      lint: true,
      smartIndent: true,
      // lineWrapping: true,
      // matchBrackets: true,
      // autoRefresh: true,
      indentUnit: 4,
      lineWrapping: true,
      scrollbarStyle: 'native',
      // styleActiveLine: true, 
      // fontSize: '20px'
    };
    // Codemirror.w("change", cm => {
    //     emit("getContent", cm.getValue());
    //       // 编辑json框里面的内容可以时刻监听到值，通过cm.getValue()获取到
    //   });
    return {
      code,
      cmOptions,
    };
  },
  methods:{
     UpdateTextValue(value: string){
        console.log("===============>>>>>>>>>>>")
        this.$emit("getContent", value);
    }
  }
});
</script>
<style scoped>
.json-editor {
  height: 500px;
  position: relative;
}
.json-editor :deep() .CodeMirror {
  height: 500px;
  min-height: 400px;
  width: 100%;
}
.json-editor :deep() .CodeMirror-scroll {
  min-height: 500px;
}
.json-editor:deep() .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>