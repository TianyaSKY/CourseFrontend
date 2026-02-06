import { request } from './request.js'

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return request({
    url: '/api/users/current',
    method: 'GET'
  })
}

/**
 * 更新用户信息
 * @param {Object} data 
 */
export const updateCurrentUser = (data) => {
  return request({
    url: '/api/users/current',
    method: 'PUT',
    data: data
  })
}

/**
 * 按 ID 获取用户
 * @param {number} id 
 */
export const getUserById = (id) => {
  return request({
    url: `/api/users/${id}`,
    method: 'GET'
  })
}
