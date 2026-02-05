<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="nav-bar">
		<view class="nav-back" @click="handleBack">
			<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
		</view>
			<text class="nav-title">修改个人信息</text>
			<view class="nav-placeholder"></view>
		</view>

		<scroll-view class="content" scroll-y="true">
			<view class="form-card">
				<view class="input-group">
					<text class="label">用户名</text>
					<input class="input" type="text" v-model="form.username" placeholder="请输入用户名" />
				</view>

				<view class="input-group">
					<text class="label">新密码 (留空则不修改)</text>
					<input class="input" type="password" v-model="form.password" placeholder="请输入新密码" />
				</view>

				<view class="input-group">
					<text class="label">学号</text>
					<input class="input" type="text" v-model="form.studentId" placeholder="请输入学号" />
				</view>

			<view class="input-group">
				<text class="label">学校</text>
				<view class="picker-display" @tap="openSchoolModal">
					{{ selectedSchoolName || '请选择学校' }}
				</view>
			</view>
				
				<view class="location-row">
					<view class="input-group half">
						<text class="label">家纬度 (Lat)</text>
						<input class="input" type="digit" v-model="latStr" placeholder="0.0" />
					</view>
					<view class="input-group half">
						<text class="label">家经度 (Lng)</text>
						<input class="input" type="digit" v-model="lngStr" placeholder="0.0" />
					</view>
				</view>

				<button class="save-btn" :loading="loading" @tap="handleSave">保存修改</button>
			</view>
		</scroll-view>

		<!-- School Selection Modal -->
		<view class="modal-mask" v-if="showSchoolModal" @tap="closeSchoolModal">
			<view class="modal-content" @tap.stop>
				<text class="modal-title">选择学校</text>
				<view class="search-box">
					<uni-icons type="search" size="18" color="#8e92a3"></uni-icons>
					<input class="search-input" v-model="schoolSearchKey" placeholder="搜索学校名称" />
				</view>
				<scroll-view class="school-list" scroll-y="true">
					<view v-for="school in filteredSchools" :key="school.id" class="school-item" @tap="selectSchool(school)">
						<text class="school-name">{{ school.name }}</text>
						<uni-icons v-if="form.schoolId === school.id" type="checkmarkempty" size="20" color="#007aff"></uni-icons>
					</view>
					<view v-if="filteredSchools.length === 0" class="empty-state">
						<text class="empty-text">未找到相关学校</text>
					</view>
				</scroll-view>
				<view class="modal-footer">
					<button class="modal-btn cancel" @tap="closeSchoolModal">取消</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, onMounted, computed } from 'vue'
	import { createEditProfileHandlers } from '@/functions/edit-profile.js'

	const form = reactive({
		username: '',
		password: '',
		studentId: '',
		schoolId: 0,
		homeLocationLat: 0.0,
		homeLocationLng: 0.0
	})

	const schoolList = ref([])
	const selectedSchoolIndex = ref(-1)
	const latStr = ref('')
	const lngStr = ref('')
	const loading = ref(false)
	
	// School Modal State
	const showSchoolModal = ref(false)
	const schoolSearchKey = ref('')

	const selectedSchoolName = computed(() => {
		if (selectedSchoolIndex.value >= 0 && selectedSchoolIndex.value < schoolList.value.length) {
			return schoolList.value[selectedSchoolIndex.value].name
		}
		return ''
	})
	
	const filteredSchools = computed(() => {
		if (!schoolSearchKey.value) return schoolList.value
		const key = schoolSearchKey.value.toLowerCase()
		return schoolList.value.filter(s => s.name.toLowerCase().includes(key))
	})

	const { initEditProfile, handleSchoolChange, handleBack, handleSave } =
		createEditProfileHandlers({
			form,
			schoolList,
			selectedSchoolIndex,
			latStr,
			lngStr,
			loading
		})

	const openSchoolModal = () => {
		showSchoolModal.value = true
	}

	const closeSchoolModal = () => {
		showSchoolModal.value = false
		schoolSearchKey.value = ''
	}

	const selectSchool = (school) => {
		const index = schoolList.value.findIndex(s => s.id === school.id)
		if (index !== -1) {
			handleSchoolChange({ detail: { value: index } })
		}
		closeSchoolModal()
	}

	onMounted(() => {
		initEditProfile()
	})
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #f1f3f8;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.nav-bar {
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		background-color: #f1f3f8;
	}

	.nav-back {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.nav-title {
		font-size: 18px;
		font-weight: 700;
		color: #1d2130;
	}

	.nav-placeholder {
		width: 40px;
	}

	.content {
		flex: 1;
		padding: 20px;
	}

	.form-card {
		background-color: #ffffff;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.input-group {
		margin-bottom: 20px;
	}

	.label {
		font-size: 14px;
		color: #8e92a3;
		margin-bottom: 8px;
		display: flex;
	}

	.input {
		width: 100%;
		height: 48px;
		border-bottom: 1px solid #f1f3f8;
		font-size: 16px;
		color: #1d2130;
	}

	.picker-display {
		width: 100%;
		height: 48px;
		border-bottom: 1px solid #f1f3f8;
		font-size: 16px;
		color: #1d2130;
		display: flex;
		align-items: center;
	}

	.location-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.half {
		width: 48%;
	}

	.save-btn {
		width: 100%;
		height: 50px;
		background-color: #1d2130;
		color: #ffffff;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 700;
		margin-top: 20px;
		text-align: center;
	}

	/* Modal Styles */
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
		height: 70vh;
		background-color: #fff;
		border-radius: 16px;
		padding: 20px;
		display: flex;
		flex-direction: column;
	}

	.modal-title {
		font-size: 18px;
		font-weight: 700;
		text-align: center;
		margin-bottom: 15px;
		display: block;
	}

	.search-box {
		background-color: #f5f7fa;
		height: 40px;
		border-radius: 20px;
		padding: 0 12px;
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		font-size: 14px;
		margin-left: 8px;
	}

	.school-list {
		flex: 1;
		overflow-y: auto;
	}

	.school-item {
		padding: 15px 0;
		border-bottom: 1px solid #f1f3f8;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.school-name {
		font-size: 15px;
		color: #1d2130;
	}

	.modal-footer {
		margin-top: 15px;
		flex-shrink: 0;
	}

	.modal-btn {
		width: 100%;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		border-radius: 22px;
		text-align: center;
	}

	.modal-btn.cancel {
		background-color: #f5f7fa;
		color: #5e616f;
	}
	
	.empty-state {
		padding: 30px 0;
		display: flex;
		justify-content: center;
	}
	
	.empty-text {
		color: #8e92a3;
		font-size: 14px;
	}
</style>
