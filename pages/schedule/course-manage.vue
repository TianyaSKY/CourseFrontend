<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
			</view>
			<text class="title">课程管理</text>
			<view class="add-btn" @tap="goToAdd">
				<uni-icons type="plus" size="24" color="#1d2130"></uni-icons>
			</view>
		</view>

		<scroll-view class="list-container" scroll-y="true">
			<view v-for="item in courses" :key="item.id" class="course-card">
				<view class="card-info">
					<view class="course-header">
						<text class="course-name">{{ item.name }}</text>
						<text class="course-code">{{ item.courseCode }}</text>
					</view>
					<text class="course-teacher">教师: {{ item.teacherName }}</text>
					<text class="course-credits">学分: {{ item.credits }}</text>
					<text class="course-desc" v-if="item.description">{{ item.description }}</text>
				</view>
				<view class="card-actions">
					<view class="action-btn" @tap="handleRemove(item.id)">
						<uni-icons type="trash" size="20" color="#ff4d4f"></uni-icons>
					</view>
				</view>
			</view>
			<view v-if="courses.length === 0" class="empty-state">
				<text class="empty-text">暂无课程</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getCourses, removeCourse } from '@/functions/timetable-course.js'

	const timetableId = ref(null)
	const courses = ref([])

	onLoad((options) => {
		if (options.timetableId) {
			timetableId.value = options.timetableId
		}
	})

	onShow(() => {
		if (timetableId.value) {
			loadCourses()
		}
	})

	const loadCourses = async () => {
		try {
			const res = await getCourses(timetableId.value)
			courses.value = res
		} catch (e) {
			console.error('加载课程失败', e)
		}
	}

	const goBack = () => {
		uni.navigateBack()
	}

	const goToAdd = () => {
		uni.navigateTo({
			url: `/pages/schedule/course-library?timetableId=${timetableId.value}`
		})
	}

	const handleRemove = async (courseId) => {
		uni.showModal({
			title: '提示',
			content: '确定从课表中移除该课程吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await removeCourse(timetableId.value, courseId)
						uni.showToast({ title: '移除成功' })
						loadCourses()
					} catch (e) {
						console.error('移除课程失败', e)
					}
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

	.list-container {
		flex: 1;
		padding: 15px;
	}

	.course-card {
		background-color: #fff;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.card-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.course-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}

	.course-name {
		font-size: 16px;
		font-weight: 600;
		color: #1d2130;
	}

	.course-code {
		font-size: 12px;
		color: #8e92a3;
		background-color: #f5f7fa;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.course-teacher, .course-credits, .course-desc {
		font-size: 13px;
		color: #5e616f;
	}

	.course-desc {
		margin-top: 4px;
		color: #8e92a3;
		font-style: italic;
	}

	.card-actions {
		margin-left: 12px;
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 100px;
	}

	.empty-text {
		color: #8e92a3;
		font-size: 14px;
	}
</style>
