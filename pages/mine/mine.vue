<template>
	<view class="page">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>

		<!-- 内容区域 -->
		<scroll-view class="content" :scroll-y="isLoggedIn">
			<view v-if="!isLoggedIn" class="auth-section">
				<login-form @success="onLoginSuccess"></login-form>
			</view>
			
			<view v-else class="mine-section">
				<view class="user-info">
					<image class="avatar" src="https://www.keaitupian.cn/cjpic/frombd/2/253/3315366793/2321372572.jpg" mode="aspectFill"></image>
					<text class="username">{{ userInfo.username && userInfo.username.length > 0 ? userInfo.username : '已登录用户' }}</text>
					<text class="sub-info" v-if="userInfo.studentId && userInfo.studentId.length > 0">学号: {{ userInfo.studentId }}</text>
					<text class="sub-info" v-if="userInfo.school && userInfo.school.length > 0">学校: {{ userInfo.school }}</text>
				</view>
				
				<view class="menu-list">
					<view class="menu-item" @tap="navigateTo('/pages/schedule/timetable-manage')">
						<view class="menu-left">
							<uni-icons type="calendar" size="22" color="#007aff" class="menu-icon"></uni-icons>
							<text class="menu-text">课表管理</text>
						</view>
						<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
					</view>
					<view class="menu-item" @tap="navigateTo('/pages/schedule/course-library')">
						<view class="menu-left">
							<uni-icons type="list" size="22" color="#007aff" class="menu-icon"></uni-icons>
							<text class="menu-text">课程库</text>
						</view>
						<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
					</view>
					<view class="menu-item" @tap="navigateToEdit">
						<view class="menu-left">
							<uni-icons type="gear" size="22" color="#007aff" class="menu-icon"></uni-icons>
							<text class="menu-text">修改个人信息</text>
						</view>
						<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
					</view>
					<view class="menu-item" @tap="handleLogout">
						<view class="menu-left">
							<uni-icons type="arrow-left" size="22" color="#ff4d4f" class="menu-icon"></uni-icons>
							<text class="menu-text text-danger">退出登录</text>
						</view>
						<uni-icons type="right" size="16" color="#c0c4cc"></uni-icons>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 公用底部菜单栏 -->
		<custom-tabbar currentTab="mine"></custom-tabbar>
	</view>
</template>

<script setup>
	import { ref, reactive, onMounted } from 'vue'
	import { createMineHandlers } from '@/functions/mine.js'

	const isLoggedIn = ref(false)
	const userInfo = reactive({
		username: '',
		studentId: '',
		school: ''
	})

	const {
		checkLoginStatus,
		onLoginSuccess,
		navigateToEdit,
		navigateTo,
		handleLogout
	} = createMineHandlers({ isLoggedIn, userInfo })

	onMounted(() => {
		checkLoginStatus()
	})
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #eef3f8;
	}
	
	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #123a64;
	}

	.content {
		flex: 1;
		padding-bottom: 100px;
		background: linear-gradient(180deg, #123a64 0, #1d4d7d 220px, #eef3f8 220px, #eef3f8 100%);
	}
	
	.auth-section {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.mine-section {
		display: flex;
		flex-direction: column;
		padding-bottom: 24px;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 20px 36px;
		margin-bottom: 0;
		background-color: transparent;
	}
	
	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-bottom: 12px;
		border: 3px solid rgba(255, 255, 255, 0.36);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}
	
	.username {
		font-size: 20px;
		font-weight: 600;
		color: #ffffff;
		margin-bottom: 4px;
	}

	.sub-info {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.8);
		margin-top: 2px;
	}
	
	.menu-list {
		background-color: rgba(255, 255, 255, 0.72);
		margin: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 8px 18px rgba(20, 52, 86, 0.08);
		position: relative;
		z-index: 1;
		border-top: 1px solid rgba(255, 255, 255, 0.6);
		border-bottom: 1px solid rgba(20, 52, 86, 0.12);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 18px 20px;
		background-color: transparent;
		transition: background-color 0.2s;
		position: relative;
	}

	.menu-item::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 56px;
		right: 0;
		height: 1px;
		background-color: rgba(26, 58, 94, 0.1);
		transform: scaleY(0.5);
	}

	.menu-item:last-child::after {
		display: none;
	}

	.menu-item:active {
		background-color: rgba(26, 58, 94, 0.08);
	}
	
	.menu-left {
		display: flex;
		align-items: center;
	}

	.menu-icon {
		margin-right: 12px;
	}
	
	.menu-text {
		font-size: 15px;
		color: #0e2d4b;
		font-weight: 500;
	}

	.text-danger {
		color: #ff4d4f;
	}
</style>
