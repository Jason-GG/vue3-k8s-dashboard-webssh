import router from '../router/index';
import { ElMessage } from 'element-plus';
import qs from 'qs';
import  axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig}  from 'axios';
import { getClusterUrl } from '../config';

const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    //   'Authorization': 'Basic cmVhZFVzZXI6Q2VsZXN0aWFsMC4=',

    },
    withCredentials: true, // cross domain with cookie，nginx can delete this part
    timeout: 500000
  })
  
  function toLoginPage() {
    if (router.currentRoute.value.params.uid != '/login') {
      ElMessage.error('your login session is expired, please login again')
      location.href = `http://localhost:5173/#/login?redirect=${encodeURIComponent(location.href)}`
    } 
  }

const ajax= (url : string, data : {}, showMsg: boolean, method : string='get', needCatch:boolean)=>{
    url = getClusterUrl({url})
  if (method === 'get' || method === 'delete') {
    if (typeof data !== 'object') {
      if (!url.endsWith('/')) url += '/'
      url += data
    } else {
      data = { params: data }
    }
  } else {
    data = { data }
  }
  return instance.request({
      method,
      url,
      ...data,
  }).then(res => {
    let msg = null
    if (res.statusText === 'OK' || res.data) {
        msg = res.data.msg
        if (Number(res.data.code) === 1) {
          showMsg && msg && ElMessage.success(msg)
          return res.data
        } else if (Number(res.data.code) === -1) {
          toLoginPage() 
          return
        }
    }
    const err = new Error(msg || res.statusText || res.status)
    err.message = res.data || {}
    err.name = String(res.status)
    return Promise.reject(err)
  }).catch(({ response = {}, message }) => {
    if (response.status == 401 || response.status === 404) {
      toLoginPage()
      return
    }
    !needCatch && response && message && ElMessage.error(message)
    return Promise.reject(response)
  })
}


export default ajax
