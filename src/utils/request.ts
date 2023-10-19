import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import { nextTick } from 'vue';
import { ElMessage } from 'element-plus';
const service:AxiosInstance = axios.create({
    timeout: 20000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            if(response.data.code === -1){
                console.log("I'm here=========>");
                location.href="/#/login"
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;


// export const baseEn = "production";
export const baseEn = "devIp";
export const baseOrigin = {
    devIp: 'http://127.0.0.1:8000',
    javadev: ``,
    test: ``,
    pre: ``,
    production: 'http://ec2-34-235-77-38.compute-1.amazonaws.com'
  }

// 当前环境下的基础url
export const baseUrl = baseOrigin[baseEn]


export function getCurrentUrl(params:any) {
    const { url, yapi } = params
    let currentUrl = baseUrl
    // mock 这个怎么弄？
    // if (baseEn === 'mock') {
    //   // 为了处理接口在多个yapi项目下的问题
    //   //currentUrl = yapiUrl + (yapi || yapiIp)
    //   currentUrl = yapiUrl
    //   // } else if (baseEn === 'devIp') {
    //   //   // 直连多个服务ip
    //   //   currentUrl = ''
    //   // currentUrl = config.headers['service-name'] + '-proxy'
    //   // } else if (baseEn === 'devLanIp') {
    //   //   // 直连多个开发局域网ip
    //   //   currentUrl = devLanIpList[config.headers['service-name']]
    // }
  
    return currentUrl + url
  }

// 对请求的统一配置
// function ajax({ url = '', data = {}, showMsg = false, method = 'get', config = {}, needCatch=false }) {
//     url = getCurrentUrl({url})
//   if (method === 'get' || method === 'delete') {
//     if (typeof data !== 'object') {
//       if (!url.endsWith('/')) url += '/'
//       url += data
//     } else {
//       data = { params: data }
//     }
//   } else {
//     data = { data }
//   }
//   return service({
//     method: method,
//     url:url,
//     crossDomain: true
//   }).then(res => {
//     // console.log(res)
//     let msg = null
//     if (res.statusText === 'OK' || res.data) {
//       if (config && config.responseType === 'blob') {
//         return res
//       } else {
//         msg = res.data.msg
//         if (Number(res.data.code) === 1) {
//           showMsg && msg && ElMessage.success(msg)
//           return res.data
//         } else if (Number(res.data.code) === -1) {
//           // 未登录或者登录超时，跳转至登录页
//           //这里调试模式，注释掉用户认证，页面跳转
//           //toLoginPage()
//           return
//         }
//       }
//     }
//     const err = new Error(msg || res.statusText || res.status)
//     err.response = res.data || {}
//     err.code = res.status
//     return Promise.reject(err)
//   }).catch(({ response = {}, message }) => {
//     if (response.status === 403) {
      
//       //这里调试模式，注释掉用户认证，页面跳转
//       //toLoginPage()
//       return
//     }
//     !needCatch && response && message && ElMessage.error(message)
//     return Promise.reject(response)
//   })
// }

// export default ajax
