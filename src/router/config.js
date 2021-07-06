import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/workplace'),
            },
            {
              path: 'analysis',
              name: '分析页',
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },
        {
          path: 'articles',
          name: '新闻稿管理',
          meta: {
            icon: 'read'
          },
          component: PageView,
          children: [
            {
              path: 'select',
              name: '新闻稿查询',
              component: ()=> import('@/pages/articles/ArticleSelect')
            },
            {
              path: 'new',
              name: '新闻稿上传',
              component: ()=> import('@/pages/articles/ArticleNew'),
              meta: {
                page: {
                  cacheAble: false
                }
              }
            },
          ]
        },
        {
          path: 'departments',
          name: '部门管理',
          meta: {
            icon: 'deployment-unit'
          },
          component: PageView,
          children: [
            {
              path: "select",
              name: '部门查询',
              component: ()=> import('@/pages/department/DepartmentSelect')
            },
            {
              path: "new",
              name: '新增部门',
              component: ()=> import('@/pages/department/DepartmentNew')
            }
          ]
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            icon: 'user'
          },
          component: PageView,
          children: [
            {
              path: 'select',
              name: '用户查询',
              component: ()=> import('@/pages/user/UserSelect')
            },
            {
              path: 'approval',
              name: '用户申请审批',
              component: ()=> import('@/pages/user/UserApproval')
            }
          ]
        },
        {
          path: 'logs',
          name: '日志管理',
          meta: {
            icon: 'database'
          },
          component: PageView,
          children: [
            {
              path: "",
              name:'日志管理',
              meta: {
                invisible: true
              },
              component:()=>import('@/pages/logs/LogSelect')
            }
          ]
        },
        {
          path: 'attachments',
          name: '附件',
          meta: {
            icon: 'file',
          },
          component: PageView,
          children: [
            {
              path:"",
              name: '附件管理',
              meta:{
                invisible: true
              },
              component:() =>import('@/pages/attachments/AttachmentManagement')
            }
          ]
        },
        {
          path: 'image',
          name: '图片管理',
          meta: {
            icon: 'file-image',
          },
          component: PageView,
          children: [
            {
              path:"imageIndex",
              name: '首页图片管理',
              component:() =>import('@/pages/image/IndexImageManagement')
            },{
              path:"imageWall",
              name: '照片墙管理',
              component:() =>import('@/pages/image/ImageWallManagement')
            }
          ]
        }
      ]
    },
  ]
}

export default options
