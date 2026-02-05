<template>
	<view class="page">
		<view class="status-bar"></view>
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<uni-icons type="left" size="24" color="#1d2130"></uni-icons>
			</view>
			<text class="title">课表管理</text>
			<view class="header-actions">
				<view class="action-icon" @tap="goToAdd">
					<uni-icons type="plus" size="24" color="#1d2130"></uni-icons>
				</view>
			</view>
		</view>

		<scroll-view 
			class="list-container" 
			scroll-y="true"
			refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view v-for="item in timetables" :key="item.id" class="timetable-card" :class="{ 'is-default': item.isDefault }" @tap="goToEdit(item.id)">
				<view class="card-info">
					<text class="card-name">{{ item.name }}</text>
					<text class="card-desc">{{ item.academicYearStart }}-{{ item.academicYearEnd }} 第 {{ item.term }} 学期</text>
				</view>
				<view class="card-actions">
					<view class="action-btn" @tap.stop="handleShare(item.id)">
						<uni-icons type="paperplane" size="20" color="#007aff"></uni-icons>
					</view>
					<view class="action-btn" @tap.stop="goToCourseManage(item.id)">
						<uni-icons type="list" size="20" color="#007aff"></uni-icons>
					</view>
					<view v-if="!item.isDefault" class="action-btn" @tap.stop="handleSetDefault(item.id)">
						<text class="action-text">设为默认</text>
					</view>
					<view class="action-btn" @tap.stop="handleDelete(item.id)">
						<uni-icons type="trash" size="20" color="#ff4d4f"></uni-icons>
					</view>
				</view>
				<view v-if="item.isDefault" class="default-badge">
					<text class="badge-text">默认</text>
				</view>
			</view>
		</scroll-view>

		<!-- Share Modal -->
		<view v-if="showShareModal" class="modal-overlay">
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
					<button class="modal-btn confirm" @tap="closeShareModal">关闭</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { getTimetables, setDefaultTimetable, deleteTimetable, shareTimetable } from '@/functions/timetable.js'

	const timetables = ref([])
	const isRefreshing = ref(false)
	
	// Share related
	const showShareModal = ref(false)
	const shareToken = ref('')
	const expirationTime = ref('')

	onShow(() => {
		loadTimetables()
	})

	const loadTimetables = async () => {
		try {
			const res = await getTimetables()
			timetables.value = res
		} catch (e) {}
	}
	
	const handleShare = async (id) => {
		uni.showLoading({ title: '生成口令...' })
		try {
			const res = await shareTimetable(id)
			console.log('Share response:', res)
			shareToken.value = res.token
			
			// Handle expiration time safely
			if (res.expiresAt) {
				try {
					let date
					// Handle Java LocalDateTime array format [yyyy, MM, dd, HH, mm, ss]
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
			
			showShareModal.value = true
			uni.hideLoading()
		} catch (e) {
			uni.hideLoading()
			// Error already handled in request.js usually, but in case
			console.error(e)
			if (!e.message) { // Only show if request.js didn't show toast
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
	
	const closeShareModal = () => {
		showShareModal.value = false
		shareToken.value = ''
	}

	const onRefresh = async () => {
		isRefreshing.value = true
		await loadTimetables()
		isRefreshing.value = false
	}
// ... existing methods ...

	const goBack = () => {
		uni.navigateBack()
	}

	const goToAdd = () => {
		uni.navigateTo({
			url: '/pages/schedule/timetable-edit'
		})
	}

	const goToEdit = (id) => {
		uni.navigateTo({
			url: `/pages/schedule/timetable-edit?id=${id}`
		})
	}

	const goToCourseManage = (id) => {
		uni.navigateTo({
			url: `/pages/schedule/course-manage?timetableId=${id}`
		})
	}

	const handleSetDefault = async (id) => {
		try {
			await setDefaultTimetable(id)
			uni.showToast({ title: '设置成功' })
			loadTimetables()
		} catch (e) {}
	}

	const handleDelete = async (id) => {
		uni.showModal({
			title: '提示',
			content: '确定删除该课表吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await deleteTimetable(id)
						uni.showToast({ title: '删除成功' })
						loadTimetables()
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

	.list-container {
		flex: 1;
		padding: 15px;
	}

	.timetable-card {
		background-color: #fff;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 15px;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.timetable-card.is-default {
		border: 1px solid #007aff;
	}

	.card-info {
		display: flex;
		flex-direction: column;
	}

	.card-name {
		font-size: 16px;
		font-weight: 600;
		color: #1d2130;
	}

	.card-desc {
		font-size: 12px;
		color: #8e92a3;
		margin-top: 4px;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 15px;
	}

	.action-text {
		font-size: 14px;
		color: #007aff;
	}

	.default-badge {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #007aff;
		padding: 2px 8px;
		border-top-right-radius: 12px;
		border-bottom-left-radius: 12px;
	}

	.badge-text {
		color: #fff;
		font-size: 10px;
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

	.modal-row {
		display: flex;
		gap: 10px;
	}

	.modal-input.half {
		flex: 1;
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

	.header-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

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

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		color: #1d2130;
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
</style>
