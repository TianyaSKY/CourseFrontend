<template>
	<view class="login-container">
		<view class="login-card">
			<text class="title">{{ isLogin ? '登录' : '注册' }}</text>
			
			<view class="input-group">
				<text class="label">用户名</text>
				<input class="input" type="text" v-model="username" placeholder="请输入用户名" />
			</view>
			
			<view class="input-group">
				<text class="label">密码</text>
				<input class="input" type="password" v-model="password" placeholder="请输入密码" />
			</view>
			
			<button class="submit-btn" :loading="loading" @tap="handleSubmit">
				{{ isLogin ? '立即登录' : '立即注册' }}
			</button>
			
			<view class="switch-mode" @tap="toggleMode">
				<text class="switch-text">{{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}</text>
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30px 20px;
	}

	.login-card {
		width: 100%;
		background-color: #ffffff;
		border-radius: 16px;
		padding: 30px 24px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: #1d2130;
		margin-bottom: 30px;
		text-align: center;
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

	.submit-btn {
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

	.switch-mode {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.switch-text {
		font-size: 14px;
		color: #8e92a3;
		text-align: center;
	}
</style>
