<template>
	<view class="schedule-board">
		<view class="board-header">
			<view class="header-left">
				<!-- 标题区域 -->
				<text class="board-title">{{ boardTitle }}</text>
			</view>
			<view class="header-right">
				<view class="nav-btn" @tap="changeWeek(-1)">
					<uni-icons type="left" size="18" color="#1d2130"></uni-icons>
				</view>
				<view class="nav-btn" @tap="changeWeek(1)">
					<uni-icons type="right" size="18" color="#1d2130"></uni-icons>
				</view>
			</view>
		</view>

		<view class="week-item-container">
			<view class="week-row">
				<view class="week-label">
					<text class="month">{{ currentMonth }}</text>
					<text class="month-unit">月</text>
				</view>
				<view class="week-days">
					<view class="day" v-for="(day, index) in days" :key="index" :class="{ 'is-today': weekDates[index].isToday }">
						<text class="day-name">{{ day }}</text>
						<text class="day-num">{{ weekDates[index].date }}</text>
					</view>
				</view>
			</view>

			<scroll-view class="schedule-area" scroll-y>
				<view class="schedule-grid">
					<!-- 1. 时间轴列 -->
					<view v-for="p in periodList" :key="'time-'+p.index" 
						  class="time-label" 
						  :style="{ gridRow: p.index, gridColumn: 1 }">
						<text class="period-index">{{p.index}}</text>
						<text class="period-time">{{p.start}}</text>
						<text class="period-time">{{p.end}}</text>
					</view>
					
					<!-- 2. 空白网格 (背景 & 点击热区) -->
					<template v-for="period in 14">
						<view v-for="day in 7" :key="'cell-'+day+'-'+period"
							  class="grid-cell"
							  :style="{ gridRow: period, gridColumn: day + 1 }"
							  @tap="handleEmptyCellTap(day, period)">
						</view>
					</template>
					
					<!-- 3. 课程卡片 -->
					<view v-for="(course, index) in displayCourses" :key="'course-'+index"
						  class="course-card-container"
						  :style="{ 
							 gridRow: `${course.startPeriod} / span ${course.span}`, 
							 gridColumn: course.dayOfWeek + 1,
							 backgroundColor: getCourseColor(course.courseId)
						  }"
						  @tap.stop="handleCourseTap(course)">
						<view class="course-card-inner">
							<text class="course-name">{{ getCourseName(course.courseId) }}</text>
							<view class="course-info">
								<text v-if="getTeacherName(course.courseId)">{{ getTeacherName(course.courseId) }}</text>
								<text v-if="getCourseBuilding(course.courseId) || course.buildingName">
									<text v-if="getTeacherName(course.courseId)"> @ </text>
									{{ getCourseBuilding(course.courseId) || course.buildingName }}
								</text>
								<text v-if="course.roomNumber">{{ course.roomNumber }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'

	const props = defineProps({
		timetable: {
			type: Object,
			required: true
		},
		courses: {
			type: Array,
			default: () => []
		},
		schedules: {
			type: Array,
			default: () => []
		}
	})

	const emit = defineEmits(['cell-tap', 'week-change'])

	const days = ['一', '二', '三', '四', '五', '六', '日']
	const weekOffset = ref(0)

	const parseDate = (dateStr) => {
		if (!dateStr) return null
		const parts = dateStr.split('-').map(Number)
		if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null
		return new Date(parts[0], parts[1] - 1, parts[2])
	}
	
	const currentMonth = computed(() => {
		const now = new Date()
		const day = now.getDay()
		const diffToMonday = now.getDate() - (day === 0 ? 6 : day - 1) + (weekOffset.value * 7)
		const date = new Date(now.getFullYear(), now.getMonth(), diffToMonday)
		return date.getMonth() + 1
	})

	const weekDates = computed(() => {
		const now = new Date()
		const day = now.getDay()
		const diffToMonday = now.getDate() - (day === 0 ? 6 : day - 1) + (weekOffset.value * 7)
		const monday = new Date(now.getFullYear(), now.getMonth(), diffToMonday)
		
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(monday)
			d.setDate(monday.getDate() + i)
			const year = d.getFullYear()
			const month = String(d.getMonth() + 1).padStart(2, '0')
			const date = String(d.getDate()).padStart(2, '0')
			return {
				date: d.getDate(),
				fullDate: `${year}-${month}-${date}`,
				isToday: d.toDateString() === new Date().toDateString()
			}
		})
	})

	const currentWeek = computed(() => {
		const termStart = parseDate(props.timetable?.termStartDate)
		const monday = parseDate(weekDates.value[0]?.fullDate)
		if (!termStart || !monday) return null
		
		// 找到 termStartDate 所在周的周一
		const termStartDay = termStart.getDay()
		const daysToMonday = termStartDay === 0 ? 6 : termStartDay - 1
		const termStartMonday = new Date(termStart)
		termStartMonday.setDate(termStart.getDate() - daysToMonday)
		termStartMonday.setHours(0, 0, 0, 0)
		
		const currentMonday = new Date(monday)
		currentMonday.setHours(0, 0, 0, 0)
		
		const diffDays = Math.floor((currentMonday.getTime() - termStartMonday.getTime()) / 86400000)
		return Math.floor(diffDays / 7) + 1
	})

	const boardTitle = computed(() => {
		if (!props.timetable?.termStartDate) return '我的课表'
		if (!currentWeek.value || currentWeek.value < 1) return '学期未开始'
		return `第 ${currentWeek.value} 周`
	})

	const changeWeek = (delta) => {
		weekOffset.value += delta
		// 通知父组件周次变化，传递新的周一日期
		const mondayDate = weekDates.value[0]?.fullDate
		if (mondayDate) {
			emit('week-change', { mondayDate })
		}
	}

	const periodList = ref([
		{ index: 1, start: '08:00', end: '08:45' },
		{ index: 2, start: '08:50', end: '09:35' },
		{ index: 3, start: '09:50', end: '10:35' },
		{ index: 4, start: '10:40', end: '11:25' },
		{ index: 5, start: '11:30', end: '12:15' },
		{ index: 6, start: '13:30', end: '14:15' },
		{ index: 7, start: '14:20', end: '15:05' },
		{ index: 8, start: '15:15', end: '16:00' },
		{ index: 9, start: '16:05', end: '16:50' },
		{ index: 10, start: '16:55', end: '17:40' },
		{ index: 11, start: '18:30', end: '19:15' },
		{ index: 12, start: '19:20', end: '20:05' },
		{ index: 13, start: '20:10', end: '20:55' },
		{ index: 14, start: '21:00', end: '21:45' }
	])

	// 计算当前展示的课程（处理日期匹配、覆盖和跨行）
	const displayCourses = computed(() => {
		const result = []
		const occupied = new Set() // keys: `${dayOfWeek}-${period}`

		// 1. 优先处理具体日期的排课 (Specific Dates)
		const specific = props.schedules.filter(s => s.scheduleDate)
		
		// 创建日期映射: dateStr -> dayOfWeek (1-7)
		const dateMap = new Map()
		weekDates.value.forEach((d, idx) => dateMap.set(d.fullDate, idx + 1))

		specific.forEach(s => {
			const day = dateMap.get(s.scheduleDate)
			if (day) {
				// 该课程属于本周的某一天
				result.push({ 
					...s, 
					dayOfWeek: day, 
					span: s.endPeriod - s.startPeriod + 1 
				})
				// 标记占用
				for (let p = s.startPeriod; p <= s.endPeriod; p++) {
					occupied.add(`${day}-${p}`)
				}
			}
		})

		// 2. 处理常规排课 (Recurring)
		const recurring = props.schedules.filter(s => !s.scheduleDate)
		recurring.forEach(s => {
			// 检查是否被 specific 课程覆盖
			let hasConflict = false
			for (let p = s.startPeriod; p <= s.endPeriod; p++) {
				if (occupied.has(`${s.dayOfWeek}-${p}`)) {
					hasConflict = true
					break
				}
			}
			
			if (!hasConflict) {
				result.push({ 
					...s, 
					span: s.endPeriod - s.startPeriod + 1 
				})
			}
		})
		
		return result
	})

	const getCourseName = (courseId) => {
		const course = props.courses.find(c => c.id === courseId)
		return course ? course.name : '未知课程'
	}

	const getTeacherName = (courseId) => {
		const course = props.courses.find(c => c.id === courseId)
		return course ? course.teacherName : ''
	}

	const getCourseBuilding = (courseId) => {
		const course = props.courses.find(c => c.id === courseId)
		// Try course.locationName first (from course object), then fall back to current schedule item's buildingName if available
		if (course && course.locationName) return course.locationName
		
		// If not in course object, try finding it in the schedules prop passed to the component
		// Note: The 'course' variable in the template loop (v-for) is actually an item from 'displayCourses', which is derived from 'schedules'
		// So we need to access the schedule item directly.
		return ''
	}

	const colors = [
		'#FFD7E8', // Pink
		'#D6E4FF', // Blue
		'#FFF2CC', // Yellow
		'#D9F7BE', // Green
		'#E6E6FA', // Purple
		'#FFDAB9', // Peach
		'#E0FFFF', // Cyan
		'#F5F5F5'  // Grey
	]
	const getCourseColor = (courseId) => {
		// Use courseId to pick a consistent color
		if (!courseId) return colors[7]
		const idNum = typeof courseId === 'number' ? courseId : courseId.toString().charCodeAt(0)
		return colors[idNum % (colors.length - 1)] // Avoid using Grey for actual courses
	}

	const handleEmptyCellTap = (dayOfWeek, period) => {
		const dateItem = weekDates.value[dayOfWeek - 1]
		const scheduleDate = dateItem?.fullDate || ''
		emit('cell-tap', { dayOfWeek, period, existing: null, scheduleDate })
	}

	const handleCourseTap = (course) => {
		const dateItem = weekDates.value[course.dayOfWeek - 1]
		const scheduleDate = dateItem?.fullDate || ''
		emit('cell-tap', { 
			dayOfWeek: course.dayOfWeek, 
			period: course.startPeriod, 
			existing: course, 
			scheduleDate 
		})
	}
