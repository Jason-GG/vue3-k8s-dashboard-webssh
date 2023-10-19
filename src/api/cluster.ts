import ajax from '../utils/ajax_v2';

export const getNamespaces = (data: any,showMsg=false) => ajax(
`/namespace`,
  data,
  showMsg,
  'get',
  false
)

export const getNamespacesDetail = (data: any,showMsg=false) => ajax(
  `/listNamespace`,
    data,
    showMsg,
    'get',
    false
  )

export const getDeployments = (data: any,showMsg=false) => ajax(
`/deploymentList`,
  data,
  showMsg,
  'get',
  false
)

export const getPods = (data: any,showMsg=false) => ajax(
`/podsListFromDeployment`,
  data,
  showMsg,
  'get',
  false
)

export const login = (data: any,showMsg=true) => ajax(
`/login`,
  data,
  showMsg,
  'post',
  false
)

export const getPodLog = (data: any,showMsg=false) => ajax(
  `/podsLogs`,
    data,
    showMsg,
    'get',
    false
  )

export const deletePod = (data: any,showMsg=false) => ajax(
  `/podDelete`,
    data,
    showMsg,
    'get',
    false
  )

export const listJobs = (data: any,showMsg=false) => ajax(
  `/listJobs`,
    data,
    showMsg,
    'get',
    false
  )

export const listPobs = (data: any,showMsg=false) => ajax(
  `/listPods`,
    data,
    showMsg,
    'get',
    false
  )