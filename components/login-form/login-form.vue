<template>
	<view class="login-container">
		<view class="login-header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" v-if="false"></image> <!-- Placeholder for logo -->
			<text class="title">{{ isLogin ? '欢迎回来' : '创建账号' }}</text>
			<text class="subtitle">{{ isLogin ? '请登录以继续使用' : '注册以开始您的旅程' }}</text>
		</view>

		<view class="login-card">
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
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { createLoginHandlers } from '@/functions/login-form.js'

	const username = ref('')
	const password = ref('')
	const isLogin = ref(true)
	const loading = ref(false)

	const emit = defineEmits(['success'])

	const { toggleMode, handleSubmit } = createLoginHandlers({
		username,
		password,
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

	.input-group {
		margin-bottom: 24px;
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
