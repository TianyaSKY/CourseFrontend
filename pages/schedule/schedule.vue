<template>
	<view class="page">
		<!-- 课表页独享工具栏 -->
		<schedule-header :timetable="currentTimetable" :current-view-date="currentViewDate" @import="handleImport" @share="handleHeaderShare" @more="openMoreOptionsModal"></schedule-header>

		<!-- 内容区域 -->
		<view class="content">
			<view class="view-container">
			<!-- 课表内容 -->
			<schedule-board 
				v-if="currentTimetable" 
				:timetable="currentTimetable" 
				:courses="courses"
				:schedules="schedules"
				:current-view-date="currentViewDate"
				@cell-tap="handleCellTap"
				@week-change="handleWeekChange"
			></schedule-board>
				<view v-else class="empty-state">
					<text class="placeholder-text">暂无课表或未设置默认课表，请点击上方“+”创建</text>
				</view>
			</view>
		</view>

		<!-- 公用底部菜单栏 -->
		<custom-tabbar currentTab="schedule"></custom-tabbar>

		<!-- Import Modal -->
		<view v-if="showImportModal" class="modal-overlay">
			<view class="modal">
				<!-- Step 1: Select Type -->
				<block v-if="importStep === 1">
					<text class="modal-title">选择导入方式</text>
					<view class="import-options">
						<view class="import-option-item" @tap="selectImportMode('share')">
							<view class="option-icon">
								<uni-icons type="link" size="24" color="#007aff"></uni-icons>
							</view>
							<view class="option-info">
								<text class="option-title">口令导入</text>
								<text class="option-desc">粘贴同学分享的课表口令</text>
							</view>
							<view class="option-arrow">
								<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
							</view>
						</view>
						
						<view class="import-option-item recommended" @tap="selectImportMode('text')">
							<view class="option-icon">
								<uni-icons type="font" size="24" color="#007aff"></uni-icons>
							</view>
							<view class="option-info">
								<text class="option-title">文本导入 (推荐)</text>
								<text class="option-desc">复制教务系统课表页面的文本内容</text>
							</view>
							<view class="option-arrow">
								<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
							</view>
						</view>
						
						<view class="import-option-item" @tap="selectImportMode('image')">
							<view class="option-icon">
								<uni-icons type="image" size="24" color="#007aff"></uni-icons>
							</view>
							<view class="option-info">
								<text class="option-title">图片导入</text>
								<text class="option-desc">上传课表截图，自动识别</text>
							</view>
							<view class="option-arrow">
								<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
							</view>
						</view>
						
						<view class="import-option-item" @tap="selectImportMode('json')">
							<view class="option-icon">
								<uni-icons type="upload" size="24" color="#007aff"></uni-icons>
							</view>
							<view class="option-info">
								<text class="option-title">JSON 导入</text>
								<text class="option-desc">使用 AI 助手解析后导入</text>
							</view>
							<view class="option-arrow">
								<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
							</view>
						</view>
					</view>
					
					<view class="modal-footer">
						<button class="modal-btn cancel" @tap="closeImportModal">取消</button>
					</view>
				</block>

				<!-- Step 2: Input Content -->
				<block v-else>
					<view class="modal-header-row">
						<view class="back-btn" @tap="importStep = 1">
							<uni-icons type="left" size="20" color="#1d2130"></uni-icons>
							<text>返回</text>
						</view>
						<text class="modal-title-small">{{ importMode === 'image' ? '图片导入' : (importMode === 'json' ? 'JSON 导入' : (importMode === 'share' ? '口令导入' : '文本导入')) }}</text>
						<view class="placeholder-icon"></view>
					</view>
					
					<input class="modal-input" v-model="importName" placeholder="课表名称 (可选)" />
					
					<view class="modal-row date-row">
						<text>开学日期：</text>
						<picker mode="date" :value="termStartDate" @change="bindDateChange">
							<view class="date-value">{{termStartDate || '点击选择'}}</view>
						</picker>
					</view>

					<block v-if="importMode === 'text'">
						<textarea 
							class="modal-textarea" 
							v-model="importContent" 
							placeholder="请长按全选并复制教务系统课表页面的所有文本内容，然后粘贴到这里。"
							maxlength="-1"
						></textarea>
					</block>
					
					<block v-if="importMode === 'share'">
						<view class="prompt-box">
							<text class="prompt-text">请粘贴同学分享的课表口令</text>
						</view>
						<textarea 
							class="modal-textarea" 
							v-model="importContent" 
							placeholder="在此粘贴口令..."
							maxlength="-1"
							style="height: 80px;"
						></textarea>
					</block>
					
					<block v-if="importMode === 'json'">
						<view class="prompt-box">
							<text class="prompt-text">请复制提示词发给 AI (ChatGPT/DeepSeek等)，并将 AI 返回的 JSON 代码粘贴到下方。</text>
							<button class="copy-btn" size="mini" @tap="copyAiPrompt">复制 AI 提示词</button>
						</view>
						<textarea 
							class="modal-textarea" 
							v-model="importContent" 
							placeholder="在此粘贴 JSON 内容..."
							maxlength="-1"
						></textarea>
					</block>

					<block v-if="importMode === 'image'">
						<view class="image-upload-area" @tap="handleChooseImage">
							<image v-if="tempFilePath" :src="tempFilePath" mode="aspectFit" class="preview-image"></image>
							<view v-else class="upload-placeholder">
								<uni-icons type="camera-filled" size="32" color="#8e92a3"></uni-icons>
								<text class="upload-text">点击选择图片</text>
							</view>
						</view>
					</block>

					<view class="modal-row checkbox-row" @tap="importAsDefault = !importAsDefault">
						<uni-icons :type="importAsDefault ? 'checkbox-filled' : 'circle'" size="20" color="#007aff"></uni-icons>
						<text>设为默认课表</text>
					</view>
					<view class="modal-footer">
						<button class="modal-btn cancel" @tap="closeImportModal">取消</button>
						<button class="modal-btn confirm" @tap="submitImport">导入</button>
					</view>
				</block>
			</view>
		</view>

		<!-- Share Output Modal -->
		<view v-if="showShareOutputModal" class="modal-overlay">
			<view class="modal">
				<text class="modal-title">分享课表</text>
				<view class="share-content">
					<text class="share-tip">将下方的口令复制给同学，他们在“导入课表”中粘贴即可获取你的课表。（仅限同校同学）</text>
					<view class="token-box">
						<text class="token-text">{{ shareToken }}</text>
						<view class="copy-icon" @tap="copyToken">
							<uni-icons type="paperclip" size="18" color="#007aff"></uni-icons>
						</view>
					</view>
					<text v-if="expirationTime" class="expire-tip">有效期至：{{ expirationTime }}</text>
				</view>
				<view class="modal-footer">
					<button class="modal-btn confirm" @tap="closeShareOutputModal">关闭</button>
				</view>
			</view>
		</view>

		<!-- More Options Modal -->
		<view v-if="showMoreOptionsModal" class="modal-overlay" @tap="closeMoreOptionsModal">
			<view class="modal more-modal" @tap.stop>
				<text class="modal-title">跳转周次</text>
				<view class="more-options">
					<text class="week-value">第 {{ jumpWeek }} 周</text>
					<slider
						class="week-slider"
						:min="1"
						:max="maxWeek"
						:step="1"
						:value="jumpWeek"
						:show-value="false"
						activeColor="#007aff"
						backgroundColor="#d7e4f8"
						block-color="#007aff"
						@change="onJumpWeekChange"
					/>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel" @tap="closeMoreOptionsModal">取消</button>
					<button class="modal-btn confirm" @tap="confirmJumpWeek">跳转</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { getDefaultTimetable, importTimetableImages, importTimetableJson, importTimetableText, acceptShare, shareTimetable } from '@/functions/timetable.js'
	import { getDefaultTimetableCourses } from '@/functions/timetable-course.js'
	import { getCurrentUser } from '@/functions/user.js'
	import { getUserScheduleByWeek } from '@/functions/schedule.js'

	const currentTimetable = ref(null)
	const courses = ref([])
	const schedules = ref([])
	const currentUser = ref(null)

	// Import related
	const showImportModal = ref(false)
	const importStep = ref(1) // 1: Select Type, 2: Input Content
	const importMode = ref('image') // 'image' | 'text' | 'json'
	const importContent = ref('') // Text or JSON content
	const importName = ref('')
	const importAsDefault = ref(false)
	const tempFilePath = ref('')
	const termStartDate = ref('')
	const currentWeekMonday = ref('')
	
	// Pass this to header to display the correct week relative to view
	const currentViewDate = computed(() => {
		return currentWeekMonday.value || new Date().toISOString().split('T')[0]
	})
	
	// Share related (Output)
	const showShareOutputModal = ref(false)
	const shareToken = ref('')
	const expirationTime = ref('')
	const showMoreOptionsModal = ref(false)
	const jumpWeek = ref(1)

	const maxWeek = computed(() => {
		const totalWeeks = Number(currentTimetable.value?.totalWeeks)
		if (totalWeeks > 0) return totalWeeks
		return 30
	})

	const getWeekMonday = (dateInput) => {
		const base = dateInput ? new Date(dateInput) : new Date()
		if (isNaN(base.getTime())) return new Date()
		const day = base.getDay()
		const diffToMonday = day === 0 ? 6 : day - 1
		const monday = new Date(base)
		monday.setDate(base.getDate() - diffToMonday)
		monday.setHours(0, 0, 0, 0)
		return monday
	}

	const formatDate = (date) => {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const currentWeekValue = computed(() => {
		if (!currentTimetable.value?.termStartDate) return 1
		const termMonday = getWeekMonday(currentTimetable.value.termStartDate)
		const viewMonday = getWeekMonday(currentViewDate.value)
		const diffTime = viewMonday.getTime() - termMonday.getTime()
		const week = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1
		if (week < 1) return 1
		if (week > maxWeek.value) return maxWeek.value
		return week
	})
	
	const AI_PROMPT = `你是一个智能课表解析助手。请仔细分析提供的课表图片（或文本），提取课程信息。
**只输出 JSON，不要任何 Markdown 标记或额外文字**。

【严格提取规则】
1. courseCode: 优先提取课程代码/选课号。如果图片中没有明确代码，可根据"课程名-老师"生成唯一指纹或留空。
2. credits: 学分，必须为数字。
3. dayOfWeek: 1-7 (周一至周日)。请根据表格列头位置判断。
4. startPeriod/endPeriod: 节次 (如 1-2节)。
5. weeks: 周次描述 (如 "1-16周", "单周")，原样保留。
6. locationName: 教室名称。
7. student/term: 尝试从表头提取学生姓名、学号、学年(如 2025-2026)、学期(1或2)。

【JSON 结构要求】
{
  "student": {"name": "张三", "studentId": "2023001"},
  "term": {"yearStart": 2025, "yearEnd": 2026, "term": 1},
  "items": [
    {
      "courseName": "高等数学",
      "teacherName": "王老师",
      "credits": 4.0,
      "locationName": "一教101",
      "sessions": [
        {"dayOfWeek": 1, "startPeriod": 1, "endPeriod": 2, "weeks": "1-16周"}
      ]
    }
  ]
}`

	onShow(() => {
		const token = uni.getStorageSync('token')
		if (!token) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/mine/mine'
				})
			}, 1000)
			return
		}
		loadData()
	})

	const loadData = async () => {
		try {
			const timetable = await getDefaultTimetable()
			// Ensure it's an object, or null if empty string/undefined
			currentTimetable.value = (timetable && typeof timetable === 'object') ? timetable : null
			
			if (currentTimetable.value) {
				const [courseList, user] = await Promise.all([
					getDefaultTimetableCourses(),
					getCurrentUser()
				])
				courses.value = courseList
				currentUser.value = user
				
				if (user && user.id) {
					await loadSchedulesByWeek()
				}
			}
		} catch (e) {
			console.error('加载数据失败', e)
			currentTimetable.value = null
		}
	}

	const loadSchedulesByWeek = async (date) => {
		// 仍然检查登录状态，但API不再需要ID
		if (!currentUser.value?.id) return
		
		try {
			// 优先使用传入日期，其次使用当前记录的周一日期，最后使用当天
			const targetDate = date || currentWeekMonday.value || new Date().toISOString().split('T')[0]
			const scheduleData = await getUserScheduleByWeek(targetDate)
			
			// API 返回的是 Map<LocalDate, List<Schedule>> 格式，需要处理成平铺数组
			const flattenedSchedules = []
			if (scheduleData) {
				Object.keys(scheduleData).forEach(date => {
					const dateSchedules = scheduleData[date]
					if (Array.isArray(dateSchedules)) {
						flattenedSchedules.push(...dateSchedules)
					}
				})
			}
			schedules.value = flattenedSchedules
		} catch (e) {
			console.error('加载周课表失败', e)
		}
	}

	const handleCellTap = ({ dayOfWeek, period, existing, scheduleDate }) => {
		if (existing) {
			uni.navigateTo({
				url: `/pages/schedule/schedule-edit?id=${existing.id}&timetableId=${currentTimetable.value.id}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/schedule/schedule-edit?dayOfWeek=${dayOfWeek}&period=${period}&timetableId=${currentTimetable.value.id}&scheduleDate=${scheduleDate}`
			})
		}
	}

	const handleWeekChange = ({ mondayDate }) => {
		currentWeekMonday.value = mondayDate
		loadSchedulesByWeek(mondayDate)
	}

	const handleImport = () => {
		importStep.value = 1
		showImportModal.value = true
		importAsDefault.value = false
		termStartDate.value = new Date().toISOString().split('T')[0]
	}
	
	const selectImportMode = (mode) => {
		importMode.value = mode
		importContent.value = ''
		tempFilePath.value = ''
		
		if (mode === 'text') {
			importName.value = '文本导入课表'
		} else if (mode === 'json') {
			importName.value = 'JSON导入课表'
		} else if (mode === 'share') {
			importName.value = '' // 留空以使用默认命名（原名+已复制）
		} else {
			importName.value = '导入课表'
		}
		
		importStep.value = 2
	}
	
	const handleChooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				const file = res.tempFiles[0]
				tempFilePath.value = file.path
			}
		})
	}
	
	const copyAiPrompt = () => {
		uni.setClipboardData({
			data: AI_PROMPT,
			success: () => {
				uni.showToast({
					title: '提示词已复制',
					icon: 'success'
				})
			}
		})
	}

	const openImportModal = (mode, file = null) => {
		// Legacy support if needed, but mainly replaced by handleImport
		importMode.value = mode
		importAsDefault.value = false
		termStartDate.value = new Date().toISOString().split('T')[0]
		// ...
	}

	const bindDateChange = (e) => {
		termStartDate.value = e.detail.value
	}

	const closeImportModal = () => {
		showImportModal.value = false
		tempFilePath.value = ''
		importName.value = ''
	}

	const submitImport = async () => {
		if (importMode.value === 'image' && !tempFilePath.value) return
		if ((importMode.value === 'text' || importMode.value === 'json') && !importContent.value) {
			uni.showToast({ title: '请输入内容', icon: 'none' })
			return
		}
		
		if (!termStartDate.value) {
			uni.showToast({ title: '请选择开学日期', icon: 'none' })
			return
		}

		uni.showLoading({ title: '上传中...' })
		try {
			let res;
			const params = {
				timetableName: importName.value,
				setAsDefault: importAsDefault.value,
				termStartDate: termStartDate.value
			}

			if (importMode.value === 'image') {
				res = await importTimetableImages(tempFilePath.value, params)
			} else if (importMode.value === 'text') {
				res = await importTimetableText(importContent.value, params)
			} else if (importMode.value === 'share') {
				const shareData = {
					token: importContent.value ? importContent.value.trim() : '',
					isDefault: importAsDefault.value
				}
				if (importName.value && importName.value.trim()) {
					shareData.name = importName.value.trim()
				}
				res = await acceptShare(shareData)
			} else if (importMode.value === 'json') {
				let jsonData;
				try {
					jsonData = JSON.parse(importContent.value)
				} catch (e) {
					uni.hideLoading()
					uni.showToast({ title: 'JSON 格式错误', icon: 'none' })
					return
				}
				res = await importTimetableJson(jsonData, params)
			}

			uni.hideLoading()
			
			if (res.success) {
				uni.showToast({ title: '导入成功' })
			} else if (res.importId) {
				uni.showToast({ 
					title: '已提交处理，请稍后刷新查看',
					icon: 'none',
					duration: 2500
				})
			} else if (res.message) {
				uni.showToast({ title: res.message, icon: 'none' })
			} else {
				// Default fallback
				uni.showToast({ title: '操作完成' })
			}
			
			closeImportModal()
			// 导入成功后刷新数据
			setTimeout(() => {
				loadData()
			}, 1000)
		} catch (e) {
			// Error handled in function or here
			console.error(e)
		}
	}

	const handleHeaderShare = async () => {
		if (!currentTimetable.value?.id) {
			uni.showToast({ title: '当前无课表可分享', icon: 'none' })
			return
		}
		
		uni.showLoading({ title: '生成口令...' })
		try {
			const res = await shareTimetable(currentTimetable.value.id)
			shareToken.value = res.token
			
			if (res.expiresAt) {
				try {
					let date
					if (Array.isArray(res.expiresAt)) {
						const [y, m, d, h, min] = res.expiresAt
						date = new Date(y, m - 1, d, h, min)
					} else {
						date = new Date(res.expiresAt)
					}
					
					if (!isNaN(date.getTime())) {
						const year = date.getFullYear()
						const month = String(date.getMonth() + 1).padStart(2, '0')
						const day = String(date.getDate()).padStart(2, '0')
						const hour = String(date.getHours()).padStart(2, '0')
						const minute = String(date.getMinutes()).padStart(2, '0')
						expirationTime.value = `${year}-${month}-${day} ${hour}:${minute}`
					} else {
						expirationTime.value = ''
					}
				} catch (err) {
					console.error('Date parse error:', err)
					expirationTime.value = ''
				}
			} else {
				expirationTime.value = ''
			}
			
			showShareOutputModal.value = true
			uni.hideLoading()
		} catch (e) {
			uni.hideLoading()
			console.error(e)
			if (!e.message) {
				uni.showToast({ title: '分享失败', icon: 'none' })
			}
		}
	}
	
	const copyToken = () => {
		uni.setClipboardData({
			data: shareToken.value,
			success: () => {
				uni.showToast({ title: '口令已复制', icon: 'success' })
			}
		})
	}
	
	const closeShareOutputModal = () => {
		showShareOutputModal.value = false
		shareToken.value = ''
		expirationTime.value = ''
	}

	const openMoreOptionsModal = () => {
		jumpWeek.value = currentWeekValue.value
		showMoreOptionsModal.value = true
	}

	const closeMoreOptionsModal = () => {
		showMoreOptionsModal.value = false
	}

	const onJumpWeekChange = (e) => {
		jumpWeek.value = Number(e.detail.value) || 1
	}

	const confirmJumpWeek = () => {
		if (!currentTimetable.value?.termStartDate) {
			uni.showToast({ title: '请先设置课表学期', icon: 'none' })
			return
		}

		const week = Math.min(Math.max(jumpWeek.value, 1), maxWeek.value)
		const termMonday = getWeekMonday(currentTimetable.value.termStartDate)
		const targetMonday = new Date(termMonday)
		targetMonday.setDate(termMonday.getDate() + (week - 1) * 7)
		const mondayDate = formatDate(targetMonday)
		currentWeekMonday.value = mondayDate
		loadSchedulesByWeek(mondayDate)
		closeMoreOptionsModal()
	}
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #dae4f5;
	}

	.content {
		flex: 1;
		padding-bottom: 80px;
		overflow: hidden;
		min-height: 0;
	}
	
	.view-container {
		padding: 0;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	.empty-state {
		padding-top: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.placeholder-text {
		color: #8e92a3;
		font-size: 16px;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.modal {
		background-color: #fff;
		border-radius: 16px;
		padding: 24px;
		width: 300px;
	}

	.modal-title {
		font-size: 18px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 20px;
		display: block;
	}

	.modal-input {
		background-color: #f5f7fa;
		height: 44px;
		border-radius: 8px;
		padding: 0 12px;
		margin-bottom: 16px;
		font-size: 14px;
	}

	.modal-textarea {
		background-color: #f5f7fa;
		width: 100%;
		height: 120px;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 16px;
		font-size: 14px;
		box-sizing: border-box;
	}

	.image-preview {
		background-color: #f5f7fa;
		height: 44px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
	}
	
	.preview-text {
		color: #8e92a3;
		font-size: 14px;
	}
	
	/* Import Options */
	.import-options {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}
	
	.import-option-item {
		display: flex;
		align-items: center;
		padding: 16px;
		background-color: #f5f7fa;
		border-radius: 12px;
		border: 1px solid transparent;
		transition: all 0.2s;
	}
	
	.import-option-item:active {
		background-color: #eef2f7;
	}
	
	.import-option-item.recommended {
		background-color: #f0f7ff;
		border-color: #cce5ff;
	}
	
	.option-icon {
		width: 40px;
		height: 40px;
		background-color: #fff;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	
	.option-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.option-title {
		font-size: 16px;
		font-weight: 600;
		color: #1d2130;
		margin-bottom: 4px;
	}
	
	.option-desc {
		font-size: 12px;
		color: #8e92a3;
	}
	
	.modal-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	
	.back-btn {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #1d2130;
		padding: 4px 8px 4px 0;
	}
	
	.modal-title-small {
		font-size: 16px;
		font-weight: 600;
	}
	
	.placeholder-icon {
		width: 40px;
	}
	
	.prompt-box {
		background-color: #f0f7ff;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.prompt-text {
		font-size: 12px;
		color: #007aff;
		line-height: 1.4;
	}
	
	.copy-btn {
		width: 100%;
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 12px;
	}
	
	.image-upload-area {
		width: 100%;
		height: 160px;
		background-color: #f5f7fa;
		border-radius: 8px;
		border: 1px dashed #dcdfe6;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
		overflow: hidden;
	}
	
	.preview-image {
		width: 100%;
		height: 100%;
	}
	
	.upload-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	
	.upload-text {
		font-size: 14px;
		color: #8e92a3;
	}

	.date-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #f5f7fa;
		height: 44px;
		border-radius: 8px;
		padding: 0 12px;
		margin-bottom: 16px;
		font-size: 14px;
		color: #1d2130;
	}

	.date-value {
		color: #007aff;
	}

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		color: #1d2130;
	}

	.modal-footer {
		display: flex;
		gap: 12px;
		margin-top: 10px;
	}

	.modal-btn {
		flex: 1;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		border-radius: 8px;
	}

	.modal-btn.cancel {
		background-color: #f5f7fa;
		color: #8e92a3;
	}

	.modal-btn.confirm {
		background-color: #007aff;
		color: #fff;
	}
	
	/* Share Modal Styles */
	.share-content {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 20px;
	}
	
	.share-tip {
		font-size: 14px;
		color: #8e92a3;
		line-height: 1.5;
	}
	
	.token-box {
		background-color: #f0f7ff;
		border: 1px dashed #007aff;
		border-radius: 8px;
		padding: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.token-text {
		font-size: 16px;
		font-weight: 600;
		color: #1d2130;
		word-break: break-all;
		flex: 1;
		margin-right: 10px;
	}
	
	.copy-icon {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border-radius: 15px;
	}
	
	.expire-tip {
		font-size: 12px;
		color: #ff9800;
		text-align: center;
	}

	.more-modal {
		width: 280px;
	}

	.more-options {
		display: flex;
		flex-direction: column;
		margin-bottom: 14px;
		gap: 10px;
	}

	.week-value {
		font-size: 16px;
		font-weight: 600;
		color: #1d2130;
		text-align: center;
	}

	.week-slider {
		width: 100%;
	}

</style>
