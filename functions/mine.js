import { BASE_URL } from '@/config.js'

export const createMineHandlers = ({ isLoggedIn, userInfo }) => {
	const fetchUserInfo = () => {
		const token = uni.getStorageSync('token')
		uni.request({
			url: `${BASE_URL}/api/users/current`,
			method: 'GET',
			header: {
				Authorization: `Bearer ${token}`
			},
			success: (res) => {
				if (res.statusCode == 200) {
					const data = res.data
					userInfo.username = data.username || ''
					userInfo.studentId = data.studentId || ''
					userInfo.school = data.school || ''
				}
			},
			fail: (err) => {
				console.error('获取用户信息失败:', err)
			}
		})
	}

	const checkLoginStatus = () => {
		const token = uni.getStorageSync('token')
		isLoggedIn.value = token != null && token.length > 0

		if (isLoggedIn.value) {
			fetchUserInfo()
		}
	}

	const onLoginSuccess = () => {
		isLoggedIn.value = true
		checkLoginStatus()
	}

	const navigateToEdit = () => {
		uni.navigateTo({
			url: '/pages/mine/edit-profile'
		})
	}

	const navigateTo = (url) => {
		uni.navigateTo({
			url
		})
	}

	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					uni.removeStorageSync('token')
					isLoggedIn.value = false
					uni.showToast({
						title: '已退出登录',
						icon: 'none'
					})
				}
			}
		})
	}

	return {
		fetchUserInfo,
		checkLoginStatus,
		onLoginSuccess,
		navigateToEdit,
		navigateTo,
		handleLogout
	}
}
