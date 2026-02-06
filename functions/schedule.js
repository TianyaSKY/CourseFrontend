import { request } from './request.js'

/**
 * 创建排课
 * @param {Object} data 
 * @param {number} schoolId 
 */
export const createSchedule = (data, schoolId) => {
  return request({
    url: `/api/schedules${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'POST',
    data: data
  })
}

/**
 * 按 ID 获取排课
 * @param {number} id 
 * @param {number} schoolId 
 */
export const getScheduleById = (id, schoolId) => {
  return request({
    url: `/api/schedules/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'GET'
  })
}

/**
 * 更新排课
 * @param {number} id 
 * @param {Object} data 
 * @param {number} schoolId 
 */
export const updateSchedule = (id, data, schoolId) => {
  return request({
    url: `/api/schedules/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'PUT',
    data: data
  })
}

/**
 * 删除排课
 * @param {number} id 
 * @param {number} schoolId 
 */
export const deleteSchedule = (id, schoolId) => {
  return request({
    url: `/api/schedules/${id}${schoolId ? '?schoolId=' + schoolId : ''}`,
    method: 'DELETE'
  })
}

/**
 * 获取用户默认课表指定周的课程
 * @param {string} date - 格式 YYYY-MM-DD，该日期所在的周
 * @returns {Promise<Object>} Map<LocalDate, List<Schedule>>
 */
export const getUserScheduleByWeek = (date) => {
  return request({
    url: `/api/schedules/user/default/week/${date}`,
    method: 'GET'
  })
}

/**
 * 按日期获取用户排课
 * @param {number} userId 
 * @param {string} date 
 */
export const getUserScheduleByDate = (userId, date) => {
  return request({
    url: `/api/schedules/user/${userId}/date/${date}`,
    method: 'GET'
  })
}

/**
 * 获取用户完整排课
 * @param {number} userId 
 */
export const getUserScheduleFull = (userId) => {
  return request({
    url: `/api/schedules/user/${userId}/full`,
    method: 'GET'
  })
}

/**
 * 按周几获取用户排课
 * @param {number} userId 
 * @param {number} dayOfWeek (1-7)
 */
export const getUserScheduleByDay = (userId, dayOfWeek) => {
  return request({
    url: `/api/schedules/user/${userId}/day/${dayOfWeek}`,
    method: 'GET'
  })
}

/**
 * 按日期获取排课 (通用)
 * @param {string} date 
 */
export const getSchedulesByDate = (date) => {
  return request({
    url: `/api/schedules/date/${date}`,
    method: 'GET'
  })
}

/**
 * 获取指定课程的所有排课
 * @param {number} courseId 
 */
export const getSchedulesByCourse = (courseId) => {
  return request({
    url: `/api/schedules/course/${courseId}`,
    method: 'GET'
  })
}
