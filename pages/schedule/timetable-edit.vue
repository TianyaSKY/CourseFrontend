<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
			</view>
			<text class="title">{{ isEdit ? '编辑课表' : '新建课表' }}</text>
			<view class="placeholder"></view>
		</view>

		<view class="form">
			<view class="form-item">
				<text class="label">名称</text>
				<input class="input" v-model="formData.name" placeholder="请输入课表名称" />
			</view>
			<view class="form-item">
				<text class="label">学年开始</text>
				<input class="input" type="number" v-model="formData.academicYearStart" placeholder="例如: 2025" />
			</view>
			<view class="form-item">
				<text class="label">学年结束</text>
				<input class="input" type="number" v-model="formData.academicYearEnd" placeholder="例如: 2026" />
			</view>
			<view class="form-item">
				<text class="label">学期开始日期 <text style="color: red">*</text></text>
				<picker mode="date" :value="formData.termStartDate" @change="(e) => formData.termStartDate = e.detail.value">
					<view class="input">{{ formData.termStartDate || '请选择日期' }}</view>
				</picker>
			</view>
			
			<button class="submit-btn" @tap="handleSubmit">保存</button>
			<button v-if="isEdit" class="manage-btn" @tap="goToCourseManage">课程管理</button>
			<button v-if="isEdit" class="clear-btn" @tap="handleClearCourses">清空课程</button>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { createTimetable, updateTimetable, getTimetableById } from '@/functions/timetable.js'
	import { clearCourses } from '@/functions/timetable-course.js'

	const isEdit = ref(false)
	const id = ref(null)
	const formData = reactive({
		name: '',
		academicYearStart: new Date().getFullYear(),
		academicYearEnd: new Date().getFullYear() + 1,
		term: 1,
		termStartDate: '',
		isDefault: false
	})

	onLoad((options) => {
		if (options.id) {
			isEdit.value = true
			id.value = options.id
			loadTimetable(options.id)
		}
	})

	const loadTimetable = async (id) => {
		try {
			const res = await getTimetableById(id)
			Object.assign(formData, res)
		} catch (e) {}
	}

	const goBack = () => {
		uni.navigateBack()
	}

	const goToCourseManage = () => {
		uni.navigateTo({
			url: `/pages/schedule/course-manage?timetableId=${id.value}`
		})
	}

	const handleClearCourses = async () => {
		uni.showModal({
			title: '提示',
			content: '确定清空该课表的所有课程吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await clearCourses(id.value)
						uni.showToast({ title: '已清空' })
					} catch (e) {}
				}
			}
		})
	}

	const handleSubmit = async () => {
		if (!formData.name) {
			uni.showToast({ title: '请输入名称', icon: 'none' })
			return
		}
		
		if (!formData.termStartDate) {
			uni.showToast({ title: '请选择学期开始日期', icon: 'none' })
			return
		}
		
		const data = {
			...formData,
			academicYearStart: parseInt(formData.academicYearStart),
			academicYearEnd: parseInt(formData.academicYearEnd),
			term: parseInt(formData.term),
			termStartDate: formData.termStartDate // 确保包含此字段
		}

		try {
			if (isEdit.value) {
				await updateTimetable(id.value, data)
				uni.showToast({ title: '更新成功' })
			} else {
				await createTimetable(data)
				uni.showToast({ title: '创建成功' })
			}
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		} catch (e) {}
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

	.label {
		display: block;
		font-size: 14px;
		color: #8e92a3;
		margin-bottom: 8px;
	}

	.input {
		font-size: 16px;
		color: #1d2130;
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

	.manage-btn {
		margin-top: 15px;
		background-color: #fff;
		color: #007aff;
		height: 50px;
		line-height: 50px;
		border-radius: 25px;
		font-weight: 600;
		border: 1px solid #007aff;
	}

	.clear-btn {
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
