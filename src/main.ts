import {createApp} from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import App from './App.vue'
import router from './router'
import { usePermissStore } from './store/permiss'
import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import './assets/css/index.less'
// import './assets/font_4062456_mf9rd61140f/iconfont.css'
import './assets/font_4062637_9isy5ses2kf/iconfont.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: en,
})
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 自定义权限指令
// const permiss = usePermissStore()
// app.directive('permiss', {
//     mounted(el, binding) {
//         if(!permiss.key.includes(String(binding.value))){
//             el['hidden'] = true;
//         }
//     }
// })

app.mount('#app')