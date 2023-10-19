<template>
  <div>
    <div style="display: flex;">
    <div slot="header">
      <el-page-header  title="POD" :content="podNameConst"  @back="$router.go(-1)">
      </el-page-header>
    </div>
    <el-dropdown @command="changeCommand" style="margin-left: 80px;"  class="title-head">
        <div style="font-size: 17px; display: flex;" >
          <div style="font-size: 17px; position: relative;   top: -4px;color: #303133">{{ selectContainer }}</div>
          <el-icon class="el-icon--right"  style="position: relative;   top: -4px;"><arrow-down /></el-icon>
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
    </div>
    <el-divider />
    <div>
      <div class="ssh-container" ref="terminal"></div>
    </div>
    </div>
  </template>
  
  <script>
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import 'xterm/css/xterm.css'
  import { debounce } from 'lodash'
  
  const packResize = (cols, rows) =>
    JSON.stringify({
      type: 'resize',
      cols: cols,
      rows: rows
    })
  export default {
    name: 'PodTerminal',
    data() {
      return {
        initText: 'connecting...\r\n',
        podNameConst: this.$route.query.podname,
        selectContainer: this.$route.query.containerName,
        containersOption:[{"value": "cmdb-service"}],
        first: true,
        connection: true,
        term: null,
        fitAddon: null,
        ws: null,
        // socketUrl: "ws://127.0.0.1:3000/ws?env=prod&podName=cmdb-deployment-6489ffc597-gkftm&namespace=production-env&containerName=cmdb-service",
        socketUrl: "wss://cmdb-cd.cloud.microstrategy.com/ws?",
        option: {
          lineHeight: 1.0,
          cursorBlink: true,
          color: "#b1c6c8",
          cursorStyle: 'block', // 光标样式 'block' | 'underline' | 'bar'
          fontSize: 14,
          fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
          theme: {
            // 背景色
            background: '#060708',
            // 前景色
            foreground: '#b7c4d1',
            // 光标背景色
            cursor: '#b1c6c8',
            // color: '#b1c6c8',
            // 光标前景色
            /** The accent color of the cursor (fg color for a block cursor) */
            // cursorAccent: '#000000',
            // 选择背景色
            /** The selection background color (can be transparent) */
            selection: '#b1c6c8',
            // 选择前景色
            /** The selection foreground color */
            selectionForeground: '#b1c6c8'
          },
          cols: 100 // 初始化的时候不要设置fit，设置col为较小值（最小为可展示initText初始文字即可）方便屏幕缩放
        }
      }
    },
    mounted() {
      this.initTerm()
      this.initSocket()
  
      this.onTerminalResize()
      this.onTerminalKeyPress()
    },
    beforeDestroy() {
      this.removeResizeListener()
      this.term && this.term.dispose()
    },
    methods: {
      utf8_to_b64(rawString) {
        return btoa(unescape(encodeURIComponent(rawString)));
      },
      b64_to_utf8(encodeString) {
        return decodeURIComponent(escape(atob(encodeString)));
      },
      bytesHuman(bytes, precision) {
        if (!/^([-+])?|(\.\d+)(\d+(\.\d+)?|(\d+\.)|Infinity)$/.test(bytes)) {
          return '-'
        }
        if (bytes === 0) return '0';
        if (typeof precision === 'undefined') precision = 1;
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
        const num = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(precision);
        return `${value} ${units[num]}`
      },
      isWsOpen() {
        return this.ws && this.ws.readyState === 1
      },
      initTerm() {
        let podname = this.$route.query.podname
        let namespace = this.$route.query.namespace
        let cluster = this.$route.query.cluster
        let containerName = this.$route.query.containerName
        console.log("==============+++>>>>>>>podname",this.$route.query.podname)
        console.log("==============+++>>>>>>>podname",this.$route.query.namespace)
        console.log("==============+++>>>>>>>podname",this.$route.query.cluster)
        console.log("==============+++>>>>>>>podname",this.$route.query.containerName)
        // &podName=cmdb-deployment-6489ffc597-gkftm&namespace=production-env&containerName=cmdb-service
        this.socketUrl = this.socketUrl + 'env=' + cluster + '&podName=' + podname + '&namespace=' + namespace + '&containerName=' + containerName

        this.term = new Terminal(this.option)
        this.fitAddon = new FitAddon()
        this.term.loadAddon(this.fitAddon)
        this.term.open(this.$refs.terminal)
        // this.fitAddon.fit() // 初始化的时候不要使用fit
        setTimeout(() => {
          this.fitAddon.fit()
        }, 500); // 必须延时处理
      },
      onTerminalKeyPress() {
        this.term.onData(data => {
          this.isWsOpen() && this.ws.send(JSON.stringify({
            type: 'input',
            // input: this.utf8_to_b64(data)
            input: data
          }))
        })
      },
      // resize 相关
      resizeRemoteTerminal() {
        const { cols, rows } = this.term
        console.log('列数、行数设置为：', cols, rows)
        // 调整后端终端大小 使后端与前端终端大小一致
        this.isWsOpen() && this.ws.send(packResize(cols, rows))
      },
      onResize: debounce(function () {
        this.fitAddon.fit()
      }, 500),
      onTerminalResize() {
        window.addEventListener('resize', this.onResize)
        this.term.onResize(this.resizeRemoteTerminal)
      },
      removeResizeListener() {
        window.removeEventListener('resize', this.onResize)
      },
      // socket
      initSocket() {
        this.term.write(this.initText)
        console.log(this.socketUrl)
        this.ws = new WebSocket(this.socketUrl)
        this.onOpenSocket()
        this.onCloseSocket()
        this.onErrorSocket()
        this.term._initialized = true
        this.onMessageSocket()
      },
      // 打开连接
      onOpenSocket() {
        this.ws.onopen = () => {
          console.log('websocket connected')
          // this.ws.send(JSON.stringify({ type: "addr", data: this.utf8_to_b64(this.ip + ':' + this.port) }));
          // // socket.send(JSON.stringify({ type: "term", data: utf8_to_b64("linux") }));
          // this.ws.send(JSON.stringify({ type: "login", data: this.utf8_to_b64(this.user) }));
          // this.ws.send(JSON.stringify({ type: "password", data: this.utf8_to_b64(this.pwd) }));
          this.term.reset()
          setTimeout(() => {
            this.resizeRemoteTerminal()
          }, 500)
        }
      },
  
      // 关闭连接
      onCloseSocket() {
        this.ws.onclose = () => {
          console.log('disconnecting')
          this.term.write("Please refresh the page and reconnect after disconnecting.\r\n");
          // setTimeout(() => {
          //   this.initSocket();
          // }, 3000)
        }
      },
      // 连接错误
      onErrorSocket() {
        this.ws.onerror = () => {
          this.term.write('Connection lost. Please refresh the page!')
        }
      },
      // 接收消息
      onMessageSocket() {
        this.ws.onmessage = res => {
          console.log(res)
          // const msg = JSON.parse(res.data)
          const msg = res.data
          // console.log(msg)
          const term = this.term
          // console.log("receive: " + data)
          // 第一次连接成功将 initText 清空
          if (this.first) {
            this.first = false
            term.reset()
            term.element && term.focus()
            this.resizeRemoteTerminal()
          }
          term.write(msg)
        }
      },
      changeCommand(container){
        ElMessage(`choose container: ${container}`)
        this.selectContainer = container
      }
    }
  }
  //
  </script>
  <style lang="scss">
  body {
    margin: 0;
    padding: 0;
  }
  .title-head {
    display: inline-flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 20px;
    height: 32px;
    vertical-align: middle;
}
  .ssh-container {
    overflow: hidden;
    // height: 93vh;
    height: 75vh;
    border-radius: 4px;
    // background: rgb(255, 255, 255);
    padding: 0px;
    color: #e7f2f3;
    background-color: #060708;
  
    .xterm-scroll-area::-webkit-scrollbar-thumb {
      background-color: #b7c4d1;
      /* 滚动条的背景颜色 */
    }
  }
  </style>
  
  