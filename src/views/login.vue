<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">Cloud Resource Managment</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="param.password" @keyup.enter="submitForm(login)">
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">Login</el-button>
				</div>
				<p class="login-tips">Tips : please fill up the name and password</p>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as api  from '../api/index'
import * as apiv2 from '../api/cluster'
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
// import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';

interface LoginInfo {
	username: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	username: '',
	password: ''
});

const rules: FormRules = {
	username: [{required: true,message: 'please type your username', trigger: 'blur'}],
	password: [{ required: true, message: 'please type your password', trigger: 'blur' }]
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	const credentials = btoa(`${param.username}:${param.password}`);
	formEl.validate((valid: boolean) => {
		api.Login({
			// "username":param.username,
     		// "password":param.password
			"credentials": credentials
		}).then(e=>{
			console.log(e)
			router.push('/');
		})
	});
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-3.jpeg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	/* color: #808A87; */
	color: #1a2146;
	font-weight: 900;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	font-weight: 500;
	line-height: 30px;
	color: rgb(245, 131, 131);
}
</style>
