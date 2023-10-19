import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import { usePermissStore } from '../store/permiss'

import * as api from "../api/index";
// import Home from "../views/home.vue";
import layout from "../layout/index.vue"
import Home from "../views/home.vue"

const routes:RouteRecordRaw[] = [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: "/",
      name: "Home",
      component: layout,
      children: [
        {
          path: '/dashboard',
          name: '首页',
          meta: {
              title: 'efs info',
              permiss: '9'
          },
          component: () => import (/* webpackChunkName: "efs" */ '../views/dashboard.vue')
        },
        {
          path: '/namespace',
          name: 'namespace',
          meta: {
              title: 'namespace',
              permiss: '12'

          },
          component: () => import (/* webpackChunkName: "namespace" */ '../views/cluster/namespace.vue')
        },
        {
          path: '/deployment',
          name: 'deployment',
          meta: {
              title: 'deployment',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "deployment" */ '../views/cluster/deployment.vue')
          // component: () => import (/* webpackChunkName: "deployment" */ '../components/YamlEditor.vue')
        },
        {
          path: '/jobs',
          name: 'jobs',
          meta: {
              title: 'jobs',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "jobs" */ '../views/cluster/jobs.vue')
        },
        {
          path: '/podlog',
          name: 'podlog',
          meta: {
              title: 'podlog',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "efs" */ '../views/cluster/pod_logs.vue')
        }
        ,
        {
          path: '/webssh',
          name: 'webssh',
          meta: {
              title: 'webssh',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "efs" */ '../views/cluster/webssh.vue')
        },
        {
          path: '/pods',
          name: 'pods',
          meta: {
              title: 'cluster managment',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "pods" */ '../views/cluster/pods.vue')
        },
        {
          path: '/user',
          name: 'user',
          meta: {
              title: 'user',
              permiss: '12'
          },
          component: () => import (/* webpackChunkName: "user" */ '../views/user.vue')
      },
      ]
    }
    , 
    {
      path: "/login",
      name: "Login",
      meta: {
          title: 'login'
      },
      component: () => import ( /* webpackChunkName: "login" */ "../views/login.vue")
    }, 
    {
      path: '/403',
      name: '403',
      meta: {
          title: 'no right'
      },
      component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
    },
    
];


const router = createRouter({
    history: createWebHashHistory(),
    routes
});


export default router;