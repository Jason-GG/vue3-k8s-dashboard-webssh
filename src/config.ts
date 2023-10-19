// const myVariableValue = process.env.ENV_EXE;
// export const baseEn = "dev";

// set a production env tag. and this setting in fact can be made as webpage function
export const baseEn = "prod";
export const baseOrigin = {
    devIp: 'http://127.0.0.1:8000',
    javadev: ``,
    pre: ``,
    prod: 'http://127.0.0.1:8000',
    //please be careful here, the example used different backend service. as to your own project. you can ignore this part.
    cluster: 'http://127.0.0.1:3000',
  }

export const baseUrl = baseOrigin[baseEn]
export const clusterUrl = baseOrigin["cluster"]

export function getCurrentUrl(params:any) {
    const { url, yapi } = params
    let currentUrl = baseUrl
    return currentUrl + url
  }

  export function getClusterUrl(params:any) {
    const { url, yapi } = params
    let currentUrl = clusterUrl
    return currentUrl + url
  }