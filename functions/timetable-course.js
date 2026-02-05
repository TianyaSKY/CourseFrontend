import { request } from './request.js'

/**
 * 获取课表中的所有课程
 * @param {number} timetableId 
 */
export const getCourses = (timetableId) => {
  return request({
    url: `/api/timetables/${timetableId}/courses`,
    method: 'GET'
  })
}

/**
 * 批量添加课程到课表
 * @param {number} timetableId 
 * @param {Object} data 
 * @param {number[]} data.courseIds
 */
export const addCourses = (timetableId, data) => {
  return request({
    url: `/api/timetables/${timetableId}/courses`,
    method: 'POST',
    data: data
  })
}

/**
 * 清空课表的所有课程
 * @param {number} timetableId 
 */
export const clearCourses = (timetableId) => {
  return request({
    url: `/api/timetables/${timetableId}/courses`,
    method: 'DELETE'
  })
}

/**
 * 添加单个课程到课表
 * @param {number} timetableId 
 * @param {number} courseId 
 */
export const addCourse = (timetableId, courseId) => {
  return request({
    url: `/api/timetables/${timetableId}/courses/${courseId}`,
    method: 'POST'
  })
}

/**
 * 从课表中移除课程
 * @param {number} timetableId 
 * @param {number} courseId 
 */
export const removeCourse = (timetableId, courseId) => {
  return request({
    url: `/api/timetables/${timetableId}/courses/${courseId}`,
    method: 'DELETE'
  })
}

/**
 * 检查课程是否在课表中
 * @param {number} timetableId 
 * @param {number} courseId 
 */
export const isCourseInTimetable = (timetableId, courseId) => {
  return request({
    url: `/api/timetables/${timetableId}/courses/${courseId}/exists`,
    method: 'GET'
  })
}

/**
 * 获取默认课表的所有课程
 */
export const getDefaultTimetableCourses = () => {
  return request({
    url: '/api/timetables/default/courses',
    method: 'GET'
  })
}
