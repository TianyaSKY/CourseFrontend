<template>
	<view class="schedule-board">
		<view class="week-item-container" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
			<view class="anim-wrapper" :class="animClass">
				<view class="week-row">
					<view class="week-label">
						<text class="month">{{ currentMonth }}</text>
						<text class="month-unit">月</text>
					</view>
					<view class="week-days">
						<view class="day" v-for="(day, index) in days" :key="index">
							<text class="day-name">{{ day }}</text>
							<text class="day-num" :class="{ 'is-today': weekDates[index].isToday }">
								{{ weekDates[index].date }}
							</text>
						</view>
					</view>
				</view>

				<view class="schedule-area">
					<view class="schedule-grid">
						<!-- 1. Time Axis -->
						<view v-for="p in periodList" :key="'time-'+p.index" 
							  class="time-label" 
							  :style="{ gridRow: p.index, gridColumn: 1 }">
							<text class="period-index">{{p.index}}</text>
							<view class="time-range">
								<text class="period-time">{{p.start}}</text>
								<text class="period-time">{{p.end}}</text>
							</view>
						</view>
						
						<!-- 2. Grid Cells (Background & Click Areas) -->
						<template v-for="period in 14">
							<view v-for="day in 7" :key="'cell-'+day+'-'+period"
								  class="grid-cell"
								  :style="{ gridRow: period, gridColumn: day + 1 }"
								  @tap="handleEmptyCellTap(day, period)">
							</view>
						</template>
						
						<!-- 3. Course Cards -->
						<view v-for="(course, index) in displayCourses" :key="'course-'+index"
							  class="course-card-container"
							  :style="{ 
								 gridRow: `${course.startPeriod} / span ${course.span}`, 
								 gridColumn: course.dayOfWeek + 1,
								 backgroundColor: getCourseColor(course.courseId || course.courseName)
							  }"
							  @tap.stop="handleCourseTap(course)">
							<view class="course-card-inner">
								<text class="course-name">{{ getCourseName(course) }}</text>
								<view class="course-detail">
									<text class="course-location" v-if="getCourseBuilding(course)">
										@{{ getCourseBuilding(course) }}
										<text v-if="course.roomNumber">{{ course.roomNumber }}</text>
									</text>
									<text class="course-teacher" v-if="getTeacherName(course)">
										{{ getTeacherName(course) }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, watch } from 'vue'

	// --- Props & Emits ---
	const props = defineProps({
		timetable: { type: Object, required: true },
		courses: { type: Array, default: () => [] },
		schedules: { type: Array, default: () => [] },
		currentViewDate: { type: String, default: '' }
	})

	const emit = defineEmits(['cell-tap', 'week-change'])

	// --- Constants ---
	const days = ['一', '二', '三', '四', '五', '六', '日']
	const colors = ['#6d9aee', '#f0ad4e', '#b197fc', '#4db6ac', '#f06292', '#a1887f', '#90a4ae']
	
	// Period configuration
	const periodList = ref([
		{ index: 1, start: '08:00', end: '08:50' },
		{ index: 2, start: '09:00', end: '09:50' },
		{ index: 3, start: '10:10', end: '11:00' },
		{ index: 4, start: '11:10', end: '12:00' },
		{ index: 5, start: '13:30', end: '14:20' },
		{ index: 6, start: '14:30', end: '15:20' },
		{ index: 7, start: '15:40', end: '16:30' },
		{ index: 8, start: '16:40', end: '17:30' },
		{ index: 9, start: '18:30', end: '19:20' },
		{ index: 10, start: '19:30', end: '20:20' },
		{ index: 11, start: '20:30', end: '21:20' },
		{ index: 12, start: '21:30', end: '22:20' }
	])

	// --- State ---
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

	const currentMonday = ref(getWeekMonday(props.currentViewDate))
	const touchStartX = ref(0)
	const touchStartY = ref(0)
	const animClass = ref('')
	const isAnimating = ref(false)

	watch(() => props.currentViewDate, (value) => {
		if (!value) return
		currentMonday.value = getWeekMonday(value)
	})

	// --- Date Logic ---
	const currentMonth = computed(() => {
		const date = currentMonday.value
		return date.getMonth() + 1
	})

	const weekDates = computed(() => {
		const monday = new Date(currentMonday.value)
		
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(monday)
			d.setDate(monday.getDate() + i)
			const date = String(d.getDate())
			return {
				date: date,
				fullDate: formatDate(d),
				isToday: d.toDateString() === new Date().toDateString()
			}
		})
	})

	// --- Course Display Logic ---
	const displayCourses = computed(() => {
		const result = []
		const occupied = new Set() // keys: `${dayOfWeek}-${period}`

		// 1. Specific Dates (High Priority)
		const specific = props.schedules.filter(s => s.scheduleDate)
		const dateMap = new Map()
		weekDates.value.forEach((d, idx) => dateMap.set(d.fullDate, idx + 1))

		specific.forEach(s => {
			const day = dateMap.get(s.scheduleDate)
			if (day) {
				result.push({ 
					...s, 
					dayOfWeek: day, 
					span: s.endPeriod - s.startPeriod + 1 
				})
				for (let p = s.startPeriod; p <= s.endPeriod; p++) occupied.add(`${day}-${p}`)
			}
		})

		// 2. Recurring (Low Priority)
		const recurring = props.schedules.filter(s => !s.scheduleDate)
		recurring.forEach(s => {
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

	// --- Helpers ---
	const getCourseName = (course) => {
		if (course?.courseName) return course.courseName
		return props.courses.find(c => c.id === course?.courseId)?.name || '未知课程'
	}

	const getTeacherName = (course) => {
		if (course?.teacherName) return course.teacherName
		return props.courses.find(c => c.id === course?.courseId)?.teacherName || ''
	}

	const getCourseBuilding = (course) => {
		if (course?.locationName) return course.locationName
		if (course?.buildingName) return course.buildingName
		return props.courses.find(c => c.id === course?.courseId)?.locationName || ''
	}
	
	const getCourseColor = (courseId) => {
		if (!courseId) return colors[0]
		const idNum = typeof courseId === 'number' ? courseId : courseId.toString().charCodeAt(0)
		return colors[idNum % colors.length]
	}

	// --- Interaction Handlers ---
	const changeWeek = (delta) => {
		const monday = new Date(currentMonday.value)
		monday.setDate(monday.getDate() + (delta * 7))
		currentMonday.value = monday
		const mondayDate = formatDate(monday)
		if (mondayDate) emit('week-change', { mondayDate })
	}

	const handleTouchStart = (e) => {
		if (isAnimating.value) return
		touchStartX.value = e.changedTouches[0].clientX
		touchStartY.value = e.changedTouches[0].clientY
	}
	
	const handleTouchEnd = (e) => {
		if (isAnimating.value) return
		
		const touchEndX = e.changedTouches[0].clientX
		const touchEndY = e.changedTouches[0].clientY
		const deltaX = touchEndX - touchStartX.value
		const deltaY = touchEndY - touchStartY.value
		
		if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
			triggerWeekChange(deltaX > 0 ? -1 : 1)
		}
	}
	
	const triggerWeekChange = (delta) => {
		isAnimating.value = true
		animClass.value = delta > 0 ? 'slide-out-right' : 'slide-out-left'
		
		setTimeout(() => {
			changeWeek(delta)
			animClass.value = 'no-anim ' + (delta > 0 ? 'prepare-left' : 'prepare-right')
			
			// Force reflow
			setTimeout(() => {
				animClass.value = 'slide-in-active'
				setTimeout(() => {
					animClass.value = ''
					isAnimating.value = false
				}, 200)
			}, 20)
		}, 200)
	}

	const handleEmptyCellTap = (dayOfWeek, period) => {
		const dateItem = weekDates.value[dayOfWeek - 1]
		emit('cell-tap', { 
			dayOfWeek, 
			period, 
			existing: null, 
			scheduleDate: dateItem?.fullDate || '' 
		})
	}

	const handleCourseTap = (course) => {
		const dateItem = weekDates.value[course.dayOfWeek - 1]
		emit('cell-tap', { 
			dayOfWeek: course.dayOfWeek, 
			period: course.startPeriod, 
			existing: course, 
			scheduleDate: dateItem?.fullDate || '' 
		})
	}
</script>

<style scoped>
	.schedule-board {
		margin-top: 0;
		background-color: #f7fbff;
		padding: 0;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.week-item-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		min-height: 0;
	}
	
	.anim-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		transition: transform 0.2s ease, opacity 0.2s ease;
		min-height: 0;
	}
	
	/* Animation States */
	.slide-out-left { transform: translateX(-50px); opacity: 0; }
	.slide-out-right { transform: translateX(50px); opacity: 0; }
	.no-anim { transition: none !important; }
	.prepare-left { transform: translateX(-50px); opacity: 0; }
	.prepare-right { transform: translateX(50px); opacity: 0; }
	.slide-in-active { transform: translateX(0); opacity: 1; }

	/* Header Row */
	.week-row {
		display: flex;
		align-items: center;
		background-color: rgba(16, 55, 92, 0.06);
		border-top: 1px solid rgba(16, 55, 92, 0.12);
		border-bottom: 1px solid rgba(16, 55, 92, 0.1);
		padding-bottom: 8px;
		margin-bottom: 0;
	}

	.week-label {
		width: 28px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.month {
		font-size: 14px;
		font-weight: 500;
		color: #1d2130;
	}

	.month-unit {
		font-size: 10px;
		color: #1d2130;
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
		width: 13.5%;
	}

	.day-name {
		font-size: 12px;
		color: #8e92a3;
		margin-bottom: 4px;
	}

	.day-num {
		font-size: 16px;
		color: #1d2130;
		font-weight: 500;
		text-align: center;
	}

	.day-num.is-today {
		color: #007aff;
		font-weight: 700;
	}

	/* Scroll Area */
	.schedule-area {
		flex: 1;
		min-height: 0;
		background-color: #f7fbff;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.schedule-grid {
		display: grid;
		grid-template-columns: 28px repeat(7, 1fr);
		grid-template-rows: repeat(12, 64px);
		gap: 0;
		padding-top: 4px;
		padding-bottom: 20px;
		background-color: #f7fbff;
		box-sizing: border-box;
		width: 100%;
	}

	/* Time Column */
	.time-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding-top: 4px;
	}

	.period-index {
		font-size: 14px;
		font-weight: 500;
		color: #1d2130;
		margin-bottom: 0px;
		line-height: 1;
	}
	
	.time-range {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.period-time {
		font-size: 9px;
		color: #8e92a3;
		line-height: 1;
		transform: scale(0.85);
		transform-origin: center top;
		white-space: nowrap;
	}

	/* Grid Cells */
	.grid-cell {
		box-sizing: border-box;
		background-color: transparent;
		border: none;
	}
	
	/* Course Cards */
	.course-card-container {
		margin: 1px;
		border-radius: 6px;
		overflow: hidden;
		z-index: 2;
		color: #fff;
	}
	
	.course-card-container:active {
		opacity: 0.9;
	}
	
	.course-card-inner {
		width: 100%;
		height: 100%;
		padding: 2px 3px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		box-sizing: border-box;
	}

	.course-name {
		font-size: 10px; 
		font-weight: 500;
		color: #fff;
		margin-bottom: 2px;
		line-height: 1.2;
		word-break: break-all;
	}

	.course-detail {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0px;
	}

	.course-location, .course-teacher {
		font-size: 9px;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.1;
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>
