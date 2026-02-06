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

<style>
	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #ffffff; /* Unified white background */
	}
	
	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.content {
		flex: 1;
		padding-bottom: 100px;
	}
	
	.auth-section {
		flex: 1;
		display: flex;
		justify-content: center;
	}
	
	.mine-section {
		padding: 0;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0; /* Remove bottom margin to connect with list */
		padding: 60px 20px 40px; /* Increased top padding */
	}
	
	.avatar {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		margin-bottom: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.username {
		font-size: 24px;
		font-weight: 700;
		color: #1d2130;
		margin-bottom: 8px;
	}

	.sub-info {
		font-size: 14px;
		color: #8e92a3;
		margin-top: 4px;
	}
	
	.menu-list {
		background-color: #ffffff;
		border-radius: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: none;
		border-top: none; /* Remove border */
		border-bottom: none; /* Remove border */
	}
	
	.menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 18px 20px;
		background-color: #ffffff;
		transition: background-color 0.2s;
		position: relative;
	}

	.menu-item::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 56px; /* Align with text, skipping icon padding */
		right: 0;
		height: 1px;
		background-color: #f5f6f8;
		transform: scaleY(0.5);
	}

	.menu-item:last-child::after {
		display: none;
	}

	.menu-item:active {
		background-color: #f9f9fb;
	}
	
	.menu-left {
		display: flex;
		align-items: center;
	}

	.menu-icon {
		margin-right: 14px;
	}
	
	.menu-text {
		font-size: 16px;
		color: #1d2130;
		font-weight: 500;
	}

	.text-danger {
		color: #ff4d4f;
	}
</style>
