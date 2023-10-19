<template>
	<div class="header">
		<div class="collapse-btn" @click="collapseChage">
			<el-avatar v-if="sidebar.collapse" shape="square" :size="50" :src="logo" />
			<el-avatar  v-else shape="square" :size="50" :src="logo" />
		</div>
    
		<div  class="logo">
      <!-- <el-avatar style="margin-top: 12px;" shape="square" :size="40" :src="logo" /> -->
      <span >Cloud Resource Management</span>
		</div>

		<div class="header-right">
			<div class="header-user-con">
				<div class="btn-bell" @click="router.push('/tabs')">
					<el-tooltip
						effect="dark"
						:content="message ? `there is ${message} havn't read` : `message box`"
						placement="bottom"
					>
						<i class="el-icon-lx-notice"></i>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div>
				<el-avatar class="user-avator" :size="30" :src="imgurl" />
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ UserAccount?.user }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="user">user info</el-dropdown-item>
							<el-dropdown-item divided command="loginout">log out</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import imgurl from '../assets/img/min-log.png';
import logo from '../assets/img/min-log.png';
import * as api  from '../api/index'


// const username: string | null = localStorage.getItem('ms_username');
const editor_name_list=["Admin"]
const message: number = 2;
interface userAccountInfo {
	user: string;
	last_login: string;
	ip_address: string;
}
const UserAccount = ref<userAccountInfo>()

const getData = () => {
};

getData();

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
});

const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		// localStorage.removeItem('ms_username');
		api.LogOut().then(e=>{
			console.log("log out has been done")
		})
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
	margin: 0;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 8px;
	cursor: pointer;
}
.collapse-logo-btn {
	display: flex;
	float: right;

}
.header .logo {
	float: left;
	/* width: 110px; */
	line-height: 70px;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
}
.user-avator {
	margin-left: 20px;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}
</style>
