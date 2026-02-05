import { request } from './request.js'
import { BASE_URL } from '@/config.js'

/**
 * 导入课表 (上传图片)
 * @param {string} filePath 文件路径
 * @param {Object} params 额外参数 { timetableName, setAsDefault, termStartDate }
 * @returns {Promise<{importId: string, status: string}>}
 */
export const importTimetableImages = (filePath, params = {}) => {
  const token = uni.getStorageSync('token')
  
  // 构建查询参数
  let url = '/api/timetables/import/images'
  const queryParts = []
  if (params.timetableName) queryParts.push(`timetableName=${encodeURIComponent(params.timetableName)}`)
  if (params.setAsDefault !== undefined) queryParts.push(`setAsDefault=${params.setAsDefault}`)
  if (params.termStartDate) queryParts.push(`termStartDate=${params.termStartDate}`)
  
  if (queryParts.length > 0) {
    url += '?' + queryParts.join('&')
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + url,
      filePath: filePath,
      name: 'images',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (uploadFileRes) => {
        if (uploadFileRes.statusCode >= 200 && uploadFileRes.statusCode < 300) {
          try {
            const data = JSON.parse(uploadFileRes.data)
            resolve(data)
          } catch (e) {
            resolve(uploadFileRes.data)
          }
        } else {
          try {
             const errorData = JSON.parse(uploadFileRes.data)
             uni.showToast({
               title: errorData.message || '上传失败',
               icon: 'none'
             })
             reject(errorData)
          } catch (e) {
             uni.showToast({ title: '上传失败', icon: 'none' })
             reject(uploadFileRes)
          }
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 导入 JSON 课表
 * @param {Object} jsonData 提取的课表JSON对象
 * @param {Object} params 额外参数 { timetableName, setAsDefault, termStartDate }
 */
export const importTimetableJson = (jsonData, params = {}) => {
  const queryParts = []
  if (params.timetableName) queryParts.push(`timetableName=${encodeURIComponent(params.timetableName)}`)
  if (params.setAsDefault !== undefined) queryParts.push(`setAsDefault=${params.setAsDefault}`)
  if (params.termStartDate) queryParts.push(`termStartDate=${params.termStartDate}`)
  
  const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : ''
  
  return request({
    url: `/api/timetables/import/json${queryString}`,
    method: 'POST',
    data: jsonData
  })
}

/**
 * 导入文本课表
 * @param {string} textContent 原始文本
 * @param {Object} params 额外参数 { timetableName, setAsDefault, termStartDate }
 */
export const importTimetableText = (textContent, params = {}) => {
  const queryParts = []
  if (params.timetableName) queryParts.push(`timetableName=${encodeURIComponent(params.timetableName)}`)
  if (params.setAsDefault !== undefined) queryParts.push(`setAsDefault=${params.setAsDefault}`)
  if (params.termStartDate) queryParts.push(`termStartDate=${params.termStartDate}`)
  
  const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : ''
  
  return request({
    url: `/api/timetables/import/text${queryString}`,
    method: 'POST',
    data: textContent,
    header: {
      'content-type': 'text/plain'
    }
  })
}

/**
 * 根据 ID 获取课表
 * @param {number} id 
 */
export const getTimetableById = (id) => {
  return request({
    url: `/api/timetables/${id}`,
    method: 'GET'
  })
}

/**
 * 更新课表
 * @param {number} id 
 * @param {Object} data 
 */
export const updateTimetable = (id, data) => {
  return request({
    url: `/api/timetables/${id}`,
    method: 'PUT',
    data: data
  })
}

/**
 * 删除课表
 * @param {number} id 
 */
export const deleteTimetable = (id) => {
  return request({
    url: `/api/timetables/${id}`,
    method: 'DELETE'
  })
}

/**
 * 设置为默认课表
 * @param {number} id 
 */
export const setDefaultTimetable = (id) => {
  return request({
    url: `/api/timetables/${id}/set-default`,
    method: 'PUT'
  })
}

/**
 * 获取当前用户的所有课表
 */
export const getTimetables = () => {
  return request({
    url: '/api/timetables',
    method: 'GET'
  })
}

/**
 * 创建新课表
 * @param {Object} data 
 */
export const createTimetable = (data) => {
  return request({
    url: '/api/timetables',
    method: 'POST',
    data: data
  })
}

/**
 * 创建课表分享链接 (获取Token)
 * @param {number} timetableId 
 * @returns {Promise<{token: string, expiresAt: string}>}
 */
export const shareTimetable = (timetableId) => {
  return request({
    url: `/api/timetables/share/${timetableId}`,
    method: 'POST'
  })
}

/**
 * 接受分享 (复制课表)
 * @param {Object} data { token, name, isDefault }
 */
export const acceptShare = (data) => {
  return request({
    url: '/api/timetables/share/accept',
    method: 'POST',
    data: data
  })
}

/**
 * 获取当前用户的默认课表
 */
export const getDefaultTimetable = () => {
  return request({
    url: '/api/timetables/default',
    method: 'GET'
  })
}

/**
 * 根据学年学期查询课表
 * @param {Object} params 
 * @param {number} params.academicYearStart
 * @param {number} params.academicYearEnd
 * @param {number} params.term
 */
export const getTimetablesByTerm = (params) => {
  const query = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return request({
    url: `/api/timetables/by-term?${query}`,
    method: 'GET'
  })
}
