import { request } from './request.js'

/**
 * 获取全部课程
 * @param {number} schoolId 
 */
export const getAllCourses = (schoolId) => {
  return request({
    url: `/api/courses${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'GET'
  })
}

/**
 * 按 ID 获取课程
 * @param {number} id 
 * @param {number} schoolId 
 */
export const getCourseById = (id, schoolId) => {
  return request({
    url: `/api/courses/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'GET'
  })
}

/**
 * 按用户所属学校获取课程
 * @param {number} userId 
 */
export const getCoursesByUser = (userId) => {
  return request({
    url: `/api/courses/user/${userId}`,
    method: 'GET'
  })
}

/**
 * 创建课程
 * @param {Object} data 
 * @param {number} schoolId 
 */
export const createCourse = (data, schoolId) => {
  return request({
    url: `/api/courses${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'POST',
    data: data
  })
}

/**
 * 更新课程
 * @param {number} id 
 * @param {Object} data 
 * @param {number} schoolId 
 */
export const updateCourse = (id, data, schoolId) => {
  return request({
    url: `/api/courses/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'PUT',
    data: data
  })
}

/**
 * 删除课程
 * @param {number} id 
 * @param {number} schoolId 
 */
export const deleteCourse = (id, schoolId) => {
  return request({
    url: `/api/courses/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'DELETE'
  })
}
