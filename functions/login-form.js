import { BASE_URL } from '@/config.js'

export const createLoginHandlers = ({ username, password, isLogin, loading, emit }) => {
	const toggleMode = () => {
		isLogin.value = !isLogin.value
	}

	const handleSubmit = () => {
		if (username.value.length == 0 || password.value.length == 0) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		loading.value = true
		const path = isLogin.value ? '/api/auth/login' : '/api/auth/register'

		uni.request({
			url: BASE_URL + path,
			method: 'POST',
			data: {
				username: username.value,
				password: password.value
			},
			success: (res) => {
				const data = res.data
				if (res.statusCode == 200) {
					uni.showToast({
						title: isLogin.value ? '登录成功' : '注册成功',
						icon: 'success'
					})

					const token = data.token
					if (token != null) {
						uni.setStorageSync('token', token)
					}

					emit('success', data)
				} else {
					uni.showToast({
						title: '操作失败：' + (data.message != null ? data.message : '未知错误'),
						icon: 'none'
					})
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				})
				console.error(err)
			},
			complete: () => {
				loading.value = false
			}
		})
	}

	return { toggleMode, handleSubmit }
}
