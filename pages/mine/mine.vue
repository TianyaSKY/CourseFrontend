<template>
	<view class="page">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>

		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y="true">
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
						<text class="menu-text">课表管理</text>
						<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
					</view>
					<view class="menu-item" @tap="navigateTo('/pages/schedule/course-library')">
						<text class="menu-text">课程库</text>
						<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
					</view>
					<view class="menu-item" @tap="navigateToEdit">
						<text class="menu-text">修改个人信息</text>
						<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
					</view>
					<view class="menu-item" @tap="handleLogout">
						<text class="menu-text text-danger">退出登录</text>
						<uni-icons type="right" size="16" color="#8e92a3"></uni-icons>
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
		background-color: #f1f3f8;
	}
	
	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.content {
		flex: 1;
		padding-bottom: 80px;
	}
	
	.auth-section {
		flex: 1;
		display: flex;
		justify-content: center;
		padding-top: 40px;
	}
	
	.mine-section {
		padding: 20px;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30px;
		padding: 30px 0;
	}
	
	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 40px;
		margin-bottom: 16px;
	}
	
	.username {
		font-size: 20px;
		font-weight: 700;
		color: #1d2130;
	}

	.sub-info {
		font-size: 14px;
		color: #8e92a3;
		margin-top: 4px;
	}
	
	.menu-list {
		background-color: #ffffff;
		border-radius: 12px;
		overflow: hidden;
	}
	
	.menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 16px 20px;
		border-bottom: 0.5px solid #f1f3f8;
	}

	.menu-item:active {
		background-color: #f9f9fb;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-text {
		font-size: 16px;
		color: #1d2130;
	}

	.text-danger {
		color: #ff4d4f;
	}
</style>
