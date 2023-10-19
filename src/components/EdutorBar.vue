
<template>

  <div id="wangeditor">

    <div ref="editorElem" style="text-align:left"></div>

  </div>

</template>

<script>

import E from "wangeditor";

export default {

  name: "editorElem",

  data() {

    return {

      editorContent: ""

    };

  },

  props: ["catchData","value"], //接收父组件的方法

  mounted() {

    var editor = new E(this.$refs.editorElem); //创建富文本实例

    editor.customConfig.onchange = html => {

      this.editorContent = html;

      this.catchData(html); //把这个html通过catchData的方法传入父组件

    };

    editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片

    editor.customConfig.uploadImgServer =

      "http://172.16.40.170:8080/upload/image/"; // 配置服务器端地址

    editor.customConfig.uploadImgHeaders = {

      Accept: "*/*",

      Authorization: "JWT " + sessionStorage.token

    }; // 自定义 header

    editor.customConfig.uploadFileName = "myFileName"; // 后端接受上传文件的参数名

    editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M

    editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片

    editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

    editor.customConfig.zindex = 20000;

    editor.customConfig.menus = [

      //菜单配置

      "head", // 标题

      "bold", // 粗体

      "fontSize", // 字号

      "fontName", // 字体

      "italic", // 斜体

      "underline", // 下划线

      "strikeThrough", // 删除线

      "foreColor", // 文字颜色

      "backColor", // 背景颜色

      "link", // 插入链接

      "list", // 列表

      "justify", // 对齐方式

      "quote", // 引用

      "emoticon", // 表情

      "image", // 插入图片

      "table", // 表格

      "video", // 插入视频

      //  "code", // 插入代码

      "undo", // 撤销

      "redo", // 重复

    ];

    //下面是最重要的的方法

    editor.customConfig.uploadImgHooks = {

      before: function(xhr, editor, files) {

        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传

        // return {
        //    prevent: true,
        //    msg: '放弃上传'
        // }

      },

      success: function(xhr, editor, result) {

        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        this.imgUrl = Object.values(result.data).toString();

      },

      fail: function(xhr, editor, result) {

        // 图片上传并返回结果，但图片插入错误时触发

        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果

      },

      error: function(xhr, editor) {

        // 图片上传出错时触发

        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象

      },

      timeout: function(xhr, editor) {

        // 图片上传超时时触发

        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象

      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置

      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）

      customInsert: function(insertImg, result, editor) {

        let url = Object.values(result.data);

        // debugger;

        JSON.stringify(url);

        insertImg(url);

      }

    };

    editor.create();
    editor.txt.html(this.value);   //回显
  }

};

</script>

<style lang="css">

</style>
