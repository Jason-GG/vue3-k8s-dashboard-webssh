<template>
    <el-dialog
        title="metrics detail"
        :visible.sync="visible"
        top="5vh"
        class="dialog"
        append-to-body
        width="1600px"
        @close="closed"
    >
        <div v-loading="load" element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-row>
                <div style="text-align: right;">
                    <el-radio-group @change="radioChange" size="small" v-model="radio" fill="#606266">
                    <el-radio-button label="1d"></el-radio-button>
                    <el-radio-button label="1w"></el-radio-button>
                    <el-radio-button label="1m"></el-radio-button>
                    <el-radio-button label="1y"></el-radio-button>
                    </el-radio-group>
                    <el-date-picker
                        size="small"
                        v-model="dateValue"
                        type="datetimerange"
                        style="align-items: right;"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="start"
                        end-placeholder="end"
                        @change="change">
                    </el-date-picker>
                </div>
                <Echarts :option="option" :dark="dark" style="height: 600px;width: 100%" />
            </el-row>
        </div>
  </el-dialog>
</template>

<script>
//引入Echart的包
import * as echarts from 'echarts';
import Echarts from "../../../components/charts/Echarts";      
import { none } from 'html-webpack-plugin/lib/chunksorter';
import * as api from '@/api/request'     
import object from 'relateurl/lib/util/object';
export default {
  props: {
    open: {
        type: Boolean,
        default: false
      },
    initial: {
      type: Object,
      default: () => {}
    }
  },
  components:{
    Echarts,
  },
  data(){
    return{
      load:null,
      dark:"dark",
      visible: false,
      option:{
        title: {
          text: 'C002_EC2_i-0f0fd67753305898c',
          left: '1%'
        },
        tooltip: {
          // trigger: 'axis'
            trigger: 'axis',
            position: function (pt) {
            return [pt[0], '10%'];
            }
        },
        grid: {
          left: '5%',
          right: '20px',
          // bottom: '10%'
        },
        xAxis: {
            type: 'time',
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
      dataZoom: [
            {
            type: 'inside',
            start: 0,
            end: 20
            },
            {
            start: 0,
            end: 20
            }
        ],
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          // restore: {},
          myTool:{ //自定义方法 配置   我这是为了实现 饼图切换为柱状图
                show : true,
                title : 'download',
                icon : 'path://M745.7792 553.8816l-2.7136 2.816-204.8 192-0.6912 0.64c-0.512 0.4864-1.1008 0.9472-1.664 1.408l2.3552-2.048a38.784 38.784 0 0 1-18.8416 9.6768 37.12 37.12 0 0 1-11.1104 0.5376 39.8336 39.8336 0 0 1-12.8256-3.5584 37.5808 37.5808 0 0 1-10.0864-6.9888l2.0992 1.8944a38.5536 38.5536 0 0 1-1.3056-1.152l-0.7936-0.7424-199.7824-192-2.688-2.8672a38.4 38.4 0 0 1 55.9104-52.48l134.7584 129.4848V42.2912a38.4 38.4 0 1 1 76.8 0V632.064l140.1344-131.3792a38.4 38.4 0 0 1 55.2448 53.1968zM0 947.2h1024v76.8H0z',
                onclick : function (){
                    alert("I'm here")
                }
            }
        }
      },
      visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: 0,lte: 50,color: '#93CE07'
          },
          {
            gt: 50,lte: 90,color: '#FBDB0F' //'#FBDB0F'
          },
          {
            gt: 90,lte: 100,color: '#AC3B2A' //'#FC7D02'
          },
          // {
          //   gt: 150,lte: 200,color: '#FD0100'
          // },
          // {
          //   gt: 200,lte: 300,color: '#AA069F'
          // },
          // {
          //   gt: 300,color: '#AC3B2A'
          // }
        ],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        name: 'Beijing AQI',
        type: 'line',
        smooth: true,
        data: [],
        areaStyle:{
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: 'rgb(255, 158, 68)'
            },
            {
                offset: 1,
                color: 'rgb(255, 70, 131)'
            }
            ])
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333'
          },
          data: [
            {   yAxis: 50   },
            {   yAxis: 100  },
            {   yAxis: 150  },
            {   yAxis: 200  },
            {   yAxis: 300  }
          ]
        }
      }
      },
      formInline:{
        platform: "Aws"
      },
      radio:"1d",
      dateValue:["2022-9-11","2022-9-12"],

    }
  },
  mounted(){
    // this.getInitial();
    const that = this
    window.onresize = () => {
      return (() => {
          that.screenHeight = window.innerHeight;
          that.screenWidth = window.innerWidth;
      })()
    }
  },
  watch: {
    open: function() {
      this.visible = this.open
      if (this.open) {
        this.radio="1d"
        this.dateValue = ["2022-9-11","2022-9-12"]
        this.getInitial()
      }
    }
  },
  methods:{
    getInitial(){
      console.log("client-metrics.component.chartDetail.initial",this.initial)
      this.option.series.data = null
        this.load = true
        console.log("this.dateValue",this.dateValue)
        if (this.initial.hasOwnProperty("DBInstanceIdentifier")){
          this.option.title.text = this.initial.client_id + "_RDS_Storage_" + this.initial.DBInstanceIdentifier
          api.RdsStorage({
            platform: this.formInline.platform,
            client: this.initial.client_id,
            instance: this.initial.DBInstanceIdentifier,
            starttime: this.dateValue[0],
            endtime: this.dateValue[1]
          }).then((re)=>{
              console.log("=======++++++++++++++++++++++++++++++ rds storage",re)
              // this.option.xAxis[0].data = re.data.time || []
              this.option.series.data = re.data.data || []
              this.load = false;
          })
        }
        else if(this.initial.hasOwnProperty("FileSystemId")){
          this.option.title.text = this.initial.client_id + "_EFS_Storage_" + this.initial.FileSystemId
          api.EfsStorage({
            platform: this.formInline.platform,
            client: this.initial.client_id,
            instance: this.initial.FileSystemId,
            starttime: this.dateValue[0],
            endtime: this.dateValue[1]
          }).then((re)=>{
              console.log("=======++++++++++++++++++++++++++++++ rds storage",re)
              // this.option.xAxis[0].data = re.data.time || []
              this.option.series.data = re.data.data || []
              this.load = false;
          })
        }
        else{
          this.option.title.text = this.initial.client_id + "_EC2_RAM_" + this.initial.InstanceId
          api.Ec2Ram({
          platform: this.formInline.platform,
          client: this.initial.client_id,
          instance: this.initial.InstanceId,
          starttime: this.dateValue[0],
          endtime: this.dateValue[1]
          }).then((re)=>{
              console.log("=======++++++++++++++++++++++++++++++",re)
              // this.option.xAxis[0].data = re.data.time || []
              this.option.series.data = re.data.data || []
              this.load = false;
          })
        }


    },
    change(){
      // alert("i'm here")
      console.log("========>",this.dateValue)
      this.getInitial()
    },
    radioChange(){

      console.log("========>00000000000000",this.radio)
      if(this.radio == "1w"){
        this.dateValue = ["2022-9-05","2022-9-12"]
        this.load = true
        this.getInitial()
      }
      else if (this.radio == "1m"){
        this.dateValue = ["2022-8-12","2022-9-12"]
        this.load = true
        this.getInitial()
      }
      else if(this.radio == "1y"){
        this.dateValue = ["2021-9-12","2022-9-12"]
        this.load = true
        this.getInitial()
      }
      else{
        this.dateValue = ["2022-9-11","2022-9-12"]
        this.load = true
        this.getInitial()
      }
    },
    closed(){
      this.$emit('childEven',false)
      
    }
  }
 
}
</script>
<style scoped>
</style>
