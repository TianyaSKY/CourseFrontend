import { request } from './request.js'

/**
 * 用户登录
 * @param {string} username 
 * @param {string} password 
 */
export const login = (username, password) => {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data: { username, password }
  })
}

/**
 * 用户注册
 * @param {Object} data 注册信息 { username, password, studentId, schoolId, ... }
 */
export const register = (data) => {
  return request({
    url: '/api/auth/register',
    method: 'POST',
    data: data
  })
}
