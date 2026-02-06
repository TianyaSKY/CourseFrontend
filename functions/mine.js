import { getCurrentUser } from '@/functions/user.js'

export const createMineHandlers = ({ isLoggedIn, userInfo }) => {
	const fetchUserInfo = async () => {
		try {
			const data = await getCurrentUser()
			userInfo.username = data.username || ''
			userInfo.studentId = data.studentId || ''
			userInfo.school = data.school || ''

			if (!userInfo.school) {
				uni.showModal({
					title: '温馨提示',
					content: '您尚未设置学校信息，请前往设置',
					confirmText: '去设置',
					cancelText: '暂不',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/mine/edit-profile'
							})
						}
					}
				})
			}
		} catch (err) {
			console.error('获取用户信息失败:', err)
		}
	}

	const checkLoginStatus = () => {
		const token = uni.getStorageSync('token')
		isLoggedIn.value = token != null && token.length > 0

		if (isLoggedIn.value) {
			fetchUserInfo()
		}
	}

	const onLoginSuccess = () => {
		console.log('Login success handler triggered')
		isLoggedIn.value = true
		fetchUserInfo()
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
