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
