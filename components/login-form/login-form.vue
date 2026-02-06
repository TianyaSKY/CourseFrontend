<template>
	<view class="login-container">
		<view class="login-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" v-if="false"></image> <!-- Placeholder for logo -->
			<text class="title">{{ isLogin ? '欢迎回来' : '创建账号' }}</text>
			<text class="subtitle">{{ isLogin ? '请登录以继续使用' : '注册以开始您的旅程' }}</text>
		</view>

		<view class="login-card">
			<view class="inputs-panel">
				<view class="input-group">
					<text class="label">用户名</text>
					<view class="input-box">
						<uni-icons type="person" size="20" color="#ffffff" class="input-icon"></uni-icons>
						<input class="input" type="text" v-model="username" placeholder="请输入用户名" placeholder-class="placeholder" />
					</view>
				</view>
				
				<view class="input-group">
					<text class="label">密码</text>
					<view class="input-box">
						<uni-icons type="locked" size="20" color="#ffffff" class="input-icon"></uni-icons>
						<input class="input" type="password" v-model="password" placeholder="请输入密码" placeholder-class="placeholder" />
					</view>
				</view>
				
				<template v-if="!isLogin">
					<view class="input-group">
						<text class="label">学号</text>
						<view class="input-box">
							<uni-icons type="contact" size="20" color="#ffffff" class="input-icon"></uni-icons>
							<input class="input" type="text" v-model="studentId" placeholder="请输入学号" placeholder-class="placeholder" />
						</view>
					</view>
					
					<view class="input-group">
						<text class="label">学校</text>
						<view class="input-box" @tap="showSchoolSelect = true">
							<uni-icons type="home" size="20" color="#ffffff" class="input-icon"></uni-icons>
							<text v-if="!selectedSchoolName" class="placeholder" style="font-size: 16px;">请选择学校</text>
							<text v-else class="input" style="line-height: 52px">{{ selectedSchoolName }}</text>
							<uni-icons type="right" size="16" color="rgba(255,255,255,0.6)" style="margin-left: auto;"></uni-icons>
						</view>
					</view>
				</template>
			</view>
			
			<button class="submit-btn" :loading="loading" @tap="handleSubmit" hover-class="submit-btn-hover">
				{{ isLogin ? '立即登录' : '立即注册' }}
			</button>
			
			<view class="switch-mode" @tap="toggleMode">
				<text class="switch-text">
					{{ isLogin ? '还没有账号？' : '已经有账号了？' }}
					<text class="switch-highlight">{{ isLogin ? '去注册' : '去登录' }}</text>
				</text>
			</view>
		</view>
		
		<!-- School Select Component -->
		<school-select 
			v-model:show="showSchoolSelect" 
			v-model="schoolId"
			@change="onSchoolSelect"
		></school-select>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { createLoginHandlers } from '@/functions/login-form.js'
	import SchoolSelect from '@/components/school-select/school-select.vue'

	const username = ref('')
	const password = ref('')
	const studentId = ref('')
	const schoolId = ref(null)
	const selectedSchoolName = ref('')
	const showSchoolSelect = ref(false)
	
	const isLogin = ref(true)
	const loading = ref(false)

	const emit = defineEmits(['success'])

	const onSchoolSelect = (school) => {
		selectedSchoolName.value = school.name
		schoolId.value = school.id
	}

	const { toggleMode, handleSubmit } = createLoginHandlers({
		username,
		password,
		studentId,
		schoolId,
		isLogin,
		loading,
		emit
	})
</script>

<style scoped>
	.login-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px 24px;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		background: url('/static/back.png') no-repeat center center;
		background-size: cover;
		overflow: hidden; /* Prevent scrolling */
	}

	.login-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 40px;
	}

	.title {
		font-size: 28px;
		font-weight: 700;
		color: black; /* Changed to white for dark background */
		margin-bottom: 8px;
	}

	.subtitle {
		font-size: 14px;
		color: rgba(30, 30, 30, 0.8); /* Changed to semi-transparent white */
		text-shadow: 0 1px 2px rgba(0,0,0,0.2);
	}

	.login-card {
		width: 100%;
		background-color: transparent;
		padding: 0 24px;
		/* box-shadow removed */
	}

	.inputs-panel {
		width: calc(100% + 48px);
		margin: 0 -24px;
		padding: 14px 0;
		border-radius: 2px;
		background-color: rgba(0, 0, 0, 0.24);
		border-top: 1px solid rgba(255, 255, 255, 0.26);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.input-group {
		margin-bottom: 20px;
		padding: 0 14px;
	}

	.input-group:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 14px;
		font-weight: 500;
		color: #ffffff;
		margin-bottom: 10px;
		display: block;
		text-shadow: 0 1px 2px rgba(0,0,0,0.2);
	}

	.input-box {
		display: flex;
		align-items: center;
		width: 100%;
		height: 52px;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 0 16px;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		transition: all 0.3s;
	}

	.input-box:focus-within {
		background-color: rgba(255, 255, 255, 0.3);
		border-color: #ffffff;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
	}

	.input-icon {
		margin-right: 12px;
	}

	.input {
		flex: 1;
		height: 100%;
		font-size: 16px;
		color: #ffffff;
	}

	.placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	.submit-btn {
		width: 100%;
		height: 52px;
		line-height: 52px;
		background: linear-gradient(135deg, #007aff, #0056b3);
		color: #ffffff;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		margin-top: 32px;
		box-shadow: 0 8px 16px rgba(0, 122, 255, 0.2);
		transition: opacity 0.2s;
	}
	
	.submit-btn::after {
		border: none;
	}

	.submit-btn-hover {
		opacity: 0.9;
		transform: translateY(1px);
		box-shadow: 0 4px 8px rgba(0, 122, 255, 0.15);
	}

	.switch-mode {
		margin-top: 24px;
		display: flex;
		justify-content: center;
	}

	.switch-text {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 0 1px 2px rgba(0,0,0,0.2);
	}

	.switch-highlight {
		color: #ffffff;
		font-weight: 700;
		margin-left: 4px;
		text-decoration: underline;
	}
</style>
