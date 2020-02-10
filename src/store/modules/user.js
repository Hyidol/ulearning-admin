// import { login, logout, getInfo } from '@/api/user'
import {
  login,
  getInfo,
  logout,
  getPermission,
  updateInfo,
  uploadAvatar,
  getRole
} from '@/api/auth'
import { removeRefreshToken, removeToken } from '@/utils/auth'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    userInfo: '',
    permisssion: '',
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  getRole({ commit }) {
    return new Promise((resolve, reject) => {
      getRole()
        .then(response => {
          const role = response.data[0]
          commit('SET_ROLE', role)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(response => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getPermission({ commit }) {
    return new Promise((resolve, reject) => {
      getPermission()
        .then(response => {
          const { data } = response
          commit('SET_PERMISSION', data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response
          commit('SET_USER_INFO', data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setInfo({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      // 更新用户信息
      updateInfo(data)
        .then(response => {
          console.log('update', response)
          // 成功，重新获取用户信息
          dispatch('getInfo')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // 移除token
      removeToken()
      removeRefreshToken()
      commit('RESET_STATE') // 重置状态
      resolve()
    })
  },

  // 上传头像
  uploadAvatar({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      // 1. 上传头像
      uploadAvatar(data)
        .then(response => {
          dispatch('getInfo')
          resolve()
        })
        .catch(error => {
          reject(error)
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

