import request from '../utils/request';
import ajax from '../utils/ajax';


export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const AlarmNamespaceList = (data: any, showMsg=true) => ajax(
  `/api/AlarmNamespaceList`,
  data,
  showMsg,
  'get',
  false
)
export const Natgateway = (data: any,showMsg=true) => ajax(
  `/api/VpcNatGateway`,
  data,
  showMsg,
  'get',
  false
)

export const NatgatewayConfigAlarm = (data: any,showMsg=true) => ajax(
  `/api/VpcNatGatewayAlarm`,
  data,
  showMsg,
  'get',
  false
)

export const EfsAlarmDelete = (data: any,showMsg=true) => ajax(
  `/api/EfsAlarmDelete`,
    data,
    showMsg,
    'get',
    false
)

export const EfsAlarmConfig = (data: any,showMsg=true) => ajax(
  `/api/EfsAlarmConfig`,
    data,
    showMsg,
    'get',
    false
)


export const EfsStorage = (data: any,showMsg=false) => ajax(
    `/api/CloudWatchEfs`,
     data,
     showMsg,
     'get',
     false
   )


export const HealthCheck = (data: any,showMsg=false) => ajax(
    `/api/healthCheck`,
     data,
     showMsg,
     'get',
     false
   )


export const Test = (data: any,showMsg=false) => {}


export const Login = (data: any,showMsg=true) => ajax(
  `/api/authenticate`,
   data,
   showMsg,
   'post',
   false
 )

export const LogOut = (showMsg=true) => ajax(
    `/api/logout`,
     {},
     showMsg,
     'get',
     false
   )

export const getTotalNumber = (data: any, showMsg=false) => {}

export const getTotalNumberLatest = (data: any, showMsg=false) => {}

export const getTotalNumberEmials = (data: any, showMsg=false) => {}


export const getCidList = (data: any, showMsg=false) => {}

export const enableFlag: boolean = true