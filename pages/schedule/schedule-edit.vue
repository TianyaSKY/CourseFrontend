<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
			</view>
			<text class="title">{{ isEdit ? '编辑排课' : '新增排课' }}</text>
			<view class="placeholder"></view>
		</view>

		<view class="form">
			<view class="form-item">
				<text class="label">选择课程</text>
				<picker @change="onCourseChange" :value="courseIndex" :range="courseNames">
					<view class="picker-value">{{ courseNames[courseIndex] || '请选择课程' }}</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="label">星期</text>
				<picker @change="onDayChange" :value="formData.dayOfWeek - 1" :range="days">
					<view class="picker-value">{{ days[formData.dayOfWeek - 1] }}</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="label">上课日期 (可选)</text>
				<picker mode="date" @change="onDateChange" :value="formData.scheduleDate">
					<view class="picker-value">{{ formData.scheduleDate || '请选择日期' }}</view>
				</picker>
			</view>

			<view class="form-row">
				<view class="form-item half">
					<text class="label">起始节次</text>
					<input class="input" type="number" v-model="formData.startPeriod" placeholder="1" />
				</view>
				<view class="form-item half">
					<text class="label">结束节次</text>
					<input class="input" type="number" v-model="formData.endPeriod" placeholder="2" />
				</view>
			</view>

			<view class="form-item">
				<text class="label">教学楼</text>
				<input class="input" v-model="formData.buildingName" placeholder="例如: 第一教学楼" />
			</view>

			<view class="form-item">
				<text class="label">教室/地点 (教室号)</text>
				<input class="input" v-model="formData.roomNumber" placeholder="例如: 101" />
			</view>

			<view class="form-item">
				<text class="label">上课周次 (逗号隔开)</text>
				<input class="input" v-model="formData.weeks" placeholder="例如: 1,2,3,4,5" />
			</view>

			<button class="submit-btn" @tap="handleSubmit">保存</button>
			<button v-if="isEdit" class="delete-btn" @tap="handleDelete">删除此排课</button>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, computed } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { getCourses } from '@/functions/timetable-course.js'
	import { createSchedule, updateSchedule, deleteSchedule, getScheduleById } from '@/functions/schedule.js'

	const isEdit = ref(false)
	const scheduleId = ref(null)
	const timetableId = ref(null)
	const courses = ref([])
	const courseIndex = ref(-1)
	const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

	const formData = reactive({
		timetableId: null,
		courseId: null,
		dayOfWeek: 1,
		scheduleDate: '',
		startPeriod: 1,
		endPeriod: 2,
		buildingName: '',
		roomNumber: '',
		weeks: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16',
		buildingId: null // 暂时不选大楼
	})

	const courseNames = computed(() => courses.value.map(c => c.name))

	onLoad(async (options) => {
		timetableId.value = options.timetableId
		formData.timetableId = parseInt(options.timetableId)

		if (options.id) {
			isEdit.value = true
			scheduleId.value = options.id
			await loadSchedule(options.id)
		} else {
			formData.dayOfWeek = parseInt(options.dayOfWeek) || 1
			formData.startPeriod = parseInt(options.period) || 1
			formData.endPeriod = (parseInt(options.period) || 1) + 1
			// 如果传入了 scheduleDate，则设置为具体日期排课
			if (options.scheduleDate) {
				formData.scheduleDate = options.scheduleDate
			}
		}

		await loadCourses()
	})

	const loadCourses = async () => {
		try {
			const res = await getCourses(timetableId.value)
			courses.value = res
			if (formData.courseId) {
				courseIndex.value = res.findIndex(c => c.id === formData.courseId)
			}
		} catch (e) {}
	}

	const loadSchedule = async (id) => {
		try {
			const res = await getScheduleById(id)
			Object.assign(formData, res)
		} catch (e) {}
	}

	const onCourseChange = (e) => {
		courseIndex.value = e.detail.value
		formData.courseId = courses.value[courseIndex.value].id
	}

	const onDayChange = (e) => {
		formData.dayOfWeek = parseInt(e.detail.value) + 1
	}

	const onDateChange = (e) => {
		formData.scheduleDate = e.detail.value
	}

	const goBack = () => {
		uni.navigateBack()
	}

	const handleSubmit = async () => {
		if (!formData.courseId) {
			uni.showToast({ title: '请选择课程', icon: 'none' })
			return
		}

		try {
			const data = {
				...formData,
				startPeriod: parseInt(formData.startPeriod),
				endPeriod: parseInt(formData.endPeriod)
			}
			if (isEdit.value) {
				await updateSchedule(scheduleId.value, data)
				uni.showToast({ title: '更新成功' })
			} else {
				await createSchedule(data)
				uni.showToast({ title: '添加成功' })
			}
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		} catch (e) {}
	}

	const handleDelete = async () => {
		uni.showModal({
			title: '提示',
			content: '确定删除此排课记录吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await deleteSchedule(scheduleId.value)
						uni.showToast({ title: '已删除' })
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					} catch (e) {}
				}
			}
		})
	}
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f1f3f8;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 10px 20px;
		background-color: #fff;
	}

	.title {
		font-size: 18px;
		font-weight: 600;
		color: #1d2130;
	}

	.placeholder {
		width: 24px;
	}

	.form {
		padding: 20px;
	}

	.form-item {
		background-color: #fff;
		padding: 15px;
		border-radius: 12px;
		margin-bottom: 15px;
	}

	.form-row {
		display: flex;
		gap: 15px;
	}

	.form-item.half {
		flex: 1;
	}

	.label {
		display: block;
		font-size: 12px;
		color: #8e92a3;
		margin-bottom: 8px;
	}

	.input {
		font-size: 16px;
		color: #1d2130;
	}

	.picker-value {
		font-size: 16px;
		color: #1d2130;
		height: 24px;
	}

	.submit-btn {
		margin-top: 30px;
		background-color: #007aff;
		color: #fff;
		height: 50px;
		line-height: 50px;
		border-radius: 25px;
		font-weight: 600;
	}

	.delete-btn {
		margin-top: 15px;
		background-color: #fff;
		color: #ff4d4f;
		height: 50px;
		line-height: 50px;
		border-radius: 25px;
		font-weight: 600;
		border: 1px solid #ff4d4f;
	}
</style>
