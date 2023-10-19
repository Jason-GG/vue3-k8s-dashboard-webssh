<template>
    <editor v-model="myValue" :init="init" :disabled="disabled" :id="tinymceId" style="pointer-events: none;"></editor>
</template>
  
  
  <script setup lang="ts">
  //JS部分
  //在js中引入所需的主题和组件
  import tinymce from 'tinymce/tinymce'
  // 这个会影响所有平台的渲染
  // import 'tinymce/skins/content/default/content.css'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
//   import 'tinymce/models/dom' // 这里是个坑 一定要引入
  
  
  //在TinyMce.vue中接着引入相关插件
  import "tinymce/icons/default/icons"
  // import "tinymce/plugins/image" // 插入上传图片插件
  // import "tinymce/plugins/media" // 插入视频插件
  import "tinymce/plugins/table" // 插入表格插件
  import "tinymce/plugins/lists" // 列表插件
  import "tinymce/plugins/wordcount" // 字数统计插件
  import "tinymce/plugins/code" // 源码
  import "tinymce/plugins/autoresize"
  // import "tinymce/plugins/fullscreen" //全屏
  
  //接下来定义编辑器所需要的插件数据
  import { reactive, ref } from "vue"
  import { onMounted, defineEmits, watch } from "@vue/runtime-core"
  import axios from 'axios'
  // import { updateImg } from '@/api/order/order'
  const emits = defineEmits(["getContent"])
  //这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
  const props = defineProps({
    value: {
      type: String,
      default: () => {
        return ""
      },
    },
    baseUrl: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: "lists  table",
    },//必填
    toolbar: {
      type: [String, Array],
      default:
        "codesample bold italic underline alignleft aligncenter alignright alignjustify | undo redo | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist outdent indent | lists link table code | removeformat ",
    },//必填
  })
  //用于接收外部传递进来的富文本
  const myValue = ref(props.value)
  const tinymceId = ref("vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""))
//   const tinymceId = ref("vue-tinymce-display")
  //定义一个对象 init初始化
  const init = reactive({
    selector: '#' + tinymceId.value, //富文本编辑器的id,
    language_url: "/tinymce/langs/en_CA.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
    // language: "en_CA", //语言
    skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
    // width: 1600,
    // height: 700, //编辑器高度
    // min_height: 400,
    // max_height: 700,
    plugins: "autoresize",
    // autoresize_min_height: 400,
    // autoresize_max_height: 800,
    branding: false, //是否禁用“Powered by TinyMCE”
    menubar: false, //顶部菜单栏显示
    toolbar:false,
    image_dimensions: false, //去除宽高属性
    // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
    paste_webkit_styles: "all",
    paste_merge_formats: false,
    nonbreaking_force_tab: false,
    paste_auto_cleanup_on_paste: false,
    file_picker_types: 'file',
    disabled: 1,
    // readonly:1,
    promotion: false,
    // theme : 'advanced',
    readonly : 1,
    content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
    
  })

  //监听外部传递进来的的数据变化
  watch(
    () => props.value,
    () => {
      myValue.value = props.value
      emits("getContent", myValue.value)
    }
  )
  //监听富文本中的数据变化
  watch(
    () => myValue.value,
    () => {
      emits("getContent", myValue.value)
    }
  )
  //在onMounted中初始化编辑器
  onMounted(() => {
    tinymce.init({})
  })
//   tinymce.activeEditor?.getBody().setAttribute('contenteditable', false);
// tinymce.get('#' + tinymceId.value).getBody().setAttribute('contenteditable', false);
//   Editor.editor.mode.set('readonly');
  </script>
  
  