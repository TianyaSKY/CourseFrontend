import { request } from './request.js'

/**
 * 获取所有教学楼
 */
export const getAllBuildings = () => {
  return request({
    url: '/api/buildings',
    method: 'GET'
  })
}

/**
 * 按 ID 获取教学楼
 * @param {number} id 
 */
export const getBuildingById = (id) => {
  return request({
    url: `/api/buildings/${id}`,
    method: 'GET'
  })
}

/**
 * 获取用户所属学校的教学楼
 * @param {number} userId 
 */
export const getBuildingsByUser = (userId) => {
  return request({
    url: `/api/buildings/user/${userId}`,
    method: 'GET'
  })
}
