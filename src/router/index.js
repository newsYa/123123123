import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意：子菜单仅在路由子级时显示。长度 >= 1
 * 详情请参阅： https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * 隐藏：如果设置为 true，则项目将不会显示在侧边栏中（默认为 false）
 * 始终显示：如果设置为 true，则始终显示根菜单
 * 如果未设置 alwaysShow，当项目有多个子路由时，
 *它将变成嵌套模式，否则不显示根菜单
 * 重定向：noRedirect 如果设置为 noRedirect，则不会在痕迹导航中重定向
 * 名称：“路由器名称”名称由 <keep-alive> （必须设置!!!）
 * 元 ： {
    角色：['admin'，'editor'] 控制页面角色（您可以设置多个角色）
    title：“title”名称显示在侧边栏和痕迹导航中（推荐集）
    图标：“svg-name”/“el-icon-x”图标显示在侧边栏中
痕迹导航：如果设置为 false，则项目将隐藏在痕迹导航中（默认为 true）
    activeMenu：“/example/list”如果设置了路径，则边栏将突出显示您设置的路径
  }
 */

/**
 * 常量路由
 * 没有权限要求的基本页面
 * 所有角色均可访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '表格', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/uploads',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Uploads',
        component: () => import('@/views/uploads/index'),
        meta: { title: '文件上传', icon: 'el-icon-folder-checked' }
      }
    ]
  },
  {
    path: '/wangeditor',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Wangeditor',
        component: () => import('@/views/wangeditor/index'),
        meta: { title: '富文本', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/codemirror',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Codemirror',
        component: () => import('@/views/codemirror/index'),
        meta: { title: '编辑器', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/gojs',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Gojs',
        component: () => import('@/views/gojs/index'),
        meta: { title: 'gojs', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/md',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Md',
        component: () => import('@/views/md/index'),
        meta: { title: 'md', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/audio',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Audio',
        component: () => import('@/views/audio/index'),
        meta: { title: 'audio', icon: 'el-icon-document' }
      }
    ]
  },  {
    path: '/viewer',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Audio',
        component: () => import('@/views/viewer/index'),
        meta: { title: 'viewer', icon: 'el-icon-document' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
