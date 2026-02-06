import { request } from './request.js'

/**
 * 获取所有学校
 */
export const getAllSchools = () => {
  return request({
    url: '/api/schools',
    method: 'GET'
  })
}

/**
 * 按 ID 获取学校
 * @param {number} id 
 */
export const getSchoolById = (id) => {
  return request({
    url: `/api/schools/${id}`,
    method: 'GET'
  })
}
