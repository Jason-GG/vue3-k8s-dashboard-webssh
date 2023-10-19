<template>
	<div class="sidebar">
		<!-- text-color="#bfcbd9" -->
		<el-menu
			class="sidebar-el-menu"
			:default-active="onRoutes"
			:collapse="sidebar.collapse"
			background-color="#324157"
			text-color="#fff"
			active-text-color="#ffd04b"
			unique-opened
			router
		>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-sub-menu :index="item.index" :key="item.index">
						<template #title>
							<el-icon>
								<!-- <el-icon-AWS /> -->
								<component v-if="item.icon" :is="item.icon"></component>
								<span v-else :class="item.fonticon"></span>
							</el-icon>
							<span>{{ item.title }}</span>
						</template>
						<template v-for="(subItem, j) in item.subs">
							<el-sub-menu
								v-if="subItem.subs"
								:index="subItem.index"
								:key="subItem.index + j"
							>
								<template #title>{{ subItem.title }}</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="threeItem.index + i" :index="threeItem.index">
									{{ threeItem.title }}
								</el-menu-item>
							</el-sub-menu>
							<el-menu-item v-else :index="subItem.index" >
								{{ subItem.title }}
							</el-menu-item>
						</template>
					</el-sub-menu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index" >
						<el-icon>
							<component v-if="item.icon" :is="item.icon"></component>
							<span v-else :class="item.fonticon"></span>
						</el-icon>
						<template #title>{{ item.title }}</template>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

interface Items {
	icon?: string;
	fonticon?: string;
	title: string;
	index: string;
	subs?: Items[];
}

const items :Items[] =  [
	{
		fonticon:"element-icons el-icon-yunwei-yunweirizhi",
		title: "Home",
		index: '2',
		subs: [
			{
				index: "/dashboard",
				title: "dashboard",
			}
		]
	}
	,
	{
		fonticon:"element-icons el-icon-kubernetes",
		title: "Clusters",
		index: '9',
		subs: [
			{
				index: "/namespace",
				title: "Namespace",
			},
			{
				index: "/deployment",
				title: "Deployment",
			},{
				index: "/jobs",
				title: "Jobs",
			},{
				index: "/pods",
				title: "Pods",
			},
		]
	}
	
];



const route = useRoute();
const onRoutes = computed(() => {
	return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}
.sidebar > ul {
	height: 100%;
}
</style>

