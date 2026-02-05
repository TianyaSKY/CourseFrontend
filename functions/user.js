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
