<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
			</view>
			<text class="title">课程库</text>
			<view class="add-btn" @tap="showAddModal">
				<uni-icons type="plus" size="24" color="#1d2130"></uni-icons>
			</view>
		</view>

		<view class="search-bar">
			<uni-icons type="search" size="18" color="#8e92a3"></uni-icons>
			<input class="search-input" v-model="searchKey" placeholder="搜索课程名称或编号" />
		</view>

		<scroll-view class="list-container" scroll-y="true">
			<view v-for="item in filteredCourses" :key="item.id" class="course-card">
				<view class="card-info" @tap="showEditModal(item)">
					<view class="course-header">
						<text class="course-name">{{ item.name }}</text>
						<text class="course-code">{{ item.courseCode }}</text>
					</view>
					<text class="course-teacher">教师: {{ item.teacherName }}</text>
					<text class="course-credits">学分: {{ item.credits }}</text>
					<text class="course-desc" v-if="item.description">{{ item.description }}</text>
				</view>
				<view class="card-actions">
					<view class="action-btn add" @tap="handleAddToTimetable(item.id)" v-if="timetableId">
						<uni-icons type="plus-filled" size="24" color="#007aff"></uni-icons>
					</view>
					<view class="action-btn delete" @tap="handleDeleteCourse(item.id)">
						<uni-icons type="trash" size="22" color="#ff4d4f"></uni-icons>
					</view>
				</view>
			</view>
			<view v-if="filteredCourses.length === 0" class="empty-state">
				<text class="empty-text">暂无课程</text>
			</view>
		</scroll-view>

		<!-- 课程编辑/新增模态框 -->
		<view class="modal-mask" v-if="modalVisible" @tap="closeModal">
			<view class="modal-content" @tap.stop>
				<text class="modal-title">{{ editingCourse ? '编辑课程' : '新增课程' }}</text>
				<view class="form-item">
					<text class="label">课程名称</text>
					<input class="input" v-model="formData.name" placeholder="请输入课程名称" />
				</view>
				<view class="form-item">
					<text class="label">课程编号</text>
					<input class="input" v-model="formData.courseCode" placeholder="请输入课程编号" />
				</view>
				<view class="form-item">
					<text class="label">教师姓名</text>
					<input class="input" v-model="formData.teacherName" placeholder="请输入教师姓名" />
				</view>
				<view class="form-item">
					<text class="label">学分</text>
					<input class="input" type="number" v-model="formData.credits" placeholder="请输入学分" />
				</view>
				<view class="form-item">
					<text class="label">课程描述</text>
					<textarea class="textarea" v-model="formData.description" placeholder="请输入课程描述" />
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel" @tap="closeModal">取消</button>
					<button class="modal-btn confirm" @tap="handleSaveCourse">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, reactive } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getAllCourses, createCourse, updateCourse, deleteCourse } from '@/functions/course.js'
	import { addCourse } from '@/functions/timetable-course.js'

	const timetableId = ref(null)
	const courses = ref([])
	const searchKey = ref('')
	const modalVisible = ref(false)
	const editingCourse = ref(null)

	const formData = reactive({
		name: '',
		courseCode: '',
		teacherName: '',
		credits: 2,
		description: ''
	})

	const filteredCourses = computed(() => {
		if (!searchKey.value) return courses.value
		const key = searchKey.value.toLowerCase()
		return courses.value.filter(c => 
			c.name.toLowerCase().includes(key) || 
			c.courseCode.toLowerCase().includes(key)
		)
	})

	onLoad((options) => {
		if (options.timetableId) {
			timetableId.value = options.timetableId
		}
	})

	onShow(() => {
		loadCourses()
	})

	const loadCourses = async () => {
		try {
			const res = await getAllCourses()
			courses.value = res
		} catch (e) {
			console.error('加载课程列表失败', e)
		}
	}

	const goBack = () => {
		uni.navigateBack()
	}

	const showAddModal = () => {
		editingCourse.value = null
		formData.name = ''
		formData.courseCode = ''
		formData.teacherName = ''
		formData.credits = 2
		formData.description = ''
		modalVisible.value = true
	}

	const showEditModal = (course) => {
		editingCourse.value = course
		formData.name = course.name
		formData.courseCode = course.courseCode
		formData.teacherName = course.teacherName
		formData.credits = course.credits
		formData.description = course.description
		modalVisible.value = true
	}

	const closeModal = () => {
		modalVisible.value = false
	}

	const handleSaveCourse = async () => {
		if (!formData.name || !formData.courseCode) {
			uni.showToast({ title: '名称和编号必填', icon: 'none' })
			return
		}

		try {
			const data = {
				...formData,
				credits: parseInt(formData.credits)
			}
			if (editingCourse.value) {
				await updateCourse(editingCourse.value.id, data)
				uni.showToast({ title: '更新成功' })
			} else {
				await createCourse(data)
				uni.showToast({ title: '创建成功' })
			}
			closeModal()
			loadCourses()
		} catch (e) {}
	}

	const handleDeleteCourse = async (id) => {
		uni.showModal({
			title: '提示',
			content: '确定永久删除该课程吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await deleteCourse(id)
						uni.showToast({ title: '删除成功' })
						loadCourses()
					} catch (e) {}
				}
			}
		})
	}

	const handleAddToTimetable = async (courseId) => {
		try {
			await addCourse(timetableId.value, courseId)
			uni.showToast({ title: '已添加到课表' })
			setTimeout(() => {
				uni.navigateBack()
			}, 1000)
		} catch (e) {
			// 如果已经在课表中，API 通常会返回错误
		}
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

	.search-bar {
		margin: 10px 15px;
		padding: 0 12px;
		height: 40px;
		background-color: #fff;
		border-radius: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}

	.search-input {
		flex: 1;
		font-size: 14px;
	}

	.list-container {
		flex: 1;
		padding: 5px 15px 15px;
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

	.course-teacher, .course-credits {
		font-size: 13px;
		color: #5e616f;
	}

	.course-desc {
		font-size: 12px;
		margin-top: 4px;
		color: #8e92a3;
		font-style: italic;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12px;
		margin-left: 12px;
	}

	.modal-mask {
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

	.modal-content {
		width: 85%;
		background-color: #fff;
		border-radius: 16px;
		padding: 24px;
	}

	.modal-title {
		font-size: 18px;
		font-weight: 700;
		text-align: center;
		margin-bottom: 20px;
		display: block;
	}

	.form-item {
		margin-bottom: 16px;
	}

	.label {
		display: block;
		font-size: 12px;
		color: #8e92a3;
		margin-bottom: 6px;
	}

	.input {
		background-color: #f5f7fa;
		height: 44px;
		border-radius: 8px;
		padding: 0 12px;
		font-size: 14px;
	}

	.textarea {
		background-color: #f5f7fa;
		width: 100%;
		height: 80px;
		border-radius: 8px;
		padding: 12px;
		font-size: 14px;
		box-sizing: border-box;
	}

	.modal-footer {
		display: flex;
		gap: 12px;
		margin-top: 24px;
	}

	.modal-btn {
		flex: 1;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		border-radius: 22px;
	}

	.modal-btn.cancel {
		background-color: #f5f7fa;
		color: #5e616f;
	}

	.modal-btn.confirm {
		background-color: #007aff;
		color: #fff;
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
