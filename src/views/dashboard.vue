<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 122px" v-model="UserAccount">
					<div class="user-info">
						<el-avatar :size="60" :src="imgurl" />
						<div class="user-info-cont">
							<div class="user-info-name" >{{ UserAccount?.user }}</div>
							<!-- <el-text  v-model="UserAccount.name"></el-text> -->
							<div>role: {{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						Latest Login: 
						<!-- <el-text  v-model="UserAccount.last_login"></el-text> -->
						<span>{{ UserAccount?.last_login }}</span>
					</div>
					<div class="user-info-list">
						Login &nbsp&nbspIP&nbsp&nbsp&nbsp&nbsp:
						<span>{{ UserAccount?.ip_address }}</span>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-1">
										<el-icon class="grid-con-icon"><Monitor /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.ec2 }}</div>
												<div>AWS EC2</div>
										</div>
								</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-2">
										<el-icon class="grid-con-icon"><Coin /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.aws_rds }}</div>
												<div>AWS RDS</div>
										</div>
								</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-3">
										<el-icon class="grid-con-icon"><Share /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.nat_gateway }}</div>
												<div>NAT GATEWAY</div>
										</div>
								</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-1">
										<el-icon class="grid-con-icon"><Monitor /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.vm }}</div>
												<div>AZURE VM</div>
										</div>
								</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-2">
										<el-icon class="grid-con-icon"><Coin /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.azure_rds }}</div>
												<div>AZURE RDS</div>
										</div>
								</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
								<div class="grid-content grid-con-3">
										<el-icon class="grid-con-icon"><UploadFilled /></el-icon>
										<div class="grid-cont-right">
												<div class="grid-num">{{ cloudResourceLatestNum.efs }}</div>
												<div>EFS</div>
										</div>
								</div>
						</el-card>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover">
						<schart ref="line" class="schart" canvasId="line" :options="MxEmailTotal"></schart>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-card shadow="hover">
						<schart ref="bar" class="schart" canvasId="bar" :options="cloudResourceCount"></schart>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
								<span>schedule</span>
								<el-button style="float: right; padding: 3px 0" text>add</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%">
						<el-table-column width="40">
							<template #default="scope">
									<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div
										class="todo-item"
										:class="{
												'todo-item-del': scope.row.status
										}"
								>
										{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
								<!-- <span>语言详情</span> -->
						</div>
					</template>
					<!-- Vue<el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript -->
					<!-- RDS
					<el-progress :percentage="24.1" color="#f1e05a"></el-progress>EFS
					<el-progress :percentage="13.7"></el-progress>EC2
					<el-progress :percentage="5.9" color="#f56c6c"></el-progress> -->
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { ref, reactive } from 'vue';
import { onBeforeMount } from 'vue';
import imgurl from '../assets/img/min-log.png';
import * as api  from '../api/index'
import { el } from 'element-plus/es/locale';

const name = "readUser";
const role: string = name === 'readUser' ? 'user' : 'readUser';

interface userAccountInfo {
    user: string;
    last_login: string;
    ip_address: string;
}

const UserAccount = ref<userAccountInfo>()
const shouldRefresh = ref(true); // Create a ref for controlling refresh

const cloudResourceLatestNum = reactive({
	ec2: "",
	vm: "",
	efs: "",
	nat_gateway: "",
	azure_rds: "",
	aws_rds: ""
})
const cloudResourceCount = reactive({
    type: 'bar',
    title: {
        text: 'Cloud Resources Total(Last 20 days)'
    },
    xRorate: 25,
    labels: [
		],
    datasets: [
    ]
});

const MxEmailTotal = reactive({
    type: 'line',
    title: {
        text: 'MX Emails Number Total'
    },
    labels: [],
    datasets: []
});



const todoList = reactive([
    {
        title: 'clear instance disk',
        status: true
    },
    {
        title: 'MX automation',
        status: true
    },
    {
        title: '... ...',
        status: false
    },
]);
</script>

<style scoped>
.el-row {
    margin-bottom: 10px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 60px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 5px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 5px;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 15px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 20px;
    color: #222;
}

.user-info-list {
    font-size: 10px;
    color: #999;
    line-height: 15px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 1px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 400px;
}
</style>
