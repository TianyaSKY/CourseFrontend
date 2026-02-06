import { login, register } from '@/functions/auth.js'

export const createLoginHandlers = ({ username, password, studentId, schoolId, isLogin, loading, emit }) => {
	const toggleMode = () => {
		isLogin.value = !isLogin.value
	}

	const handleSubmit = async () => {
		if (username.value.length == 0 || password.value.length == 0) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		if (!isLogin.value) {
			if ((studentId && !studentId.value) || (schoolId && !schoolId.value)) {
				uni.showToast({
					title: '请补全注册信息',
					icon: 'none'
				})
				return
			}
		}

		loading.value = true
		
		try {
			let data
			if (isLogin.value) {
				data = await login(username.value, password.value)
			} else {
				const registerData = {
					username: username.value,
					password: password.value,
					studentId: studentId ? studentId.value : undefined,
					schoolId: schoolId ? schoolId.value : undefined
				}
				data = await register(registerData)
			}

			uni.showToast({
				title: isLogin.value ? '登录成功' : '注册成功',
				icon: 'success'
			})

			console.log('Login response:', data)
			const token = data.token
			if (token != null) {
				console.log('Saving token:', token)
				uni.setStorageSync('token', token)
			} else {
				console.error('No token in response')
			}

			emit('success', data)
		} catch (err) {
			// Error handled in request.js usually, but we can double check logic
			// request.js already shows toast for errors
		} finally {
			loading.value = false
		}
	}

	return { toggleMode, handleSubmit }
}