</script>

<style scoped>
	.schedule-board {
		margin-top: 18px;
		background-color: #ffffff;
		border-top-left-radius: 24px;
		border-top-right-radius: 24px;
		padding: 16px 12px;
		display: flex;
		flex-direction: column;
		flex: 1;
		box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
	}

	.board-header {
		padding: 0 4px 16px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.board-title {
		font-size: 20px;
		font-weight: 700;
		color: #1d2130;
		letter-spacing: 0.5px;
	}

	.header-right {
		display: flex;
		flex-direction: row;
		gap: 12px;
	}

	.nav-btn {
		width: 36px;
		height: 36px;
		background-color: #fff;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
		transition: all 0.2s;
	}

	.nav-btn:active {
		transform: scale(0.92);
		background-color: #f9f9f9;
	}

	.week-item-container {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.week-row {
		display: flex;
		align-items: center;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.03);
		margin-bottom: 4px;
	}

	.week-label {
		width: 44px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.month {
		font-size: 18px;
		font-weight: 800;
		color: #1d2130;
	}

	.month-unit {
		font-size: 10px;
		color: #8e92a3;
		font-weight: 500;
		margin-top: -2px;
	}

	.week-days {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 40px;
		border-radius: 12px;
		padding: 4px 0;
		transition: all 0.2s;
	}

	.day-name {
		font-size: 11px;
		color: #8e92a3;
		font-weight: 500;
		margin-bottom: 4px;
	}

	.day-num {
		font-size: 15px;
		color: #1d2130;
		font-weight: 600;
		width: 32px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		border-radius: 50%;
	}

	.day.is-today {
		background-color: transparent;
	}

	.day.is-today .day-name {
		color: #007aff;
		font-weight: 700;
	}

	.day.is-today .day-num {
		background-color: #007aff;
		color: #fff;
		box-shadow: 0 4px 10px rgba(0, 122, 255, 0.3);
	}

	.schedule-area {
		flex: 1;
		/* height is handled by flex in page usually, but if fixed height needed: */
		height: 0; 
		min-height: 500px;
	}

	.schedule-grid {
		display: grid;
		grid-template-columns: 44px repeat(7, 1fr);
		grid-template-rows: repeat(14, 64px); /* Increased height per period */
		gap: 4px; /* increased gap */
		padding-top: 10px;
		position: relative;
	}

	.time-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding-top: 6px;
	}

	.period-index {
		font-size: 15px;
		font-weight: 700;
		color: #1d2130;
		margin-bottom: 2px;
	}

	.period-time {
		font-size: 9px;
		color: #a0a4b0;
		line-height: 1.1;
		transform: scale(0.9);
	}

	.grid-cell {
		border-top: 1px solid rgba(0,0,0,0.03);
		border-left: 1px solid rgba(0,0,0,0.03);
		border-radius: 4px;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	
	.course-card-container {
		margin: 2px;
		border-radius: 8px; /* Larger radius */
		overflow: hidden;
		z-index: 2;
		box-shadow: 0 2px 6px rgba(0,0,0,0.04);
		transition: transform 0.1s;
	}
	
	.course-card-container:active {
		transform: scale(0.98);
	}
	
	.course-card-inner {
		width: 100%;
		height: 100%;
		padding: 3px 4px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		box-sizing: border-box; /* Ensure padding doesn't affect width */
	}

	.course-name {
		font-size: 11px; 
		font-weight: 700;
		color: #1d2130;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* Limit to 2 lines to save space */
		overflow: hidden;
		line-height: 1.2;
		margin-bottom: 2px;
	}

	.course-info {
		font-size: 9px;
		color: rgba(29, 33, 48, 0.7);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* Ensure at least 2 lines for info if possible */
		overflow: hidden;
		line-height: 1.1;
		margin-top: auto; /* Push to bottom */
		white-space: pre-wrap; /* Allow wrapping */
	}
</style>
