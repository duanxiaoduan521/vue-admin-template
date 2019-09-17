// import { asyncRoutes, constantRoutes } from '@/router'
import { constantRoutes } from '@/router'
import { validatenull } from '@/utils/validate'
// for get menus from server
// import { getMenuByRole } from '@/api/menu'
import { getRecuData } from '@/api/common'
import Layout from '@/layout'

function buildRouter(aMenu) {
  const aRouter = []

  aMenu.forEach(item => {
    if (!validatenull(item.component)) {
      const oRouter = {
        meta: { 'title': '', 'icon': '' },
        children: []
      }

      if (item.component !== 'Iframe') {
        if (item.component === 'Layout') {
          oRouter.component = Layout
        } else {
          oRouter.component = require('@/views/' + item.component + '.vue').default
        }

        oRouter.name = item.path
        oRouter.id = item.id || null
        if (item.redirect !== '') {
          oRouter.redirect = item.redirect || null
          oRouter.path = '/' + item.path
        } else {
          oRouter.path = item.path
        }
        oRouter.meta.icon = item.icon
        oRouter.meta.title = item.title
        // oRouter.meta.noCache = item.noCache || false
        oRouter.meta.noCache = false
        // oRouter.meta.breadcrumb = item.breadcrumb || true
        oRouter.children = validatenull(item.children) ? [] : buildRouter(item.children)

        aRouter.push(oRouter)
      }
    }
  })

  return aRouter
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  data1: { name: 'getmenu',
    idname: 'id',
    parammaps: { id: -1 }
  }
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRecuData(state.data1).then(response => {
        const menus = response.data
        if (menus.length === 0) {
          reject('menus data is null')
        }

        const accessedRoutes = buildRouter(menus)
        // final add 404
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        // commit to stores
        commit('SET_ROUTES', accessedRoutes)
        // return for add to router
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
